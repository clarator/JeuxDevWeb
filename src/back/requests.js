//requête pour la gestion des joueurs et des jeux
import express from "express";
import bcrypt from "bcrypt";
import db from "./db.js"; 

const router = express.Router();

//inscription
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
                res.cookie("user", pseudo, { path: "/" });
                res.send({ message: "Connexion réussie" });
                return;
            } else {
                res.status(500).send("Pseudo ou mot de passe incorrect");
            }
        });
    });
});

//deconnexion
router.post('/logout', (req, res) => {
    res.send({ message: "Déconnexion réussie" });
});


//modifie le profil du joueur
router.post("/update-profile", async (req, res) => {
    const { oldUsername, newUsername, password } = req.body;

    if (!oldUsername) {
        return res.status(400).json({ message: "Ancien pseudo manquant." });
    }

    if (!newUsername && !password) {
        return res.status(400).json({ message: "Aucune donnée à mettre à jour." });
    }

    // Vérifie si l'utilisateur existe
    db.get("SELECT * FROM users WHERE pseudo = ?", [oldUsername], async (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Erreur serveur (recherche user)" });
        }

        if (!row) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        // Préparer les valeurs à mettre à jour
        const updates = [];
        const values = [];

        if (newUsername) {
            updates.push("pseudo = ?");
            values.push(newUsername);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push("password = ?");
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "Aucune modification à appliquer." });
        }

        values.push(oldUsername); // pour WHERE clause

        const sql = `UPDATE users SET ${updates.join(", ")} WHERE pseudo = ?`;

        db.run(sql, values, function (err) {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la mise à jour." });
            }

            // Met à jour le cookie si le pseudo a changé
            if (newUsername) {
                res.cookie("user", newUsername, {
                    path: "/",
                    maxAge: 3600000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict"
                });
            }

            res.json({
                message: "Profil mis à jour avec succès.",
                newUsername: newUsername || oldUsername
            });
        });
    });
});

//supprime le compte du joueur
router.delete('/delete-account', (req, res) => {
    const pseudo = req.cookies.user; 

    //si joueur pas connect"
    if (!pseudo) {
        res.status(400).send("Utilisateur non identifié");
        return;
    }

    //supprime le compte dans la BDD
    const deleteQuery = "DELETE FROM users WHERE pseudo = ?";
    db.query(deleteQuery, [pseudo], (err, result) => {
        if (err) {
            console.error("Erreur suppression compte :", err);
            res.status(500).send("Erreur lors de la suppression du compte");
            return;
        }

        res.clearCookie("user", { path: "/" });
        res.status(200).send("Compte supprimé avec succès");
    });
});


/* JEUX 1 */
//sauvegarde du score du jeu1
router.post("/save-score", (req, res) => {
    console.log("Requête reçue :", req.body);

    const { pseudo } = req.body;
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
            SELECT id, score FROM minorClicker
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
                INSERT INTO minorClicker (user_id, score, is_best, created_at)
                VALUES (?, ?, ?, NOW())
            `;

            db.query(insertScoreQuery, [userId, score, isBest], (err3) => {
                if (err3) {
                    console.error("Erreur insertion score :", err3);
                    res.status(500).send("Erreur enregistrement score");
                    return;
                }

                if (isBest && bestResults.length > 0) {
                    const oldBestId = bestResults[0].id;
                    const updateOldBestQuery = `UPDATE minorClicker SET is_best = false WHERE id = ?`;
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

//retourne le meilleur score d'un joueur pour jeu1
router.get('/best-score', (req, res) => {
    const { pseudo } = req.query;

    if (!pseudo) {
        return res.status(400).json({ message: "Pseudo requis" });
    }

    const userQuery = "SELECT id FROM users WHERE pseudo = ?";
    db.query(userQuery, [pseudo], (err, userResults) => {
        if (err || userResults.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const userId = userResults[0].id;

        const bestScoreQuery = `
            SELECT score FROM minorClicker
            WHERE user_id = ? ORDER BY score DESC LIMIT 1
        `;

        db.query(bestScoreQuery, [userId], (err2, scoreResults) => {
            if (err2) {
                return res.status(500).json({ message: "Erreur lors de la récupération du score" });
            }

            const bestScore = scoreResults.length > 0 ? scoreResults[0].score : null;
            console.log("Best score pour", pseudo, ":", bestScore);
            return res.json({ bestScore });
        });
    });
});

//retourne tout les scores de tout les joueurs pour game1
router.get('/all-scores-game1', (req, res) => {
    const query = `
        SELECT u.pseudo, m.score, m.created_at
        FROM users u
        JOIN minorClicker m ON u.id = m.user_id
        ORDER BY m.score DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erreur récupération scores game1 :", err);
            return res.status(500).json({ message: "Erreur lors de la récupération des scores" });
        }
    
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Aucun score trouvé" });
        }
    
        console.log("Scores récupérés :", results);
        res.status(200).json(results);
    });
});


/* JEU 2 */
//sauvegarde les vagues de game2
router.post("/save-waves", (req, res) => {
    const { pseudo, wave } = req.body; 

    if (!pseudo || typeof wave !== 'number') {
        res.status(400).send("Champs invalides");
        return;
    }

    const userQuery = "SELECT id FROM users WHERE pseudo = ?";
    db.query(userQuery, [pseudo], (err, results) => {
        if (err || results.length === 0) {
            res.status(500).send("Utilisateur non trouvé");
            return;
        }

        const userId = results[0].id;

        const insertQuery = `
            INSERT INTO deepSpaceSurvivor (playerID, wave, created_at)
            VALUES (?, ?, NOW())
        `;

        db.query(insertQuery, [userId, wave], (err2) => { 
            if (err2) {
                console.error("Erreur enregistrement vagues :", err2);
                res.status(500).send("Erreur enregistrement vagues");
                return;
            }

            res.status(200).send("Vague enregistrée");
        });
    });
});





/* JEU 3 */
//sauvegarde le score de game3
router.post("/save-score-game3", (req, res) => {
    const { pseudo, score, level } = req.body;

    console.log(pseudo, score, level);
    if (!pseudo || typeof score !== "number" || isNaN(score) || typeof level !== "number") {
        res.status(400).send("Champs invalides");
        return;
    }

    const userQuery = "SELECT id FROM users WHERE pseudo = ?";
    db.query(userQuery, [pseudo], (err, results) => {
        if (err || results.length === 0) {
            res.status(500).send("Utilisateur non trouvé");
            return;
        }

        const userId = results[0].id;

        const insertQuery = `
            INSERT INTO serpentRush (id_player, score, level, created_at)
            VALUES (?, ?, ?, NOW())
        `;

        db.query(insertQuery, [userId, score, level], (err2) => {
            if (err2) {
                console.error("Erreur enregistrement score game3 :", err2);
                res.status(500).send("Erreur enregistrement score");
                return;
            }

            res.status(200).send("Score game3 enregistré");
        });
    });
});


//retourne tout les scores pour game3
router.get("/all-scores-game3", (req, res) => {
    const query = `
        SELECT u.pseudo, s.score, s.level, s.created_at
        FROM users u
        JOIN serpentRush s ON u.id = s.id_player
        ORDER BY s.score DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erreur récupération scores game3 :", err);
            return res.status(500).json({ message: "Erreur lors de la récupération des scores" });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Aucun score trouvé" });
        }

        console.log("Scores récupérés :", results);
        res.status(200).json(results);
    });
});



export default router;