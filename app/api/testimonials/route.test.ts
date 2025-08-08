// app/api/testimonials/route.test.ts

function makeRequest(body?: unknown, opts?: { throwOnJson?: boolean }) {
  return {
    json: async () => {
      if (opts?.throwOnJson) throw new Error("bad json");
      return body ?? {};
    },
  } as unknown as Request;
}

const loadWithMocks = async () => {
  jest.resetModules();

  await jest.unstable_mockModule("@/lib/db", () => ({
    connectDB: jest.fn().mockResolvedValue(undefined),
  }));

  await jest.unstable_mockModule("@/models/Testimonial", () => {
    const Testimonial = function (this: { _id?: string; name?: string; quote?: string }, doc: Record<string, unknown>) { Object.assign(this, doc); };
    Testimonial.find = jest.fn();
    Testimonial.prototype.save = jest.fn();
    return { __esModule: true, default: Testimonial };
  });

  const Testimonial = (await import("@/models/Testimonial")).default as { find: jest.Mock; prototype: { save: jest.Mock } };
  const route = await import("./route");

  return { ...route, Testimonial };
};

describe("GET /api/testimonials", () => {
  test("returns 200 with testimonials array", async () => {
    const { GET, Testimonial } = await loadWithMocks();
    const lean = jest.fn().mockResolvedValue([
      { _id: "1", name: "Alice", quote: "Great!" },
      { _id: "2", name: "Bob", quote: "Awesome!" },
    ]);
    jest.spyOn(Testimonial, "find").mockReturnValue({ lean } as { lean: jest.Mock });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { _id: "1", name: "Alice", quote: "Great!" },
      { _id: "2", name: "Bob", quote: "Awesome!" },
    ]);
  });

  test("returns 200 with empty array", async () => {
    const { GET, Testimonial } = await loadWithMocks();
    const lean = jest.fn().mockResolvedValue([]);
    jest.spyOn(Testimonial, "find").mockReturnValue({ lean } as { lean: jest.Mock });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test("returns 500 when find().lean() rejects", async () => {
    const { GET, Testimonial } = await loadWithMocks();
    const lean = jest.fn().mockRejectedValue(new Error("boom"));
    jest.spyOn(Testimonial, "find").mockReturnValue({ lean } as { lean: jest.Mock });
    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch testimonials" });
  });

  test("returns 500 when Testimonial.find() throws sync", async () => {
    const { GET, Testimonial } = await loadWithMocks();
    jest.spyOn(Testimonial, "find").mockImplementation(() => { throw new Error("sync fail"); });
    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch testimonials" });
  });
});

describe("POST /api/testimonials", () => {
  test("returns 201 and created testimonial on valid body", async () => {
    const { POST, Testimonial } = await loadWithMocks();
    jest.spyOn(Testimonial.prototype, "save").mockImplementation(function (this: { _id?: string }) {
      if (!this._id) this._id = "abc123"; return Promise.resolve();
    });
    const res = await POST(makeRequest({ name: "Carol", quote: "Love it" }));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json).toMatchObject({ name: "Carol", quote: "Love it" });
    expect(json._id).toBeDefined();
  });

  test.each(
    [[{ quote: "Nice" }, "name missing"], [{ name: "Dan" }, "quote missing"]] as const
  )("returns 400 when %s", async (partialBody) => {
    const { POST, Testimonial } = await loadWithMocks();
    const saveSpy = jest.spyOn(Testimonial.prototype, "save");
    const res = await POST(makeRequest(partialBody));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing required fields" });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  test.each(
    [[{ name: "", quote: "Great" }, "name empty"], [{ name: "Eve", quote: "" }, "quote empty"]] as const
  )("returns 400 when %s", async (body) => {
    const { POST, Testimonial } = await loadWithMocks();
    const saveSpy = jest.spyOn(Testimonial.prototype, "save");
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing required fields" });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  test("returns 500 when req.json() throws", async () => {
    const { POST } = await loadWithMocks();
    const res = await POST(makeRequest(undefined, { throwOnJson: true }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to create testimonial" });
  });

  test("returns 500 when save() rejects", async () => {
    const { POST, Testimonial } = await loadWithMocks();
    jest.spyOn(Testimonial.prototype, "save").mockRejectedValue(new Error("db down"));
    const res = await POST(makeRequest({ name: "Frank", quote: "Wow" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to create testimonial" });
  });
});
