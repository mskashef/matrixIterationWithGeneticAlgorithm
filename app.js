const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const {getChild, getChildMatrix} = require('./functions');
const {Genetic} = require('./core/Genetic');
const {Solution} = require('./core/Solution');

let matrixSize = 10;
let topSize = 20000;
let mutationRate = 2;
let populationSize = 1_000;

/**
 * @param {string} x parent 1
 * @param {string} y parent 2
 * @returns {string} child
 */
function crossover(x, y) {
    const childMatrix = getChildMatrix(x, y, matrixSize);
    let child = getChild(childMatrix);
    child = child + generateRandomPath(matrixSize * matrixSize - 1 - child.length)
    return child;
}

/**
 * @param {string} child
 * @param {number} probability
 * @returns {string} child
 */
function mutate(child, probability) {
    if (Math.floor(Math.random() * 100) > probability) return child;
    let i = Math.floor(Math.random() * child.length);
    let otherDirections = ['R', 'L', 'U', 'D'].filter(
        (x) => x !== child.charAt(i)
    );
    let pathArray = [...child.split('')];
    pathArray[i] =
        otherDirections[Math.floor(Math.random() * otherDirections.length)];
    return pathArray.join('');
}

/**
 * @param {string} path the path
 * @returns {number} fitness
 */
function fitness(path) {
    let pos = {x: 0, y: matrixSize - 1};
    let mat = JSON.parse(
        JSON.stringify(Array(matrixSize).fill(Array(matrixSize).fill(0)))
    );
    mat[matrixSize - 1][0] = 1;
    for (let i = 0; i < path.length; i++) {
        let cur = path.charAt(i);
        let {x, y} = pos;
        let newPosition;
        switch (cur) {
            case 'L':
                newPosition = {x: x - 1, y: y};
                break;
            case 'R':
                newPosition = {x: x + 1, y: y};
                break;
            case 'U':
                newPosition = {x: x, y: y - 1};
                break;
            case 'D':
                newPosition = {x: x, y: y + 1};
                break;
        }
        if (
            newPosition.x < 0 ||
            newPosition.x >= matrixSize ||
            newPosition.y < 0 ||
            newPosition.y >= matrixSize
        ) {
            pos = newPosition;
            continue;
        }
        pos = newPosition;
        mat[newPosition.y][newPosition.x] = 1;
    }
    let f = 0;
    for (const row of mat) {
        for (const cell of row) {
            if (cell === 1) f++;
        }
    }
    return f;
}

/**
 * @param {array} children
 * @returns {array} 100 best children
 */
function findBests(children) {
    return children
        .sort(function (a, b) {
            let fitnessA = fitness(a);
            let fitnessB = fitness(b);
            if (fitnessA > fitnessB) return 1;
            if (fitnessA === fitnessB) return 0;
            return -1;
        })
        .slice(-topSize);
}

function generateRandomPath(length) {
    let path = '';
    const dirs = ['R', 'L', 'U', 'D'];
    for (let i = 0; i < length; i++) {
        path += dirs[Math.floor(Math.random() * dirs.length)];
    }
    return path;
}

function generateRandomPopulation(populationSize, matrixSize) {
    let res = [];
    for (let i = 0; i < populationSize; i++) {
        res.push(generateRandomPath(matrixSize * matrixSize - 1));
    }
    return res;
}

let limit = 0;

function genetic(population) {
    const bestPopulation = findBests(population);
    for (const person of bestPopulation) {
        if (fitness(person) === matrixSize * matrixSize) {
            console.log('gen:', limit);
            console.log(person);
            return 1;
        }
    }
    limit++;
    if (limit > 50000) {
        limit = 0;
        return generateRandomPopulation(populationSize, matrixSize);
    }
    console.log('generation: ', limit);
    const newPopulation = new Set();
    while (newPopulation.size < population.length) {
        let x = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
        let y = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
        let child = crossover(x, y);
        child = mutate(child, mutationRate);
        newPopulation.add(child);
    }
    return [...newPopulation];
}

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

app.listen(7000);

