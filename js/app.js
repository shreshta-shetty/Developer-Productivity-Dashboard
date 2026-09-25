
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

const addTaskButton = document.querySelector(".add-task-btn");
const taskList = document.querySelector("#tasks .task-list");
const todayTaskList = document.querySelector(".tasks-card .task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ===============================
// TASK COUNT
// ===============================

const taskCount = document.querySelector("#task-count");

function updateTaskCount() {
    taskCount.textContent = tasks.length;
}


// ===============================
// DATE HELPERS
// ===============================

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatTaskDate(taskDate) {
    if (!taskDate) return "";

    const todayString = getTodayDate();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowString = getDateString(tomorrow);

    const date = new Date(taskDate + "T00:00:00");

    if (taskDate === todayString) return "Today";
    if (taskDate === tomorrowString) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}


// ===============================
// DAY 14 - WEEKLY ACTIVITY
// ===============================

function updateWeeklyActivity() {
    const activityContainer = document.querySelector(".activity-placeholder");

    if (!activityContainer) return;

    const bars = activityContainer.querySelectorAll(".bar");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activity = [];

    // Get task completion counts for the last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = getDateString(date);

        const count = tasks.filter(function (task) {
            return task.completedDate === dateString;
        }).length;

        activity.push({
            date: dateString,
            count: count,
            label: date.toLocaleDateString("en-US", {
                weekday: "short"
            })
        });
    }

    const maxCount = Math.max(
        ...activity.map(function (day) {
            return day.count;
        }),
        1
    );

    bars.forEach(function (bar, index) {
        const day = activity[index];

        if (!day) return;

        // Scale bar heights between 10px and 120px
        const height = day.count === 0
            ? 10
            : Math.max(10, (day.count / maxCount) * 120);

        bar.style.height = `${height}px`;
        bar.title = `${day.label}: ${day.count} completed task(s)`;
    });
}


// ===============================
// CREATE TASK
// ===============================

function createTask(task) {
    const taskElement = document.createElement("div");

    taskElement.classList.add("task");

    if (task.completed) {
        taskElement.classList.add("completed");
    }

    taskElement.innerHTML = `
        <div class="task-check">
            ${task.completed ? "✓" : ""}
        </div>

        <span></span>

        <span class="task-date">
            ${formatTaskDate(task.date)}
        </span>

        <button class="delete-task">🗑️</button>
    `;

    taskElement.querySelector("span").textContent = task.name;

    // ===============================
    // COMPLETE TASK
    // ===============================

    const checkButton = taskElement.querySelector(".task-check");

    checkButton.addEventListener("click", function () {
        task.completed = !task.completed;

        if (task.completed) {
            task.completedDate = getTodayDate();
        } else {
            task.completedDate = null;
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();
        updateTaskCount();
        updateWeeklyActivity();
    });

    // ===============================
    // DELETE TASK
    // ===============================

    const deleteButton = taskElement.querySelector(".delete-task");

    deleteButton.addEventListener("click", function () {
        tasks = tasks.filter(function (item) {
            return item !== task;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();
        updateTaskCount();
        updateWeeklyActivity();
    });

    return taskElement;
}


// ===============================
// RENDER ALL TASKS
// ===============================

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        taskList.appendChild(createTask(task));
    });

    renderTodayTasks();
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
        todayTaskList.appendChild(createTask(task));
    });
}


// ===============================
// ADD TASK
// ===============================

addTaskButton.addEventListener("click", function () {
    const taskName = prompt("Enter task name:");

    if (!taskName || !taskName.trim()) return;

    const taskDate = prompt("Enter due date (YYYY-MM-DD):");

    const newTask = {
        name: taskName.trim(),
        completed: false,
        date: taskDate || getTodayDate(),
        completedDate: null
    };

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    updateTaskCount();
    updateWeeklyActivity();
});


// ===============================
// INITIAL TASK LOAD
// ===============================

renderTasks();
updateTaskCount();
updateWeeklyActivity();


// ===============================
// PROJECT DATA
// ===============================

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const projectsGrid = document.querySelector(".projects-grid");
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
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    projectCard.innerHTML = `
        <div class="project-icon">💻</div>

        <div class="project-info">
            <h3></h3>
            <p></p>

            <div class="tags">
                <span></span>
            </div>

            <div class="project-actions">
                <button class="edit-project">✏️ Edit</button>
                <button class="delete-project">🗑️ Delete</button>
            </div>
        </div>
    `;

    projectCard.querySelector("h3").textContent = project.name;
    projectCard.querySelector("p").textContent =
        project.description || "New project";

    projectCard.querySelector(".tags span").textContent =
        project.technology || "JavaScript";

    projectsGrid.appendChild(projectCard);


    // ===============================
    // DELETE PROJECT
    // ===============================

    const deleteButton = projectCard.querySelector(".delete-project");

    deleteButton.addEventListener("click", function () {
        projects = projects.filter(function (item) {
            return item !== project;
        });

        localStorage.setItem("projects", JSON.stringify(projects));

        projectCard.remove();
        updateProjectCount();
    });


    // ===============================
    // EDIT PROJECT
    // ===============================

    const editButton = projectCard.querySelector(".edit-project");

    editButton.addEventListener("click", function () {
        const newName = prompt("Enter new project name:", project.name);

        if (newName && newName.trim()) {
            project.name = newName.trim();

            localStorage.setItem("projects", JSON.stringify(projects));

            projectCard.querySelector("h3").textContent = project.name;
        }
    });
}


// ===============================
// LOAD SAVED PROJECTS
// ===============================

projects.forEach(function (project) {
    createProject(project);
});

updateProjectCount();


// ===============================
// ADD PROJECT
// ===============================

addProjectButton.addEventListener("click", function () {
    const projectName = prompt("Enter project name:");

    if (!projectName || !projectName.trim()) return;

    const projectDescription = prompt("Enter project description:");
    const projectTechnology = prompt("Enter technology used:");

    const newProject = {
        name: projectName.trim(),
        description: projectDescription || "New project",
        technology: projectTechnology || "JavaScript"
    };

    projects.push(newProject);

    localStorage.setItem("projects", JSON.stringify(projects));

    createProject(newProject);
    updateProjectCount();
});