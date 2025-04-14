// pour le choix de connexion ou inscription
const choice = document.querySelectorAll(".loginChoice");

choice.forEach((choix) => {
    choix.addEventListener("click", function() {
        choice.forEach(el => el.classList.remove("active"));
        this.classList.add("active");
    });
});



// pour faire afficher le formulaire de connexion ou d'inscription
function displayChoice() { 
    const loginChoice = document.querySelector(".loginChoice");
    const registerChoice = document.querySelector(".registerChoice");
    const login = document.querySelector(".login");
    const register = document.querySelector(".register");

    // Afficher Connexion par défaut
    login.style.display = "flex";
    register.style.display = "none";

    loginChoice.addEventListener("click", function () {
        registerChoice.style.borderBottom = "none ";
        loginChoice.style.borderBottom = "4px solid white";
        login.style.display = "flex";
        register.style.display = "none";
    });

    registerChoice.addEventListener("click", function () {
        registerChoice.style.borderBottom = "4px solid white";
        loginChoice.style.borderBottom = "none";
        register.style.display = "flex";
        login.style.display = "none";

    });
}

//s'inscrire
function handleRegistration() {
    const formRegistration = document.querySelector(".formRegistration");
    const login = document.querySelector(".login");
    const register = document.querySelector(".register");

    if(formRegistration){
        formRegistration.addEventListener("submit", function(e){
            e.preventDefault(); 

            const pseudo = e.target.querySelector(".pseudoRegister").value;
            const password = e.target.querySelector(".passwordRegister").value;
            const password2 = e.target.querySelector(".password2").value;

            
            if(pseudo === "" || password === "" || password2 === ""){
                alert("Veuillez remplir tous les champs");
                return;
            } 

            if(password !== password2){
                alert("Les mots de passe ne correspondent pas");
                return;
            }

            //envoie requête POST pour l'inscription
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pseudo, password, password2 })
            })
            .then(response => response.text()) 
            .then(data => {
                if (data === "Inscription réussie") {
                    formRegistration.reset();
                    login.style.display = "flex";
                    register.style.display = "none";

                    const loginChoice = document.querySelector(".loginChoice");
                    const registerChoice = document.querySelector(".registerChoice");
                    registerChoice.style.borderBottom = "none";
                    loginChoice.style.borderBottom = "4px solid white";
                
                } else {
                    alert(data); 
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'inscription", error);
                alert("Une erreur s'est produite.");
            });
        });
    }
}

//se connecter 
function handleLogin() {
    const formLogin = document.querySelector(".formLogin");

    if(formLogin){
        formLogin.addEventListener("submit", function(e){
            e.preventDefault(); 

            const pseudo = e.target.querySelector(".pseudoLogin").value;
            const password = e.target.querySelector(".passwordLogin").value;

            if (pseudo === "" || password === "") {
                alert("Veuillez remplir tous les champs");
                return;
            }

            //envoie requête POST pour connexion
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pseudo, password })
            })
            .then(response => response.text()) 
            .then(data => {
                console.log("reponse : ",data);
                if (data === "Connexion réussie") {
                    window.location.href = "/site"; 
                } else {
                    alert(data); 
                }
            })
            .catch(error => {
                login.reset();
                console.error("Erreur lors de la connexion", error);
                alert("Une erreur s'est produite.");
            });
        });
        
    }
    
}

function login() {
    const boutonConnexion = document.querySelector(".btConnexion");
    boutonConnexion.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}

function home() {
    const boutonConnexion = document.querySelector(".accueil");
    boutonConnexion.addEventListener("click", function () {
        window.location.href = "/src/front/index.html";
    });
}

displayChoice();
handleRegistration();
handleLogin();
