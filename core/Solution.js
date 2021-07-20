const {getCopyOfMatrix} = require('../functions');
const selectRandomly = true;

class Solution {
    #path
    #matrixSize

    constructor(matrixSize, path = null) {
        this.#matrixSize = matrixSize;
        if (path === null) {
            this.initializeRandomly()
        } else {
            this.#path = path
        }
    }

    get fitness() {
        const matrixSize = this.#matrixSize;
        const path = this.#path;
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

    initializeRandomly() {
        this.#path = this.generateRandomPath(this.#matrixSize * this.#matrixSize - 1)
    }

    showPathInMatrix(path, mat) {
        let matrixSize = this.#matrixSize;
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

    getChildMatrix(path1, path2) {
        let matrixSize = this.#matrixSize;
        let mat = JSON.parse(
            JSON.stringify(Array(matrixSize).fill(Array(matrixSize).fill(0)))
        );
        this.showPathInMatrix(path1, mat, matrixSize);
        this.showPathInMatrix(path2, mat, matrixSize);
        return mat;
    }

    crossoverWith(parent) {
        let matrixSize = this.#matrixSize;
        const childMatrix = this.getChildMatrix(this.#path, parent.#path);
        let child = this.getChild(childMatrix);
        child = child + this.generateRandomPath(matrixSize * matrixSize - 1 - child.length)
        return new Solution(this.#matrixSize, child);
    }

    getLP(matrix, i = 0, j = 0) {
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
        // --------------------------------------
        let randomIndex;
        if (selectRandomly)
            randomIndex = Math.floor(Math.random() * neighbours.length);
        else
            randomIndex = 0;
        // --------------------------------------
        return neighbours[randomIndex][2] + this.getLP(mat, neighbours[randomIndex][0], neighbours[randomIndex][1]);
    }

    getChild(matrix) {
        return this.getLP(matrix, matrix.length - 1, 0);
    }

    mutate(probability) {
        const child = this.#path;
        if (Math.floor(Math.random() * 100) > probability) return new Solution(this.#matrixSize, child);
        let i = Math.floor(Math.random() * child.length);
        let otherDirections = ['R', 'L', 'U', 'D'].filter(
            (x) => x !== child.charAt(i)
        );
        let pathArray = [...child.split('')];
        pathArray[i] =
            otherDirections[Math.floor(Math.random() * otherDirections.length)];
        return new Solution(this.#matrixSize, pathArray.join(''));
    }

    generateRandomPath = (length = this.#matrixSize * this.#matrixSize - 1) => {
        let path = '';
        const dirs = ['R', 'L', 'U', 'D'];
        for (let i = 0; i < length; i++) {
            path += dirs[Math.floor(Math.random() * dirs.length)];
        }
        return path;
    }

    get path() {
        return this.#path
    }
}

module.exports = {Solution};