import { jest, describe, it, expect, beforeEach } from "@jest/globals";

let mockFindUnique: any;
let mockFindFirst: any;
let mockUpdate: any;
let resolveTenant: any;

describe("resolveTenant", () => {
  let request: any;
  let reply: any;

  beforeAll(async () => {
    mockFindUnique = jest.fn();
    mockFindFirst = jest.fn();
    mockUpdate = jest.fn();

    const jestGlobal = jest as any;
    jestGlobal.unstable_mockModule("../lib/prisma.js", () => ({
      prisma: {
        organization: { findUnique: mockFindUnique, update: mockUpdate },
        organizationMembro: { findFirst: mockFindFirst },
      },
    }));

    const mod = await import("./tenant.js");
    resolveTenant = mod.resolveTenant;
  });

  beforeEach(() => {
    request = {
      userId: "user_123",
      orgId: undefined,
      log: { error: jest.fn() },
    };
    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sent: false,
    };
    mockFindUnique.mockReset();
    mockFindFirst.mockReset();
    mockUpdate.mockReset();
  });

  it("returns 401 when userId is missing", async () => {
    request.userId = undefined;
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(401);
  });

  it("returns 403 when no membership found", async () => {
    mockFindFirst.mockResolvedValue(null);
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("onboarding"),
      }),
    );
  });

  it("returns 402 TRIAL_EXPIRED when trial expired", async () => {
    const pastDate = new Date(Date.now() - 86400000);
    mockFindFirst.mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "OWNER",
      organization: {
        id: "org1",
        status: "TRIAL_ATIVO",
        trialExpiraEm: pastDate,
      },
    });
    mockUpdate.mockResolvedValue({});
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(402);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ code: "TRIAL_EXPIRED" }),
    );
  });

  it("returns 402 ACCOUNT_SUSPENDED when suspended", async () => {
    mockFindFirst.mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "OWNER",
      organization: {
        id: "org1",
        status: "SUSPENSO",
        trialExpiraEm: new Date(),
      },
    });
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(402);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ code: "ACCOUNT_SUSPENDED" }),
    );
  });

  it("sets organizationId and role when active", async () => {
    mockFindFirst.mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "MEMBER",
      organization: {
        id: "org1",
        status: "ATIVO",
        trialExpiraEm: new Date(Date.now() + 86400000),
      },
    });
    await resolveTenant(request, reply);
    expect(request.organizationId).toBe("org1");
    expect(request.role).toBe("MEMBER");
    expect(reply.sent).toBe(false);
  });

  it("uses orgId from Clerk JWT to match organization", async () => {
    request.orgId = "clerk_org_123";
    mockFindUnique.mockResolvedValue({
      id: "org1",
      clerkOrgId: "clerk_org_123",
    });
    mockFindFirst.mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "OWNER",
      organization: {
        id: "org1",
        status: "ATIVO",
        trialExpiraEm: new Date(Date.now() + 86400000),
      },
    });
    await resolveTenant(request, reply);
    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkOrgId: "clerk_org_123", deletedAt: null },
      }),
    );
    expect(request.organizationId).toBe("org1");
  });
});
