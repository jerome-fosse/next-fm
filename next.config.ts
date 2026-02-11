import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.discogs.com',
            },
            {
                protocol: 'https',
                hostname: 'st.discogs.com',
            },
            {
                protocol: 'https',
                hostname: 'lastfm.freetls.fastly.net'
            }
        ],
    },

};

export default nextConfig;
