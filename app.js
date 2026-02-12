document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const titleInput = document.getElementById('title');
    const priorityInput = document.getElementById('priority');
    const dueDateInput = document.getElementById('dueDate');
    const descriptionInput = document.getElementById('description');
    const taskIdInput = document.getElementById('taskId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const titleError = document.getElementById('titleError');
    const searchInput = document.getElementById('searchInput'); 
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const totalCountSpan = document.getElementById('totalCount');
    const pendingCountSpan = document.getElementById('pendingCount');
    const completedCountSpan = document.getElementById('completedCount');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let searchQuery = ''; 

    function getLocalDateString() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const todayStr = getLocalDateString();
    
    dueDateInput.setAttribute('min', todayStr);
    dueDateInput.value = todayStr;

    renderTasks();
    updateCounters();

    taskForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', resetForm);
    
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderTasks();
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    function handleFormSubmit(e) {
        e.preventDefault();

        const title = titleInput.value.trim();
        if (title.length < 3) {
            titleError.textContent = 'El título debe tener al menos 3 caracteres.';
            return;
        }
        titleError.textContent = '';

        const taskData = {
            id: taskIdInput.value ? Number(taskIdInput.value) : Date.now(),
            title: title,
            priority: priorityInput.value,
            dueDate: dueDateInput.value,
            description: descriptionInput.value.trim(),
            completed: taskIdInput.value ? getTaskById(Number(taskIdInput.value)).completed : false,
            createdAt: taskIdInput.value ? getTaskById(Number(taskIdInput.value)).createdAt : new Date().toISOString()
        };

        if (taskIdInput.value) {
            const index = tasks.findIndex(t => t.id === Number(taskIdInput.value));
            if (index !== -1) {
                tasks[index] = taskData;
            }
        } else {
            tasks.push(taskData);
        }

        saveTasks();
        renderTasks();
        resetForm();
    }

    function getTaskById(id) {
        return tasks.find(t => t.id === id);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateCounters();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;
            
            const term = searchQuery.toLowerCase();
            return task.title.toLowerCase().includes(term) || 
                   task.description.toLowerCase().includes(term);
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
            <li style="text-align:center; padding: 2rem; color: #a0aec0; display: flex; flex-direction: column; align-items: center;">
                <i class="fa-solid fa-list-ul" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No se encontraron tareas.</p>
            </li>`;
        } else {
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.id = `task-${task.id}`;
                li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
                
                let dueDateDisplay = 'Sin fecha límite';
                if(task.dueDate) {
                     const datePart = task.dueDate.split('-');
                     if(datePart.length === 3) {
                        const d = new Date(datePart[0], datePart[1]-1, datePart[2]);
                        dueDateDisplay = `<i class="fa-regular fa-calendar"></i> ${d.toLocaleDateString()}`;
                     }
                } else {
                    dueDateDisplay = '<i class="fa-regular fa-calendar"></i> Sin fecha límite';
                }
                
                const priorityLabel = 
                    task.priority === 'alta' ? 'PRIORIDAD ALTA' :
                    task.priority === 'media' ? 'PRIORIDAD MEDIA' : 'PRIORIDAD BAJA';

                li.innerHTML = `
                    <div class="task-checkbox-container">
                        <div class="task-checkbox" onclick="toggleTask(${task.id})" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                            <i class="fa-solid fa-check"></i>
                        </div>
                    </div>
                    
                    <div class="task-content">
                        <div class="task-meta">
                             <span class="badge badge-priority-${task.priority}">${priorityLabel}</span>
                             <span class="task-date">${dueDateDisplay}</span>
                        </div>
                        <h3 class="task-title" onclick="loadTaskForEdit(${task.id})" style="cursor: pointer;" title="Clic para editar">
                            ${escapeHtml(task.title)}
                        </h3>
                        <p class="task-desc">${escapeHtml(task.description)}</p>
                    </div>

                    <div class="task-actions">
                        <button class="action-btn" onclick="loadTaskForEdit(${task.id})" title="Editar">
                             <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteTask(${task.id})" title="Eliminar">
                             <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }
        
        updateCounters();
    }

    function updateCounters() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        if (totalCountSpan) totalCountSpan.textContent = total;
        if (completedCountSpan) completedCountSpan.textContent = completed;
        if (pendingCountSpan) pendingCountSpan.textContent = pending;
    }

    function resetForm() {
        taskForm.reset();
        taskIdInput.value = '';
        submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar Tarea';
        cancelEditBtn.style.display = 'none';
        titleError.textContent = '';
        priorityInput.value = 'media';
        
        dueDateInput.value = getLocalDateString();
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.toggleTask = function(id) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            const taskElement = document.getElementById(`task-${id}`);
            if (taskElement) {
                taskElement.classList.toggle('completed');
            }

            setTimeout(() => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            }, 300);
        }
    };

    window.deleteTask = function(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            
            if (taskIdInput.value == id) {
                resetForm();
            }
            renderTasks();
        }
    };

    window.loadTaskForEdit = function(id) {
        const task = getTaskById(id);
        if (task) {
            taskIdInput.value = task.id;
            titleInput.value = task.title;
            priorityInput.value = task.priority;
            dueDateInput.value = task.dueDate;
            descriptionInput.value = task.description;

            submitBtn.textContent = 'Guardar Cambios';
            cancelEditBtn.style.display = 'block';
             
            if(window.innerWidth < 900) {
                 document.querySelector('.sidebar').scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
});
