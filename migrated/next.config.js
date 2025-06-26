/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable styled-components
  compiler: {
    styledComponents: true,
  },
  // Handle the service worker registration
  webpack: (config, { isServer }) => {
    // Add worker-loader for web workers
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    });

    // Support global CSS imports through css-loader
    const rules = config.module.rules;
    const cssRuleIndex = rules.findIndex(
      rule => rule.oneOf && Array.isArray(rule.oneOf)
    );

    if (cssRuleIndex !== -1) {
      const cssRule = rules[cssRuleIndex].oneOf;
      
      // Update CSS module loaders
      cssRule.forEach(rule => {
        if (
          rule.test && 
          rule.test.toString().includes('module') && 
          rule.test.toString().includes('css') && 
          !rule.test.toString().includes('sass')
        ) {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach(loader => {
              if (
                loader.loader && 
                loader.loader.includes('css-loader') && 
                loader.options &&
                loader.options.modules
              ) {
                loader.options.modules = {
                  ...loader.options.modules,
                  exportLocalsConvention: 'camelCase', // Use camelCase for CSS class names
                };
              }
            });
          }
        }
      });
    }

    return config;
  },
  // Redirect old routes if needed
  async redirects() {
    return [];
  },
  // Handle image domains for next/image
  images: {
    domains: ['localhost', 'api.example.com', 'images.unsplash.com'],
  },
  // Configure headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 