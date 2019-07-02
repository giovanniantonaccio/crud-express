const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
var numberOfRequests = 0;

//Middleware that checks the number of requests
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url}`);
  console.log(`Number of requests: ${numberOfRequests++}`);

  next();

  console.timeEnd("Request");
});

//Middleware that checks if the project exists
function checkProjectExists(req, res, next) {
  const project = projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exist" });
  }

  return next();
}

//Return all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Save a new project
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(project);
});

//Edit a project
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);
  project.title = title;

  return res.json(project);
});

//Delete a project
server.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);
  projects.splice(index, 1);

  return res.json();
});
//Save a new task
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
