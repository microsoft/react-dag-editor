import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    outDir: "dist",
    reportCompressedSize: true,
    lib: {
      entry: "src/index.ts",
      name: "ReactDagEditor",
      fileName: format => {
        if (format === "es") {
          return "index.es.js";
        }
        return "index.js";
      }
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React"
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
});
