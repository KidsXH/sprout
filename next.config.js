/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  webpack: (config) => {
    config.module.rules.push({
      test: /\.txt$/,
      use: "raw-loader",
    });
    config.module.rules.push({
      test: /\.(png|jp(e*)g|svg|gif)$/,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
