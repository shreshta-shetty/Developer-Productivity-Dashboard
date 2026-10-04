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
// ANALYTICS
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
// WEEKLY ACTIVITY
// ===============================

function updateWeeklyActivity() {

    const activityContainer =
        document.querySelector(".activity-placeholder");

    if (!activityContainer) return;

    const bars = activityContainer.querySelectorAll(".bar");

    const labels =
        activityContainer.querySelectorAll(".activity-day span");

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {

        const date = new Date(today);

        date.setDate(today.getDate() - i);

        const dateString = getDateString(date);

        const index = 6 - i;

        const dayTasks = tasks.filter(function (task) {
            return task.date === dateString;
        });

        const completedTasks = dayTasks.filter(function (task) {
            return task.completed;
        }).length;

        const totalTasks = dayTasks.length;

        const percentage =
            totalTasks === 0
                ? 0
                : (completedTasks / totalTasks) * 100;

        const height = (percentage / 100) * 120;

        const bar = bars[index];

        if (bar) {

            bar.style.height = `${height}px`;

            bar.title =
                `${completedTasks}/${totalTasks} tasks completed (${Math.round(percentage)}%)`;
        }

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

        <button class="edit-task">✏️</button>

        <button class="delete-task">🗑️</button>
    `;

    taskElement.querySelector(".task-name").textContent =
        task.name;


    // ===============================
    // COMPLETE / UNCOMPLETE TASK
    // ===============================

    const checkButton =
        taskElement.querySelector(".task-check");

    checkButton.addEventListener("click", function () {

        task.completed = !task.completed;

        if (task.completed) {

            task.completedDate = getTodayDate();

        } else {

            task.completedDate = null;
        }

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

        renderTasks();

        updateTaskCount();

        updateWeeklyActivity();

        updateAnalytics();

        if (task.completed) {

            showToast("Task completed! 🎉");

        } else {

            showToast("Task marked as pending!");
        }

    });


    // ===============================
    // EDIT TASK
    // ===============================

    const editButton =
        taskElement.querySelector(".edit-task");

    editButton.addEventListener("click", function () {

        const newTaskName =
            prompt(
                "Edit task name:",
                task.name
            );

        if (newTaskName === null) {
            return;
        }

        if (!newTaskName.trim()) {

            showToast("Task name cannot be empty!");

            return;
        }

        const newTaskDate =
            prompt(
                "Edit due date (YYYY-MM-DD):",
                task.date
            );

        if (newTaskDate === null) {
            return;
        }

        task.name = newTaskName.trim();

        task.date =
            newTaskDate || getTodayDate();

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

        renderTasks();

        updateTaskCount();

        updateWeeklyActivity();

        updateAnalytics();

        showToast("Task updated successfully! ✏️");

    });


    // ===============================
    // DELETE TASK
    // ===============================

    const deleteButton =
        taskElement.querySelector(".delete-task");

    deleteButton.addEventListener("click", function () {

        tasks = tasks.filter(function (item) {

            return item !== task;

        });

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

        renderTasks();

        updateTaskCount();

        updateWeeklyActivity();

        updateAnalytics();

        showToast("Task deleted successfully! 🗑️");

    });

    return taskElement;
}


// ===============================
// RENDER ALL TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    const searchInput =
        document.querySelector("#task-search");

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const filterSelect =
        document.querySelector("#task-filter");

    const filter =
        filterSelect
            ? filterSelect.value
            : "all";

    const showCompletedCheckbox =
        document.querySelector("#show-completed-tasks");

    const showCompleted =
        showCompletedCheckbox
            ? showCompletedCheckbox.checked
            : true;

    let visibleTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.name
                .toLowerCase()
                .includes(searchText);

        let matchesFilter = true;

        if (filter === "pending") {
            matchesFilter = !task.completed;
        }

        if (filter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;

    });


    // Hide completed tasks
    if (!showCompleted) {

        visibleTasks =
            visibleTasks.filter(function (task) {

                return !task.completed;

            });

    }


    // ===============================
    // SORT TASKS
    // ===============================

    const sortSelect =
        document.querySelector("#task-sort");

    const sort =
        sortSelect
            ? sortSelect.value
            : "date";


    if (sort === "date") {

        visibleTasks.sort(function (a, b) {

            const dateA =
                a.date || "9999-12-31";

            const dateB =
                b.date || "9999-12-31";

            return dateA.localeCompare(dateB);

        });

    }


    if (sort === "name") {

        visibleTasks.sort(function (a, b) {

            return a.name
                .toLowerCase()
                .localeCompare(
                    b.name.toLowerCase()
                );

        });

    }


    if (sort === "status") {

        visibleTasks.sort(function (a, b) {

            return Number(a.completed) -
                Number(b.completed);

        });

    }


    // ===============================
    // DISPLAY TASKS
    // ===============================

    visibleTasks.forEach(function (task) {

        taskList.appendChild(
            createTask(task)
        );

    });

    renderTodayTasks();
}


// ===============================
// TODAY'S TASKS
// ===============================

function renderTodayTasks() {

    todayTaskList.innerHTML = "";

    const today = getTodayDate();

    const todayTasks =
        tasks.filter(function (task) {

            return task.date === today;

        });

    todayTasks.forEach(function (task) {

        todayTaskList.appendChild(
            createTask(task)
        );

    });
}


// ===============================
// ADD TASK
// ===============================

addTaskButton.addEventListener("click", function () {

    const taskName =
        prompt("Enter task name:");

    if (!taskName || !taskName.trim()) {
        return;
    }

    const taskDate =
        prompt(
            "Enter due date (YYYY-MM-DD):"
        );

    const newTask = {

        name: taskName.trim(),

        completed: false,

        date: taskDate || getTodayDate(),

        completedDate: null

    };

    tasks.push(newTask);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    renderTasks();

    updateTaskCount();

    updateWeeklyActivity();

    updateAnalytics();

    showToast(
        "Task added successfully! ✅"
    );

});


// ===============================
// SEARCH EVENT
// ===============================

const taskSearch =
    document.querySelector("#task-search");

if (taskSearch) {

    taskSearch.addEventListener("input", function () {

        renderTasks();

    });

}


// ===============================
// FILTER EVENT
// ===============================

const taskFilter =
    document.querySelector("#task-filter");

if (taskFilter) {

    taskFilter.addEventListener("change", function () {

        renderTasks();

    });

}


// ===============================
// SORT EVENT
// ===============================

const taskSort =
    document.querySelector("#task-sort");

if (taskSort) {

    taskSort.addEventListener("change", function () {

        renderTasks();

    });

}


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

let projects =
    JSON.parse(
        localStorage.getItem("projects")
    ) || [];


const projectsGrid =
    document.querySelector(".projects-grid");

const addProjectButton =
    document.querySelector(".add-project-btn");


// ===============================
// PROJECT COUNT
// ===============================

const projectCount =
    document.querySelector("#project-count");

function updateProjectCount() {

    projectCount.textContent =
        projects.length;

}


// ===============================
// CREATE PROJECT CARD
// ===============================

function createProject(project) {

    const projectCard =
        document.createElement("div");

    projectCard.classList.add(
        "project-card"
    );

    projectCard.innerHTML = `

        <div class="project-icon">
            💻
        </div>

        <div class="project-info">

            <h3></h3>

            <p></p>

            <div class="tags">
                <span></span>
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

    projectCard.querySelector("h3")
        .textContent = project.name;

    projectCard.querySelector("p")
        .textContent =
        project.description || "New project";

    projectCard.querySelector(".tags span")
        .textContent =
        project.technology || "JavaScript";

    projectsGrid.appendChild(
        projectCard
    );


    // DELETE PROJECT

    const deleteButton =
        projectCard.querySelector(
            ".delete-project"
        );

    deleteButton.addEventListener(
        "click",
        function () {

            projects =
                projects.filter(function (item) {

                    return item !== project;

                });

            localStorage.setItem(
                "projects",
                JSON.stringify(projects)
            );

            projectCard.remove();

            updateProjectCount();

        }
    );


    // EDIT PROJECT

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

            if (
                newName &&
                newName.trim()
            ) {

                project.name =
                    newName.trim();

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

projects.forEach(function (project) {

    createProject(project);

});

updateProjectCount();


// ===============================
// ADD PROJECT
// ===============================

addProjectButton.addEventListener(
    "click",
    function () {

        const projectName =
            prompt("Enter project name:");

        if (
            !projectName ||
            !projectName.trim()
        ) {

            return;

        }

        const projectDescription =
            prompt(
                "Enter project description:"
            );

        const projectTechnology =
            prompt(
                "Enter technology used:"
            );

        const newProject = {

            name: projectName.trim(),

            description:
                projectDescription ||
                "New project",

            technology:
                projectTechnology ||
                "JavaScript"

        };

        projects.push(newProject);

        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );

        createProject(newProject);

        updateProjectCount();

    }
);


// ===============================
// TOAST NOTIFICATIONS
// ===============================

function showToast(message) {

    const container =
        document.querySelector(
            "#toast-container"
        );

    if (!container) {
        return;
    }

    const toast =
        document.createElement("div");

    toast.classList.add("toast");

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(function () {

        toast.remove();

    }, 3000);

}


// ===============================
// SETTINGS
// ===============================

const settingsThemeBtn =
    document.querySelector(
        "#settings-theme-btn"
    );

const mainThemeBtn =
    document.querySelector(
        ".theme-btn"
    );

const showCompletedCheckbox =
    document.querySelector(
        "#show-completed-tasks"
    );

const resetAppButton =
    document.querySelector(
        "#reset-app-btn"
    );


// Load saved preference
const savedShowCompleted =
    localStorage.getItem(
        "showCompletedTasks"
    );

if (showCompletedCheckbox) {

    showCompletedCheckbox.checked =
        savedShowCompleted !== "false";

    showCompletedCheckbox.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "showCompletedTasks",
                showCompletedCheckbox.checked
            );

            renderTasks();

        }
    );
}


