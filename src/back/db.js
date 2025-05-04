import dotenv from "dotenv";
dotenv.config();
import mysql2 from "mysql2";

// Utilisation de l'URL complète
const db = mysql2.createConnection(process.env.MYSQL_URL);

// Vérifie la connexion
db.connect(err => {
    if (err) {
        console.error("Erreur connexion à MySQL : ", err);
        return;
    }
    console.log("Connexion à MySQL réussie");
    
});

export default db;