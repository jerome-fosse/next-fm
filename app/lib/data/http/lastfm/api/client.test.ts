import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, LastFMClient} from "@/app/lib/data/http/lastfm/api/client";
import axios from "axios";
import {getStorage, NOT_FOUND} from "@/app/lib/data/storage";
import {readFileSync} from "fs";
import {Scrobbles} from "@test/data/lastfm";

vi.mock("axios");
vi.mock("@/app/lib/data/storage", () => ({
    NOT_FOUND: "NOT_FOUND",
    getStorage: vi.fn()
}));

const mockReadStorage = vi.fn();
vi.mocked(getStorage).mockReturnValue({
    read: mockReadStorage,
    write: vi.fn()
})

const mockGet = vi.fn();
const mockPost = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet, post: mockPost } as never);

describe("LastFMClient - search", () => {
    let client: Client;

    beforeEach(() => {
        mockGet.mockReset();
        mockReadStorage.mockReset();
        client = new LastFMClient({
            apiKey: "test-api-key",
            secret: "test-secret",
            baseUrl: "https://ws.audioscrobbler.com",
            timeout: 5000,
            userAgent: "TestAgent/1.0",
        });
    });

    it("should return search results", async () => {
        const mockResponse = {
            results: { albummatches: { album: [{ name: "Black Sabbath", artist: "Black Sabbath" }, { name: "Paranoid", artist: "Black Sabbath" }] } }
        };
        mockGet.mockResolvedValue({ data: mockResponse, status: 200 });

        const response = await client.search({ album: "Black Sabbath" });

        expect(mockGet).toHaveBeenCalledWith("/2.0/", expect.objectContaining({
            params: {
                method: "album.search",
                api_key: "test-api-key",
                format: "json",
                album: "Black Sabbath",
            }
        }));
        expect(response.results.albummatches.album.length).toBe(2);
        expect(response.results.albummatches.album[0].name).toBe("Black Sabbath");
        expect(response.results.albummatches.album[0].artist).toBe("Black Sabbath");
        expect(response.results.albummatches.album[1].name).toBe("Paranoid");
        expect(response.results.albummatches.album[1].artist).toBe("Black Sabbath");
    });

    it("should throw Last.fm error message on API error", async () => {
        mockGet.mockRejectedValue({
            response: { data: { error: 6, message: "Invalid parameters" } }
        });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.search({ album: "Believe" }))
            .rejects.toThrow("Invalid parameters");
    });

    it("should throw unexpected error on unknown failure", async () => {
        mockGet.mockRejectedValue(new Error("Something went wrong"));
        vi.mocked(axios.isAxiosError).mockReturnValue(false);

        await expect(client.search({ album: "Believe" }))
            .rejects.toThrow("Unexpected error when fetching search results");
    });
});


describe("LastFMClient - getUserInfo", () => {
    let client: Client;

    beforeEach(() => {
        mockGet.mockReset();
        mockReadStorage.mockReset();
        client = new LastFMClient({
            apiKey: "test-api-key",
            secret: "test-secret",
            baseUrl: "https://ws.audioscrobbler.com",
            timeout: 5000,
            userAgent: "TestAgent/1.0",
        });
    });

    it("should return user info", async () => {
        const mockResponse = {
            user: { name: "jerome", playcount: "12345" }
        };
        mockGet.mockResolvedValue({ data: mockResponse, status: 200 });

        const response = await client.getUserInfo("jerome");

        expect(mockGet).toHaveBeenCalledWith("/2.0/", expect.objectContaining({
            params: {
                method: "user.getInfo",
                user: "jerome",
                api_key: "test-api-key",
                format: "json",
            }
        }));
        expect(response.user.name).toBe("jerome");
    });

    it("should throw Last.fm error message on API error", async () => {
        mockGet.mockRejectedValue({
            response: { data: { error: 6, message: "User not found" } }
        });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.getUserInfo("unknown"))
            .rejects.toThrow("User not found");
    });

    it("should throw unexpected error on unknown failure", async () => {
        mockGet.mockRejectedValue(new Error("Something went wrong"));
        vi.mocked(axios.isAxiosError).mockReturnValue(false);

        await expect(client.getUserInfo("jerome"))
            .rejects.toThrow("Unexpected error when fetching user info");
    });
});


describe("LastFMClient - getSession", () => {
    let client: Client;

    beforeEach(() => {
        mockGet.mockReset();
        mockReadStorage.mockReset();
        client = new LastFMClient({
            apiKey: "test-api-key",
            secret: "test-secret",
            baseUrl: "https://ws.audioscrobbler.com",
            timeout: 5000,
            userAgent: "TestAgent/1.0",
        });
    });

    it("should return session", async () => {
        const mockResponse = {
            session: { name: "jerome", key: "abc123", subscriber: 0 }
        };
        mockGet.mockResolvedValue({ data: mockResponse, status: 200 });

        const response = await client.getSession("test-token");

        expect(response.session.name).toBe("jerome");
        expect(response.session.key).toBe("abc123");
    });

    it("should throw Last.fm error message on API error", async () => {
        mockGet.mockRejectedValue({
            response: { data: { error: 4, message: "Invalid authentication token" } }
        });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.getSession("invalid-token"))
            .rejects.toThrow("Invalid authentication token");
    });

    it("should throw unexpected error on unknown failure", async () => {
        mockGet.mockRejectedValue(new Error("Something went wrong"));
        vi.mocked(axios.isAxiosError).mockReturnValue(false);

        await expect(client.getSession("test-token"))
            .rejects.toThrow("Unexpected error when fetching session");
    });
});


