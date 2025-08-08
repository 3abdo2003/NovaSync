// app/api/features/route.test.ts

function makeRequest(body?: any, opts?: { throwOnJson?: boolean }) {
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
  await jest.unstable_mockModule("@/models/Feature", () => {
    const Feature: any = function (this: any, doc: any) { Object.assign(this, doc); };
    Feature.find = jest.fn();
    Feature.prototype.save = jest.fn();
    return { __esModule: true, default: Feature };
  });

  const Feature = (await import("@/models/Feature")).default as any;
  const route = await import("./route");
  return { ...route, Feature };
};

describe("GET /api/features", () => {
  test("returns 200 with features array", async () => {
    const { GET, Feature } = await loadWithMocks();

    const lean = jest.fn().mockResolvedValue([
      { _id: "1", title: "A", description: "aa", icon: "a.svg" },
      { _id: "2", title: "B", description: "bb", icon: "b.svg" },
    ]);
    jest.spyOn(Feature, "find").mockReturnValue({ lean } as any);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { _id: "1", title: "A", description: "aa", icon: "a.svg" },
      { _id: "2", title: "B", description: "bb", icon: "b.svg" },
    ]);
  });

  test("returns 200 with empty array", async () => {
    const { GET, Feature } = await loadWithMocks();
    const lean = jest.fn().mockResolvedValue([]);
    jest.spyOn(Feature, "find").mockReturnValue({ lean } as any);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test("returns 500 when find().lean() rejects", async () => {
    const { GET, Feature } = await loadWithMocks();
    const lean = jest.fn().mockRejectedValue(new Error("boom"));
    jest.spyOn(Feature, "find").mockReturnValue({ lean } as any);
    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch features" });
  });

  test("returns 500 when Feature.find() throws sync", async () => {
    const { GET, Feature } = await loadWithMocks();
    jest.spyOn(Feature, "find").mockImplementation(() => { throw new Error("sync fail"); });
    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch features" });
  });
});

describe("POST /api/features", () => {
  test("returns 201 and created feature on valid body", async () => {
    const { POST, Feature } = await loadWithMocks();
    jest.spyOn(Feature.prototype, "save").mockImplementation(function (this: any) {
      if (!this._id) this._id = "abc123"; return Promise.resolve();
    });
    const body = { title: "X", description: "desc", icon: "x.svg" };
    const res = await POST(makeRequest(body));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json).toMatchObject(body);
    expect(json._id).toBeDefined();
  });

  test.each([
    [{ description: "desc", icon: "x.svg" }, "title missing"],
    [{ title: "X", icon: "x.svg" }, "description missing"],
    [{ title: "X", description: "desc" }, "icon missing"],
  ])("returns 400 when %s", async (partialBody) => {
    const { POST, Feature } = await loadWithMocks();
    const saveSpy = jest.spyOn(Feature.prototype, "save");
    const res = await POST(makeRequest(partialBody));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing required fields" });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  test.each([
    [{ title: "", description: "desc", icon: "x.svg" }, "title empty"],
    [{ title: "X", description: "", icon: "x.svg" }, "description empty"],
    [{ title: "X", description: "desc", icon: "" }, "icon empty"],
  ])("returns 400 when %s", async (body) => {
    const { POST, Feature } = await loadWithMocks();
    const saveSpy = jest.spyOn(Feature.prototype, "save");
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing required fields" });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  test("returns 500 when req.json() throws", async () => {
    const { POST } = await loadWithMocks();
    const res = await POST(makeRequest(undefined, { throwOnJson: true }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to create feature" });
  });

  test("returns 500 when save() rejects", async () => {
    const { POST, Feature } = await loadWithMocks();
    jest.spyOn(Feature.prototype, "save").mockRejectedValue(new Error("db down"));
    const res = await POST(makeRequest({ title: "X", description: "desc", icon: "x.svg" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to create feature" });
  });
});
