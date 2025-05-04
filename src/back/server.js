import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import requestRoutes from "./requests.js";   
import cors from "cors";


//express
const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5000", 
    credentials: true
}));


// Pour gérer correctement __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", requestRoutes);
//serveur
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

//front
app.use(express.static(path.join(__dirname, "../front")));

app.get("/", (req, res) => {
    res.redirect("/site");
});


