import mysql from 'mysql2';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const dbUrl = new URL(process.env.MYSQL_URL); 

const connection = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  port: parseInt(dbUrl.port, 10),
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
  } else {
    console.log('✅ Connecté à MySQL avec succès (réseau privé) !');
  }
});

export default connection;
