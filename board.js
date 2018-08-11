function getBoard(rows, columns, squareSize, emptySquare) {
  
  let board = []
  for (let r = 0; r < rows; r++) {
    board[r] = []
    for (let c = 0; c < columns; c++) {
      board[r][c] = emptySquare
    }
  }

  function isSquareEmpty(x, y) {
    return board[x][y] === emptySquare
  }

  function setSquare(x, y, color) {
    board[x][y] = color
  }
  
  function drawSquare(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(y * squareSize, x * squareSize, squareSize, squareSize)
  
    ctx.strokeStyle = 'black'
    ctx.strokeRect(y * squareSize, x * squareSize, squareSize, squareSize)
  }

  function drawBoard() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        drawSquare(r, c, board[r][c])
      }
    }
  }

  function hasFullRow() {
    let fullLine = null
    board.forEach((line, i) => {
      if (line.every(x => x !== emptySquare)) {
        fullLine = i
      }
    })
    return fullLine
  }

  function deleteRow(row) {
    for (let x = row; x >= 0; x--) {
      x === 0
        ? board[x].fill(emptySquare)
        : board[x] = board[x - 1]
    }
  }

  function logme() {
    board.forEach((row, i) => console.log(`${i}: ${row}`))
  }

  return {
    isSquareEmpty,
    setSquare,
    drawSquare,
    draw: drawBoard,
    hasFullRow,
    deleteRow,
    logme
  }
}






