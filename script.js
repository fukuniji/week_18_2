// Получаем элементы со страницы
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearListBtn = document.getElementById("clearListBtn");

// Прописываем локаль и опции для форматирования даты
const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
});

// Получаем сохраненный список задач из Local Storage
let tasks = localStorage.getItem("tasks");
tasks = tasks ? JSON.parse(tasks) : [];

// Функция сохранения списка задач в Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Функция добавления задачи в список
function addTask() {
    // Получаем текст задачи из input
    const taskText = taskInput.value.trim();

    // Если текст задачи не пустой, добавляем его в список
    if (taskText !== "") {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        // Очищаем поле ввода
        taskInput.value = "";
    } else {
        console.log("Введите текст задачи.");
    }
}

// Функция отрисовки списка задач на странице
function renderTasks() {
    // Очищаем список задач на странице
    taskList.innerHTML = "";

    // Если задач нет, добавляем уведомление об этом
    if (tasks.length === 0) {
        const noTasks = document.createElement("p");
        noTasks.classList.add("no-tasks");
        noTasks.textContent = "Задачи отсутствуют";
        taskList.appendChild(noTasks);
        clearListBtn.disabled = true;
    } else {
        clearListBtn.disabled = false;
    }

    // Добавляем каждую задачу в список на странице
    tasks.forEach((task) => {
        // Создаём элемент списка
        const taskItem = document.createElement("li");
        // Добавляем классы для элемента списка
        taskItem.classList.add(
            "task-item",
            task.completed ? "completed" : "unachieved"
        );

        const taskCheckbox = document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");
        taskCheckbox.classList.add("task-checkbox");
        taskCheckbox.checked = task.completed;
        // Добавляем обработчик клика на чекбокс
        taskCheckbox.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const taskLabel = document.createElement("label");
        taskLabel.classList.add("task-label");
        taskLabel.textContent = task.text;

        const taskDate = document.createElement("span");
        taskDate.classList.add("task-date");
        taskDate.textContent = formatter.format(task.id);

        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskLabel);
        taskLabel.appendChild(taskDate);
        taskList.appendChild(taskItem);
    });
}

// Функция удаления всех задач из списка (очистка списка)
function clearList() {
    const clear = confirm("Вы действительно хотите очистить список?");
    if (clear) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Обработчик клика на кнопку добавления задачи
addTaskBtn.addEventListener("click", addTask);

// Обработчик нажатия Enter в input для добавления задачи (отравка по Enter)
taskInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        addTask();
    }
});

// Обработчик клика на кнопку очистки списка задач
clearListBtn.addEventListener("click", clearList);

// Отрисовываем список задач при загрузке страницы
renderTasks();
