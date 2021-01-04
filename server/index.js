const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler();

const filePath = './data.json';
const fs = require('fs');
const path = require('path');
const moviesData = require(filePath);




app.prepare().then(() => {

  const server = express();
  server.use(bodyParser.json())

  server.get('/api/v1/movies', (req, res) => {
    return res.json(moviesData)
  })

  server.get('/api/v1/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = moviesData.find((m) => m.id === id);
    return res.json(movie)
  })

  server.post('/api/v1/movies', (req, res) => {
    const movie = req.body;
    moviesData.push(movie);
    const stringifyData = JSON.stringify(moviesData, null, 2)
    const pathToFile = path.join(__dirname, filePath)

    fs.writeFile(pathToFile, stringifyData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
      return res.json('Movie had been succesfully added');
    })
  })

  server.delete('/api/v1/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = moviesData.findIndex((m) => m.id === id);
    moviesData.splice(movieIndex, 1)

    const pathToFile = path.join(__dirname, filePath)
    const stringifyData = JSON.stringify(moviesData, null, 2)

    fs.writeFile(pathToFile, stringifyData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
      return res.json('Movie had been succesfully deleted');
    })

  })

  server.patch('/api/v1/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = req.body;
    const movieIndex = moviesData.findIndex((m) => m.id === id);
    moviesData[movieIndex] = movie

    const pathToFile = path.join(__dirname, filePath)
    const stringifyData = JSON.stringify(moviesData, null, 2)

    fs.writeFile(pathToFile, stringifyData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
      return res.json(movie);
    })

  })

  /* server.get('*', (req, res) => {
    //next.js is handling requests and providing pages
    return handle(req, res)
  })

  server.post('*', (req, res) => {
    //next.js is handling requests and providing pages
    return handle(req, res)
  })
 */
  const PORT = process.env.PORT || 3000;

  server.use(handle).listen(PORT, (err) => {
    if (err) throw err
    console.log('> Ready on port ' + PORT)
  })
})