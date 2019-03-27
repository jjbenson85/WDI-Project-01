class GameLevel{
  constructor($game,gameConst, gameLets, gameDom){

    this.gameConst = gameConst
    this.gameLets = gameLets
    this.gameDom = gameDom

    //Game level is global level
    const {width, srcArray, numberOfTiles} = gameConst
    this.width = width
    this.srcArray = srcArray
    this.numberOfTiles = numberOfTiles

    const {opponent, player, turnCount, gridClassArray} = gameLets

    this.opponent = opponent
    this.player = player
    this.turnCount = turnCount
    this.gridClassArray = gridClassArray
    //Log level for testing


    const {$turnIcon} = gameDom
    this.$turnIcon = $turnIcon

    //The game grid is global and persistent
    this.$game = $game

    //Build the board
    //Get needed dom elements
    this.getHtmlElements()
    //Build rows
    this.buildRows()
    //Build tiles
    this.buildTiles()
    //Create audio objects for each tone
    this.createAudio()
    //Reset variables for new game (should be setVariables)
    this.resetVariables()
    //Create neighbour tiles lookup (this could be persistent)
    this.createLookups()
    //Set the player  and opponent and update icon
    this.updatePlayerAndOpponent()
    //Get array of valid moves for current player
    this.getValidMoves()
    //Add the click events to the cubes
    this.addClickEvents()

  }


  getHtmlElements(){
    //Get the grid (to insert the rows and cubes into)
    this.$grid = this.$game.find('.hex-grid')

    //Delete the contents of the grid
    this.$grid.empty()

    //Get the fireworks container for end game
    // const $fireworks = $('.fireworks-container')
  }
  buildRows(){
    //Build rows
    let row = ''
    for(let i=0;i<(2*this.width)-1;i++){
      //Even rows
      if(i%2===0) row = '<div class="even"></div>'
      //Odd rows
      else row = '<div class="odd"></div>'
      //Add rows to grid
      this.$grid.append(row)
    }
  }
  buildTiles(){
    //Build tiles
    //Get even rows
    this.$evens = this.$grid.find('.even')
    //Get odd rows
    this.$odds = this.$grid.find('.odd')
    //HTML for the hexagon
    //!!Improved hexagon is only 2 divs!
    const hex = `<div class="hex">
      <div class="diamond">
        <div class="scale">
          <div class="seg"></div>
        </div>
      </div>
      <div class="diamond">
        <div class="scale">
          <div class="seg"></div>
        </div>
      </div>
      <div class="diamond">
        <div class="scale">
          <div class="seg"></div>
        </div>
      </div>
  </div>`
    //Add the width amount of hexes to the evens and -1 for the odds
    for(let i = 0; i < this.width; i++){
      this.$evens.append(hex)
      if(i === this.width-1) continue
      this.$odds.append(hex)
    }

    //Get all the hexs in a single object
    this.$hexArray = this.$grid.find('.hex')
    //Add hidden class to all tiles, will show tiles when level is built
    this.$hexArray.addClass('hidden')

    //For each tile, add a data-id
    this.$hexArray.each(function(index){
      $(this).attr('data-id',index)
    })

    //For debugging, adds numbers to the tiles
    // if(showNumbers === true){
    //   const $firstSegs = this.$hexArray.find('.diamond:last-child .seg')
    //   $firstSegs.each(function( index ){
    //     this.append(index)
    //   })
    // }
  }

  getTileId(tile){
    const id = parseInt($(tile).attr('data-id'))
    return id
  }

  addTile(tile, thisPlayer, sound=true){
    const thisOpponent = (thisPlayer === 'black') ? 'white' : 'black'

    //Remove thisOpponent class and valid from this tile
    $(tile)
      .removeClass(thisOpponent)
      .removeClass('valid')
      .addClass(thisPlayer)

    //Get the tile id
    const id = this.getTileId(tile)
    this.gridClassArray[id] = thisPlayer

    //If this tile should play a sound when added, play
    if(sound){
      this.playSound(id)
    }
  }

  createAudio(){
    this.audioPlayerArr = []
    this.gridToneArray = []
    this.srcArray.forEach((src)=>{
      this.audioPlayer = document.createElement('audio')
      this.audioPlayer.src = 'sounds/'+src
      this.audioPlayerArr.push(this.audioPlayer)
    })

    let j = this.gameLets.level
    for(let i=0;i<this.numberOfTiles;i++){
      this.gridToneArray[i] = j
      j = (j+7)%9
    }
  }

  playSound(id){
    const tone = this.gridToneArray[id]
    this.audioPlayerArr[tone].pause()
    this.audioPlayerArr[tone].currentTime = 0
    this.audioPlayerArr[tone].play()
  }

  createLookups(){
    //!!Check if lookup is defined, if it is don't create it

    //Create class variable
    this.neighbourLookup = []

    //For every tile
    for(let i=0;i<this.numberOfTiles;i++){
      //insert the array returned from the getNeighbours function (an array of this tiles neighbours)
      this.neighbourLookup[i] = this.getNeighbours(this.$hexArray.eq(i))
    }
  }


  selectRandom(arr){
    const rndm = Math.random()
    const selected = arr[Math.floor(rndm*arr.length)]
    return selected
  }

  updatePlayerAndOpponent(){
    //Alternate between players
    //!!could be neater?
    this.opponent = this.turnCount%2 === 0 ? 'black':'white'
    this.player = this.turnCount%2 === 0 ? 'white':'black'

    // this.opponent = (this.player === 'white)' ? 'black':'white'

    //Update player icon

    this.$turnIcon.removeClass(this.opponent).addClass(this.player)

  }
  createLevel(boardSquares,blackSquares,whiteSquares){
    boardSquares.forEach((elem)=>{
      this.$hexArray.eq(elem).removeClass('hidden')
    })
    blackSquares.forEach((elem)=>{
      this.$hexArray.eq(elem).addClass('black')
    })
    whiteSquares.forEach((elem)=>{
      this.$hexArray.eq(elem).addClass('white')
    })
  }
  levelBuilder(arr){
    // console.log('levelBuilder')
    const lookUp = {
      'X': 'hidden',
      '-': 'show',
      'W': 'white',
      'B': 'black',
      'i': 'invert',
      'b': 'bomb'
    }

    const $rows = this.$grid.children('div')

    for(let i=0;i<15;i++){
      const levelRow = arr[i]
      const $gridRow = $($rows).eq(i)
      const $rowTiles = $gridRow.children('div')

      for(let j=0;j<10;j++){
        const levelTile = levelRow[j]
        const $rowTile = $rowTiles.eq(j)
        const levelClass = lookUp[levelTile]
        if(levelClass === 'show'){
          $rowTile.removeClass('hidden')
        }else if(levelClass !== 'hide'){
          $rowTile.removeClass('hidden').addClass(levelClass)
        }

      }
    }
  }
  resetVariables(){
    this.turnCount = 0
    this.gameLets.clickable = true
    this.gridClassArray = []
    this.validMovesArr = []
    // $fireworks.hide()

    this.gameDom.$footer.removeClass('white').removeClass('black')

    this.$hexArray.removeClass('black').removeClass('white').removeClass('invert')

    const levelDesign = this.gameConst.levelDesignArray[this.gameLets.level]

    this.levelBuilder(levelDesign)

    for(let i = 0;i<this.numberOfTiles;i++){
      this.gridClassArray[i] = this.$hexArray.eq(i).attr('class').split(' ')[1]
    }

    history[this.turnCount] = JSON.parse(JSON.stringify(this.gridClassArray))

  }

  getNeighbours(tile){
    const id = this.getTileId(tile)
    const neighbourArr = []

    for(let i=0; i<=8; i++){

      const neighbourId = id + this.gameConst.directions[i]
      //If going upLeft and has no neighbour
      if(this.$hexArray.eq(neighbourId).hasClass('hidden')){
        neighbourArr.push('hidden')
      }else{
        neighbourArr.push(this.$hexArray.eq(neighbourId))
      }
    }

    return neighbourArr
  }

  validFlip(tile,index){

    //Create an array to store candidates for flipping
    const potentialArr = []

    //This neighbour-tile's id as an int
    const id = this.getTileId(tile)

    //Prep id of next in search, will add direction to look later
    let nextId = id
    //If this neighbour-tile is an opponent, look on the other side of it
    if($(tile).hasClass(this.opponent)){
      //check to see if there is a player tile in this direction
      //max travel the twice width of the board -2
      for(let i=0;i<(2*this.width)-2;i++){

        //The nextId is the current nextId plus the direction, the direction is the index! (This is really neat!)
        nextId += this.gameConst.directions[index]

        //Get the tile associated with this id
        const nextTile = this.$hexArray.eq(nextId)

        //If it is a player tile, this is a valid move
        if ($(nextTile).hasClass(this.player)){
          potentialArr.unshift(tile)
          return potentialArr

          //If the next tile is an opponent tile, keep searching in this direction
        }else if ($(nextTile).hasClass(this.opponent)){
          //Add this tile to the potentials flip array
          potentialArr.push(nextTile)

        }else{
          //This tile is empty it is not a valid move
          return false
        }
      }
    }
  }
  checkTileIsValid(tile){
    const flipArr = []
    //check to see if the tile is empty
    if( $(tile).hasClass('white')||
        $(tile).hasClass('black')||
        $(tile).hasClass('hidden')) return false


    //check to see if there is an opponent tile next to this tile
    //create array of neighbours
    const id = this.getTileId(tile)
    const neighbours = this.neighbourLookup[id]

    //for each neighbour check if any is a valid move
    return neighbours.some((neighbourTile, index)=>{
      //If element is string it is not a valid tile
      if(typeof neighbourTile === 'string') return

      //Valid flip array returns false or an array
      return !!this.validFlip(neighbourTile,index)

    })

    // //If the flip array contains some tiles to flip then return it
    // //This is a valid move
    // if(flipArr.length) return true
    //
    // //Otherwise return false, this move is not valid
    // return false
  }

  getValidMoves(){
    this.$hexArray.each((i)=>{
      this.validMovesArr[i] = !!this.checkTileIsValid(this.$hexArray.eq(i))
    })
  }

  validHoverOn(e){

    const tile = $(e.currentTarget)
    const id = this.getTileId(tile)

    //Remove class from all, (mouseout had some weird behaviours)
    if(this.validMovesArr[id]){
      this.$hexArray.removeClass('valid')
      tile.addClass('valid')
    }
  }

  getTilesToFlip(tile){
    const flipArr = []

    //check to see if there is an opponent tile next to this tile
    //create array of neighbours
    const id = this.getTileId(tile)
    const neighbours = this.neighbourLookup[id]

    //for each neighbour check it is a valid move
    neighbours.forEach((elem, index)=>{
      const arr = this.validFlip(elem,index)
      if(arr) flipArr.push(arr)
    })

    //Sort array in size order so longest plays sounds
    return flipArr.sort(function(a, b){
      return b.length - a.length
    })

    //If the flip array contains some tiles to flip then return it
    //This is a valid move
    // if(flipArr.length) return flipArr

    //Otherwise return false, this move is not valid
    // return false
  }

  endTurn(){
    //Add grid to history for undo
    history[this.turnCount+1] = JSON.parse(JSON.stringify(this.gridClassArray))

    //Allow click
    this.gameLets.clickable = true

    //Increase the turn count
    this.turnCount++
  }
  calculateScores(){

    //Reset counter
    let wCount = 0
    let bCount = 0

    //Check game if game is over
    this.$hexArray.each(function(){
      $(this).hasClass('white') && wCount++
      $(this).hasClass('black') && bCount++
    })

    this.gameLets.whiteCount = wCount
    this.gameLets.blackCount = bCount

    console.log('whiteCount',this.gameLets.whiteCount,'blackCount',this.gameLets.blackCount)
    this.winner = 'black'
    if(this.gameLets.whiteCount>this.gameLets.blackCount) this.winner = 'white'
    if(this.gameLets.whiteCount===this.gameLets.blackCount) this.winner = 'tie'

  }

  updateScores(){
    //Update class on footer
    this.gameDom.$footer.removeClass('white').removeClass('black').addClass(this.winner)
  }

  nextTurn(){
    //Work out scores
    this.calculateScores()
    //Display Scores
    this.updateScores()
    //Set the player  and opponent and update icon
    this.updatePlayerAndOpponent()
    //Get an array of valid moves for current player
    this.getValidMoves()
    //Turn pointer events back on that are switched off on cpu turn
    this.$hexArray.css('pointer-events','auto')
  }

  cpuMove(){
    let rndm
    let selected
    let selectedLen = 0
    const list = []
    let selectedTile

    // CPU No valid moves
    if(!this.validMovesArr.some((elem) => elem)){

      this.play()
      return
    }
    console.log('cpuMove', this.gameConst.cpuType)
    switch(this.gameConst.cpuType){
      case 'first':
        this.$hexArray.each((i)=>{
          if(this.validMovesArr[i]){
            this.$hexArray.eq(i).click()
          }
        })
        break

      case 'random':
        this.$hexArray.each((i)=>{
          if(this.validMovesArr[i]){
            list.push(this.$hexArray.eq(i))
          }
        })
        //get random selection
        rndm = Math.random()
        selected = Math.floor(rndm*list.length)
        list[selected].click()
        break

      case 'greedy':
        this.$hexArray.each((i)=>{
          if(this.validMovesArr[i]){
            const tile = this.$hexArray.eq(i)
            const availableMoves = this.getTilesToFlip(tile)
            const len = availableMoves[0].length
            if (len > selectedLen) {
              selectedTile = tile
              selectedLen = len
            }
          }
        })
        selectedTile.click()
        break
    }
  }
  cpuPlay(){
    console.log('cpu play', this.player, this.gameLets.cpu)
    if(this.player === 'black' && this.gameLets.cpu === true){
      this.$hexArray.css('pointer-events','none')
      setTimeout(()=>{
        this.cpuMove()
      },1000)
    }
  }
  gameOver(){
    console.log('Game Over winner is', this.winner)
    if(this.winner === 'white'){
      //disable clicks
      if(this.gameLets.level===16 || this.gameLets.cpu === false){
        // $fireworks.show()
        return
      }
      this.$hexArray.off()

      console.log('White Wins')
      this.gameLets.level++
    }else{
      console.log('Black Wins')
      if(this.gameLets.cpu === false){
        // $fireworks = $('.fireworks-container')
        // $fireworks.show()
        return
      }
      setTimeout(()=> {
        this.resetVariables()
        this.updatePlayerAndOpponent()
        this.getValidMoves()
      }, 500)
      return
    }
    this.$grid.addClass('hideLeft')
    setTimeout(()=> {
      this.$grid.addClass('hideRight')
      this.$grid.removeClass('hideLeft')
      // $fireworks.hide()

      // new GameLevel(this.$game,level)

      console.log('gameLets.level',this.gameLets.level)
      new GameLevel(this.$game, this.gameConst, this.gameLets, this.gameDom)
    }, 500)
    setTimeout(()=> {
      this.$grid.removeClass('hideRight')
    }, 1000)
  }
  specialCapture(tile){
    if($(tile).hasClass('invert')){
      for(let i=0;i<this.numberOfTiles;i++){
        if(this.$hexArray.eq(i).hasClass('white')){
          this.$hexArray.eq(i)
            .removeClass('white')
            .addClass('black')
        }else if(this.$hexArray.eq(i).hasClass('black')){
          this.$hexArray.eq(i)
            .removeClass('black')
            .addClass('white')
        }
      }
      $(tile).addClass(this.player).removeClass(this.opponent)
    }
    if($(tile).hasClass('bomb')){
      const id = this.getTileId(tile)
      const neighbours = this.neighbourLookup[id]
      $(neighbours).each(function(){
        $(this).addClass('hidden')
      })
      console.log('bomb neighbours',$(neighbours))
    }
  }
  play(e){
    if(!this.gameLets.clickable)return

    //Check if there are some valid moves to play
    //If neither player has valid Moves
    //Game Over
    if(!this.validMovesArr.some((elem)=>elem)){
      this.gameLets.noValidMoves[this.player] = true

      console.log('No Valid Moves')

      this.endTurn()
      this.nextTurn()

      const nextPlayerValid = (this.validMovesArr.some((elem)=>elem))
      if(!nextPlayerValid){
        this.gameOver()
        return
      }

      this.cpuPlay()
      return
    }

    this.gameLets.noValidMoves[this.player] = false

    //check if it is a valid move
    // const id = parseInt($(tile).attr('data-id'))
    const tile = $(e.currentTarget)
    const id = this.getTileId(tile)

    //If the valid moves array contains this tile
    if(this.validMovesArr[id]){

      //disable click
      this.gameLets.clickable = false

      //Add the tile that was clicked
      this.addTile(tile, this.player)

      const timerArr = []

      //Get tiles to flip
      const tilesToFlip = this.getTilesToFlip(tile)

      const thisPlayer = this.player

      tilesToFlip.forEach((elem, index)=>{

        elem.forEach((thisTile, i)=>{

          const timerId = setTimeout(()=>{

            //First line to add will play sound
            if(index===0) this.addTile(thisTile, thisPlayer)
            //Subsequent lines will not play sound
            else this.addTile(thisTile, thisPlayer, false)

            this.specialCapture(thisTile)

            timerArr.pop()

          },this.gameConst.delay*(i+1))

          timerArr.push(timerId)
        })
      })

      this.specialCapture(tile)

      const wait = timerArr.length*this.gameConst.delay
      setTimeout(()=>{
        this.endTurn()
        this.nextTurn()
        this.cpuPlay()
      },wait)
    }
  }

  undoRedoUpdate(){

    this.gridClassArray = []
    this.$hexArray.removeClass('black').removeClass('white')

    history[this.turnCount].forEach((elem,index)=>{
      const tile = this.$hexArray.eq(index)
      if(elem !== undefined){
        $(tile).addClass(elem)
        this.gridClassArray[index] = elem
      }
    })
    this.nextTurn()
  }

  undoMove(loop = true){

    this.turnCount--
    if(this.turnCount<0)this.turnCount=0
    this.undoRedoUpdate()

    //If playing computer, undo two moves
    if(this.gameLets.cpu && loop){
      setTimeout(()=>{
        this.undoMove(false)
      },500)
    }
  }

  addClickEvents(){
    //Add on click
    const $undoButton = $('.undo')
    $undoButton.on('click', (e) => this.undoMove(e))
    this.$hexArray.on('click', (e) => this.play(e))
    this.$hexArray.on('mouseenter', (e) => this.validHoverOn(e, this.$hexArray))
  }
}
