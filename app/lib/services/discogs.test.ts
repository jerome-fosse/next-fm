import {beforeEach, describe, expect, it, vi} from "vitest";
import {Masters} from "@test/data/discogs";
import {discogsMasterToAlbum} from "@/app/lib/services/mapper/album";
import {fetchDiscogsMasterReleaseById} from "@/app/lib/services/discogs";

vi.mock("@/app/config");
vi.mock("server-only", () => ({}));
const masterReleaseById = vi.hoisted(() => vi.fn())

vi.mock("@/app/lib/data/http/discogs/api/client", () => ({
    DiscogsClient: class { masterReleaseById = masterReleaseById }
}))

describe("Discogs Service", () => {
    beforeEach(() => {
        masterReleaseById.mockReset();
    });

    it("should fetch a Album by it's id", async () => {
        masterReleaseById.mockResolvedValue({ data: Masters.BlackSabbath, status: 200 });
        const album = await fetchDiscogsMasterReleaseById(1234);

        expect(masterReleaseById).toHaveBeenCalledWith(1234);
        expect(album).toEqual(discogsMasterToAlbum(Masters.BlackSabbath));
    });
})

