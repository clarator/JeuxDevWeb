//gère la connexion à la base de données

import mysql2 from "mysql2";

//sql
const db = mysql2.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database: "jeuxweb"
});


//verifie la connexion
db.connect(err => {
    if(err){
        console.error("Erreur connexion à MySQL", err);
        return;
    }
    console.log("Connexion à MySQL");
});

export default db;