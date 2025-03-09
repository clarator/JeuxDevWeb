const automations = [
    { 
        id: 'miner', 
        costId: 'minerCost', 
        price: 200, 
        gainPerClick: 10,
        number: 0
    },
    { 
        id: 'excavator', 
        costId: 'excavatorCost', 
        price: 300, 
        gainPerClick: 50,
        number: 0
    },
    { 
        id: 'drill2', 
        costId: 'drill2Cost', 
        price: 500, 
        gainPerClick: 100,
        number: 0
    }
];

// Fonction d'achat d'une automation
function buyAutomation(automation, game) {
    const choice = document.getElementById(automation.id);
    const costChoice = document.getElementById(automation.costId);

    if (!choice || !costChoice) return; 

    choice.addEventListener("click", () => {
        if (game.gold >= automation.price) {
            game.gold -= automation.price;
            automation.number += 1;       

            // Augmenter le prix après chaque achat
            automation.price = Math.floor(automation.price * 1.5); 

            game.update();
            updateAutomationDisplay(automation);  
            costChoice.textContent = `${automation.price} 💰`; 
        } else {
            alert("Pas assez d'or !");
        }
    });
}

// Mise à jour de l'affichage des automations
function updateAutomationDisplay(automation) {
    const automationElement = document.getElementById(automation.id);
    if (automationElement) {
        const countElement = automationElement.querySelector('.count');
        if (countElement) {
            countElement.textContent = `x${automation.number}`;
        }
    }
}

function startAutomation(game) {
    automations.forEach(automation => {
        buyAutomation(automation, game); 
    });
    
    setInterval(() => {
        let totalGain = 0;
        automations.forEach(automation => {
            if (automation.number > 0) {
                totalGain += automation.gainPerClick * automation.number;
            }
        });

        if (totalGain > 0) {
            game.score += totalGain; 
            game.update();
        }
    }, 1000);
}

export { automations, startAutomation };
