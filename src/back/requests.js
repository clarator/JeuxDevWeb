import express from "express";
import bcrypt from "bcrypt";
import db from "./db.js";

const router = express.Router();

router.post('/register', (req, res) => {
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
router.post('/login', (req, res) => {
    const { pseudo, password } = req.body;

    const query = 'SELECT * FROM users WHERE pseudo = ?';

    db.query(query, [pseudo], (err, result) => {
        if (err || result.length === 0) {
            res.status(500).send("Pseudo ou mot de passe incorrect");
            return;
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Erreur lors de la comparaison des mots de passe", err);
                res.status(500).send("Une erreur s'est produite");
                return;
            }

            if (isMatch) {
                res.send({ message: "Connexion réussie" });
                return;
            } else {
                res.status(500).send("Pseudo ou mot de passe incorrect");
            }
        });
    });
});

router.post('/logout', (req, res) => {
    res.send({ message: "Déconnexion réussie" });
});

export default router;