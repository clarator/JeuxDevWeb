import { upgrades, startUpgrade } from "./upgrade.js";
import { checkNotifications } from "./notification.js";
import { startAutomation } from "./automation.js";
import { vibrateGold,explodeGoldPicture } from "./animation.js";
import { setupHeader } from "./header.js";
import { saveScore } from "../../common/scoreManager.js";
import { getCookie } from "./cookies.js";

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
        window.gameInstance = this;

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

        //menu
        document.addEventListener("DOMContentLoaded", () => {
            setupHeader();
        });

        // Enregistre le score quand la page est quittée
        window.addEventListener("beforeunload", () => {
            this.saveScoreFinal();
        });

        //magasin
        startUpgrade(this);
        startAutomation(this);

        //notification
        setInterval(() => checkNotifications(this), 1000);
    }

    //gere le clic sur la pépite d'or
    mineClick(){
        this.clickCount++;
        this.score += this.scorePerClick;
        this.scoreDisplay.textContent = this.score;

        //son
        if (window.soundEnabled) {
            let pioche = new Audio("/assets/sound/game1/bruitPioche.mp3");
            pioche.volume = 0.3;
            pioche.play();
        }
      
        //vibration
        vibrateGold(this.vibrationIntensity, this.buttonGold);

    
        if (this.clickCount == 10) {
            this.vibrationIntensity += 0.25;
            this.clickCount = 0;
        }
     
        //explosion
        const goldPicture = document.getElementById("goldPicture");
        const explosionContainer = document.querySelector(".explosion");

        //crée une explosion de pépite d'or
        if (this.score >= 10) {
            explodeGoldPicture(goldPicture, explosionContainer);
            
            if (window.soundEnabled) {
                let explo = new Audio("/assets/sound/game1/explosion-VEED.mp3");
                explo.volume = 0.5;
                explo.play();
            }
        }
        
        this.addGoldWallet();
    }

    //gere l'affichage du porte feuille
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
     
        this.update();
    }

    //gere le bruit de l'ajout de piece dans le porte feuille
    addSound(){
        if (window.soundEnabled) {
            let sound = new Audio("/assets/sound/game1/piecesPorteFeuille.mp3");
            sound.volume = 0.2;
            sound.play();
        }
    }

    //gere l'explosion de la pépite d'or
    triggerExplosion() {
        //crée des mini images qui sortent de l'image principale
        for (let i = 0; i < 20; i++) {
            const miniGold = document.createElement("div");
            miniGold.classList.add("miniGold");
            miniGold.style.backgroundImage = "url('assets/img/game1/or.png')"; 
            miniGold.style.left = `${this.buttonGold.offsetLeft + Math.random() * 100 - 50}px`;
            miniGold.style.top = `${this.buttonGold.offsetTop + Math.random() * 100 - 50}px`; 
            document.body.appendChild(miniGold);
    
            //supprimer l'image après l'animation
            setTimeout(() => {
                miniGold.remove();
            }, 1000);
        }
    }

    //gère la sauvegarde du score
    saveScoreFinal() {
        const user = getCookie("user");
    
        if (this.score > 0) {
            if (user) {
                saveScore(user, this.score);
            } else {
                console.warn("Aucun utilisateur connecté pour sauvegarder le score");
            }
        } else {
            console.log("Score nul, aucune sauvegarde effectuée.");
        }
    }
}