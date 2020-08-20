const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); //tiro o return para ele executar o código abaixo

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

  const repoData = { id: uuid(), title, url, techs, likes };

  repositories.push(repoData);

  return response.json(repoData);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;