// Function to fetch tasks
async function fetchTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();
    console.log("Fetched tasks:", data.slice(0, 10));  
    return data.slice(0, 10); 
}
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const todos = await fetchTodos();
        const taskList = document.getElementById('task-list');
        console.log("Adding tasks to the DOM:", todos);  

        todos.forEach(todo => {
            const task = document.createElement('li');
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Not Complete';
            toggleButton.onclick = function () {
                this.textContent = this.textContent === 'Complete' ? 'Not Complete' : 'Complete';
                task.classList.toggle('completed');
            };
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function () {
                taskList.removeChild(task);
            };
            task.textContent = todo.title;
            task.appendChild(toggleButton);
            task.appendChild(deleteButton);
            taskList.appendChild(task);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);  // Log any errors that occur
    }
});


// Function to add a task
function addTask() {
    const input = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const task = document.createElement('li');
    const taskText = document.createTextNode(input.value);
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Not Complete';
    toggleButton.onclick = function () {
        this.textContent = this.textContent === 'Complete' ? 'Not Complete' : 'Complete';
        task.classList.toggle('completed');
    };
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        taskList.removeChild(task);
    };
    task.appendChild(taskText);
    task.appendChild(toggleButton);
    task.appendChild(deleteButton);
    taskList.appendChild(task);
    input.value = '';
}

// Function to search tasks
function searchTasks() {
    const searchValue = document.getElementById('search-task').value.toLowerCase();
    const tasks = document.getElementById('task-list').getElementsByTagName('li');
    
    console.log("Search value:", searchValue); 
    Array.from(tasks).forEach(task => {
        const title = task.firstChild.textContent.toLowerCase(); 

        console.log("Task title:", title); 

        if (title.includes(searchValue)) {
            task.style.display = ""; 
        } else {
            task.style.display = "none"; 
        }
    });
}


// Function to filter tasks
function filterTasks() {
    const completed = document.getElementById('filter-completed').checked;
    const notCompleted = document.getElementById('filter-not-completed').checked;
    const tasks = document.getElementById('task-list').getElementsByTagName('li');
    Array.from(tasks).forEach(task => {
        if (completed && task.classList.contains('completed')) {
            task.style.display = '';
        } else if (notCompleted && !task.classList.contains('completed')) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchTodos);
