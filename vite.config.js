import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  root: path.resolve(__dirname),     
  publicDir: 'public', 
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, 
    },
   
});
