import { Plugin, defineConfig } from "vite";

import { cjsInterop } from "vite-plugin-cjs-interop";
import fs from "fs";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function loadConfigTitle(): string {
    try {
        const configPath = path.join(__dirname, "public/config.js");
        if (!fs.existsSync(configPath)) {
            return "Dead y00ts DEX";
        }

        const configText = fs.readFileSync(configPath, "utf-8");
        const jsonText = configText
            .replace(/window\.__RUNTIME_CONFIG__\s*=\s*/, "")
            .replace(/;$/, "")
            .trim();

        const config = JSON.parse(jsonText);
        return config.VITE_ORDERLY_BROKER_NAME || "Dead y00ts DEX";
    } catch (error) {
        console.warn("Failed to load title from config.js:", error);
        return "Dead y00ts DEX";
    }
}

function htmlTitlePlugin(): Plugin {
    const title = loadConfigTitle();
    console.log(`Using title from config.js: ${title}`);

    return {
        name: "html-title-transform",
        transformIndexHtml(html) {
            return html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        },
    };
}

export default defineConfig(() => {
    const basePath = process.env.PUBLIC_PATH || "/";

    return {
        base: basePath,
        plugins: [
            react(),
            tsconfigPaths(),
            htmlTitlePlugin(),
            cjsInterop({
                dependencies: ["bs58", "@coral-xyz/anchor", "lodash"],
            }),
            nodePolyfills({
                include: ["buffer", "crypto", "stream"],
            }),
        ],
        build: {
            outDir: "build/client",
        },
        optimizeDeps: {
            include: ["react", "react-dom", "react-router-dom"],
        },
    };
});
