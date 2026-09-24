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
// TASK DATA
// ===============================

const addTaskButton =document.querySelector(".add-task-btn");

const taskList =document.querySelector("#tasks .task-list");

const todayTaskList =document.querySelector(".tasks-card .task-list");

let tasks =JSON.parse(localStorage.getItem("tasks")) || [];


// ===============================
// TASK COUNT
// ===============================

const taskCount = document.querySelector("#task-count");

function updateTaskCount() {

    taskCount.textContent = tasks.length;

}


// ===============================
// GET TODAY'S DATE
// ===============================

function getTodayDate() {

    const today = new Date();

    const year =today.getFullYear();

    const month =String(today.getMonth() + 1).padStart(2, "0");

    const day =String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ===============================
// FORMAT TASK DATE
// ===============================

function formatTaskDate(taskDate) {

    if (!taskDate) return "";

    const today = new Date();

    const date =new Date(taskDate + "T00:00:00");

    const todayString =today.toISOString().split("T")[0];

    const tomorrow =new Date(today);

    tomorrow.setDate(today.getDate() + 1 );

    const tomorrowString =tomorrow.toISOString().split("T")[0];

    if (taskDate === todayString) {
        return "Today";
    }

    if (taskDate === tomorrowString) {
        return "Tomorrow";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}


// ===============================
// CREATE TASK
// ===============================

function createTask(task) {

    const taskElement =document.createElement("div");

    taskElement.classList.add("task");

    if (task.completed) {
        taskElement.classList.add("completed");
    }

    taskElement.innerHTML = `

        <div class="task-check">
            ${task.completed ? "✓" : ""}
        </div>

        <span>${task.name}</span>

        <span class="task-date">
            ${formatTaskDate(task.date)}
        </span>

        <button class="delete-task">
            🗑️
        </button>

    `;


    // ===============================
    // COMPLETE TASK
    // ===============================

    const checkButton =taskElement.querySelector(".task-check");

    checkButton.addEventListener(
        "click",
        function () {

            task.completed =
                !task.completed;

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderTasks();

        }
    );


    // ===============================
    // DELETE TASK
    // ===============================

    const deleteButton =
        taskElement.querySelector(".delete-task");

    deleteButton.addEventListener(
        "click",
        function () {

            tasks =
                tasks.filter(function (item) {

                    return item !== task;

                });


            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            renderTasks();

            // DAY 13
            updateTaskCount();

        }
    );


    return taskElement;

}


// ===============================
// RENDER ALL TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        const taskElement =
            createTask(task);

        taskList.appendChild(
            taskElement
        );

    });

    renderTodayTasks();

}


// ===============================
// TODAY'S TASKS
// ===============================

function renderTodayTasks() {

    todayTaskList.innerHTML = "";

    const today =
        getTodayDate();

    const todayTasks =
        tasks.filter(function (task) {

            return task.date === today;

        });


    todayTasks.forEach(function (task) {

        const taskElement =
            createTask(task);

        todayTaskList.appendChild(
            taskElement
        );

    });

}


// ===============================
// ADD TASK
// ===============================

addTaskButton.addEventListener(
    "click",
    function () {

        const taskName =
            prompt("Enter task name:");

        if (!taskName) {
            return;
        }

        const taskDate =
            prompt("Enter due date (YYYY-MM-DD):");


        const newTask = {

            name: taskName,

            completed: false,

            date:
                taskDate || getTodayDate()

        };


        tasks.push(newTask);


        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );


        renderTasks();
        updateTaskCount();

    }
);


// ===============================
// INITIAL TASK LOAD
// ===============================

renderTasks();

updateTaskCount();


// ===============================
// PROJECT DATA
// ===============================

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectsGrid =document.querySelector(".projects-grid");

const addProjectButton = document.querySelector(".add-project-btn");


// ===============================
// PROJECT COUNT
// ===============================

const projectCount = document.querySelector("#project-count");

function updateProjectCount() {

    projectCount.textContent = projects.length;

}


// ===============================
// CREATE PROJECT CARD
// ===============================

function createProject(project) {

    const projectCard =  document.createElement("div");

    projectCard.classList.add(
        "project-card"
    );


    projectCard.innerHTML = `

        <div class="project-icon">
            💻
        </div>

        <div class="project-info">

            <h3>
                ${project.name}
            </h3>

            <p>
                ${project.description || "New project"}
            </p>

            <div class="tags">

                <span>
                    ${project.technology || "JavaScript"}
                </span>

            </div>

            <div class="project-actions">

                <button class="edit-project">
                    ✏️ Edit
                </button>

                <button class="delete-project">
                    🗑️ Delete
                </button>

            </div>

        </div>

    `;


    projectsGrid.appendChild(projectCard  );


    // ===============================
    // DELETE PROJECT
    // ===============================

    const deleteButton =
        projectCard.querySelector(
            ".delete-project"
        );

    deleteButton.addEventListener(
        "click",
        function () {

            projectCard.remove();

            projects =
                projects.filter(
                    function (item) {

                        return item !== project;

                    }
                );


            localStorage.setItem(
                "projects",
                JSON.stringify(projects)
            );

            updateProjectCount();

        }
    );


    // ===============================
    // EDIT PROJECT
    // ===============================

    const editButton =
        projectCard.querySelector(
            ".edit-project"
        );

    editButton.addEventListener(
        "click",
        function () {

            const newName =
                prompt(
                    "Enter new project name:",
                    project.name
                );


            if (newName) {

                project.name =
                    newName;


                localStorage.setItem(
                    "projects",
                    JSON.stringify(projects)
                );


                projectCard.querySelector(
                    "h3"
                ).textContent =
                    project.name;

            }

        }
    );

}


// ===============================
// LOAD SAVED PROJECTS
// ===============================

projects.forEach(
    function (project) {

        createProject(project);

    }
);


// ===============================
// INITIAL PROJECT COUNT
// ===============================

updateProjectCount();


// ===============================
// ADD PROJECT
// ===============================

addProjectButton.addEventListener(
    "click",
    function () {

        const projectName =
            prompt(
                "Enter project name:"
            );


        if (projectName) {

            const projectDescription =
                prompt(
                    "Enter project description:"
                );


            const projectTechnology =
                prompt(
                    "Enter technology used:"
                );


            const newProject = {

                name: projectName,

                description:
                    projectDescription ||
                    "New project",

                technology:
                    projectTechnology ||
                    "JavaScript"

            };


            projects.push(
                newProject
            );


            localStorage.setItem(
                "projects",
                JSON.stringify(projects)
            );


            createProject(
                newProject
            );

            updateProjectCount();

        }

    }
);