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

// Fonction d'achat d'automatisation
function buyAutomation(automation, game) {
    const choice = document.getElementById(automation.id);
    const costChoice = document.getElementById(automation.costId);

    if (!choice || !costChoice) return; 

    choice.addEventListener("click", () => {
        if (game.gold >= automation.price) {
            game.gold -= automation.price;
            automation.number += 1;
            game.update();
            updateAutomationDisplay(automation);  
        } else {
            alert("Pas assez d'or !");
        }
    });
}

// Mise à jour de l'affichage des automations
function updateAutomationDisplay(automation) {
    const automationElement = document.getElementById(automation.id);
    if (automationElement) {
        automationElement.querySelector('.count').textContent = `x${automation.number}`;
    }
}

// Fonction de démarrage des automations (ajoute l'or toutes les secondes)
function startAutomation(game) {

    automations.forEach(automation => {
        buyAutomation(automation, game); 
    });

    
    setInterval(() => {
        automations.forEach(automation => {
            if (automation.number > 0) {
                game.gold += automation.gainPerClick * automation.number;
            }
        });
        game.update();  
    }, 1000);
}

export { automations, startAutomation };
