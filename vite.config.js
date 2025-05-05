import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/front/site',      
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, 
    },
   
});
