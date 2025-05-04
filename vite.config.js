import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/front/site',  // Définir la racine du projet
  build: {
    outDir: '../../dist',  // Indiquer où mettre les fichiers de build (relative à 'root')
    emptyOutDir: true,
}
});
