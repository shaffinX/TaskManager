// Static tasks data - replace this with API calls later

var tasks = [
    // {
    //     id: 1,
    //     title: "Design User Interface",
    //     description: "Create wireframes and mockups for the new dashboard",
    //     status: "todo",
    //     priority: "high",
    //     created_at: "2025-01-20"
    // },
    // {
    //     id: 2,
    //     title: "Implement Authentication",
    //     description: "Set up user login and registration system",
    //     status: "in-progress",
    //     priority: "high",
    //     created_at: "2025-01-19"
    // },
    // {
    //     id: 3,
    //     title: "Write Documentation",
    //     description: "Document all API endpoints and usage examples",
    //     status: "todo",
    //     priority: "medium",
    //     created_at: "2025-01-18"
    // },
    // {
    //     id: 4,
    //     title: "Setup Database",
    //     description: "Configure database schema and migrations",
    //     status: "done",
    //     priority: "high",
    //     created_at: "2025-01-17"
    // },
    // {
    //     id: 5,
    //     title: "Testing Framework",
    //     description: "Implement unit and integration tests",
    //     status: "todo",
    //     priority: "low",
    //     created_at: "2025-01-16"
    // }
];

axios.get('/api/getTask').then(response => {
    tasks = response.data;
    initializeSortable();
    renderTasks();
    updateStats();}).catch(error => {
    console.error('Error fetching tasks:', error);
    showNotification('Error fetching tasks: ' + error.message);
});

let currentFilter = 'all';
let isEditing = false;
let editingTaskId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSortable();
    renderTasks();
    updateStats();
});

// Initialize drag and drop functionality
function initializeSortable() {
    const tasksContainer = document.getElementById('tasksContainer');
    new Sortable(tasksContainer, {
        animation: 150,
        ghostClass: 'dragging',
        onStart: function(evt) {
            evt.item.classList.add('dragging');
        },
        onEnd: function(evt) {
            evt.item.classList.remove('dragging');
            // Here you would typically update the order in your database
            console.log('Task order changed');
        }
    });
}

// Render all tasks
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const filteredTasks = filterTasksByStatus(tasks, currentFilter);
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No tasks found</h3>
                <p>Create your first task to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
}

// Create HTML for a single task
function createTaskHTML(task) {
    const statusIcon = getStatusIcon(task.status);
    const statusLabel = getStatusLabel(task.status);
    
    return `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})" title="Edit Task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete Task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span class="task-status ${task.status}">
                        <i class="fas ${statusIcon}"></i>
                        ${statusLabel}
                    </span>
                    <span class="task-priority ${task.priority}">
                        ${task.priority}
                    </span>
                </div>
                <span style="color: var(--text-muted); font-size: 0.8rem;">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(task.created_at)}
                </span>
            </div>
        </div>
    `;
}

// Get status icon
function getStatusIcon(status) {
    switch(status) {
        case 'todo':
            return 'fa-clipboard-list';
        case 'in-progress':
            return 'fa-spinner';
        case 'done':
            return 'fa-check-circle';
        default:
            return 'fa-clipboard-list';
    }
}

// Get status label
function getStatusLabel(status) {
    switch(status) {
        case 'todo':
            return 'To Do';
        case 'in-progress':
            return 'In Progress';
        case 'done':
            return 'Done';
        default:
            return 'To Do';
    }
}

// Filter tasks by status
function filterTasksByStatus(tasks, status) {
    if (status === 'all') {
        return tasks;
    }
    return tasks.filter(task => task.status === status);
}

// Filter tasks based on selected filter
function filterTasks() {
    const filterSelect = document.getElementById('statusFilter');
    currentFilter = filterSelect.value;
    renderTasks();
}

// Update statistics
function updateStats() {
    const todoCount = tasks.filter(task => task.status === 'todo').length;
    const progressCount = tasks.filter(task => task.status === 'in-progress').length;
    const doneCount = tasks.filter(task => task.status === 'done').length;
    
    document.getElementById('todo-count').textContent = todoCount;
    document.getElementById('progress-count').textContent = progressCount;
    document.getElementById('done-count').textContent = doneCount;
}

// Open modal for adding/editing task
function openModal(task = null) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const statusSelect = document.getElementById('taskStatus');
    const prioritySelect = document.getElementById('taskPriority');
    
    if (task) {
        // Editing existing task
        isEditing = true;
        editingTaskId = task.id;
        modalTitle.textContent = 'Edit Task';
        taskIdInput.value = task.id;
        titleInput.value = task.title;
        descriptionInput.value = task.description || '';
        statusSelect.value = task.status;
        prioritySelect.value = task.priority;
    } else {
        // Adding new task
        isEditing = false;
        editingTaskId = null;
        modalTitle.textContent = 'Add New Task';
        taskIdInput.value = '';
        titleInput.value = '';
        descriptionInput.value = '';
        statusSelect.value = 'todo';
        prioritySelect.value = 'medium';
    }
    
    modal.classList.add('active');
    titleInput.focus();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    clearForm();
}

// Clear form
function clearForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskStatus').value = 'todo';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskId').value = '';
    isEditing = false;
    editingTaskId = null;
}

// Save task (add or edit)
function saveTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    if (isEditing && editingTaskId) {
        // Update existing task
        const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                description,
                status,
                priority
            };
            console.log(`Task ${typeof(editingTaskId)}`);
            
            axios.put('/api/editTask', {
                id: editingTaskId,
                title: title,
                description: description,
                status: status,
                priority: priority
            }).then(response => {
                console.log(response.data.message);
                closeModal();
                renderTasks();
                updateStats();
                showNotification(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
            }).catch(error => {
                console.error('Error updating task:', error);
                showNotification('Error updating task: ' + error.message);
            });
        }
    } else {
        // Add new task
        const newTask = {
            id: Date.now(), // Simple ID generation - use proper UUID in production
            title,
            description,
            status,
            priority,
            created_at: new Date().toISOString().split('T')[0]
        };
        tasks.unshift(newTask);

        axios.post('/api/create', {title:title, description:description, status:status, priority:priority}).then(response => {
            console.log(response.data.message);
            closeModal();
            renderTasks();
            updateStats();
            showNotification(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
        }).catch(error => {
            console.error('Error creating task:', error);
            showNotification('Error creating task: ' + error.message);
        });
    }
    
    closeModal();
    renderTasks();
    updateStats();
    
    // Show success message
    showNotification(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
}

// Edit task
function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        openModal(task);
    }
}

// Delete task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);        
        axios.delete(`/api/deleteTask/${taskId}`).then(response => {
            console.log(response.data.message);
            renderTasks();
            updateStats();
            showNotification('Task deleted successfully!');
        }).catch(error => {
            console.error('Error deleting task:', error);
            showNotification('Error deleting task: ' + error.message);
        });
        
    }
}

// Show notification (simple implementation)
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--carmine-red);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + N to add new task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal();
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);