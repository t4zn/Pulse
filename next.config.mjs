/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    "ethers",
    "lucide-react",
    "@noble/hashes",
    "@noble/curves",
    "@adraffy/ens-normalize",
  ],
  webpack: (config, { dev }) => {
    if (dev) {
      // Use in-memory cache in dev to avoid macOS APFS file rename race conditions (.pack.gz)
      config.cache = {
        type: "memory",
      };
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
