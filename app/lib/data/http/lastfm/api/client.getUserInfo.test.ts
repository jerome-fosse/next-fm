import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, LastFMClient} from "@/app/lib/data/http/lastfm/api/client";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet } as never);

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
