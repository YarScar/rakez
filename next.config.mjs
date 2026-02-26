/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  /*added output: "standalone" for docker*/
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;
