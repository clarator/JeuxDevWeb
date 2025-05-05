import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  root: 'src/front/site',      
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, 
    rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/front/site/index.html'),
          game1: path.resolve(__dirname, 'src/front/games/game1/game1.html'),
          game2: path.resolve(__dirname, 'src/front/games/game2/game2.html'),
          game3: path.resolve(__dirname, 'src/front/games/game3/game3.html'),
        },
      },
    },
   
});
