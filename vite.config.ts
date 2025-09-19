import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Determine env directory relative to this config file without Node types
  const envDir = new URL('.', import.meta.url).pathname;
  // Load env file based on `mode`
  const env = loadEnv(mode, envDir);
  
  // Set base URL: use root '/' for development, repository subpath only for production
  const base = mode === 'development' ? '/' : (env.VITE_BASE_URL || '/japan-skilled-profes/');
  
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': new URL('./src/', import.meta.url).pathname
      }
    },
    build: {
      // Generate source maps for production build for easier debugging
      sourcemap: mode === 'development',
      // Improve build performance
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          }
        }
      }
    }
  };
});
