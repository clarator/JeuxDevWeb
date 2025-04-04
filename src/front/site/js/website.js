fetch('/site/html/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById("headerContainer").innerHTML = data;
            const script = document.createElement("script");
            script.src = "/site/js/header.js";
            document.body.appendChild(script);
        });

//TODO recup le pseudo du joueur 
//s'occuper de recup les scores en fin de jeu
//faire le site principal
//faier en sorte que ce soit pas possible de revenir en arriere apres s'etre connecter