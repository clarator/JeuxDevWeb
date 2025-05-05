//connexion à la base de données MySQL
import dotenv from "dotenv";
dotenv.config();
import mysql2 from "mysql2";

//utilisation de l'url pour se connecter à la base de données sur railway
const db = mysql2.createConnection(process.env.MYSQL_URL);

//vérifie la connexion
db.connect(err => {
    if (err) {
        console.error("Erreur connexion à MySQL : ", err);
        return;
    }
    console.log("Connexion à MySQL réussie");
    
});

export default db;