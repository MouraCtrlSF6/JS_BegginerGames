const game = new Game({ order: 3 })
const playerScore = { X: 0, O: 0 }
let turnMonitor = 0
let cells = document.querySelectorAll('.data')
function setEvents(){
  cells.forEach(cell => 
    cell.addEventListener('click', () => setPosition(cell.id))
  )
} 
function setPosition(cell){
  if(!game.endGame()){
    const players = ['X', 'O']
    const { validSet } = game.fillPosition(players[turnMonitor], cell)
    const gameResult = game.endGame()

    if(gameResult === 'draw') game.updateWinnerDisplay(null, 'draw')
    else if(gameResult){
      game.updateWinnerDisplay(players[turnMonitor], true)
      playerScore[players[turnMonitor]]++;
    }
    else {
      if (validSet) turnMonitor = turnMonitor ? 0 : 1 
      game.updateWinnerDisplay(players[turnMonitor] , false)
    }
  } else ending()
}
function ending(){
  game.render(playerScore.X, playerScore.O, 'X', null)
  turnMonitor = 0
  cells = document.querySelectorAll('.data')
  setEvents()
} setEvents()