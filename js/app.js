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

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Create a task
function createTask(task) {

    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    const check = document.createElement("span");
    check.classList.add("task-check");

    const text = document.createElement("span");
    text.textContent = task.name;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.classList.add("delete-task");

    taskElement.appendChild(check);
    taskElement.appendChild(text);
    taskElement.appendChild(deleteButton);

    taskList.appendChild(taskElement);


    // Complete / uncomplete task
    check.addEventListener("click", function () {

        if (taskElement.classList.contains("completed")) {

            check.textContent = "";
            taskElement.classList.remove("completed");

            task.completed = false;

        } else {

            check.textContent = "✓";
            taskElement.classList.add("completed");

            task.completed = true;

        }

        localStorage.setItem("tasks", JSON.stringify(tasks));

    });


    // Show completed status
    if (task.completed) {

        check.textContent = "✓";
        taskElement.classList.add("completed");

    }


    // Delete task
    deleteButton.addEventListener("click", function () {

        taskElement.remove();

        tasks = tasks.filter(function (item) {
            return item !== task;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

    });

}


tasks.forEach(function (task) {
    createTask(task);
});

addTaskButton.addEventListener("click", function () {

    const taskName = prompt("Enter your task:");

    if (taskName) {

        const newTask = {
            name: taskName,
            completed: false
        };

        tasks.push(newTask);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        createTask(newTask);

    }

});