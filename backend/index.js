// instance express framework
const express = require('express');
const app = express();

// port 8000
const port = 8000;

// handle external requests with cors
const cors = require('cors');
app.use(cors());

// body-parser middleware used to extract incoming data of POST request
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// morgan middleware, displays request informations
var morgan = require('morgan');
morgan('tiny');

// json data
let superHeroes = require('./heroes.json');


// body-parser same process
app.use(express.json());


// get all heroes with their informations
app.get('/', (req, res) => {
    res.json(superHeroes);
});

// give a unique heroe name
app.get('/heroes/:slug', (req, res) => {
    const { slug } = req.params;
    const heroe = superHeroes.find(superHeroe => superHeroe.slug === slug);
    // res.send(`Hello, my name is ${req.params.slug} !`);
    res.json(heroe);
});

// route used to get power names from a unique heroe
app.get('/heroes/:slug/powers', (req, res) => {
    const { slug } = req.params;
    const heroe = superHeroes.find(superHeroe => superHeroe.slug === slug);
    const power = heroe.power.map(power => power)
    res.json(power);
});

// route used to check if heroe already exists 
const checkHero = (req, res, next) => {
    const { slug } = req.body;
    const heroe = superHeroes.find(heroe => heroe.slug === slug)
  
    if (heroe) {
      res.status(409).send("Existing hero")
    } else {
      next()
    }
  }

// route used to create and add a new heroe 
app.post('/heroes', checkHero, (req, res) => {
    const heroe = {
        ...req.body
    }
    superHeroes = [...superHeroes, heroe];
    res.status(200).send(heroe);
    console.log(heroe);
});

// route used to update/add powers to an existing heroe in the list
app.put('/heroes/:slug/powers', (req, res) => {
    const { slug } = req.params;
    // power's heroe conqt variable declaration
    const { newPower } = req.body;
    let heroe = superHeroes.find(superHeroe => superHeroe.slug === slug);
    // create and add a new power for hero : destructuring power array to add new ones
    heroe.power = [...heroe.power, newPower];
    res.json(heroe);
})

// server launched (8000)
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
