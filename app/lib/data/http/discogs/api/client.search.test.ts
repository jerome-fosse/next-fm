import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, DiscogsClient} from "@/app/lib/data/http/discogs/api/client";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet } as never);

describe("DiscogsClient - search", () => {
    let client: Client;

    beforeEach(() => {
        mockGet.mockReset();
        client = new DiscogsClient({
            token: "test-token",
            baseUrl: "https://api.discogs.com",
            timeout: 5000,
            userAgent: "TestAgent/1.0",
        });
    });

    it("should return search results", async () => {
        const mockResponse = {
            results: [],
        };
        mockGet.mockResolvedValue({ data: mockResponse, status: 200 });

        const response = await client.search({ query: "Nirvana" });

        expect(mockGet).toHaveBeenCalledWith("/database/search", { params: { query: "Nirvana" } });
        expect(response.results).toEqual([]);
    });

    it("should throw a generic error on failure", async () => {
        mockGet.mockRejectedValue({ isAxiosError: true, response: { status: 500 } });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.search({ query: "Nirvana" }))
            .rejects.toThrow("Unexpected error when searching");
    });
});
