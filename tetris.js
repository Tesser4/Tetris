const canvasMain = document.querySelector('#tetris')
const ctxMain = canvasMain.getContext('2d')
const canvasNext = document.querySelector('#nextbrick')
const ctxNext = canvasNext.getContext('2d')
const scoreElement = document.querySelector('#score')
const levelElement = document.querySelector('#level')
const highScoreElement = document.querySelector('#highScore')

const gameParams = {
  rowsMain: 20,
  columnsMain: 10,
  rowsNext: 4,
  columnsNext: 4,
  squareSize: 30,
  emptySquare: 'white'
}  

const boards = []

boards.push(getBoard(
  gameParams.rowsMain,
  gameParams.columnsMain,
  gameParams.squareSize,
  gameParams.emptySquare,
  ctxMain
))

boards.push(getBoard(
  gameParams.rowsNext,
  gameParams.columnsNext,
  gameParams.squareSize,
  gameParams.emptySquare,
  ctxNext
))

const gameState = {
  interval: 500,
  isOver: false,
  currentBrick: null,
  nextBrick: null,
  score: null
}  

gameState.currentBrick = getRandomBrick(boards[0], 0, 3)
gameState.nextBrick = getRandomBrick(boards[1], 0, 0)
gameState.score = getScoreManager()
highScoreElement.innerHTML = gameState.score.getHighScore()

boards.forEach(x => x.draw())
gameState.currentBrick.draw()
gameState.nextBrick.draw()

function control(evt) {
  switch (evt.keyCode) {
    case 37:
      gameState.currentBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:  
      gameState.currentBrick.rotate()
      dropStart = Date.now()
      break
    case 39:  
      gameState.currentBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:  
      gameState.currentBrick.moveDown()
      dropStart = Date.now()
      break
  }    
}  
document.addEventListener('keydown', control)

let dropStart = Date.now()
;(function play() {
  let now = Date.now()
  let delta = now - dropStart

  if (delta > gameState.interval) {
    dropStart = Date.now()
    let locked = gameState.currentBrick.moveDown()

    if (locked) {
      gameState.isOver = gameState.currentBrick.lock()

      gameState.nextBrick.undraw()
      gameState.currentBrick = gameState.nextBrick
      gameState.currentBrick.y = 3
      gameState.currentBrick.board = boards[0]
      gameState.currentBrick.draw()
      gameState.nextBrick = getRandomBrick(boards[1], 0, 0)
      
      while (boards[0].hasFullRow()) {
        boards[0].deleteRow(boards[0].hasFullRow())

        let levelChanged = gameState.score.increasePoints()
        if (levelChanged) {
          gameState.interval = gameState.interval === 100
            ? gameState.interval
            : gameState.interval - 100
          levelElement.innerHTML = gameState.score.getLevel()
        }

        scoreElement.innerHTML = gameState.score.getPoints()
      }

      boards.forEach(x => x.draw())
      gameState.currentBrick.draw()
      gameState.nextBrick.draw()
    }
  }

  if (gameState.isOver) {
    document.removeEventListener('keydown', control)

    if (gameState.score.getHighScore() < gameState.score.getPoints()) {
      gameState.score.setHighScore(gameState.score.getPoints())
      highScoreElement.innerHTML = gameState.score.getHighScore()
    }

    alert('Game Over')
  } else {
    requestAnimationFrame(play)
  }

})()
