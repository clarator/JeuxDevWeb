// Fonction pour sauvegarder la wave du joueur game2
function saveWaveGame2(pseudo, wave) {
    console.log("Appel de saveWaveGame2 avec :", pseudo, wave);

    // Vérification des données
    if (!pseudo || isNaN(waveInt)) {
        console.error("Erreur : données invalides.");
        return;
    }

    console.log("Envoi des données :", { pseudo, wave: waveInt });

    // Envoi des données au serveur
    fetch("http://localhost:4000/save-waves", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pseudo: pseudo,
            wave: waveInt,
        }),
    })
    .then(res => res.text())
    .then(data => {
        console.log("Réponse serveur :", data);
    })
    .catch(err => console.error("Erreur de sauvegarde :", err));
}

export { saveWaveGame2 };
