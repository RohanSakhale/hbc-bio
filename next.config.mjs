/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  distDir: "dist",
  images: {
    domains: [
      "w7.pngwing.com",
      "www.spectrumspace.org.au",
      "via.placeholder.com",
    ], // Add any other domains you need here
  },
};

export default nextConfig;
