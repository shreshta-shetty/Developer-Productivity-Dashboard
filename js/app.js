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


// Convert date into Today / Tomorrow / actual date
function formatTaskDate(taskDate) {

    if (!taskDate) {
        return "";
    }

    const today = new Date();
    const date = new Date(taskDate + "T00:00:00");

    const todayString = today.toISOString().split("T")[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowString = tomorrow.toISOString().split("T")[0];

    if (taskDate === todayString) {
        return "Today";
    }

    if (taskDate === tomorrowString) {
        return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}


// Create a task
function createTask(task) {

    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    const check = document.createElement("span");
    check.classList.add("task-check");

    const text = document.createElement("span");
    text.textContent = task.name;

    const date = document.createElement("span");
    date.classList.add("task-date");
    date.textContent = formatTaskDate(task.date);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.classList.add("delete-task");

    taskElement.appendChild(check);
    taskElement.appendChild(text);
    taskElement.appendChild(date);
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


// Load saved tasks
tasks.forEach(function (task) {
    createTask(task);
});


// Add new task
addTaskButton.addEventListener("click", function () {

    const taskName = prompt("Enter your task:");

    if (taskName) {

        const taskDate = prompt("Enter due date (YYYY-MM-DD):");

        const newTask = {
            name: taskName,
            completed: false,
            date: taskDate
        };

        tasks.push(newTask);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        createTask(newTask);
    }
});