const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function checkValidID(request, response, next){
  const repIndex = repositories.findIndex( ({id})=> id === request.params.id );
  
  if(repIndex<0){
    return response.status(400).json({error:'There is no repository with the informed ID'})
  }
  request.locals = {repIndex};
  return next();
}

app.use('/repositories/:id', checkValidID);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const content = request.body;
  const newRepository = {id: uuid(), likes: 0, ...content};
  repositories.push(newRepository);
  return response.json(newRepository);
});


app.put("/repositories/:id", (request, response) => {
  const updatableFilds = ['url','title','techs'];
  const newInfo = request.body;
  const repIndex = request.locals.repIndex;
  
  for(let fild of updatableFilds){
    repositories[repIndex][fild] = newInfo[fild] || repositories[repIndex][fild];
  }

  return response.json(repositories[repIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const repIndex = request.locals.repIndex;
  repositories.splice(repIndex,1);
  return  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repIndex = request.locals.repIndex;
  repositories[repIndex].likes+=1;
  return response.json(repositories[repIndex]);
});

module.exports = app;
