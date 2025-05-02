fetch('/site/html/header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById("headerContainer").innerHTML = data;

        // Ajouter les écouteurs ici, une fois le HTML injecté
        const login = document.getElementById("login");
        const contact = document.getElementById("contact");
        const home = document.getElementById("home");

        if (login) {
            login.addEventListener("click", () => {
                window.location.href = "/site/html/login.html";
            });
        }

        if (contact) {
            contact.addEventListener("click", () => {
                window.location.href = "/site/html/contact.html";
            });
        }

        if (home) {
            home.addEventListener("click", () => {
                window.location.href = "/";
            });
        }

      
    });
