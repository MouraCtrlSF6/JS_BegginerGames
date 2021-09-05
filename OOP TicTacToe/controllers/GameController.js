class Game {
  constructor({ order }){
    this.width = order;
    this.height = order;
    this.render( 0, 0, 'X')
  }
  render(playerXScore, playerOScore, turnPlayer){
    try {
      this._resetDocument()
      if(this.width !== this.height) throw new Error('Width and height must be the same!')
      const body = document.querySelector('body');
      const template = document.createElement('div')
      const tableBlock = document.createElement('div')
      const table = document.createElement('table');
      const scoreBlock = document.createElement('div')
      const scoreContainer = document.createElement('div') 
      const scoreDisplay = document.createElement('div') 
      const scoreHeader = document.createElement('div')
      const playerX = document.createElement('span')
      const playerO = document.createElement('span')
      const separator = document.createElement('span')
      const winnerBlock = document.createElement('div')
      const winnerContainer = document.createElement('div')
      const winnerText = document.createElement('span')
      let tr, td = null

      body.setAttribute('class', 'background')
      template.setAttribute('class', 'template')
      tableBlock.setAttribute('class', 'table_block')
      table.setAttribute('class', 'table')

      for(let lines = 0; lines < this.height; lines++){
        tr = document.createElement('tr')
        tr.setAttribute('class', 'row')
        tr.setAttribute('id', `row_${lines}`)
        if(lines < this.height - 1) 
          tr.style.borderBottom = '2px solid aliceblue'
        for(let columns = 0; columns < this.width; columns++){
          td = document.createElement('td')
          td.setAttribute('class', 'data')
          td.setAttribute('id', `data_${columns+(lines*this.height)}`)
          if(columns < this.width - 1) 
            td.style.borderRight = '2.5px solid aliceblue'
          tr.appendChild(td)
        }
        table.appendChild(tr)
      }
      tableBlock.appendChild(table)
      winnerBlock.setAttribute('class', 'winner_block')
      winnerContainer.setAttribute('class', 'winner_container')
      winnerText.setAttribute('class', 'winner_text')
      winnerText.innerHTML = 'Vez do jogador '
      winnerText.appendChild(this._generateIcon(turnPlayer, true))
      winnerContainer.appendChild(winnerText)
      winnerBlock.appendChild(winnerContainer)
      scoreBlock.setAttribute('class', 'score_block')
      scoreContainer.setAttribute('class', 'score_container')
      scoreHeader.setAttribute('class', 'score_header')
      scoreDisplay.setAttribute('class', 'score_display')
      playerX.setAttribute('class', 'player_X')
      separator.setAttribute('class', 'separator')
      playerO.setAttribute('class', 'player_O')
      playerX.innerHTML= `${playerXScore} `
      separator.innerHTML = ' - '
      playerO.innerHTML = ` ${playerOScore}`
      scoreDisplay.appendChild(playerX)
      scoreDisplay.appendChild(separator)
      scoreDisplay.appendChild(playerO)
      scoreHeader.innerHTML = 'Placar de partidas'
      scoreContainer.appendChild(scoreHeader)
      scoreContainer.appendChild(scoreDisplay)
      scoreBlock.appendChild(scoreContainer)
      template.appendChild(tableBlock)
      template.appendChild(winnerBlock)
      template.appendChild(scoreBlock)
      body.appendChild(template)

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
  updateWinnerDisplay(turnPlayer, winner){
    const winnerText = document.querySelector('.winner_text')
    winnerText.innerHTML = '';
    if(winner === 'draw'){
      winnerText.appendChild(this._generateIcon('X', true))
      winnerText.innerHTML += ' EMPATE '
      winnerText.appendChild(this._generateIcon('O', true))
    }
    else if (winner) {
      winnerText.appendChild(this._generateIcon(turnPlayer, true))
      winnerText.innerHTML += ' VENCEU!'
    }
    else {
      winnerText.innerHTML = 'Vez do jogador '
      winnerText.appendChild(this._generateIcon(turnPlayer, true))
    }
  }
  _generateIcon(player, winnerDisplay){
    const newIcon = document.createElement('img')
    if(winnerDisplay)
      newIcon.setAttribute('class', 'winnerDisplayIcon')
    else 
    newIcon.setAttribute('class', 'playerIcon')
    newIcon.src = `./images/${player}.png` 
    newIcon.alt = `player_${player}.png`
    return newIcon
  }
  fillPosition(player, cellId){
    const cell = document.getElementById(cellId)
    let playerIcon = null
    if(!cell.innerHTML){
      playerIcon = this._generateIcon(player, false)
      cell.appendChild(playerIcon)
      return { validSet: true }
    }
    return { validSet: false }
  }
  _resetDocument(){
    const body = document.querySelector('body')
    body.innerHTML = ''
  }
  _findLineResults(cells){
    const lineWinningCase = []
    let lineCells = []

    for(let lines = 0; lines < this.height; lines ++){
      for (let columns = 0; columns < this.width; columns ++){
        let index = lines*this.height + columns
        lineCells.push(cells[index].innerHTML)
      }
      lineWinningCase.push(this._checkEqual(lineCells))
      lineCells = []
    }
    return lineWinningCase
  }
  _findColumnResults(cells){
    const columnWinningCase = []
    let columnCells = []

    for(let columns = 0; columns < this.width; columns ++){
      for (let lines = 0; lines < this.height; lines ++){
        let index = this.height*lines + columns
        columnCells.push(cells[index].innerHTML)
      }
      columnWinningCase.push(this._checkEqual(columnCells))
      columnCells = []
    }
    return columnWinningCase
  }
  _findMainDiagonalResults(cells){
    const mainDiagonal = []
    for(let number = 0; number < this.width; number ++){
      mainDiagonal.push(cells[number*(this.height + 1)].innerHTML)
    }
    return this._checkEqual(mainDiagonal)
  }
  _findSecondaryDiagonalResults(cells){
    const secondaryDiagonal = []
    for(let number = 0; number < this.width; number ++){
      secondaryDiagonal.push(cells[number*(this.height)+(this.height - (1 + number))].innerHTML)
    }
    return this._checkEqual(secondaryDiagonal)
  }
  _checkEqual(myArray){
    let watcher = true
    myArray.forEach((item, index) => {
      if(!watcher) return false
      if(typeof myArray[index+1] === 'undefined') return false
      if(item !== myArray[index+1] || (!item && !myArray[index+1]))
        watcher = false
    })
    return watcher
  }
  _isTableFull(cells){
    for (const cell of cells){
      if(!cell.innerHTML) return false
    }
    return true
  }
  endGame(){
    const cells = document.querySelectorAll('.data')
    const winningCases = []

    winningCases.push(...this._findLineResults(cells))
    winningCases.push(...this._findColumnResults(cells))
    winningCases.push(this._findMainDiagonalResults(cells))
    winningCases.push(this._findSecondaryDiagonalResults(cells))
    const weHaveAWinner = winningCases.find(item => item)
    if(!weHaveAWinner) {
      const gameHasEnded = this._isTableFull(cells) 
      return gameHasEnded ? 'draw' : false
    }
    return weHaveAWinner || false
  }
};