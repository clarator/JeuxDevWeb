import { upgrades } from "./upgrade.js";
import { gameInstance } from "./Game.js";
import { automations } from "./automation.js";

export function checkNotifications() {
    const notificationList = document.getElementById("list");
    let notifications = [];

    upgrades.forEach(upgrade => {
        if (gameInstance.gold >= upgrade.price) {
            notifications.push(`Vous pouvez acheter ${upgrade.id} (+${upgrade.gain} or/clic) !`);
        }
    });

    automations.forEach(automation => {
        if (gameInstance.gold >= automation.price) {
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

setInterval(checkNotifications, 1000);
