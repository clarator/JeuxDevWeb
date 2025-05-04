import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/front/site',  // Définir la racine du projet
  build: {
    outDir: 'dist',  // Indiquer où mettre les fichiers de build (par défaut dist)
    rollupOptions: {
      input: {
        main: 'src/front/site/index.html'  // Spécifier explicitement le fichier d'entrée
      }
    }
  }
});
