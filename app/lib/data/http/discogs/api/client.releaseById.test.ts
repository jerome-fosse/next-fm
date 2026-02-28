import {beforeEach, describe, expect, it, vi} from "vitest";
import {Client, DiscogsClient} from "@/app/lib/data/http/discogs/api/client";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.fn();
vi.mocked(axios.create).mockReturnValue({ get: mockGet } as never);

describe("DiscogsClient - releaseById", () => {
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

    it("should return a release by its id", async () => {
        const mockRelease = {
            id: 987,
            title: "Nevermind",
        };
        mockGet.mockResolvedValue({ data: mockRelease, status: 200 });

        const response = await client.releaseById(987);

        expect(mockGet).toHaveBeenCalledWith("/releases/987");
        expect(response.id).toBe(987);
    });

    it("should throw 'not found' error on 404", async () => {
        mockGet.mockRejectedValue({ isAxiosError: true, response: { status: 404 } });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.releaseById(999))
            .rejects.toThrow("Release with id 999 not found");
    });

    it("should throw a generic error on other failures", async () => {
        mockGet.mockRejectedValue({ isAxiosError: true, response: { status: 500 } });
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(client.releaseById(123))
            .rejects.toThrow("Unexpected error when fetching release with id 123");
    });
});
