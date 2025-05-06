import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  root: index.html,     
  publicDir: 'public', 
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, 
    },
   
});
