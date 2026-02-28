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
