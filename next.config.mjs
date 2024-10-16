/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'appwrite.freecorps.xyz',
                port: "",
                pathname: '**',
            }
        ]
    }
};

export default nextConfig;
