import {startUpgrade } from "./upgrade.js";
import { checkNotifications } from "./notification.js";
import {startAutomation } from "./automation.js";

export let gameInstance = null;
/*
chose à ajouter :
- sons 
- image d'une pepite et d'une pelle
- fracment de pepite qui part
- animation de la pelle
- animation de la pepite
- augmentation des prix
- differencier le score et les sous gagné
- mettre des trucs genre si tu 
- score 
*/
export default class Game {
    constructor(){
        this.gold = 0;
        this.goldPerClick = 1;

        this.score = document.getElementById('gold');
        this.mine = document.getElementById('mine');

        if (!this.score) {
            console.error("Erreur : élément #gold introuvable");
        }

        if (this.mine) {
            this.mine.addEventListener("click", () => {
                this.gold += this.goldPerClick;
                this.update();
            });
        } else {
            console.error("Erreur : élément #mine introuvable");
        }

        gameInstance = this;  
        
        this.update();
        startUpgrade(this);
        startAutomation(this);
        checkNotifications();
    }

    update() {
        if (this.score) {
            this.score.textContent = this.gold;
        }
    }

    getGold(){
        return this.gold;
    }
}