describe("LastFMClient - getAlbumInfo", () => {
    let client: Client;

    beforeEach(() => {
        mockGet.mockReset();
        mockReadStorage.mockReset();
        client = new LastFMClient({
            apiKey: "test-api-key",
            secret: "test-secret",
            baseUrl: "https://ws.audioscrobbler.com",
            timeout: 5000,
            userAgent: "TestAgent/1.0",
        });
    });

    it("should return album info", async () => {
        const mockResponse = {
            album: { name: "Believe", artist: "Cher" }
        };
        mockGet.mockResolvedValue({ data: mockResponse, status: 200 });

        const response = await client.getAlbumInfo({ artist: "Cher", album: "Believe" });

        expect(mockGet).toHaveBeenCalledWith("/2.0/", expect.objectContaining({
            params: {
                method: "album.getInfo",
                api_key: "test-api-key",
                format: "json",
                artist: "Cher",
                album: "Believe",
            }
        }));
        expect(response.album.artist).toBe("Cher");
        expect(response.album.name).toBe("Believe");
    });

    it("should throw Last.fm error message on API error", async () => {
        mockGet.mockRejectedValue({
            response: { data: { error: 6, message: "Album not found" } }
        });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.getAlbumInfo({ artist: "Unknown", album: "Unknown" }))
            .rejects.toThrow("Album not found");
    });

    it("should throw unexpected error on unknown failure", async () => {
        mockGet.mockRejectedValue(new Error("Something went wrong"));
        vi.mocked(axios.isAxiosError).mockReturnValue(false);

        await expect(client.getAlbumInfo({ artist: "Cher", album: "Believe" }))
            .rejects.toThrow("Unexpected error when fetching album info");
    });
});

describe("LastFMClient - Scrobble", () => {
    let client: Client;

    beforeEach(() => {
        mockPost.mockReset();
        mockReadStorage.mockReset();
        client = new LastFMClient({
            apiKey: "test-api-key",
            secret: "test-secret",
            baseUrl: "https://ws.audioscrobbler.com",
            timeout: 5000,
            userAgent: "TestAgent/1.0",
        });
    });

    it("should scrobble an album with all tracks accepted", async () => {
        mockReadStorage.mockReturnValue({
            success: true,
            data: {user: "user_name", "key": "apikey", "subscriber": 0, "createdAt": "2026-02-24T21:44:05.340Z"}
        });

        const xml = readFileSync("test/fixtures/scrobble-success-black-sabbath.xml", "utf8");
        mockPost.mockResolvedValue({ data: xml, status: 200 });

        const response = await client.scrobble("user_name", Scrobbles.BlackSabbath);

        expect(response.lfm.status).toBe("ok");
        expect(response.lfm.scrobbles.ignored).toBe(0);
        expect(response.lfm.scrobbles.accepted).toBe(7);
        for (const i in Scrobbles.BlackSabbath) {
            const scrobble = Scrobbles.BlackSabbath[i];
            expect(response.lfm.scrobbles.scrobble[i].artist["#text"]).toBe(scrobble.artist);
            expect(response.lfm.scrobbles.scrobble[i].track["#text"]).toBe(scrobble.track);
        }
    })

    it("should scrobble an album with some tracks rejected", async () => {
        mockReadStorage.mockReturnValue({
            success: true,
            data: {user: "user_name", "key": "apikey", "subscriber": 0, "createdAt": "2026-02-24T21:44:05.340Z"}
        });

        const xml = readFileSync("test/fixtures/scrobble-success-voivod-war-and-pain.xml", "utf8");
        mockPost.mockResolvedValue({ data: xml, status: 200 });

        const response = await client.scrobble("user_name", Scrobbles.WarAndPain);
        expect(response.lfm.status).toBe("ok");
        expect(response.lfm.scrobbles.ignored).toBe(2);
        expect(response.lfm.scrobbles.accepted).toBe(9);
        for (const i in Scrobbles.WarAndPain) {
            expect(response.lfm.scrobbles.scrobble[i].artist["#text"]).toBe("Voïvod");
        }
        expect(response.lfm.scrobbles.scrobble[9].track["#text"]).toBe("Iron Side");
        expect(response.lfm.scrobbles.scrobble[9].ignoredMessage.code).toBe(1);
        expect(response.lfm.scrobbles.scrobble[10].track["#text"]).toBe("Blower Side");
        expect(response.lfm.scrobbles.scrobble[10].ignoredMessage.code).toBe(1);
    })

    it("should thrown an exception when the user is not connected", async () => {
        mockReadStorage.mockReturnValue({ success: false, errorType: NOT_FOUND, error: "file not found" });

        await expect(client.scrobble("user", [{artist: "Cher", track: "Believe", timestamp: 0,}]))
            .rejects.toThrow("Failed to read session");
    })
})
