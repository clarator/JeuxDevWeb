fetch('/site/html/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById("headerContainer").innerHTML = data;
            const script = document.createElement("script");
            script.src = "/site/js/header.js";
            document.body.appendChild(script);
});
