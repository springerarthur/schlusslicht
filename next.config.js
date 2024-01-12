const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
