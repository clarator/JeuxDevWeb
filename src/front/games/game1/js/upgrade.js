//initialisation des améliorations
const upgrades = [
    { 
        id: 'hammer', 
        costId: 'hammerCost', 
        price: 50, 
        gain: 2,
        active: false
    },
    { 
        id: 'ironPickaxe', 
        costId: 'ironPickaxeCost', 
        price: 100, 
        gain: 5 ,
        active: false
    },
    { 
        id: 'diamondPickaxe', 
        costId: 'diamondPickaxeCost', 
        price: 150, 
        gain: 10 ,
        active: false
    },
    { 
        id: 'dynamite', 
        costId: 'dynamiteCost', 
        price: 200, 
        gain: 20 ,
        active: false
    },
    { 
        id: 'tnt', 
        costId: 'tntCost', 
        price: 500, 
        gain: 50 ,
        active: false
    },
    { 
        id: 'drill', 
        costId: 'drillCost', 
        price: 1000, 
        gain: 50 ,
        active: false
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
            
            upgrade.price = Math.floor(upgrade.price * 2);
            upgrade.active = true;
            
            game.update();
            applyUpgrade(upgrade, game);
            costChoice.textContent = upgrade.price;
        } else {
            alert("Pas assez d'or !");
        }
    });
}

//appliquer l'effet de l'amélioration
function applyUpgrade(upgrade, game) {
    game.scorePerClick += upgrade.gain;
}


//lancer les améliorations
function startUpgrade(game) {
    upgrades.forEach(upgrade => buyUpgrade(upgrade, game));
}

export{ upgrades, startUpgrade };