//gère les automatisations du jeu
const automations = [
    { 
        id: 'mineur', 
        costId: 'minerCost', 
        price: 200, 
        gainPerClick: 10,
        number: 0
    },
    { 
        id: 'excavateur', 
        costId: 'excavatorCost', 
        price: 300, 
        gainPerClick: 50,
        number: 0
    },
    { 
        id: 'foreuse', 
        costId: 'drill2Cost', 
        price: 500, 
        gainPerClick: 100,
        number: 0
    }
];

//fonction d'achat d'une automation
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
            costChoice.textContent = automation.price; 
            game.update();

        } else {
            alert("Pas assez d'or !");
        }
    });
}

//fonction pour démarrer l'automatisation
function startAutomation(game) {
    automations.forEach(automation => {
        buyAutomation(automation, game); 
    });
    
    // Exécute l'automatisation toutes les secondes
    setInterval(() => {
        let totalGain = 0;
        let totalGold = 0;
        automations.forEach(automation => {
            if (automation.number > 0) {
                totalGain += automation.gainPerClick * automation.number;
                totalGold += (automation.gainPerClick * automation.number) /2;
            }
        });

        if (totalGain > 0) {
            game.score += totalGain;
            game.scoreDisplay.textContent = game.score;
        }

        game.gold += totalGold;
        game.update();
    }, 1000);
}

export { automations, startAutomation };
