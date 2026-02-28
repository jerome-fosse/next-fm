import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, LastFMClient} from "@/app/lib/data/http/lastfm/api/client";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet } as never);

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
