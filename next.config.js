/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone output for Docker
  // Ensure the app is served from the root path
  basePath: '',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Only apply this in the browser build
    if (!isServer) {
      // Node.js polyfills needed by Cornerstone libraries
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        http: false,
        https: false,
        crypto: false,
        stream: false,
        zlib: false,
        util: false,
        assert: false,
        process: false,
        events: false,
        os: false
      };
      
      // Add exception for cornerstone-wado-image-loader and polyseg-wasm
      config.resolve.alias = {
        ...config.resolve.alias,
        'cornerstone-wado-image-loader': false,  // Disable SSR for this module
        '@icr/polyseg-wasm': false  // Prevent error for missing module
      };
      
      // Special handling for cornerstone libraries
      config.externals = [
        ...(config.externals || []),
        {'cornerstone-wado-image-loader': 'cornerstone-wado-image-loader'}
      ];
    }

    return config;
  },
  // Handle Cornerstone wasm files
  images: {
    // Keep existing configuration if any
    domains: ['scancerai.amrff.com'],
    // Add other image configuration as needed
  },
  // Add hostname configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Host',
            value: 'scancerai.amrff.com',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 