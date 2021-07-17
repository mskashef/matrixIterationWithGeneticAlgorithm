const {Solution} = require('./Solution');

class Genetic {
    matrixSize;
    topSize;
    mutationRate;
    populationSize;
    #limit = 0;
    #gen;
    get generation() {
        return this.#gen
    }
    constructor(config) {
        this.matrixSize = config.matrixSize;
        this.topSize = config.topSize;
        this.mutationRate = config.mutationRate;
        this.populationSize = config.populationSize;
    }

    #generateRandomPopulation() {
        let res = [];
        for (let i = 0; i < this.populationSize; i++) {
            res.push(new Solution(this.matrixSize));
        }
        return res;
    }

    findBests(children) {
        return children
            .sort(function (a, b) {
                let fitnessA = a.fitness;
                let fitnessB = b.fitness;
                if (fitnessA > fitnessB) return 1;
                if (fitnessA === fitnessB) return 0;
                return -1;
            })
            .slice(-this.topSize);
    }

    gen(population) {
        const bestPopulation = this.findBests(population);
        for (const person of bestPopulation) {
            if (person.fitness === this.matrixSize * this.matrixSize) {
                return person.path;
            }
        }
        const newPopulation = [];
        while (newPopulation.length < population.length) {
            let x = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
            let y = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
            let child = x.crossoverWith(y);
            child = child.mutate(this.mutationRate);
            newPopulation.push(child);
        }
        return newPopulation;
    }

    findSolution() {
        let population = this.#generateRandomPopulation();

        while (true) {
            this.#gen = this.#limit++;
            console.log('gen:', this.#gen)
            if (this.#limit > 50000) {
                this.#limit = 0;
                population = this.#generateRandomPopulation();
            }

            population = this.gen(population);
            if (typeof population === 'string') break;
        }
        const gen = this.#gen;
        this.#gen = 0;
        return {solution: population, generation: gen}; // solution
    }
}

module.exports = {Genetic};