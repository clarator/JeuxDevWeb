const routes = {
    "/": "/site/html/website.html",
    "/login": "/site/html/login.html",
    "/games/game1": "/games/game1/game1.html",
    "/games/game2": "/games/game2/game2.html",
    "/games/game3": "/games/game3/game3.html"
};

const navigateTo = (componentName, data = {}) => {
    history.pushState({ component: componentName, data }, "", ""); // Pas de changement d'URL
    loadComponentFromState();
};

const loadComponentFromState = async () => {
    const state = history.state || { component: "/" }; 
    const componentUrl = routes[state.component] || "./site/html/404.html";
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) throw new Error("Erreur de chargement du composant");
        var html = await response.text();

        const path = componentUrl.substring(0, componentUrl.lastIndexOf("/") + 1);
        const parser = new DOMParser();
        html = parser.parseFromString(html, "text/html");

        document.getElementById("app").innerHTML = html.body.innerHTML;
        loadStyles(html, path);
        loadScripts(html, path);

    } catch (error) {
        console.error("Erreur de chargement:", error);
        document.getElementById("app").innerHTML = "<h1>Erreur de chargement</h1>";
    }
    document.querySelectorAll("#navBar p[data-active]").forEach(p => p.removeAttribute("data-active"));
    document.querySelectorAll(`#navBar p[data-link="${state.component}"]`).forEach(p => p.setAttribute("data-active", ""));
};

const loadScripts = (html, path) => {

    // Supprimer les anciens scripts spécifiques à la page
    document.querySelectorAll("script[data-dynamic-script]").forEach(script => script.remove());

    // Ajouter les nouveaux scripts
    html.querySelectorAll("script[src]").forEach(script => {
        const newScript = document.createElement("script");
        const serverAddress = window.location.origin + "/"; // Dynamically get the server address
        newScript.src = "." + path + script.src.replace(serverAddress, "");
        newScript.type = script.type;   
        newScript.setAttribute("data-dynamic-script", ""); // Marquer comme script dynamique
        console.log("Chemin généré pour le script :", newScript.src);
        document.body.appendChild(newScript);
    });

    // Ajouter les scripts inline
    html.querySelectorAll("script:not([src])").forEach(script => {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        newScript.setAttribute("data-dynamic-script", ""); // Marquer comme script dynamique
        document.body.appendChild(newScript);
    });
};

const loadStyles = (html, path) => {
    // Supprime les anciens styles sauf ceux de base
    document.querySelectorAll("link[data-dynamic-style]").forEach(link => link.remove());

    // Ajoute les nouveaux styles
    html.querySelectorAll("link[rel='stylesheet']").forEach(link => {
        const newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        const serverAddress = window.location.origin + "/"; // Dynamically get the server address
        newLink.href = "." + path + link.href.replace(serverAddress, "");
        newLink.setAttribute("data-dynamic-style", ""); // Marque comme style dynamique
        document.head.appendChild(newLink);
    });
};

// Intercepter les clics sur les liens internes
document.addEventListener("DOMContentLoaded", () => {
    loadComponentFromState();
});

// Gérer les boutons "précédent" et "suivant" du navigateur
window.onpopstate = () => loadComponentFromState();

