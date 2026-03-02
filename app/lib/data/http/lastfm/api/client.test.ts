import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, LastFMClient} from "@/app/lib/data/http/lastfm/api/client";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet } as never);

describe("LastFMClient - search", () => {
    let client: Client;

    beforeEach(() => {
        mockGet.mockReset();
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

        expect(mockGet).toHaveBeenCalledWith("/2.0/", {
            params: {
                method: "album.search",
                api_key: "test-api-key",
                format: "json",
                album: "Black Sabbath",
            }
        });
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

        expect(mockGet).toHaveBeenCalledWith("/2.0/", {
            params: {
                method: "user.getInfo",
                user: "jerome",
                api_key: "test-api-key",
                format: "json",
            }
        });
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

        expect(mockGet).toHaveBeenCalledWith("/2.0/", {
            params: {
                method: "album.getInfo",
                api_key: "test-api-key",
                format: "json",
                artist: "Cher",
                album: "Believe",
            }
        });
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
