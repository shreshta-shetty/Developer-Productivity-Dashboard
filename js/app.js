
// ===============================
// DARK MODE
// ===============================

const themeButton = document.querySelector(".theme-btn");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "☀";
} else {
    themeButton.textContent = "☾";
}

// Toggle theme
themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "☀";
        localStorage.setItem("theme", "dark");
    } else {
        themeButton.textContent = "☾";
        localStorage.setItem("theme", "light");
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
// DAY 15 - ANALYTICS
// ===============================

function updateAnalytics() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.querySelector("#analytics-total").textContent = total;
    document.querySelector("#analytics-completed").textContent = completed;
    document.querySelector("#analytics-pending").textContent = pending;
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
    const activityContainer =
        document.querySelector(".activity-placeholder");

    if (!activityContainer) return;

    const bars = activityContainer.querySelectorAll(".bar");
    const labels = activityContainer.querySelectorAll(".activity-day span");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Display the last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = getDateString(date);
        const index = 6 - i;

        // All tasks due on this date
        const dayTasks = tasks.filter(function (task) {
            return task.date === dateString;
        });

        // Tasks completed out of the total
        const completedTasks = dayTasks.filter(function (task) {
            return task.completed;
        }).length;

        const totalTasks = dayTasks.length;

        // Calculate completion percentage
        const percentage = totalTasks === 0
            ? 0
            : (completedTasks / totalTasks) * 100;

        // Convert percentage into bar height
        const height = (percentage / 100) * 120;

        const bar = bars[index];

        if (bar) {
            bar.style.height = `${height}px`;

            bar.title =
                `${completedTasks}/${totalTasks} tasks completed (${Math.round(percentage)}%)`;
        }

        // Update weekday labels automatically
        if (labels[index]) {
            labels[index].textContent =
                date.toLocaleDateString("en-US", {
                    weekday: "short"
                });
        }
    }
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

        <span class="task-name"></span>

        <span class="task-date">
            ${formatTaskDate(task.date)}
        </span>

        <button class="delete-task">🗑️</button>
    `;

    taskElement.querySelector(".task-name").textContent = task.name;

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
        updateAnalytics();
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
        updateAnalytics();
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
    updateAnalytics();
});


// ===============================
// INITIAL TASK LOAD
// ===============================

renderTasks();
updateTaskCount();
updateWeeklyActivity();
updateAnalytics();


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