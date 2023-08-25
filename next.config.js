/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! just a demo !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! just a demo !!
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
