// redirige vers le menu
const login = document.getElementById("login");


login.addEventListener("click", function () {
    window.location.href = "/site/html/login.html";
});


document.addEventListener("DOMContentLoaded", function () {
    fetch("/getUser", { credentials: "include" }) // Important pour envoyer les cookies
    .then(response => response.json())
    .then(data => {
        const pseudoSpan = document.getElementById("pseudo");
        if (pseudoSpan) {
            pseudoSpan.textContent = data.pseudo ? data.pseudo : "Invité";
        }
    })
    .catch(error => console.error("Erreur de récupération du pseudo :", error));

});


//mettre une fleche ppur revenir en arrierer
// faire la page contacte
