const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.count('Número de requisições');

  next();
});

function checkProjectExists(req, res, next){
  const { id } = req.params;
  let index = 0;
  let projectExists = false;

  projects.map(project =>{
    if (project.id == id){
      req.index = index;
      projectExists = true;

      return next();
    }

    index++;
  });

  if (!projectExists){
    return res.status(400).json({
      response: "Project not found!"
    });
  }
}

// Save new project
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({
    "id": id,
    "title": title,
    "tasks": []
  });

  return res.status(200).json({
    response: "Project successfully added!"
  });
});

// Save tasks for project
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.status(200).json({
    response: "Task successfully added!"
  });
});

// Update project title
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].title = title;

  return res.status(200).json({
    response: "Project successfully updated!"
  });
});

// See all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Delete project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  projects.splice(req.index, 1);

  return res.status(200).json({
    response: "Project successfully deleted!"
  });
});

server.listen(3000);