// Settings theme button
if (
    settingsThemeBtn &&
    mainThemeBtn
) {

    settingsThemeBtn.addEventListener(
        "click",
        function () {

            mainThemeBtn.click();

        }
    );
}


// ===============================
// RESET APP DATA
// ===============================

if (resetAppButton) {

    resetAppButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to reset all DevTrack data? This will delete all tasks and projects."
                );

            if (!confirmed) {
                return;
            }

            tasks = [];

            projects = [];

            localStorage.removeItem(
                "tasks"
            );

            localStorage.removeItem(
                "projects"
            );

            taskList.innerHTML = "";

            todayTaskList.innerHTML = "";

            projectsGrid.innerHTML = "";

            updateTaskCount();

            updateProjectCount();

            updateWeeklyActivity();

            updateAnalytics();

            showToast(
                "All app data has been reset."
            );

        }
    );
}
// =========================================
// GITHUB CONTRIBUTION CALENDAR
// =========================================

function generateGitHubContributions() {

    const grid =
        document.querySelector("#contribution-grid");

    const monthsContainer =
        document.querySelector("#github-months");

    const yearElement =
        document.querySelector("#github-year");

    const contributionElement =
        document.querySelector("#github-contributions");


    // Stop if GitHub section does not exist
    if (!grid || !monthsContainer) {
        return;
    }


    // =========================================
    // GET SELECTED YEAR
    // =========================================

    const year =
        yearElement
            ? Number(yearElement.value)
            : new Date().getFullYear();


    // =========================================
    // CLEAR OLD CALENDAR
    // =========================================

    grid.innerHTML = "";
    monthsContainer.innerHTML = "";


    // =========================================
    // CONTRIBUTION COUNT
    // =========================================

    let contributionCount = 0;


    // =========================================
    // CREATE CALENDAR DATES
    // =========================================

    const firstDay =
        new Date(year, 0, 1);

    const lastDay =
        new Date(year, 11, 31);


    /*
        GitHub calendars start on Sunday.

        Move backwards from January 1st
        to the Sunday before it.
    */

    const startDate =
        new Date(firstDay);

    startDate.setDate(
        firstDay.getDate() -
        firstDay.getDay()
    );


    /*
        Move forward from December 31st
        to the following Saturday.
    */

    const endDate =
        new Date(lastDay);

    endDate.setDate(
        lastDay.getDate() +
        (6 - lastDay.getDay())
    );


    // =========================================
    // TOTAL NUMBER OF WEEKS
    // =========================================

    const totalDays =
        Math.round(
            (endDate - startDate) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    const totalWeeks =
        Math.ceil(totalDays / 7);


    // =========================================
    // SET GRID COLUMNS
    // =========================================

    grid.style.gridTemplateColumns =
        `repeat(${totalWeeks}, 18px)`;


    // =========================================
    // GENERATE CONTRIBUTION CELLS
    // =========================================

    const currentDate =
        new Date(startDate);


    for (
        let week = 0;
        week < totalWeeks;
        week++
    ) {

        for (
            let day = 0;
            day < 7;
            day++
        ) {

            // -----------------------------------------
            // CREATE CELL
            // -----------------------------------------

            const cell =
                document.createElement("span");


            // -----------------------------------------
            // DATE
            // -----------------------------------------

            const date =
                new Date(currentDate);


            const dateString =
                getDateString(date);


            cell.dataset.date =
                dateString;


            // -----------------------------------------
            // BASE CELL CLASS
            // -----------------------------------------

            cell.classList.add(
                "contribution-cell"
            );


            // -----------------------------------------
            // DEFAULT LEVEL
            // -----------------------------------------

            let level = 0;


            // =========================================
            // GENERATE ACTIVITY
            // =========================================

            if (
                date.getFullYear() === year
            ) {

                /*
                    Temporary activity generator.

                    This gives the calendar
                    realistic-looking activity.

                    Later we can replace this
                    with real GitHub API data.
                */

                const seed =
                    date.getDate() *
                    (date.getMonth() + 1) *
                    (date.getDay() + 2);


                if (seed % 17 === 0) {

                    level = 3;

                } else if (seed % 11 === 0) {

                    level = 2;

                } else if (seed % 5 === 0) {

                    level = 1;

                }

            }


            // =========================================
            // APPLY CONTRIBUTION LEVEL
            // =========================================

            if (level === 1) {

                cell.classList.add(
                    "level-1"
                );

            }

            if (level === 2) {

                cell.classList.add(
                    "level-2"
                );

            }

            if (level === 3) {

                cell.classList.add(
                    "level-3"
                );

            }


            // =========================================
            // UPDATE CONTRIBUTION COUNT
            // =========================================

            if (level > 0) {

                contributionCount++;

            }


            // =========================================
            // DAY 24 TOOLTIP
            // =========================================

            const contributionText = {

                0: "No contributions",
                1: "Low activity",
                2: "Medium activity",
                3: "High activity"

            };


            /*
                Temporary contribution amount.

                Level 1 = 3
                Level 2 = 6
                Level 3 = 9
            */

            const contributionAmount =
                level * 3;


            cell.title =
                `${contributionAmount} contributions · ` +
                `${contributionText[level]}`;


            // =========================================
            // ADD CELL TO GRID
            // =========================================

            grid.appendChild(cell);


            // =========================================
            // MOVE TO NEXT DAY
            // =========================================

            currentDate.setDate(
                currentDate.getDate() + 1
            );

        }

    }


    // =========================================
    // MONTH NAMES
    // =========================================

    const monthNames = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    // =========================================
    // FIND MONTH POSITIONS
    // =========================================

    const monthPositions = {};


    const calendarDate =
        new Date(startDate);


    for (
        let week = 0;
        week < totalWeeks;
        week++
    ) {

        for (
            let day = 0;
            day < 7;
            day++
        ) {

            const date =
                new Date(calendarDate);


            if (
                date.getFullYear() === year &&
                date.getDate() === 1
            ) {

                monthPositions[
                    date.getMonth()
                ] = week + 1;

            }


            calendarDate.setDate(
                calendarDate.getDate() + 1
            );

        }

    }


    // =========================================
    // CREATE MONTH LABELS
    // =========================================

    Object.keys(monthPositions).forEach(
        function (monthIndex) {

            const label =
                document.createElement("span");


            label.textContent =
                monthNames[monthIndex];


            label.style.gridColumn =
                monthPositions[monthIndex];


            monthsContainer.appendChild(
                label
            );

        }
    );


    // =========================================
    // UPDATE CONTRIBUTION NUMBER
    // =========================================

    if (contributionElement) {

        contributionElement.textContent =
            contributionCount;

    }

}


// =========================================
// GITHUB YEAR SELECTOR
// =========================================

const githubYear =
    document.querySelector("#github-year");


if (githubYear) {

    githubYear.addEventListener(
        "change",
        function () {

            generateGitHubContributions();

        }
    );

}


// =========================================
// INITIALIZE GITHUB CALENDAR
// =========================================

generateGitHubContributions();