class Stack {
    constructor() {
      this.data = [];
    }
  
    push(item) {
      this.data.push(item);
    }
  
    pop() {
      if (this.isEmpty()) {
        return 'Stack is empty';
      }
      return this.data.pop();
    }
  
    peek() {
      if (this.isEmpty()) {
        return 'Stack is empty';
      }
      return this.data[this.data.length - 1];
    }
  
    isEmpty() {
      return this.data.length === 0;
    }
  
    clear() {
      this.data = [];
    }
  }
  
  class PriorityQueue {
    constructor() {
      this.data = [];
    }
  
    enqueue(value, priority) {
      const newNode = { value, priority };
      if (this.isEmpty()) {
        this.data.push(newNode);
      } else {
        let added = false;
        for (let i = 0; i < this.data.length; i++) {
          if (priority < this.data[i].priority) {
            this.data.splice(i, 0, newNode);
            added = true;
            break;
          }
        }
        if (!added) {
          this.data.push(newNode);
        }
      }
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return 'Priority queue is empty';
      }
      return this.data.shift().value;
    }
  
    front() {
      if (this.isEmpty()) {
        return 'Priority queue is empty';
      }
      return this.data[0].value;
    }
  
    isEmpty() {
      return this.data.length === 0;
    }
  
    clear() {
      this.data = [];
    }
  }
  
  class Task {
    constructor(description, priority) {
      this.description = description;
      this.priority = priority;
      this.completed = false;
    }
  }
  
  class TaskManager {
    constructor() {
      this.tasks = new PriorityQueue();
      this.completedTasks = new Stack();
      this.loadTasks();
    }
  
    addTask(description, priority) {
      const newTask = new Task(description, priority);
      this.tasks.enqueue(newTask, priority);
      this.displayTasks();
      this.saveTasks();
    }
  
    completeTask() {
      const taskList = document.getElementById('taskList');
      if (this.tasks.isEmpty()) {
        alert('No tasks to complete');
        return;
      }
      const task = this.tasks.dequeue();
      if (task !== 'Priority queue is empty') {
        const taskItem = taskList.querySelector('li'); // Select the first item in the list
        if (taskItem) {
          taskItem.classList.add('animate-line');
          taskItem.addEventListener('animationend', () => {
            task.completed = true;
            this.completedTasks.push(task);
            taskItem.classList.remove('animate-line');
            this.displayTasks();
            this.displayCompletedTasks();
            this.saveTasks();
          }, { once: true });
        }
      }
    }
  
    displayTasks() {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      this.tasks.data.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.value.description} (Priority: ${task.value.priority})`;
        taskList.appendChild(taskItem);
      });
    }
  
    displayCompletedTasks() {
      const completedTasksList = document.getElementById('completedTasks');
      completedTasksList.innerHTML = '';
      this.completedTasks.data.slice().reverse().forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.description} (Priority: ${task.priority})`;
        taskItem.classList.add('completed');
        completedTasksList.appendChild(taskItem);
      });
    }
  
    saveTasks() {
      const tasks = this.tasks.data.map(task => ({ description: task.value.description, priority: task.value.priority }));
      const completedTasks = this.completedTasks.data.map(task => ({ description: task.description, priority: task.priority }));
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
  
    loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
      tasks.forEach(task => this.tasks.enqueue(new Task(task.description, task.priority), task.priority));
      completedTasks.forEach(task => this.completedTasks.push(new Task(task.description, task.priority)));
      this.displayTasks();
      this.displayCompletedTasks();
    }
  
    clear() {
      this.tasks.clear();
      this.completedTasks.clear();
      this.displayTasks();
      this.displayCompletedTasks();
      localStorage.removeItem('tasks');
      localStorage.removeItem('completedTasks');
    }
  }
  
  const taskManager = new TaskManager();
  const priorityInput = document.getElementById('priorityInput');
  priorityInput.addEventListener('keydown', addTaskWithEnterKey);
  
  function addTask() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskDescription = taskInput.value;
    const taskPriority = parseInt(priorityInput.value, 10);
    if (taskDescription && taskPriority && !isNaN(taskPriority)) {
      taskManager.addTask(taskDescription, taskPriority);
      taskInput.value = '';
      priorityInput.value = '';
      taskInput.focus();
    }
  }
  
  function completeTask() {
    taskManager.completeTask();
    const taskInput = document.getElementById('taskInput');
    taskInput.focus();
  }
  
  function addTaskWithEnterKey(e) {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskDescription = taskInput.value;
    const taskPriority = parseInt(priorityInput.value, 10);
    if (taskDescription && taskPriority && !isNaN(taskPriority)) {
      if (e.key === 'Enter') {
        taskManager.addTask(taskDescription, taskPriority);
        taskInput.value = '';
        priorityInput.value = '';
        taskInput.focus();
      }
    }
  }
  
  function resetInputs() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    taskInput.value = '';
    priorityInput.value = '';
    taskInput.focus();
  }
  
  function clearTasks() {
    taskManager.clear();
    const taskInput = document.getElementById('taskInput');
    taskInput.focus();
  }
  