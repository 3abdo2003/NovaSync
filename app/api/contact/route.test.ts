// app/api/contact/route.test.ts

// Minimal Request builder with ability to throw on json()
function makeRequest(body?: any, opts?: { throwOnJson?: boolean; ip?: string }) {
  const headers = new Map<string, string>();
  if (opts?.ip !== undefined) headers.set("x-forwarded-for", opts.ip);
  return {
    headers: { get: (k: string) => headers.get(k.toLowerCase()) ?? null },
    json: async () => {
      if (opts?.throwOnJson) throw new Error("bad json");
      return body ?? {};
    },
  } as unknown as Request;
}

// Fresh ESM-friendly mock loader for each test
const loadWithMocks = async () => {
  jest.resetModules();

  await jest.unstable_mockModule("@/lib/db", () => ({
    connectDB: jest.fn().mockResolvedValue(undefined),
  }));
  await jest.unstable_mockModule("@/models/Contact", () => ({
    __esModule: true,
    default: { create: jest.fn().mockResolvedValue({ _id: "new" }) },
  }));
  await jest.unstable_mockModule("@/utils/validators", () => ({
    __esModule: true,
    contactSchema: { safeParse: (_: any) => ({ success: true, data: {} }) },
  }));

  const Contact = (await import("@/models/Contact")).default as any;
  const { contactSchema } = await import("@/utils/validators");
  const { POST } = await import("./route");

  return { POST, Contact, contactSchema };
};

describe("POST /api/contact", () => {
  test("returns 200 with success message on valid input", async () => {
    const { POST, Contact, contactSchema } = await loadWithMocks();

    jest.spyOn(contactSchema, "safeParse").mockReturnValue({
      success: true,
      data: { name: "Ahmed", email: "a@b.com", message: "Hi" },
    } as any);
    const createSpy = jest.spyOn(Contact, "create").mockResolvedValue({ _id: "abc123" } as any);

    const res = await POST(makeRequest({ name: "Ahmed", email: "a@b.com", message: "Hi" }, { ip: "10.0.0.1" }));
    const json = await res.json();

    expect(createSpy).toHaveBeenCalledWith({ name: "Ahmed", email: "a@b.com", message: "Hi" });
    expect(res.status).toBe(200);
    expect(json).toEqual({ message: "Inquiry submitted" });
  });

  test("returns 400 on validation error", async () => {
    const { POST, contactSchema, Contact } = await loadWithMocks();

    jest.spyOn(contactSchema, "safeParse").mockReturnValue({ success: false, error: { issues: [] } } as any);
    const createSpy = jest.spyOn(Contact, "create");

    const res = await POST(makeRequest({ bad: "data" }, { ip: "10.0.0.2" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Invalid input" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("returns 500 when Contact.create throws", async () => {
    const { POST, contactSchema, Contact } = await loadWithMocks();

    jest.spyOn(contactSchema, "safeParse").mockReturnValue({
      success: true,
      data: { name: "X", email: "x@y.com", message: "Yo" },
    } as any);
    jest.spyOn(Contact, "create").mockRejectedValue(new Error("DB down"));

    const res = await POST(makeRequest({ name: "X", email: "x@y.com", message: "Yo" }, { ip: "10.0.0.3" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Server error" });
  });

  test("rate limits after 5 requests per IP", async () => {
    const { POST, contactSchema, Contact } = await loadWithMocks();

    jest.spyOn(contactSchema, "safeParse").mockReturnValue({ success: true, data: { name: "A", email: "a@a.com", message: "m" } } as any);
    jest.spyOn(Contact, "create").mockResolvedValue({ _id: "ok" } as any);

    const ip = "55.55.55.55";
    for (let i = 0; i < 5; i++) expect((await POST(makeRequest({}, { ip }))).status).toBe(200);
    const res6 = await POST(makeRequest({}, { ip }));
    expect(res6.status).toBe(429);
  });

  test("rate limit is per IP (different IP allowed)", async () => {
    const { POST, contactSchema, Contact } = await loadWithMocks();

    jest.spyOn(contactSchema, "safeParse").mockReturnValue({ success: true, data: {} } as any);
    jest.spyOn(Contact, "create").mockResolvedValue({ _id: "ok" } as any);

    for (let i = 0; i < 6; i++) await POST(makeRequest({}, { ip: "1.1.1.1" }));
    const res = await POST(makeRequest({}, { ip: "2.2.2.2" }));
    expect(res.status).toBe(200);
  });

  test("uses 'unknown' bucket when no x-forwarded-for", async () => {
    const { POST, contactSchema, Contact } = await loadWithMocks();

    jest.spyOn(contactSchema, "safeParse").mockReturnValue({ success: true, data: {} } as any);
    jest.spyOn(Contact, "create").mockResolvedValue({ _id: "ok" } as any);

    for (let i = 0; i < 5; i++) expect((await POST(makeRequest({}, { ip: undefined }))).status).toBe(200);
    const res6 = await POST(makeRequest({}, { ip: undefined }));
    expect(res6.status).toBe(429);
  });
});
