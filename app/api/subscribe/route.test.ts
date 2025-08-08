// app/api/subscribe/route.test.ts

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

const loadWithMocks = async () => {
  jest.resetModules();

  await jest.unstable_mockModule("@/lib/db", () => ({
    connectDB: jest.fn().mockResolvedValue(undefined),
  }));
  await jest.unstable_mockModule("@/models/Subscriber", () => ({
    __esModule: true,
    default: { findOne: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ _id: "newid" }) },
  }));
  await jest.unstable_mockModule("@/utils/validators", () => ({
    __esModule: true,
    subscribeSchema: { safeParse: (_: any) => ({ success: true, data: {} }) },
  }));

  const Subscriber = (await import("@/models/Subscriber")).default as any;
  const { subscribeSchema } = await import("@/utils/validators");
  const { POST } = await import("./route");

  return { POST, Subscriber, subscribeSchema };
};

describe("POST /api/subscribe", () => {
  // silence route logs for clean output (route logs a lot)
  let logSpy: jest.SpyInstance, errSpy: jest.SpyInstance;
  beforeAll(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    logSpy.mockRestore(); errSpy.mockRestore();
  });

  test("200 when email is valid and not subscribed", async () => {
    const { POST, Subscriber, subscribeSchema } = await loadWithMocks();

    jest.spyOn(subscribeSchema, "safeParse").mockReturnValue({ success: true, data: { email: "ok@example.com" } } as any);
    jest.spyOn(Subscriber, "findOne").mockResolvedValue(null);
    jest.spyOn(Subscriber, "create").mockResolvedValue({ _id: "id1" });

    const res = await POST(makeRequest({ email: "ok@example.com" }, { ip: "10.0.0.1" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Subscribed successfully." });
  });

  test("400 when validation fails", async () => {
    const { POST, subscribeSchema, Subscriber } = await loadWithMocks();

    jest.spyOn(subscribeSchema, "safeParse").mockReturnValue({ success: false, error: { issues: [] } } as any);
    const findSpy = jest.spyOn(Subscriber, "findOne");
    const createSpy = jest.spyOn(Subscriber, "create");

    const res = await POST(makeRequest({ email: "bad" }, { ip: "10.0.0.2" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid email format." });
    expect(findSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("409 when email already subscribed", async () => {
    const { POST, Subscriber, subscribeSchema } = await loadWithMocks();

    jest.spyOn(subscribeSchema, "safeParse").mockReturnValue({ success: true, data: { email: "dup@example.com" } } as any);
    jest.spyOn(Subscriber, "findOne").mockResolvedValue({ _id: "exists" });

    const res = await POST(makeRequest({ email: "dup@example.com" }, { ip: "1.2.3.4" }));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "Email already subscribed." });
  });

  test("429 after 5 requests from the same IP", async () => {
    const { POST, Subscriber, subscribeSchema } = await loadWithMocks();

    jest.spyOn(subscribeSchema, "safeParse").mockReturnValue({ success: true, data: { email: "x@x.com" } } as any);
    jest.spyOn(Subscriber, "findOne").mockResolvedValue(null);
    jest.spyOn(Subscriber, "create").mockResolvedValue({ _id: "ok" });

    const ip = "55.55.55.55";
    for (let i = 0; i < 5; i++) expect((await POST(makeRequest({ email: `u${i}@x.com` }, { ip }))).status).toBe(200);
    const res6 = await POST(makeRequest({ email: "u6@x.com" }, { ip }));
    expect(res6.status).toBe(429);
  });

  test("500 when req.json() throws", async () => {
    const { POST, subscribeSchema } = await loadWithMocks();
    jest.spyOn(subscribeSchema, "safeParse").mockReturnValue({ success: true, data: { email: "ok@example.com" } } as any);
    const res = await POST(makeRequest(undefined, { throwOnJson: true, ip: "9.9.9.9" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Server error. Please try again." });
  });
});
