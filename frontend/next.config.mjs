/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'query',
              key: '_nextAlias',
              value: 'true',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
