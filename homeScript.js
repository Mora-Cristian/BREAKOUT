const form = document.getElementById("gameForm");
const nickname = document.getElementById("nickname");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = nickname.value.trim();

    if (nome === "") {
        errorMessage.style.display = "block";
        nickname.focus();
    } else {
        errorMessage.style.display = "none";

        // Salva il nickname
        localStorage.setItem("nickname", nome);

        // Vai alla seconda pagina
        window.location.href = "index.html";
    }
});

nickname.addEventListener("input", function() {
    if (nickname.value.trim() !== "") {
        errorMessage.style.display = "none";
    }
});