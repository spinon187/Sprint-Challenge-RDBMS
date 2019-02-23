const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/sprint.sqlite3'
  },
}

const db = knex(knexConfig);

const errors = {
  '19': 'Another record with that value exists',
};

server.get('/api/projects', async (req, res) => {
  try {
    const projects = await db('projects');
    res.status(200).json(projects);
  }
  catch(error) {
    res.status(500).json(error);
  }
})

server.post('/api/projects', async (req, res) => {
  try {
    const id = await db('projects').insert(req.body);

    const project = await db('projects')
      .where({id})
      .first();
    res.status(201).json(project);
  }
  catch(error){
    const message = errors[error.errorno] || 'Error';
    res.status(500).json({message, error});
  }
})

server.get('/api/projects/:id', async (req, res) => {
  const id = req.params.id

  try {
    const project = await db('projects')
      .where({id})
      .first();
    res.status(200).json(project);
  }
  catch {
    res.status(500).json(error);
  }
})

server.put('/api/projects/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const count = await db('projects')
      .where({id})
      .update(req.body);
    if (count > 0) {
      const project = await db('projects')
        .where({id})
        .first();
      res.status(200).json(project);
    }
    else {
      res.status(404).json({message: 'not found'});
    }
  } 
  catch(error){}
});

server.delete('/api/projects/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const count = await db('projects')
      .where({id})
      .del();

    if (count > 0) {
      res.status(204).end();
    }
    else {
      res.status(404).json({message: 'not found'});
    }
  }
  catch (error){}
});


server.get('/api/projects/:project_id/actions', async (req, res) => {
  const id = req.params.project_id;

  try {
    const actions = await db('actions')
    .where({project_id: id});
    res.status(200).json(actions);
  }
  catch(error) {
    res.status(500).json(error);
  }
})

server.post('/api/projects/:project_id/actions', async (req, res) => {
    const projectID = req.params.project_id;
    const actionObj = {name: req.body.name, project_id: projectID, description: req.body.description, notes: req.body.notes, complete: false}
    try {
      const id = await db('actions').insert(actionObj);
  
      const action = await db('actions')
        .where({id})
        .first();
      res.status(201).json(action);
    }
    catch(error){
      const message = errors[error.errorno] || 'Error';
      res.status(500).json({message, error});
    }
  })

  server.get('/api/projects/:project_id/actions/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const action = await db('actions')
      .where({id});
      res.status(200).json(action);
    }
    catch(error) {
      res.status(500).json(error);
    }
  })

  server.put('/api/projects/:project_id/actions/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const count = await db('actions')
        .where({id})
        .update(req.body);
      if (count > 0) {
        const action = await db('actions')
          .where({id})
          .first();
        res.status(200).json(action);
      }
      else {
        res.status(404).json({message: 'not found'});
      }
    } 
    catch(error){}
  });

  server.delete('/api/projects/:project_id/actions/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
      const count = await db('actions')
        .where({id})
        .del();
  
      if (count > 0) {
        res.status(204).end();
      }
      else {
        res.status(404).json({message: 'not found'});
      }
    }
    catch (error){}
  });

const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
