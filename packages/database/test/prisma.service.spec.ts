import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../prisma/db.js", () => ({
    db: {
        orm: { public: { marker: "mock-orm" } },
        connect: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
    },
}));

import { db } from "../prisma/db.js";
import { PrismaService } from "../src/prisma.service.js";

describe("PrismaService", () => {
    let service: PrismaService;

    beforeEach(() => {
        vi.mocked(db.connect).mockClear();
        vi.mocked(db.close).mockClear();
        service = new PrismaService();
    });

    it("exposes the public ORM client", () => {
        expect(service.orm).toBe(db.orm.public);
    });

    it("connects during module initialization", async () => {
        await service.onModuleInit();

        expect(db.connect).toHaveBeenCalledOnce();
    });

    it("closes the connection during module destruction", async () => {
        await service.onModuleDestroy();

        expect(db.close).toHaveBeenCalledOnce();
    });
});