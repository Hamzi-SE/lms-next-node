/** @type {import('next').NextConfig} */
const nextConfig = {
    // images: {
    //     domains: [
    //         "res.cloudinary.com",
    //         "lh3.googleusercontent.com",
    //         "avatars.githubusercontent.com",
    //     ],
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
};

export default nextConfig;
