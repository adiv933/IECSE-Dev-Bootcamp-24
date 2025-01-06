document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.querySelector('.task-list');
    const emptyMessage = document.querySelector('.empty-message');
    const clearAllButton = document.querySelector('.clear-all');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];   // get tasks from local storage or set tasks to an empty array
    let currentFilter = 'all';                                      // set current filter to 'all'

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));         // save tasks to local storage
        updateStats();
    };

    const updateStats = () => {
        const completed = tasks.filter(task => task.completed).length;        // get number of completed tasks
        document.getElementById('totalTasks').textContent = tasks.length;        // update total tasks count
        document.getElementById('completedTasks').textContent = completed;       // update completed tasks count
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();                   // format date string
    };

    const createTaskElement = (task, index) => {
        const li = document.createElement('li');                         // create task element
        li.className = 'task-item';                                      // add class to task element
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>                               
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>                 
                <span class="priority-${task.priority}">${task.priority}</span>
                <span>${formatDate(task.dueDate)}</span>
            </div>
            <div class="task-actions">
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>                                                                           
        `;                                                                                   // add task content to task element

        const checkbox = li.querySelector('input[type="checkbox"]');                             // get checkbox
        const deleteBtn = li.querySelector('.delete-btn');                                   // get delete button

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;                                                  // update task completed status
            li.querySelector('.task-text').classList.toggle('completed', checkbox.checked);        // toggle completed class
            saveTasks();
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this task?')) {                          // confirm delete task
                tasks.splice(index, 1);                                  // remove task from tasks array
                saveTasks();
                renderTasks();
            }
        });

        return li;                                                        // return task element
    };

    const renderTasks = () => {
        taskList.innerHTML = '';                                            // clear task list
        let filteredTasks = tasks;                                             // get filtered tasks

        if (currentFilter === 'active') {                                                      // if current filter is active
            filteredTasks = tasks.filter(task => !task.completed);                            // filter tasks based on current filter
        } else if (currentFilter === 'completed') {                                            // if current filter is completed
            filteredTasks = tasks.filter(task => task.completed);                             // filter tasks based on current filter
        }  

        filteredTasks.forEach((task, index) => {
            taskList.appendChild(createTaskElement(task, index));                            // create task element and append to task list
        });

        emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';                    // show or hide empty message based on tasks length
        clearAllButton.style.display = tasks.length === 0 ? 'none' : 'block';                   // show or hide clear all button based on tasks length
    };

    const addTask = () => {
        const text = taskInput.value.trim();                                               
        if (text) {
            tasks.push({
                text,
                priority: taskPriority.value,  // add task to tasks array
                dueDate: taskDueDate.value,    
                completed: false               
            });
            taskInput.value = '';     // clear input field---jagah khali karo
            saveTasks();
            renderTasks();
        }
    };

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();          // To-Do--add task on enter key press----anaye recruit ko naukri do
    });  

    clearAllButton.addEventListener('click', () => {
        if (confirm('Clear all tasks?')) {
            tasks = []; // clear all tasks
            saveTasks(); // save tasks
            renderTasks(); // render tasks
        }
    });

    filterButtons.forEach(button => {       // add event listener to filter buttons
        button.addEventListener('click', () => {        // on click
            filterButtons.forEach(btn => btn.classList.remove('active'));       // remove active class from all filter buttons
            button.classList.add('active');
            currentFilter = button.dataset.filter; // set current filter
            renderTasks(); // render tasks
        });
    });

    renderTasks();  // render tasks
});
