const express = require("express");
const cors = require("cors");

const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validadeRepoId(request, response, next) {
  const { id } = request.params;

  if (!uuidValidate(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID.' })
  }

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validadeRepoId);

app.get("/repositories", (request, response) => {

  const { title, techs } = request.query;

  const result = title || techs
    ? repositories.filter(repoData => repoData.title.includes(title) || repoData.techs.includes(techs))
    : repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;

  const repoData = { id: uuidv4(), title, url, techs, likes };

  repositories.push(repoData);

  return response.json(repoData);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repoData => repoData.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  } 

  const repoData = {
    title,
    url,
    techs
  };

  repositories[repoIndex].title = title;
  repositories[repoIndex].url = url;
  repositories[repoIndex].techs = techs;

  return response.json(repoData);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repoData => repoData.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repoData => repoData.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  }

repositories[repoIndex].likes += 1;

 return response.json(repositories[repoIndex])
});

module.exports = app;