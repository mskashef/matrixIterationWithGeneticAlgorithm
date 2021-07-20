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

const hillClimbing = () => {
    const mat = createEmptyMatrix();
    let path = '';
    let i = mat.length - 1;
    let j = 0;
    mat[i][j] = 1;
    while (true) {
        const neighbours = [
            [i - 1, j, 'U'],
            [i + 1, j, 'D'],
            [i, j + 1, 'R'],
            [i, j - 1, 'L'],
        ].filter(pos => (
            pos[0] < mat.length && pos[0] >= 0) &&
            (pos[1] < mat.length && pos[1] >= 0) &&
            mat[pos[0]][pos[1]] === 0
        );
        if (neighbours.length === 0) break;
        const newCell = neighbours[Math.floor(Math.random() * neighbours.length)];
        i = newCell[0];
        j = newCell[1];
        mat[i][j] = 1;
        path += newCell[2];
    }
    return path;
}
const solveWithHillClimbing = (ms) => {
    matrixSize = ms;
    return hillClimbing();
}

module.exports.solveWithHillClimbing2 = solveWithHillClimbing;