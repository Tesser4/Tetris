function getBoard(rows, columns, squareSize, emptySquare, ctx) {
  
  let board = []
  for (let i = 0; i < rows * columns; i++) {
      board[i] = emptySquare
  }

  function parseCoords(...coords) {
    return Number(coords.join(''))
  }

  function getRows() {
    return rows
  }

  function getColumns() {
    return columns
  }

  function isSquareEmpty(x, y) {
    return board[parseCoords(x, y)] === emptySquare
  }

  function setSquare(x, y, color) {
    board[parseCoords(x, y)] = color
  }

  function drawSquare(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(y * squareSize, x * squareSize, squareSize, squareSize)

    ctx.strokeStyle = 'black'
    ctx.strokeRect(y * squareSize, x * squareSize, squareSize, squareSize)
  }

  function undrawSquare(x, y) {
    ctx.fillStyle = emptySquare
    ctx.fillRect(y * squareSize, x * squareSize, squareSize, squareSize)

    ctx.strokeStyle = 'black'
    ctx.strokeRect(y * squareSize, x * squareSize, squareSize, squareSize)
  }

  function draw() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        drawSquare(r, c, board[parseCoords(r, c)])
      }
    }
  }

  function hasFullRow() {
    let fullRow = null

    for (let i = 0; i < rows; i++) {
      let row = board.slice(i * columns, i * columns + columns)
      if (row.every(x => x !== emptySquare)) fullRow = i
    }

    return fullRow
  }

  function deleteRow(row) {
    for (let x = row * columns + columns - 1; x >= 0; x--) {
      x < columns
        ? board[x] = emptySquare
        : board[x] = board[x - columns]
    }
  }

  function logme() {
    board.forEach((row, i) => console.log(`${i}: ${row}`))
  }

  return {
    getRows,
    getColumns,
    isSquareEmpty,
    setSquare,
    drawSquare,
    undrawSquare,
    draw,
    hasFullRow,
    deleteRow,
    logme
  }
}
