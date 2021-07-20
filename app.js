const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const {getChild, getChildMatrix} = require('./functions');
const {Genetic} = require('./core/Genetic');
const {Solution} = require('./core/Solution');
const {solveWithHillClimbing} = require('./core/HillClimbing');
const {solveWithHillClimbing2} = require('./core/HillClimbing2');

let g;

app.get('/findSolution', async (req, res) => {
    const {matrixSize, topSize, mutationRate, populationSize} = req.query;
    const config = {
        matrixSize: Number(matrixSize),
        topSize: Number(topSize),
        mutationRate: Number(mutationRate),
        populationSize: Number(populationSize),
    }
    console.log(config)
    g = new Genetic(config);
    const solution = g.findSolution()
    console.log(solution);
    res.json(solution)
})

app.get('/findHillClimbingSolution', async (req, res) => {
    const {matrixSize} = req.query;
    console.log(matrixSize)
    const solution = solveWithHillClimbing(matrixSize);
    res.json({solution})
})
app.get('/findHillClimbingSolution2', async (req, res) => {
    const {matrixSize} = req.query;
    console.log(matrixSize)
    const solution = solveWithHillClimbing2(matrixSize);
    res.json({solution})
})

app.listen(7000);

