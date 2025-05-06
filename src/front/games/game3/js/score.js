// Fonction pour sauvegarder un score
function saveScoreGame3(pseudo, score, level) {
    //verif des données avant envoi
    if (typeof score !== "number" || isNaN(score) || typeof level !== "number" || isNaN(level) || !pseudo) {
        console.error("Erreur : données invalides.");
        return;
    }

    //envoi des données au serveur
    fetch("http://localhost:4000/save-score-game3", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pseudo: pseudo,
            score: score,
            level: level,
        }),
    })
    .then(res => res.text())
    .then(data => {
        console.log("Réponse serveur :", data);
    })
    .catch(err => console.error("Erreur de sauvegarde :", err));
}

function getAllScoresGame3() {
    fetch('http://localhost:4000/all-scores-game3')
    .then(response => response.json())
    .then(scores => {
        // Afficher les scores dans la console pour vérifier que les données sont correctes
        console.log('Scores reçus depuis le serveur:', scores);

        // Cibler le corps du tableau
        const tableBody = document.getElementById('scoreTable');

        // Pour chaque score, créer une nouvelle ligne dans le tableau
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            const date = new Date(score.created_at).toLocaleString('fr-FR'); // Formater la date
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.pseudo}</td>
                <td>${score.score}</td>
                <td>${date}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erreur lors du chargement des scores :', error);
    });
}

getAllScoresGame3();

export { saveScoreGame3};