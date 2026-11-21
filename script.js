// 1. Get HTML Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// 2. Store Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let editId = null;


// 3. Save Tasks in Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// 4. Add New Task
function addTask() {

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {

        tasks = tasks.map(function(task) {
            if (task.id === editId) {
                return { ...task, name: taskName };
            }
            return task;
        });

        editId = null;
        addBtn.textContent = "+ Add Task";

    } else {

        const newTask = {
            id: Date.now(),
            name: taskName,
            completed: false
        };

        tasks.push(newTask);
    }

    taskInput.value = "";

    saveTasks();
    displayTasks();
}


// 5. Display Tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Task Text
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.name;

        // Complete Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        // Task Content
        const taskContent = document.createElement("div");
        taskContent.style.display = "flex";
        taskContent.style.alignItems = "center";
        taskContent.style.gap = "12px";
        taskContent.style.flex = "1";

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);

        // Action Buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function() {
            editTask(task.id);
        });

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskContent);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    // Empty Message
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateStatistics();
}


// 6. Edit Task
function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        taskInput.value = task.name;
        taskInput.focus();

        editId = id;
        addBtn.textContent = "Update Task";
    }
}


// 7. Delete Task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    if (editId === id) {
        editId = null;
        taskInput.value = "";
        addBtn.textContent = "+ Add Task";
    }

    saveTasks();
    displayTasks();
}


// 8. Complete Task
function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}


// 9. Update Statistics
function updateStatistics() {

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}


// 10. Filter Tasks
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});


// 11. Add Button Event
addBtn.addEventListener("click", addTask);


// 12. Enter Key Event
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// 13. Display Saved Tasks on Page Load
displayTasks();