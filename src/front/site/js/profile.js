import { getCookie } from "./cookies.js"; 

document.addEventListener("DOMContentLoaded", () => {
    const pseudo = getCookie("user");
    const usernameInput = document.getElementById("username");

    if (pseudo) {
        usernameInput.value = pseudo;
    }

    document.getElementById("deleteAccount").addEventListener("click", () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            fetch(`/delete-account?pseudo=${pseudo}`, {
                method: "DELETE",
            })
            .then(res => {
                if (res.ok) {
                    alert("Compte supprimé.");
                    document.cookie = "user=; Max-Age=0"; // supprime cookie
                    window.location.href = "/";
                } else {
                    alert("Erreur lors de la suppression du compte.");
                }
            });
        }
    });
});

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}
