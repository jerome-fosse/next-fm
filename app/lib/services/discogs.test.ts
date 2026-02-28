import {beforeEach, describe, expect, it, vi} from "vitest";
import {Masters} from "@test/data/discogs";
import {discogsMasterToAlbum} from "@/app/lib/services/mapper/album";
import {fetchDiscogsMasterReleaseById} from "@/app/lib/services/discogs";

vi.mock("@/app/config");
vi.mock("server-only", () => ({}));
vi.mock("lru-cache", () => ({
    LRUCache: class {
        has() { return false; }
        get() { return undefined; }
        set() {}
    }
}));
vi.mock("@/app/lib/data/http/discogs/api/client", () => ({
    DiscogsClient: class { masterReleaseById = masterReleaseById }
}))
const masterReleaseById = vi.hoisted(() => vi.fn())

describe("Discogs Service", () => {
    beforeEach(() => {
        masterReleaseById.mockReset();
    });

    it("should fetch an Album by it's id", async () => {
        masterReleaseById.mockResolvedValue(Masters.BlackSabbath);
        const album = await fetchDiscogsMasterReleaseById(1234);

        expect(masterReleaseById).toHaveBeenCalledWith(1234);
        expect(album).toEqual(discogsMasterToAlbum(Masters.BlackSabbath));
    });

    it('should throw an error on API error', async () => {
        masterReleaseById.mockRejectedValue(new Error('API error'));

        await expect(fetchDiscogsMasterReleaseById(1234))
            .rejects.toThrow('API error');
    });
})

