const themeButton = document.querySelector(".theme-btn");

themeButton.addEventListener("click", function () {

    if (themeButton.textContent === "☾") {
        themeButton.textContent = "☀";
    } else {
        themeButton.textContent = "☾";
    }

});
const addTaskButton = document.querySelector(".add-task-btn");
const taskList = document.querySelector("#tasks .task-list");

addTaskButton.addEventListener("click", function () {
    const taskName = prompt("Enter your task:");

    if (taskName) {

        const task = document.createElement("div");
        task.classList.add("task");

        const check = document.createElement("span");
        check.classList.add("task-check");

        const text = document.createElement("span");
        text.textContent = taskName;

        task.appendChild(check);
        task.appendChild(text);

        taskList.appendChild(task);
        check.addEventListener("click", function () {
    if (task.classList.contains("completed")) {
        check.textContent = "";
        task.classList.remove("completed");
    } else {
        check.textContent = "✓";
        task.classList.add("completed");
    }
});
    }
});

console.log("Task JavaScript is running");