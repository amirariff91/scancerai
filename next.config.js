/** @type {import('next').NextConfig} */
const nextConfig = {
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
      
      // Add exception for cornerstone-wado-image-loader
      config.resolve.alias = {
        ...config.resolve.alias,
        'cornerstone-wado-image-loader': false  // Disable SSR for this module
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
    domains: [],
    // Add other image configuration as needed
  },
  // Next.js 13+ app directory
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig; 