import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, LastFMClient} from "@/app/lib/data/http/lastfm/api/client";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet } as never);

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
