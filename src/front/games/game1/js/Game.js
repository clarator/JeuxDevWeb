import { upgrades, startUpgrade } from "./upgrade.js";
import { checkNotifications } from "./notification.js";
import { automations, startAutomation } from "./automation.js";
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

    Potion d'endurance (Double les gains pendant 30 secondes)
    Boost de minage (Accélère la production automatique pendant 1 minute)
    Tempête de dynamite (Explosion qui génère instantanément X or)
*/

export default class Game {
    constructor(){
        this.score = 0;
        this.scorePerClick = 1;
        this.clickCount = 0;
        this.gold = 0;
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

        if (this.clickCount == 10) {
            this.vibrationIntensity += 0.25;
            this.clickCount = 0;
        }
     
        this.addGoldWallet();
    }

    update() {
        if (this.goldDisplay) {
            this.goldDisplay.textContent = this.gold;
        
        }
    }

    //gere le porte feuille
    addGoldWallet(){
        let result = 0;
    
        //on ajoute 5 tout les 5 clics
        if(this.score % 5 === 0){
            result += 5;
            this.addSound();
        }
        
        //si une amelioration achetée 
        //ajoute le gain au porte feuille
        upgrades.forEach(upgrade => {
            if (upgrade.active) {
                result += upgrade.gain / 2;   
                this.addSound();            
            }
        });

        this.gold += result; 
        this.goldDisplay.textContent = this.gold;
        
        //bonus
        let bonus = applyBonus(this.score);
        if(bonus > 0){
            this.gold += bonus;
        }
 
        this.update();
    }

    addSound(){
        let sound = new Audio("./assets/sound/game1/piecesPorteFeuille.mp3");
        sound.play();
    }

    mineClick(){
        this.clickCount++;
        this.score += this.scorePerClick;
        this.scoreDisplay.textContent = this.score;
    
        // Vérifie si le score atteint un certain nombre pour l'explosion
        if (this.score >= 10) {
            this.triggerExplosion();
        }
    
    
    
        if (this.clickCount == 10) {
            this.vibrationIntensity += 0.25;
            this.clickCount = 0;
        }
     
        this.addGoldWallet();
    }
    
    triggerExplosion() {
        // Crée des mini images qui sortent de l'image principale
        for (let i = 0; i < 20; i++) {
            const miniGold = document.createElement("div");
            miniGold.classList.add("miniGold");
            miniGold.style.backgroundImage = "url('assets/img/game1/or.png')"; // même image que le principal
            miniGold.style.left = `${this.buttonGold.offsetLeft + Math.random() * 100 - 50}px`; // Position aléatoire
            miniGold.style.top = `${this.buttonGold.offsetTop + Math.random() * 100 - 50}px`; // Position aléatoire
            document.body.appendChild(miniGold);
    
            // Supprimer l'image après l'animation
            setTimeout(() => {
                miniGold.remove();
            }, 1000);
        }
    }
    
}
