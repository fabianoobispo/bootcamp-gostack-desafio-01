const express = require('express');

const server = express();

server.use(express.json());



const projects = [];


//Middleware para verificar se o projeto exixte para editar ou deletar 
function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }
  return next();
};

//Middleware para nao criar projetos com id parecido 
function noRepeatProject(req, res, next) {
  const { id } = req.body;
  const project = projects.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: 'Project id repeated' });
  }
  return next();
};


 //Middleware para numero de requisições 
function logRequests(req, res, next) {
  console.count("Número de requisições");
  return next();
};

server.use(logRequests);





server.get('/projects', (rec, res) => {
  return res.json(projects);
});


server.post('/projects',noRepeatProject, (req,res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(project);
});


server.post('/projects/:id/tasks',checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  return res.json(project);
});



server.put('/projects/:id',checkProject, (req,res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;
  return res.json(project);
});


server.delete('/projects/:id',checkProject, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);
  return res.send();
});



server.listen(3000);