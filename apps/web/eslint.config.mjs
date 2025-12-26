import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextConfig from "eslint-config-next/core-web-vitals";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
  ...nextConfig,
  ...compat.extends("@repo/eslint-config/base.js"),
];

export default config;
