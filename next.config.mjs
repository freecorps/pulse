/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mdxeditor/editor"],
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appwrite.freecorps.xyz",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
