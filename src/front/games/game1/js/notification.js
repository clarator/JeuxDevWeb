//gère les notifications du jeu 1
import { upgrades } from "./upgrade.js";
import { automations } from "./automation.js";

//fonction qui affiche les notifications
export function checkNotifications(game) {
    const notificationList = document.getElementById("list");
    let notifications = [];

    if (!game) return; 

    upgrades.forEach(upgrade => {
        if (game.gold >= upgrade.price) {
            notifications.push(`Vous pouvez acheter ${upgrade.id} (+${upgrade.gain} or/clic) !`);
        }
    });

    automations.forEach(automation => { 
        if (game.gold >= automation.price) {
            notifications.push(`Vous pouvez acheter ${automation.id} (+${automation.gainPerClick} or/sec) !`);
        }
    });

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
