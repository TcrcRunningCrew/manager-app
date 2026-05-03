/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance: tree-shake heavy packages
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "lottie-react",
      "qrcode.react",
    ],
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Security & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
