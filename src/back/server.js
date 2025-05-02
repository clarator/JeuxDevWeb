import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import requestRoutes from "./request.js";

//express
const app = express();
app.use(express.json());

// Pour gérer correctement __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//serveur
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

//front
app.use(express.static(path.join(__dirname, "../front")));

app.get("/", (req, res) => {
    res.redirect("/site");
});


