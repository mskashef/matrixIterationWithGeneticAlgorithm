function getCopyOfMatrix(mat) {
    return mat.map(row => row.map(col => col))
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

module.exports = {getCopyOfMatrix}