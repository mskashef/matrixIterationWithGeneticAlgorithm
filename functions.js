function getCopyOfMatrix(mat) {
    return mat.map(row => row.map(col => col))
}

/**
 * @param {string} a
 * @returns {string}
 */
function max(...a) {
    let maxStr = a[0];
    for (let i = 1; i < a.length; i++) {
        if (a[i].length > maxStr.length)
            maxStr = a[i];
    }
    return maxStr;
}

/**
 * @param {array[]} matrix
 * @param {number} i
 * @param {number} j
 * @returns {any} fitness
 */
function getLP(matrix, i = 0, j = 0) {
    const mat = getCopyOfMatrix(matrix);
    mat[i][j] = 0;
    const neighbours = [
        [i, j + 1, 'R'],
        [i - 1, j, 'U'],
        [i, j - 1, 'L'],
        [i + 1, j, 'D'],
    ].filter(pos => (
        pos[0] < mat.length && pos[0] >= 0) &&
        (pos[1] < mat.length && pos[1] >= 0) &&
        mat[pos[0]][pos[1]] === 1
    )

    if (neighbours.length === 0) return '';

    // const randomIndex = Math.floor(Math.random() * neighbours.length);
    const randomIndex = 0;
    return neighbours[randomIndex][2] + getLP(mat, neighbours[randomIndex][0], neighbours[randomIndex][1]);
}

// function getLP(matrix, i = 0, j = 0) {
//     const mat = getCopyOfMatrix(matrix);
//     mat[i][j] = 0;
//     const neighbours = [
//         [i - 1, j, 'U'],
//         [i + 1, j, 'D'],
//         [i, j - 1, 'L'],
//         [i, j + 1, 'R'],
//     ].filter(pos => (
//         pos[0] < mat.length && pos[0] >= 0) &&
//         (pos[1] < mat.length && pos[1] >= 0) &&
//         mat[pos[0]][pos[1]] === 1
//     );
//
//     if (neighbours.length === 0) return '';
//     const moves = [];
//
//     for (const neighbour of neighbours) {
//         moves.push(neighbour[i] + getLP(mat, neighbour[0], neighbour[1]))
//     }
//
//     return max(...moves);
// }
function getChild(matrix) {
    return getLP(matrix, matrix.length - 1, 0);
}

function showPathInMatrix(path, mat, matrixSize) {
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
/**
 * @param {string} path1
 * @param {string} path2
 * @param {number} matrixSize
 * @returns {array[]}
 */
function getChildMatrix(path1, path2, matrixSize) {
    let mat = JSON.parse(
        JSON.stringify(Array(matrixSize).fill(Array(matrixSize).fill(0)))
    );
    showPathInMatrix(path1, mat, matrixSize);
    showPathInMatrix(path2, mat, matrixSize);
    return mat;
}


module.exports = {getChild, getChildMatrix, getCopyOfMatrix}