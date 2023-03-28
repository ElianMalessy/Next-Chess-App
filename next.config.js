/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['encrypted-tbn0.gstatic.com', 'upload.wikimedia.org', 'lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
