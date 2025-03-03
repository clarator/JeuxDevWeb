//initialisation des améliorations
const upgrades = [
    { 
        id: 'pickaxe', 
        costId: 'pickaxeCost', 
        price: 50, 
        gain: 2 
    },
    { 
        id: 'ironPickaxe', 
        costId: 'ironPickaxeCost', 
        price: 100, 
        gain: 5 
    },
    { 
        id: 'diamondPickaxe', 
        costId: 'diamondPickaxeCost', 
        price: 150, 
        gain: 10 
    },
    { 
        id: 'dynamite', 
        costId: 'dynamiteCost', 
        price: 200, 
        gain: 20 
    },
    { 
        id: 'tnt', 
        costId: 'tntCost', 
        price: 500, 
        gain: 50 
    },
    { 
        id: 'drill', 
        costId: 'drillCost', 
        price: 500, 
        gain: 50 
    }
];

//acheter l'amélioration
function buyUpgrade(upgrade, game) {
    const choice = document.getElementById(upgrade.id);
    const costChoice = document.getElementById(upgrade.costId);

    if (!choice || !costChoice) return; 

    choice.addEventListener("click", () => {
        if (game.gold >= upgrade.price) {
            game.gold -= upgrade.price;
            game.update();
            applyUpgrade(upgrade, game);
        } else {
            alert("Pas assez d'or !");
        }
    });
}

//appliquer l'effet de l'amélioration
function applyUpgrade(upgrade, game) {
    game.goldPerClick += upgrade.gain;
}

//lancer les améliorations
function startUpgrade(game) {
    upgrades.forEach(upgrade => buyUpgrade(upgrade, game));
}

export{ upgrades, startUpgrade };