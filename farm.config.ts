import { defineConfig } from "@farmfe/core"
import react from '@farmfe/plugin-react'

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
        watchOptions: {
          ignored: ["**/src-tauri/**"],

        }
      }
      : {
        watchOptions: {
          ignored: ["**/src-tauri/**"],
        }
      },
  }

})