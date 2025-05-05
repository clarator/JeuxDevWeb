import { getCookie } from "../../games/common/cookie.js";

document.addEventListener("DOMContentLoaded", () => {
    const pseudo = getCookie("user");
    const pseudoDisplay = document.getElementById("pseudoDisplay");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const updateForm = document.getElementById("updateForm");

    //affiche le pseudo dans l'élément HTML
    if (pseudoDisplay) {
        pseudoDisplay.textContent = pseudo;
    } else {
        console.error("Erreur : élément #pseudoDisplay introuvable");
    }

    //modifie le pseudo et/ou le mot de passe du joueur
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();
    
        const oldUsername = pseudo; 
        const newUsername = usernameInput.value.trim();
        const password = passwordInput.value.trim();
    
        const data = {
            oldUsername
        };
    
        if (newUsername) data.newUsername = newUsername;
        if (password) data.password = password;
    
        if (!newUsername && !password) {
            alert("Veuillez remplir au moins un champ pour mettre à jour le profil.");
            return;
        }
    
        fetch('/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        .then(res => res.json().catch(() => { throw new Error("Erreur serveur") }))
        .then(data => {
            alert(data.message);
            if (data.newUsername) {
                document.cookie = `user=${data.newUsername}; path=/`;
                pseudoDisplay.textContent = data.newUsername;
            }
        })
        .catch(err => {
            console.error("Erreur côté client :", err);
            alert("Une erreur est survenue.");
        });
    });
    
    //supprime le compte du joueur
    document.getElementById("deleteAccount").addEventListener("click", () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            fetch(`/delete-account?pseudo=${pseudo}`, {
                method: "DELETE",
            })
            .then(res => {
                if (res.ok) {
                    alert("Compte supprimé.");
                    document.cookie = "user=; Max-Age=0";
                    window.location.href = "/";
                } else {
                    alert("Erreur lors de la suppression du compte.");
                }
            });
        }
    });
});
