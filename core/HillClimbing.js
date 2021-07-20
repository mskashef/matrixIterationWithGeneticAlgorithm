let matrixSize = 10;
let maxLimit = 200000 * 10;
const getNeighboursFunction = 2;
const selectRandomly = true;
const createEmptyMatrix = () => {
    let mat = [];
    for (let i = 0; i < matrixSize; i++) {
        mat[i] = [];
        for (let j = 0; j < matrixSize; j++)
            mat[i].push(0);
    }
    return mat;
}
const fitness = (path) => {
    let pos = {x: 0, y: matrixSize - 1};
    let mat = createEmptyMatrix();
    mat[matrixSize - 1][0] = 1;
    for (let i = 0; i < path.length; i++) {
        let cur = path[i];
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

const generateRandomPath = (length) => {
    let path = '';
    const dirs = ['R', 'L', 'U', 'D'];
    for (let i = 0; i < length; i++) {
        path += dirs[Math.floor(Math.random() * dirs.length)];
    }
    return path;
}

const getNeighbours = (node) => {
    let neighbours = [];
    let n = Math.floor(Math.random() * node.length);
    let cur = node;
    for (let i = 0; i < 1000; i++) {
        for (let i = 0; i < n; i++) {
            let randomIndex = Math.floor(Math.random() * cur.length);
            const dirs = ['R', 'L', 'U', 'D'].filter(x => cur.charAt(randomIndex) !== x);
            let charArr = cur.split('');
            charArr[randomIndex] = dirs[Math.floor(Math.random() * dirs.length)];
            cur = charArr.join('');
        }
        neighbours.push(cur);
    }
    return neighbours;
}

function showPathInMatrix(path, mat) {
    let pos = {x: 0, y: matrixSize - 1};
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
}

function getMatrix(path) {
    let mat = createEmptyMatrix();
    showPathInMatrix(path, mat);
    return mat;
}

function getCopyOfMatrix(mat) {
    return mat.map(row => row.map(col => col))
}

function getNeighboursOf(path) {
    if (getNeighboursFunction === 1)
        return getNeighbours(path);
    const matrix = getMatrix(path);
    let neighbours = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                const neighbour = getCopyOfMatrix(matrix);
                neighbour[i][j] = 1;
                neighbours.push(getChild(neighbour));
            }
        }
    }
    return neighbours.map(neighbour => neighbour + generateRandomPath(matrixSize * matrixSize - 1 - neighbour.length));
}

function getLP(matrix, i = 0, j = 0) {
    const mat = getCopyOfMatrix(matrix);
    mat[i][j] = 0;
    const neighbours = [
        [i - 1, j, 'U'],
        [i + 1, j, 'D'],
        [i, j + 1, 'R'],
        [i, j - 1, 'L'],
    ].filter(pos => (
        pos[0] < mat.length && pos[0] >= 0) &&
        (pos[1] < mat.length && pos[1] >= 0) &&
        mat[pos[0]][pos[1]] === 1
    )

    if (neighbours.length === 0) return '';
    // ---------------------------------------------
    let randomIndex;
    if (selectRandomly)
        randomIndex = Math.floor(Math.random() * neighbours.length);
    else
        randomIndex = 0;
    // ---------------------------------------------
    return neighbours[randomIndex][2] + getLP(mat, neighbours[randomIndex][0], neighbours[randomIndex][1]);
}

function getChild(matrix) {
    return getLP(matrix, matrix.length - 1, 0);
}

let limit = 0;
const hillClimbing = () => {
    let current = generateRandomPath(matrixSize * matrixSize - 1);
    while (true) {
        if (fitness(current) === matrixSize * matrixSize) {
            console.log('Found: ', current);
            return current;
        }
        const neighbours = getNeighboursOf(current);
        let maxFitness = 0;
        let maxFitNeighbour = current;
        let isLocalMaximum = true;
        for (const neighbour of neighbours) {
            const currentFitness = fitness(neighbour);
            if (currentFitness >= maxFitness) {
                maxFitness = currentFitness;
                maxFitNeighbour = neighbour;
                isLocalMaximum = false;
            }
        }
        if (isLocalMaximum) {
            console.log('LOCAL MAX :(')
            return;
        }
        limit++;
        current = maxFitNeighbour;
        if (limit > maxLimit) {
            console.log('Not Found!!!!!!\nRestarting');
            console.log(current, fitness(current))
            current = generateRandomPath(matrixSize * matrixSize - 1);
            // return;
            limit = 0;
            return hillClimbing()
        }
    }
}
const solveWithHillClimbing = (ms) => {
    matrixSize = ms;
    return hillClimbing();
}

module.exports.solveWithHillClimbing = solveWithHillClimbing;