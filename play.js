function keyboardControl(evt) {
  switch (evt.keyCode) {
    case 37:
      tetrisAPI.state.currentBrick.moveLeft()
      dropStart = Date.now()
      break
    case 38:
      tetrisAPI.state.currentBrick.rotate()
      dropStart = Date.now()
      break
    case 39:
      tetrisAPI.state.currentBrick.moveRight()
      dropStart = Date.now()
      break
    case 40:
      tetrisAPI.state.currentBrick.moveDown()
      dropStart = Date.now()
      break
  }
}
document.addEventListener('keydown', keyboardControl)

function buttonControl(evt) {
  if (evt.target.nodeName !== 'BUTTON') return

  switch (evt.target.id) {
    case 'pauseButton':
      tetrisAPI.buttons.togglePause()
      break
    case 'newGameButton':
      tetrisAPI.buttons.pauseButton.disabled = false
      tetrisAPI.buttons.newGameButton.disabled = true
      tetrisAPI.buttons.resetHSButton.disabled = true
      play()
      break
    case 'resetHSButton':
      tetrisAPI.state.score.resetHighScore()
      tetrisAPI.html.highScoreElement.innerHTML = tetrisAPI.state.score.getHighScore()
      break
  }
}
document.addEventListener('click', buttonControl)

let dropStart = Date.now()

function play() {
  tetrisAPI.state.currentBrick.draw()
  tetrisAPI.state.nextBrick.draw()

  let now = Date.now()
  let delta = now - dropStart

  if (delta > tetrisAPI.state.interval && !tetrisAPI.state.isPaused) {
    dropStart = Date.now()
    let locked = tetrisAPI.state.currentBrick.moveDown()

    if (locked) {
      tetrisAPI.state.isOver = tetrisAPI.state.currentBrick.lock()

      tetrisAPI.state.nextBrick.undraw()
      tetrisAPI.state.currentBrick = tetrisAPI.state.nextBrick
      tetrisAPI.state.currentBrick.y = 3
      tetrisAPI.state.currentBrick.board = tetrisAPI.boards[0]
      tetrisAPI.state.nextBrick = getRandomBrick(tetrisAPI.boards[1], 0, 0)

      while (tetrisAPI.boards[0].hasFullRow()) {
        tetrisAPI.boards[0].deleteRow(tetrisAPI.boards[0].hasFullRow())

        let levelChanged = tetrisAPI.state.score.increasePoints()
        if (levelChanged) {
          tetrisAPI.state.interval = tetrisAPI.state.interval === 100
            ? tetrisAPI.state.interval
            : tetrisAPI.state.interval - 100
          tetrisAPI.html.levelElement.innerHTML = tetrisAPI.state.score.getLevel()
        }

        tetrisAPI.html.scoreElement.innerHTML = tetrisAPI.state.score.getPoints()
      }

      tetrisAPI.boards.forEach(x => x.draw())
      // tetrisAPI.state.currentBrick.draw()
      tetrisAPI.state.nextBrick.draw()
    }
  }

  if (tetrisAPI.state.isOver) {
    tetrisAPI.state.currentBrick.draw()

    tetrisAPI.buttons.pauseButton.disabled = true
    tetrisAPI.buttons.newGameButton.disabled = false
    tetrisAPI.buttons.resetHSButton.disabled = false

    document.removeEventListener('keydown', keyboardControl)

    if (tetrisAPI.state.score.getHighScore() < tetrisAPI.state.score.getPoints()) {
      tetrisAPI.state.score.setHighScore(tetrisAPI.state.score.getPoints())
      tetrisAPI.html.highScoreElement.innerHTML = tetrisAPI.state.score.getHighScore()
    }

    alert('Game Over')
  } else {
    requestAnimationFrame(play)
  }
}
