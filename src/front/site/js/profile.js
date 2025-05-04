import { getCookie } from "./cookies.js"; 

document.addEventListener("DOMContentLoaded", () => {
    const pseudo = getCookie("user");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const updateForm = document.getElementById("updateForm");

    // Si un pseudo est déjà enregistré dans le cookie, le remplir dans le formulaire
    if (pseudo) {
        usernameInput.value = pseudo;
    }

    // Soumission du formulaire de mise à jour du profil
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Empêche le rechargement de la page à la soumission du formulaire

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Envoie une requête POST pour mettre à jour le profil
        fetch('/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                if (username) {
                    document.cookie = `user=${username}; path=/`; // Met à jour le cookie avec le nouveau pseudo
                }
            }
        })
        .catch(err => {
            alert("Une erreur est survenue lors de la mise à jour du profil.");
            console.error(err);
        });
    });

    // Gestion de la suppression du compte
    document.getElementById("deleteAccount").addEventListener("click", () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            fetch(`/delete-account?pseudo=${pseudo}`, {
                method: "DELETE",
            })
            .then(res => {
                if (res.ok) {
                    alert("Compte supprimé.");
                    document.cookie = "user=; Max-Age=0"; // Supprime le cookie
                    window.location.href = "/"; // Redirige l'utilisateur
                } else {
                    alert("Erreur lors de la suppression du compte.");
                }
            });
        }
    });
});

