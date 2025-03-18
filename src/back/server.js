import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import db from "./db.js";

//express
const app = express();
app.use(cors()); 
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


//sql
app.post('/register', (req, res) => {
    const { pseudo, password, password2 } = req.body;
    
    if(pseudo === "" || password === "" || password2 === ""){
        res.status(400).send("Veuillez remplir tous les champs");
        return;
    }

    if(password !== password2){
        res.status(400).send("Les mots de passe ne correspondent pas!!");
        return
    }
    
    //crypter le mot de passe
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
    
    
        const query = 'INSERT INTO users (pseudo,password) VALUES (?, ?)';
    
        db.query(query, [pseudo, hash], (err, result) => {
            if(err){
                console.error("Erreur lors de l'inscription", err);
                res.status(500).send("Erreur lors de l'inscription");
                return;
            }
            res.status(200).send("Inscription réussie");
        });
    }catch(err){
        console.error("Erreur lors de l'inscription", err);
        res.status(500).send("Erreur lors de l'inscription");
    }
});
    

//connexion
app.post('/login', (req, res) => {
    const { pseudo, password } = req.body;

    const query = 'SELECT * FROM users WHERE pseudo = ?';

    db.query(query, [pseudo], (err, result) => {
        if(err || result.length === 0){
            res.status(500).send("Pseudo ou mot de passe incorrect");
            return;
        }

        const user = result[0];

        //comparer les mots de passe
        bcrypt.compare(password, user.password, (err, result) => {
            if(err){
                console.error("Erreur lors de la comparaison des mots de passe", err);
                res.status(500).send("Une erreur s'est produite");
                return;
            }

            if(result){
                res.status(200).send("Connexion réussie");
                return;
            }

            if(user.password == password){
                res.status(200).send("Connexion réussie");
                return;
            }else{
                res.status(500).send("Pseudo ou mot de passe incorrect");
                return;
            }
        });
    }
    );
});


//recup le pseudo
app.get("/getUser", (req, res) => {
    if (req.session && req.session.user) {
        res.json({ pseudo: req.session.user.pseudo });
    } else {
        res.json({ pseudo: null });
    }
});


