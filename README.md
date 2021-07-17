# Installation 
In root directory:
1. run `npm install`
2. run `npm start`
this will start the backend
   
In the frontend directory:
1. run `npm install`,
2. run `npm start`,
This will start the frontend
   
## Code descriptions
All process of the genetic algorithm and generating solution is implemented in these two files:
- `core/Solution.js`
- `core/Genetic.js`

### Solution.js
This is a data structure for storing a sample solution for our problem.
It has some methods like:
- fitness: This method calculates the fitness of the solution. the fitness is calculated by counting the number of filled cells in the matrix. more fill is more fit.
- crossoverWith: This is to generate a new child from two parents. child can be better or worse than its parents, or it can be same as its parents.
- mutate: Receives a probability (0 to 100) as its input argument and according to it, makes/does not make a mutation in the child.
- ...

### Genetic.js
This class is to implement a complete process of genetic algorithm.
it works as described below:

let's imagine we have this configuration: 
```JAVASCRIPT
const config = {
    matrixSize: 5,
    topSize: 200,
    mutationRate: 2,
    populationSize: 1000
}
```
1. The code generates a population of 1000 random solutions.

    each solution is made of `U, R, D, L` characters and each solution's length is matrixSize * matrixSize - 1 (why?)
    because we need `n * n - 1` moves to fill a `n * n` matrix.
   
2. Top 200 solutions (according to their fitness) are selected.
3. Now it's time to generate the second generation.
    
    1000 new children are created in the process of crossover.
    parents are selected randomly and each child mutates by probability of 2%.
   
4. Now we have generated the second generation, and the code is going to repeat this steps from 1 to 4 until it finds a solution with needed fitness, or it reaches a limit and restarts the algorithm with a new bunch of population.