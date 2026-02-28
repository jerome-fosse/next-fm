import {beforeEach, describe, expect, it, vi} from "vitest";
import {fetchLastfmAlbumByIdOrNameAndArtist} from "@/app/lib/services/lastfm";
import {Albums} from "@test/data/lastfm";
import {lastfmAlbumToAlbum} from "@/app/lib/services/mapper/album";

vi.mock("@/app/config");
vi.mock("server-only", () => ({}));
const getAlbumInfo = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/data/http/lastfm/api/client", () => ({
    LastFMClient: class { getAlbumInfo = getAlbumInfo }
}))

describe("Lastfm Services", () => {
    beforeEach(() => {
        getAlbumInfo.mockReset();
    });

    it("should fetch an Album by it's id", async () => {
        getAlbumInfo.mockResolvedValue({ album: Albums.BlackSabbath });
        const album = await fetchLastfmAlbumByIdOrNameAndArtist('1234', '', '');

        expect(getAlbumInfo).toHaveBeenCalledWith({mbid: '1234', autocorrect: 1});
        expect(album).toEqual(lastfmAlbumToAlbum(Albums.BlackSabbath));
    });
});