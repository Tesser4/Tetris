function keyboardControl(evt) {
  switch (evt.keyCode) {
    case 37:
      tetris.state.currentBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      tetris.state.currentBrick.rotate()
      dropStart = Date.now()
      break
    case 39:
      tetris.state.currentBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      tetris.state.currentBrick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', keyboardControl)

function buttonControl(evt) {
  if (evt.target.nodeName !== 'BUTTON') return

  switch (evt.target.id) {
    case 'pauseButton':
      tetris.buttons.togglePause()
      break
    case 'newGameButton':
      tetris.buttons.pauseButton.disabled = false
      tetris.buttons.newGameButton.disabled = true
      tetris.buttons.resetHSButton.disabled = true
      play()
      break
    case 'resetHSButton':
      tetris.state.score.resetHighScore()
      tetris.html.highScoreElement.innerHTML = tetris.state.score.getHighScore()
      break
  }
}
document.addEventListener('click', buttonControl)

let dropStart = Date.now()

function play() {
  tetris.state.currentBrick.draw()
  tetris.state.nextBrick.draw()

  let now = Date.now()
  let delta = now - dropStart

  if (delta > tetris.state.interval && !tetris.state.isPaused) {
    dropStart = Date.now()
    let locked = tetris.state.currentBrick.moveDown()

    if (locked) {
      tetris.state.isOver = tetris.state.currentBrick.lock()

      tetris.state.nextBrick.undraw()
      tetris.state.currentBrick = tetris.state.nextBrick
      tetris.state.currentBrick.y = 3
      tetris.state.currentBrick.board = tetris.boards[0]
      tetris.state.nextBrick = getRandomBrick(tetris.boards[1], 0, 0)

      while (tetris.boards[0].hasFullRow()) {
        tetris.boards[0].deleteRow(tetris.boards[0].hasFullRow())

        let levelChanged = tetris.state.score.increasePoints()
        if (levelChanged) {
          tetris.state.interval = tetris.state.interval === 100
            ? tetris.state.interval
            : tetris.state.interval - 100
          tetris.html.levelElement.innerHTML = tetris.state.score.getLevel()
        }

        tetris.html.scoreElement.innerHTML = tetris.state.score.getPoints()
      }

      tetris.boards.forEach(x => x.draw())
      // tetris.state.currentBrick.draw()
      tetris.state.nextBrick.draw()
    }
  }

  if (tetris.state.isOver) {
    tetris.state.currentBrick.draw()

    tetris.buttons.pauseButton.disabled = true
    tetris.buttons.newGameButton.disabled = false
    tetris.buttons.resetHSButton.disabled = false

    document.removeEventListener('keydown', keyboardControl)

    if (tetris.state.score.getHighScore() < tetris.state.score.getPoints()) {
      tetris.state.score.setHighScore(tetris.state.score.getPoints())
      tetris.html.highScoreElement.innerHTML = tetris.state.score.getHighScore()
    }

    alert('Game Over')
  } else {
    requestAnimationFrame(play)
  }
}
