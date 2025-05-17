/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // output: 'standalone', // Nixpacks handles deployment packaging; 'standalone' might be redundant.
  // Ensure the app is served from the root path
  basePath: '',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      resolveAlias: {
        fs: { browser: './lib/empty.js' },
        path: { browser: './lib/empty.js' },
        http: { browser: './lib/empty.js' },
        https: { browser: './lib/empty.js' },
        crypto: { browser: './lib/empty.js' },
        stream: { browser: './lib/empty.js' },
        zlib: { browser: './lib/empty.js' },
        util: { browser: './lib/empty.js' },
        assert: { browser: './lib/empty.js' },
        process: { browser: './lib/empty.js' },
        events: { browser: './lib/empty.js' },
        os: { browser: './lib/empty.js' },
        'cornerstone-wado-image-loader': { browser: './lib/empty.js' },
        // '@icr/polyseg-wasm': { browser: './lib/empty.js' } // Kept removed
      },
    },
    // Add WebAssembly support for Webpack if it's not under turbo block
    // asyncWebAssembly: true, // This is a Next.js experimental flag, may not be for webpack directly
  },
  // Handle Cornerstone wasm files
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(',') : [],
    unoptimized: true,
  },
  // Update headers configuration for multiple domains
  async headers() {
    const customHeaders = [];
    if (process.env.NEXT_PUBLIC_ALLOWED_HOST_HEADER) {
      customHeaders.push({
        key: 'Host', // Note: Sending 'Host' in a response is non-standard.
        value: process.env.NEXT_PUBLIC_ALLOWED_HOST_HEADER,
      });
    }

    // You can add other headers here if needed
    // Example: 
    // customHeaders.push({
    //   key: 'X-Custom-Header',
    //   value: 'my-custom-value',
    // });

    if (customHeaders.length > 0) {
      return [
        {
          source: '/:path*',
          headers: customHeaders,
        },
      ];
    }
    return [];
  },
  // Add hostname configuration
  // Ensure proper hostname handling
  serverRuntimeConfig: {
    hostname: '0.0.0.0',
  },
  publicRuntimeConfig: {
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Add rewrites to handle root path
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite for the homepage
        {
          source: '/',
          destination: '/home',
        },
        // Existing passthrough rewrite (ensure it's after specific rewrites)
        {
          source: '/:path((?!home$|api/|_next/static|_next/image|favicon.ico).*)',
          destination: '/:path*',
        },
      ],
    };
  },
  webpack: (config, { isServer, dev, webpack }) => {
    // Enable WebAssembly experiments
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };

    // Necessary for WASM modules to be correctly loaded
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // For cornerstonejs/dicom-image-loader to load codecs correctly
    // It needs to resolve paths to wasm/decoders within its own node_modules structure
    if (!config.resolve.extensions.includes('.wasm')) {
        config.resolve.extensions.push('.wasm');
    }

    // Alias @cornerstonejs/tools to its UMD build as a test
    config.resolve.alias = {
      ...config.resolve.alias,
      '@cornerstonejs/tools': '@cornerstonejs/tools/dist/umd/index.js',
    };
    
    return config;
  },
};

export default nextConfig; 