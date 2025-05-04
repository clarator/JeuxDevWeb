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
