// Array que irá armazenar os projetos
let projects = [];

// Carregar os dados do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
        renderProjects();
    }
});

// Função para renderizar os projetos na tela
function renderProjects(category = 'todos') {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = ''; // Limpar a lista de projetos

    const projetosFiltrados = projects.filter(project =>{
        if(category === 'todos'){
            return true;
        }

        return project.category === category;
    }
    );

    projetosFiltrados.forEach((project, projectIndex) => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const projectTitle = document.createElement('h3');
        projectTitle.textContent = `${project.name} (${project.category})`;
        projectDiv.appendChild(projectTitle);

        // Barra de progresso
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        const progress = document.createElement('div');
        progress.classList.add('progress');
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter(task => task.completed).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progress.style.width = `${progressPercentage}%`;
        progressBar.appendChild(progress);
        projectDiv.appendChild(progressBar);

        // Botão para adicionar tarefas
        const taskInput = document.createElement('input');
        taskInput.placeholder = 'Adicionar Tarefa';
        projectDiv.appendChild(taskInput);

        const addTaskBtn = document.createElement('button');
        addTaskBtn.textContent = 'Adicionar Tarefa';
        addTaskBtn.addEventListener('click', () => addTask(projectIndex, taskInput.value));
        projectDiv.appendChild(addTaskBtn);

        // Listar tarefas do projeto
        const taskList = document.createElement('ul');
        project.tasks.forEach((task, taskIndex) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task');
            taskItem.textContent = task.title;

            // Marcar como concluída
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.addEventListener('click', () => toggleTaskCompletion(projectIndex, taskIndex));

            taskList.appendChild(taskItem);
        });
        projectDiv.appendChild(taskList);

        // Botão para remover projeto
        const removeProjectBtn = document.createElement('button');
        removeProjectBtn.textContent = 'Remover Projeto';
        removeProjectBtn.addEventListener('click', () => removeProject(projectIndex));
        projectDiv.appendChild(removeProjectBtn);

        projectList.appendChild(projectDiv);
    });

    // Salvar os projetos no localStorage
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Função para adicionar projeto
document.getElementById('addProjectBtn').addEventListener('click', () => {
    const projectName = document.getElementById('projectName').value;
    const projectCategory = document.getElementById('categorySelect').value;

    if (projectName) {
        projects.push({
            name: projectName,
            category: projectCategory,
            tasks: []
        });
        document.getElementById('projectName').value = ''; // Limpar o campo
        renderProjects();
    }
});

// Função para adicionar tarefas
function addTask(projectIndex, taskTitle) {
    if (taskTitle) {
        projects[projectIndex].tasks.push({
            title: taskTitle,
            completed: false
        });
        renderProjects();
    }
}

// Função para alternar o status de conclusão da tarefa
function toggleTaskCompletion(projectIndex, taskIndex) {
    projects[projectIndex].tasks[taskIndex].completed = !projects[projectIndex].tasks[taskIndex].completed;
    renderProjects();
}

// Função para remover projeto
function removeProject(projectIndex) {
    projects.splice(projectIndex, 1);
    renderProjects();
}

function filterProjects(category){
    renderProjects(category);
}
