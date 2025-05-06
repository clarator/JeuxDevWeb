// Fonction pour sauvegarder un score
function saveScore(pseudo, score) {
    fetch("http://localhost:4000/save-score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pseudo: pseudo,
            score: score,
        }),
    })
    .then(res => res.text())
    .then(data => {
        console.log("Réponse serveur :", data);
        getBestScore(pseudo); 
    })
    .catch(err => console.error("Erreur de sauvegarde :", err));
}

// Fonction pour récupérer le meilleur score
function getBestScore(pseudo) {
    return fetch(`http://localhost:4000/best-score?pseudo=${pseudo}`)
        .then(res => {
            if (!res.ok) {
                console.error("Erreur lors de la récupération du meilleur score :", res.statusText);
            }
            return res.json();
        })
        .then(data => data) 
        .catch(err => {
            console.error("Erreur lors de la récupération du meilleur score :", err);
            return { bestScore: null }; 
        });
}

//récuperer les scores de tout les joueurs du jeu 1
function getAllScoresGame1() {
    fetch('http://localhost:4000/all-scores-game1')
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

getAllScoresGame1();

export { saveScore, getBestScore, getAllScoresGame1 };