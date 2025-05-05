import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  root: 'src/front/site',      
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, 
    },
   
});
