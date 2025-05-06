//fonction pour sauvegarder la wave du joueur game2
function saveWaveGame2(pseudo, wave) {
    //verif des données avant envoi
    if (typeof wave !== "number" || isNaN(wave) || !pseudo) {
        console.error("Erreur : données invalides.");
        return;
    }

    console.log("Envoi des données :", { pseudo, wave });
    //envoi des données au serveur
    fetch("http://localhost:4000/save-waves", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pseudo: pseudo,
            wave: wave,
        }),
    })
    .then(res => res.text())
    .then(data => {
        console.log("Réponse serveur :", data);
    })
    .catch(err => console.error("Erreur de sauvegarde :", err));
}

export { saveWaveGame2 };