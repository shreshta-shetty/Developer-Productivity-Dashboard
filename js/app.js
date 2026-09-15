const themeButton = document.querySelector(".theme-btn");

themeButton.addEventListener("click", function () {

    if (themeButton.textContent === "☾") {
        themeButton.textContent = "☀";
    } else {
        themeButton.textContent = "☾";
    }

});