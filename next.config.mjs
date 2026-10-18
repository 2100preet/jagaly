/** @type {import('next').NextConfig} */
// On GitHub Pages the site lives under /<repo-name>. Set NEXT_PUBLIC_BASE_PATH
// (the deploy workflow does this) — locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};
export default nextConfig;
