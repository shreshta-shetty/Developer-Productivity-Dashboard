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

const todayTaskList = document.querySelector(".tasks-card .task-list");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Get today's date
function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Format task date
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


// Create task in main Tasks section
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


    // Complete / uncomplete
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


        // Update Today's Tasks
        renderTodayTasks();

    });


    // Show completed task
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


        // Update Today's Tasks
        renderTodayTasks();

    });

}


// Show only today's tasks on dashboard
function renderTodayTasks() {

    todayTaskList.innerHTML = "";


    const today = getTodayDate();


    const todayTasks = tasks.filter(function (task) {

        return task.date === today;

    });


    todayTasks.forEach(function (task) {

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");


        const check = document.createElement("span");

        check.classList.add("task-check");


        const text = document.createElement("span");

        text.textContent = task.name;


        taskElement.appendChild(check);

        taskElement.appendChild(text);


        todayTaskList.appendChild(taskElement);


        // Show completed status
        if (task.completed) {

            check.textContent = "✓";

            taskElement.classList.add("completed");

        }


        // Complete / uncomplete today's task
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


            // Refresh main task list
            taskList.innerHTML = "";

            tasks.forEach(function (task) {

                createTask(task);

            });

        });

    });

}


// Load saved tasks
tasks.forEach(function (task) {

    createTask(task);

});


// Load today's tasks
renderTodayTasks();


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


        // Update Today's Tasks
        renderTodayTasks();

    }

});