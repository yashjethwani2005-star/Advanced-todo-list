// ============================================
// DOM ELEMENTS
// ============================================

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const dateInput =
    document.getElementById("dateInput");

const addBtn =
    document.getElementById("addBtn");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const themeBtn =
    document.getElementById("themeBtn");

const clearCompleted =
    document.getElementById("clearCompleted");

const clearAll =
    document.getElementById("clearAll");


// ============================================
// STAT ELEMENTS
// ============================================

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const highTasks =
    document.getElementById("highTasks");

const taskCounter =
    document.getElementById("taskCounter");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");


// ============================================
// APPLICATION STATE
// ============================================

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


let currentFilter = "all";


// ============================================
// SAVE STATE
// ============================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ============================================
// CREATE TASK
// ============================================

function addTask() {

    const title =
        taskInput.value.trim();


    if (!title) {

        alert("Please enter a task.");

        taskInput.focus();

        return;

    }


    const task = {

        id: crypto.randomUUID(),

        title: title,

        priority: priorityInput.value,

        dueDate: dateInput.value,

        completed: false,

        createdAt: Date.now()

    };


    tasks.unshift(task);


    saveTasks();

    render();


    // Reset inputs

    taskInput.value = "";

    priorityInput.value = "medium";

    dateInput.value = "";

    taskInput.focus();

}


// ============================================
// DELETE TASK
// ============================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    render();

}


// ============================================
// TOGGLE COMPLETE
// ============================================

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    render();

}


// ============================================
// EDIT TASK
// ============================================

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    const newTitle =
        prompt(
            "Edit task:",
            task.title
        );


    if (newTitle === null) return;


    const title =
        newTitle.trim();


    if (!title) {

        alert("Task cannot be empty.");

        return;

    }


    task.title = title;


    saveTasks();

    render();

}


// ============================================
// FILTER TASKS
// ============================================

function filterTasks() {

    let result = [...tasks];


    // Search

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (search) {

        result =
            result.filter(task =>
                task.title
                    .toLowerCase()
                    .includes(search)
            );

    }


    // Status filter

    if (currentFilter === "active") {

        result =
            result.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        result =
            result.filter(
                task => task.completed
            );

    }


    if (currentFilter === "high") {

        result =
            result.filter(
                task => task.priority === "high"
            );

    }


    return result;

}


// ============================================
// SORT TASKS
// ============================================

function sortTasks(taskArray) {

    const sortType =
        sortSelect.value;


    if (sortType === "newest") {

        taskArray.sort(
            (a, b) =>
                b.createdAt - a.createdAt
        );

    }


    if (sortType === "oldest") {

        taskArray.sort(
            (a, b) =>
                a.createdAt - b.createdAt
        );

    }


    if (sortType === "priority") {

        const priorityValue = {

            high: 3,

            medium: 2,

            low: 1

        };


        taskArray.sort(
            (a, b) =>
                priorityValue[b.priority] -
                priorityValue[a.priority]
        );

    }


    if (sortType === "dueDate") {

        taskArray.sort(
            (a, b) => {

                if (!a.dueDate) return 1;

                if (!b.dueDate) return -1;

                return a.dueDate.localeCompare(
                    b.dueDate
                );

            }
        );

    }


    return taskArray;

}


// ============================================
// RENDER TASKS
// ============================================

function render() {

    let visibleTasks =
        filterTasks();


    visibleTasks =
        sortTasks(visibleTasks);


    taskList.innerHTML = "";


    // Empty state

    emptyState.style.display =
        visibleTasks.length === 0
            ? "block"
            : "none";


    visibleTasks.forEach(task => {

        const li =
            document.createElement("li");


        li.className = "task";


        if (task.completed) {

            li.classList.add("completed");

        }


        const dueDate =
            task.dueDate
                ? `📅 ${formatDate(task.dueDate)}`
                : "No due date";


        li.innerHTML = `

            <input
                type="checkbox"
                class="checkbox"
                data-action="toggle"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-meta">

                    <span class="priority ${task.priority}">
                        ${task.priority}
                    </span>

                    <span>
                        ${dueDate}
                    </span>

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    data-action="edit"
                    data-id="${task.id}">
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    data-action="delete"
                    data-id="${task.id}">
                    🗑️
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    updateStats();

}


// ============================================
// UPDATE STATISTICS
// ============================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    const high =
        tasks.filter(
            task =>
                task.priority === "high" &&
                !task.completed
        ).length;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        active;


    completedTasks.textContent =
        completed;


    highTasks.textContent =
        high;


    taskCounter.textContent =
        `${active} active task${active !== 1 ? "s" : ""}`;


    // Progress

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    progressBar.style.width =
        `${percentage}%`;


    progressText.textContent =
        `${percentage}%`;

}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ============================================
// SECURITY
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ============================================
// EVENT DELEGATION
// ============================================

taskList.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) return;


        const id =
            button.dataset.id;


        const action =
            button.dataset.action;


        if (action === "delete") {

            deleteTask(id);

        }


        if (action === "edit") {

            editTask(id);

        }

    }
);


// Checkbox change

taskList.addEventListener(
    "change",
    function(event) {

        if (
            event.target.dataset.action ===
            "toggle"
        ) {

            toggleTask(
                event.target.dataset.id
            );

        }

    }
);


// ============================================
// ADD BUTTON
// ============================================

addBtn.addEventListener(
    "click",
    addTask
);


// Enter key

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ============================================
// SEARCH
// ============================================

searchInput.addEventListener(
    "input",
    render
);


// ============================================
// SORT
// ============================================

sortSelect.addEventListener(
    "change",
    render
);


// ============================================
// FILTER BUTTONS
// ============================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            currentFilter =
                button.dataset.filter;


            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            render();

        }
    );

});


// ============================================
// CLEAR COMPLETED
// ============================================

clearCompleted.addEventListener(
    "click",
    function() {

        tasks =
            tasks.filter(
                task => !task.completed
            );


        saveTasks();

        render();

    }
);


// ============================================
// CLEAR ALL
// ============================================

clearAll.addEventListener(
    "click",
    function() {

        if (tasks.length === 0) return;


        const confirmDelete =
            confirm(
                "Delete all tasks?"
            );


        if (!confirmDelete) return;


        tasks = [];


        saveTasks();

        render();

    }
);


// ============================================
// DARK MODE
// ============================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeBtn.textContent =
            isDark ? "☀️" : "🌙";


        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

    }
);


// ============================================
// LOAD THEME
// ============================================

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


// ============================================
// INITIAL RENDER
// ============================================

render();