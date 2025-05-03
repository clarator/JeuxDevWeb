// Fonction pour sauvegarder un score
function saveScore(pseudo, gameName, score) {
    fetch("http://localhost:4000/save-score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pseudo: pseudo,
            game_name: gameName,
            score: score,
        }),
    })
    .then(res => res.text())
    .then(data => {
        console.log("Réponse serveur :", data);
        getBestScore(pseudo, gameName); 
    })
    .catch(err => console.error("Erreur de sauvegarde :", err));
}

// Fonction pour récupérer le meilleur score
function getBestScore(pseudo, gameName) {
    return fetch(`http://localhost:4000/best-score?pseudo=${pseudo}&game_name=${gameName}`)
    .then(res => {
        if (!res.ok) {
            throw new Error("Erreur réseau ou serveur");
        }
        return res.json();
    })
    .then(data => data) 
    .catch(err => {
        console.error("Erreur de récupération du meilleur score :", err);
        return { bestScore: null }; 
    });
}


export { saveScore, getBestScore };
