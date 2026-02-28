import {beforeEach, describe, expect, it, vi} from "vitest";
import {fetchLastfmAlbumByIdOrNameAndArtist} from "@/app/lib/services/lastfm";
import {Albums} from "@test/data/lastfm";
import {lastfmAlbumToAlbum} from "@/app/lib/services/mapper/album";

vi.mock("@/app/config");
vi.mock("server-only", () => ({}));
vi.mock("lru-cache", () => ({
    LRUCache: class {
        has() { return false; }
        get() { return undefined; }
        set() {}
    }
}));
vi.mock("@/app/lib/data/http/lastfm/api/client", () => ({
    LastFMClient: class {
        getAlbumInfo = getAlbumInfo
    }
}))
const getAlbumInfo = vi.hoisted(() => vi.fn());

describe("Lastfm Services", () => {
    beforeEach(() => {
        getAlbumInfo.mockReset();
    });

    it("should fetch an Album by it's id", async () => {
        getAlbumInfo.mockResolvedValue({album: Albums.BlackSabbath});
        const album = await fetchLastfmAlbumByIdOrNameAndArtist('1234', '', '');

        expect(getAlbumInfo).toHaveBeenCalledWith({mbid: '1234', autocorrect: 1});
        expect(album).toEqual(lastfmAlbumToAlbum(Albums.BlackSabbath));
    });

    it("should fetch an Album by it's title and artist name", async () => {
        getAlbumInfo.mockResolvedValue({album: Albums.MasterOfPuppets});
        const album = await fetchLastfmAlbumByIdOrNameAndArtist('', 'Master of Puppets', 'Metallica');

        expect(getAlbumInfo).toHaveBeenCalledWith({album: 'Master of Puppets', artist: 'Metallica', autocorrect: 1});
        expect(album).toEqual(lastfmAlbumToAlbum(Albums.MasterOfPuppets));
    });

    it('should throw an error on API error', async () => {
        getAlbumInfo.mockRejectedValue(new Error('API error'));

        await expect(fetchLastfmAlbumByIdOrNameAndArtist('', 'Master of Puppets', 'Metallica'))
            .rejects.toThrow('API error');
    });
});
