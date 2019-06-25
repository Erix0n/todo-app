const globalState = {
  tasks: [],
};

const inputField = document.getElementById('add-input');
const taskForm = document.getElementById('task-form');
const incompleteItemsContainer = document.getElementById('incomplete-tasks');
const completeItemsContainer = document.getElementById('completed-tasks');

const createListItem = (task) => {
  const listItemWrapper = document.createElement('li');

  const item = `
  <input type="checkbox" ${task.done && 'checked'} id="${task.id}" name="${task.id}" />
  <label>${task.label}</label>
  <input type="text" value="hejsan" />
  <button class="delete">Delete</button>
`;

  listItemWrapper.innerHTML = item;
  listItemWrapper.value = task.id;

  return listItemWrapper;
};

function renderHTMLElement(task) {
  if (!task.done) {
    incompleteItemsContainer.appendChild(createListItem(task));
  } else if (task.done) {
    completeItemsContainer.appendChild(createListItem(task));
  }
}

function resetHTML() {
  incompleteItemsContainer.innerHTML = '';
  completeItemsContainer.innerHTML = '';
}

const updateView = () => {
  resetHTML();
  const doneTasks = globalState.tasks.filter(task => task.done);
  const remainingTasks = globalState.tasks.filter(task => !task.done);

  doneTasks.forEach(task => renderHTMLElement(task));
  remainingTasks.forEach(task => renderHTMLElement(task));
};

function clearInput() {
  inputField.value = '';
}

function handleCheckBoxChange(event) {
  const { checked, id } = event.target;

  const updatedTask = globalState.tasks.find(task => task.id.toString() === id);

  updatedTask.done = checked;
  updateView();
  setUpCheckBoxListeners();
  saveStateToLocal();
}

function setUpCheckBoxListeners() {
  globalState.tasks.forEach((task) => {
    const taskNode = document.querySelector(`input[name="${task.id}"]`);
    taskNode.addEventListener('change', handleCheckBoxChange);
  });
}

function saveStateToLocal() {
  localStorage.setItem('todo_state_tasks', JSON.stringify(globalState.tasks));
}

function addNewTask(event) {
  event.preventDefault();

  const newTask = {};
  newTask.label = inputField.value;
  newTask.id = Math.floor(Math.random() * 9999);
  newTask.done = false;

  globalState.tasks.push(newTask);

  saveStateToLocal();
  updateView();
  clearInput();
  setUpCheckBoxListeners();
}

function removeTask(id) {
  const deletedTask = globalState.tasks.findIndex((obj => obj.id === id));
  globalState.tasks.splice(deletedTask, 1);
  saveStateToLocal();
  updateView();
}

document.addEventListener('click', (e) => {
  if (e.target.matches('.delete')) {
    const { value } = e.target.parentNode;
    removeTask(value);
  }
});

function init() {
  const savedTodos = JSON.parse(localStorage.getItem('todo_state_tasks'));
  if (savedTodos) {
    globalState.tasks = savedTodos;
  }
  updateView();
  setUpCheckBoxListeners();
}

init();
taskForm.addEventListener('submit', addNewTask);
