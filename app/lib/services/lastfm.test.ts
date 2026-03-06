import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {fetchLastfmAlbumByIdOrNameAndArtist, scrobbleTracks} from "@/app/lib/services/lastfm";
import {Albums, Scrobbles} from "@test/data/lastfm";
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

const getAlbumInfo = vi.hoisted(() => vi.fn());
const scrobble = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/data/http/lastfm/api/client", () => ({
    LastFMClient: class {
        getAlbumInfo = getAlbumInfo
        scrobble = scrobble
    }
}))

const mockGetConnectedUserName = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/services/authent", () => ({
    getConnectedUserName: mockGetConnectedUserName
}));

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

describe("scrobbleTracks", () => {
    const tracks = Scrobbles.BlackSabbath.map(s => s.track);
    const artists = Scrobbles.BlackSabbath.map(s => s.artist);
    const durations = Scrobbles.BlackSabbath.map(s => s.duration);
    const NOW_MS = 1773244684000;
    const NOW_S = NOW_MS / 1000;

    beforeEach(() => {
        scrobble.mockReset();
        mockGetConnectedUserName.mockReset();
        vi.spyOn(Date, "now").mockReturnValue(NOW_MS);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should scrobble tracks and return a report with all tracks accepted", async () => {
        mockGetConnectedUserName.mockResolvedValue("jerome");
        scrobble.mockResolvedValue({
            lfm: {
                status: "ok",
                scrobbles: {
                    accepted: 7,
                    ignored: 0,
                    scrobble: Scrobbles.BlackSabbath.map(s => ({
                        track: {"#text": s.track, corrected: 0},
                        artist: {"#text": s.artist, corrected: 0},
                        album: {"#text": "Black Sabbath", corrected: 0},
                        albumArtist: {"#text": "Black Sabbath", corrected: 0},
                        timestamp: s.timestamp,
                        ignoredMessage: {"#text": "", code: 0},
                    }))
                }
            }
        });

        const result = await scrobbleTracks("Black Sabbath", "Black Sabbath", tracks, artists, durations);

        expect(scrobble).toHaveBeenCalledWith("jerome", Scrobbles.BlackSabbath.map((s, i) => ({
            artist: s.artist,
            track: s.track,
            timestamp: NOW_S + durations.slice(0, i).reduce((a, b) => a + b, 0),
            album: "Black Sabbath",
            albumArtist: "Black Sabbath",
            duration: s.duration,
        })));
        expect(result.status).toBe("ok");
        expect(result.report.accepted).toBe(7);
        expect(result.report.ignored).toBe(0);
        expect(result.report.scrobbles).toHaveLength(7);
        expect(result.report.scrobbles![0]).toEqual({track: "Black Sabbath", artist: "Black Sabbath", code: 0, message: "OK"});
    });

    it("should throw when user is not connected", async () => {
        mockGetConnectedUserName.mockResolvedValue(undefined);

        await expect(scrobbleTracks("Black Sabbath", "Black Sabbath", tracks, artists, durations))
            .rejects.toThrow("Utilisateur non connecté");
    });

    it("should throw on API error", async () => {
        mockGetConnectedUserName.mockResolvedValue("jerome");
        scrobble.mockRejectedValue(new Error("Network error"));

        await expect(scrobbleTracks("Black Sabbath", "Black Sabbath", tracks, artists, durations))
            .rejects.toThrow("Erreur lors de l'envoi des scrobbles: Network error");
    });
});
