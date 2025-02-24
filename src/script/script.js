//separer en divers fichiers
// rajouter d'autre amelioration + remplacer par des images
//changer les noms des 

let score = 0;
let multiplicateur = 1;
let autoClicks = 0;

// Sélection des éléments du DOM
const scoreDisplay = document.getElementById('score');
const rocket = document.getElementById('rocket');
const notificationList = document.getElementById('notification-list');

// Clic sur la fusée pour augmenter le score
rocket.addEventListener('click', () => {
    score += (1 * multiplicateur);
    mettreAJourAffichage();
    verifierNotifications();
});

// Achat de multiplicateur
const upgrades = document.querySelectorAll('.upgrade');
upgrades.forEach(button => {
    button.addEventListener('click', () => {
        const prix = parseInt(button.getAttribute('data-price'));
        const newMultiplier = parseInt(button.getAttribute('data-multiplier'));
        if (score >= prix) {
            score -= prix;
            multiplicateur = newMultiplier;
            mettreAJourAffichage();
            verifierNotifications();
        }
    });
});

// Achat d'auto-clics
const autoClickButtons = document.querySelectorAll('.auto-click');
autoClickButtons.forEach(button => {
    button.addEventListener('click', () => {
        const prix = parseInt(button.getAttribute('data-price'));
        const amount = parseInt(button.getAttribute('data-amount'));
        if (score >= prix) {
            score -= prix;
            autoClicks += amount;
            mettreAJourAffichage();
            verifierNotifications();
        }
    });
});

// Génération automatique de points par Auto-Clic
setInterval(() => {
    score += autoClicks;
    mettreAJourAffichage();
    verifierNotifications();
}, 1000);

// Fonction pour mettre à jour l'affichage du score
function mettreAJourAffichage() {
    scoreDisplay.textContent = score;
}

// Fonction pour vérifier les notifications
function verifierNotifications() {
    let notifications = [];

    upgrades.forEach(button => {
        const prix = parseInt(button.getAttribute('data-price'));
        const newMultiplier = button.getAttribute('data-multiplier');
        if (score >= prix) {
            notifications.push(`Vous pouvez acheter le Multiplicateur x${newMultiplier} !`);
        }
    });

    autoClickButtons.forEach(button => {
        const prix = parseInt(button.getAttribute('data-price'));
        if (score >= prix) {
            notifications.push(`Vous pouvez acheter un Auto-Clic !`);
        }
    });

    // Mise à jour des notifications
    notificationList.innerHTML = '';
    if (notifications.length > 0) {
        notifications.forEach(notif => {
            const li = document.createElement('li');
            li.textContent = notif;
            notificationList.appendChild(li);
        });
    } else {
        notificationList.innerHTML = '<li>Aucune notification pour le moment.</li>';
    }




}
