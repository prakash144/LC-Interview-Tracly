import type { NextConfig } from "next";

const repoName = 'LC-Interview-Tracly';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === "production" ? `/${repoName}` : '');

const nextConfig: NextConfig = {
    output: 'export',

    basePath,
    assetPrefix: basePath,

    images: {
        unoptimized: true,
    },
};

export default nextConfig;
