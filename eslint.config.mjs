import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "prisma/seed.ts", // Zezwól na console.log w seed.ts
    ],
  },
  {
    rules: {
      "no-console": [
        "error",
        {
          allow: ["error"], // Zezwól tylko na console.error (dla logowania błędów w API)
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Dla plików API routes - zezwól na console.error i console.warn
  {
    files: ["src/app/api/**/*.ts"],
    rules: {
      "no-console": [
        "error",
        {
          allow: ["error", "warn"], // W API routes pozwól na console.error i console.warn
        },
      ],
    },
  },
];

export default eslintConfig;
