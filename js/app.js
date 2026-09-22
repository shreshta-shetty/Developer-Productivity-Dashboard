// ===============================
// THEME BUTTON
// ===============================

const themeButton = document.querySelector(".theme-btn");

themeButton.addEventListener("click", function () {

    if (themeButton.textContent === "☾") {
        themeButton.textContent = "☀";
    } else {
        themeButton.textContent = "☾";
    }

});


// ===============================
// TASK ELEMENTS
// ===============================

const addTaskButton = document.querySelector(".add-task-btn");

const taskList = document.querySelector("#tasks .task-list");

const todayTaskList = document.querySelector(".tasks-card .task-list");


// ===============================
// PROJECT ELEMENT
// ===============================

const addProjectButton = document.querySelector(".add-project-btn");


// ===============================
// TASK DATA
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ===============================
// GET TODAY'S DATE
// ===============================

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ===============================
// FORMAT TASK DATE
// ===============================

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


// ===============================
// CREATE TASK
// ===============================

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


        renderTodayTasks();

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


        renderTodayTasks();

    });

}


// ===============================
// TODAY'S TASKS
// ===============================

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


            // Refresh main task list
            taskList.innerHTML = "";


            tasks.forEach(function (task) {

                createTask(task);

            });

        });

    });

}


// ===============================
// LOAD SAVED TASKS
// ===============================

tasks.forEach(function (task) {

    createTask(task);

});


renderTodayTasks();


// ===============================
// ADD TASK
// ===============================

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


        renderTodayTasks();

    }

});

// ===============================
// PROJECT DATA
// ===============================

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectsGrid = document.querySelector(".projects-grid");


// ===============================
// CREATE PROJECT CARD
// ===============================

function createProject(project) {

    const projectCard = document.createElement("div");

    projectCard.classList.add("project-card");

    projectCard.innerHTML = `
        <div class="project-icon">💻</div>

        <div class="project-info">

            <h3>${project.name}</h3>

            <p>${project.description}</p>

            <div class="tags">
                <span>${project.technology}</span>
            </div>

        </div>
    `;

    projectsGrid.appendChild(projectCard);
}


// ===============================
// LOAD SAVED PROJECTS
// ===============================

projects.forEach(function (project) {

    createProject(project);

});


// ===============================
// ADD PROJECT
// ===============================

addProjectButton.addEventListener("click", function () {

    const projectName = prompt("Enter project name:");

    if (projectName) {

        const projectDescription = prompt("Enter project description:");

        const projectTechnology = prompt("Enter technology used:");

        const newProject = {

            name: projectName,

            description: projectDescription || "New project",

            technology: projectTechnology || "JavaScript"

        };


        projects.push(newProject);


        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );


        createProject(newProject);

    }

});
function createProject(project) {

    const projectCard = document.createElement("div");

    projectCard.classList.add("project-card");

    projectCard.innerHTML = `
        <div class="project-icon">💻</div>

        <div class="project-info">

            <h3>${project.name}</h3>

            <p>${project.description}</p>

            <div class="tags">
                <span>${project.technology}</span>
            </div>

            <button class="delete-project">🗑️ Delete</button>

        </div>
    `;

    projectsGrid.appendChild(projectCard);


    // Delete project
    const deleteButton = projectCard.querySelector(".delete-project");

    deleteButton.addEventListener("click", function () {

        projectCard.remove();

        projects = projects.filter(function (item) {
            return item !== project;
        });

        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );

    });

}