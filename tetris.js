const canvas = document.querySelector('#tetris')
const ctx = canvas.getContext('2d')

const ROW = 20
const COL = 10
const SQ = squareSize = 20
const VACANT = 'white'


function drawSquare(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ)
  
  ctx.strokeStyle = 'black'
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ)
}
