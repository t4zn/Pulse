/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable filesystem packfile cache in dev to prevent vendor-chunks MODULE_NOT_FOUND during client navigation
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
