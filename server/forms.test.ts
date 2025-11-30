import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("forms.submit", () => {
  it("should accept valid form submission", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.forms.submit({
      language: "en",
      name: "John Doe",
      company: "Test Company",
      phone: "+1234567890",
      email: "john@example.com",
      rating1: 5,
      rating2: 4,
      rating3: 5,
      rating4: 4,
      rating5: 5,
      rating6: 4,
      suggestions: "Great workshop!",
    });

    expect(result).toEqual({ success: true });
  });

  it("should accept Arabic form submission", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.forms.submit({
      language: "ar",
      name: "محمد أحمد",
      company: "شركة الاختبار",
      phone: "+966501234567",
      email: "mohammed@example.com",
      rating1: 5,
      rating2: 5,
      rating3: 4,
      rating4: 5,
      rating5: 4,
      rating6: 5,
      suggestions: "ورشة عمل ممتازة!",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("managers", () => {
  it("should add manager email", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.managers.add({
      email: "manager@example.com",
      name: "Manager Name",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get all managers", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.managers.getAll();
    expect(Array.isArray(result)).toBe(true);
  });
});
