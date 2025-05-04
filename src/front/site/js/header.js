//gestion du header
fetch('/site/html/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById("headerContainer").innerHTML = data;

    const login = document.getElementById("login");
    const contact = document.getElementById("contact");
    const home = document.getElementById("home");
    const userMenu = document.getElementById("userMenu");
    const playerName = document.getElementById("playerName");
    const userIcon = document.getElementById("userIcon");
    const menu = document.getElementById("menu");
    const logout = document.getElementById("logout");
    const profile = document.getElementById("profile");

    //redirige vers la page de connexion
    if (login) {
      login.addEventListener("click", () => {
        window.location.href = "/site/html/login.html";
      });
    }

    //redirige vers la page de contact
    if (contact) {
      contact.addEventListener("click", () => {
        window.location.href = "/site/html/contact.html";
      });
    }

    //redirige vers la page d'accueil
    if (home) {
      home.addEventListener("click", () => {
        window.location.href = "/";
      });
    }

    //redirige vers la page de profil
    if (profile) {
      profile.addEventListener("click", () => {
        window.location.href = "/site/html/profile.html";
      });
    }

      // Fonction utilitaire pour lire un cookie
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }


    const user = getCookie("user");
    console.log("User Cookie:", user);

    if (user) { 
      if (login) login.style.display = "none";

      userMenu.style.display = "flex";

      document.querySelector('.loginContenair').style.display = "none";

      userIcon.addEventListener("click", () => {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
      });

      //Déconnexion
      logout.addEventListener("click", () => {
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"; 
      });
    }
  });

// Ferme le menu si on clique en dehor
document.addEventListener("click", function(event) {
    const userMenu = document.getElementById("userMenu");
    const menu = document.getElementById("menu");
    const userIcon = document.getElementById("userIcon");

    if (!userMenu.contains(event.target)) {
        menu.style.display = "none";
    }
});