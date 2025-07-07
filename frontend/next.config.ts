// frontend/next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Images configuratie voor Strapi
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/uploads/**',
            },
            // Voor productie zou je hier je Strapi production domain toevoegen
            // {
            //     protocol: 'https',
            //     hostname: 'your-strapi-domain.com',
            //     pathname: '/uploads/**',
            // }
        ],
    },
};

module.exports = nextConfig;