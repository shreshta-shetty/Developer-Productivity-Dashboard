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
    const task = document.createElement("p");
    task.textContent = taskName;

    taskList.appendChild(task);

    console.log("Task added:", task);
    console.log("Task list:", taskList);
}
});
console.log("Task JavaScript is running");