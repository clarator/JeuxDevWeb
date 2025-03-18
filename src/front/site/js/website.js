


document.addEventListener("DOMContentLoaded", function () {
    fetch("/getUser")
        .then(response => response.json())
        .then(data => {
            const pseudoSpan = document.getElementById("pseudo");
            if (pseudoSpan) {
                pseudoSpan.textContent = data.pseudo ? data.pseudo : "Invité";
            }
        })
        .catch(error => console.error("Erreur de récupération du pseudo", error));
});

//TODO recup le pseudo du joueur 
//s'occuper de recup les scores en fin de jeu
//faire le site principal
//faier en sorte que ce soit pas possible de revenir en arriere apres s'etre connecter