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
    
    
        const query = 'INSERT INTO users (pseudo, password) VALUES (?, ?)';
    
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

router.post("/save-score", (req, res) => {
    console.log("Requête reçue :", req.body);

    const { pseudo, game_name } = req.body;
    req.body.score = parseInt(req.body.score, 10);
    const score = req.body.score;

    if (!pseudo || typeof score !== "number" || isNaN(score)) {
        console.log("Champs invalides :", { pseudo, score });
        res.status(400).send("Champs manquants ou invalides");
        return;
    }

    const userQuery = "SELECT id FROM users WHERE pseudo = ?";
    db.query(userQuery, [pseudo], (err, results) => {
        if (err || results.length === 0) {
            console.error("Erreur récupération user :", err, "Résultats :", results);
            res.status(500).send("Utilisateur non trouvé");
            return;
        }

        const userId = results[0].id;
        console.log("Utilisateur trouvé :", userId);

        const bestScoreQuery = `
            SELECT id, score FROM scores
            WHERE user_id = ? AND is_best = true
        `;

        db.query(bestScoreQuery, [userId], (err2, bestResults) => {
            if (err2) {
                console.error("Erreur récupération meilleur score :", err2);
                res.status(500).send("Erreur lors de la récupération du meilleur score");
                return;
            }

            const isBest = bestResults.length === 0 || score > bestResults[0].score;
            console.log("Nouveau score est-il meilleur ?", isBest);

            const insertScoreQuery = `
                INSERT INTO scores (user_id, score, is_best, created_at)
                VALUES (?, ?, ?, ?, NOW())
            `;

            db.query(insertScoreQuery, [userId, score, isBest], (err3) => {
                if (err3) {
                    console.error("Erreur insertion score :", err3);
                    res.status(500).send("Erreur enregistrement score");
                    return;
                }

                if (isBest && bestResults.length > 0) {
                    const oldBestId = bestResults[0].id;
                    const updateOldBestQuery = `UPDATE scores SET is_best = false WHERE id = ?`;
                    db.query(updateOldBestQuery, [oldBestId], (err4) => {
                        if (err4) {
                            console.warn("Erreur mise à jour ancien meilleur score :", err4);
                        }
                        res.status(200).send("Score enregistré (nouveau meilleur score)");
                    });
                } else {
                    res.status(200).send("Score enregistré");
                }
            });
        });
    });
});

//retourne le meilleur score d'un joueur pour un jeu donné
router.get('/best-score', (req, res) => {
    const { pseudo } = req.query;

    if (!pseudo || !game_name) {
        return res.status(400).json({ message: "Champs manquants" });
    }

    const userQuery = "SELECT id FROM users WHERE pseudo = ?";
    db.query(userQuery, [pseudo], (err, results) => {
        if (err || results.length === 0) {
            console.error("Erreur récupération user :", err, "Résultats :", results);
            return res.status(500).json({ message: "Utilisateur non trouvé" });
        }

        const userId = results[0].id;

        const bestScoreQuery = `
            SELECT score FROM scores
            WHERE user_id = ? AND game_name = ? AND is_best = true
        `;
        db.query(bestScoreQuery, [userId, game_name], (err2, bestResults) => {
            if (err2) {
                console.error("Erreur récupération meilleur score :", err2);
                return res.status(500).json({ message: "Erreur lors de la récupération du meilleur score" });
            }

            if (bestResults.length > 0) {
                return res.json({ bestScore: bestResults[0].score });
            } else {
                return res.json({ bestScore: null });
            }
        });
    });
});



export default router;