import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/text-(slate|gray|neutral|zinc|stone)-/]",
          message: "Use semantic text tokens or shared typography classes instead of raw text-* colors.",
        },
        {
          selector: "Literal[value=/text-[0-9]+px/]",
          message: "Use the shared typography scale classes instead of pixel text sizes.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
