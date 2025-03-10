import { startUpgrade } from "./upgrade.js";
import { checkNotifications } from "./notification.js";
import { startAutomation } from "./automation.js";
import { vibrateGold } from "./animation.js";
import { applyBonus } from "./bonus.js";
/*
chose à ajouter :
- trouver une musique de fond
- faire fonctionner automation
- essayer de rajouter des mini pepites d'or qui apparaissent
- rajouter des bonus
- rajouter des animations
- rajouter des sons genre quand on clique sur une ame ou une auto
- ajouter des trucs dans le magasin
Boosts temporaires

    Potion d’endurance (Double les gains pendant 30 secondes)
    Boost de minage (Accélère la production automatique pendant 1 minute)
    Tempête de dynamite (Explosion qui génère instantanément X or)
*/

export default class Game {
    constructor(){
        this.score = 0;
        this.scorePerClick = 1;
        this.clickCount = 0;
        this.gold = 500;
        this.vibrationIntensity = 0.25;

        this.scoreDisplay = document.getElementById('score');
        this.goldDisplay = document.getElementById('gold');
        this.buttonGold = document.getElementById('goldPicture');

        if (!this.goldDisplay || !this.scoreDisplay) {
            console.error("Erreur : élément #score ou #gold introuvable");
        }

        if (this.buttonGold) {
            this.buttonGold.addEventListener("click", () => {
                this.mineClick();
            });
        } else {
            console.error("Erreur : élément #buttonGold introuvable");
        }

        this.update();

        //magasin
        startUpgrade(this);
        startAutomation(this);

        //notification
        setInterval(() => checkNotifications(this), 1000);
    }

    mineClick(){
        this.clickCount++;
        this.score += this.scorePerClick;
        this.scoreDisplay.textContent = this.score;
          
        //vibration
        vibrateGold(this.vibrationIntensity, this.buttonGold);

        //effet sonore
        if (this.clickCount == 10) {
            this.vibrationIntensity += 0.25;
            this.clickCount = 0;
        }
         
        //porte monnaie
        if (this.score % 10 === 0) { 
            let sound = new Audio("./assets/sound/game1/piecesPorteFeuille.mp3");
            sound.play();
            this.gold += 5;
            this.goldDisplay.textContent = this.gold;
        }
    
          
        //bonus
        let bonus = applyBonus(this.score);
        if(bonus > 0){
            this.gold += bonus;
            this.goldDisplay.textContent = this.gold;
        }
    }

    update() {
        if (this.goldDisplay) {
            this.goldDisplay.textContent = this.gold;
        }
    }

    getGold(){
        return this.gold;
    }

    //gere le porte feuille
    addGoldWallet(){
        this.gold += 5;
        this.goldDisplay.textContent = this.gold;

        //recup le gain dans upgrapes et suivant le gain ajoute l'argent
    }
}
