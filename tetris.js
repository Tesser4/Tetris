const tetrisAPI = (function() {

  const canvasMain = document.querySelector('#tetris')
  const ctxMain = canvasMain.getContext('2d')
  const canvasNext = document.querySelector('#nextbrick')
  const ctxNext = canvasNext.getContext('2d')
  const scoreElement = document.querySelector('#score')
  const levelElement = document.querySelector('#level')
  const highScoreElement = document.querySelector('#highScore')

  const html = {
    scoreElement,
    levelElement,
    highScoreElement
  }

  const params = {
    rowsMain: 20,
    columnsMain: 10,
    rowsNext: 4,
    columnsNext: 4,
    squareSize: 30,
    emptySquare: 'white'
  }

  const boards = []

  boards.push(getBoard(
    params.rowsMain,
    params.columnsMain,
    params.squareSize,
    params.emptySquare,
    ctxMain
  ))

  boards.push(getBoard(
    params.rowsNext,
    params.columnsNext,
    params.squareSize,
    params.emptySquare,
    ctxNext
  ))

  const state = {
    interval: 500,
    isOver: false,
    currentBrick: null,
    nextBrick: null,
    score: null
  }

  state.currentBrick = getRandomBrick(boards[0], 0, 3)
  state.nextBrick = getRandomBrick(boards[1], 0, 0)
  state.score = getScoreManager()
  highScoreElement.innerHTML = state.score.getHighScore()

  boards.forEach(x => x.draw())
  state.currentBrick.draw()
  state.nextBrick.draw()

  return {
    html,
    params,
    boards,
    state
  }

})()
