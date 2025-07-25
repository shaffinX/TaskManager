<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <link rel="stylesheet" href="{{ asset('css/tasks.css') }}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <h1 class="title">
                    <i class="fas fa-tasks"></i>
                    Task Manager
                </h1>
                <button class="add-task-btn" onclick="openModal()">
                    <i class="fas fa-plus"></i>
                    Add New Task
                </button>
            </div>
        </header>

        <div class="dashboard">
            <div class="stats-grid">
                <div class="stat-card todo">
                    <div class="stat-icon">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="todo-count">0</h3>
                        <p>To Do</p>
                    </div>
                </div>
                <div class="stat-card in-progress">
                    <div class="stat-icon">
                        <i class="fas fa-spinner"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="progress-count">0</h3>
                        <p>In Progress</p>
                    </div>
                </div>
                <div class="stat-card done">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="done-count">0</h3>
                        <p>Completed</p>
                    </div>
                </div>
            </div>

            <div class="tasks-section">
                <div class="section-header">
                    <h2>All Tasks</h2>
                    <div class="filters">
                        <select id="statusFilter" onchange="filterTasks()">
                            <option value="all">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                </div>
                
                <div class="tasks-container" id="tasksContainer">
                    <!-- Tasks will be dynamically inserted here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Add/Edit Task -->
    <div class="modal-overlay" id="modalOverlay" onclick="closeModal()">
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3 id="modalTitle">Add New Task</h3>
                <button class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="modal-body" onsubmit="saveTask(event)">
                <input type="hidden" id="taskId" value="">
                
                <div class="form-group">
                    <label for="taskTitle">Task Title</label>
                    <input type="text" id="taskTitle" required placeholder="Enter task title...">
                </div>
                
                <div class="form-group">
                    <label for="taskDescription">Description</label>
                    <textarea id="taskDescription" rows="4" placeholder="Enter task description..."></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="taskStatus">Status</label>
                        <select id="taskStatus" required>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="taskPriority">Priority</label>
                        <select id="taskPriority" required>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Task</button>
                </div>
            </form>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="{{ asset('js/tasks.js') }}"></script>
</body>
</html>