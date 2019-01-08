//LOGS
const validMovesLog = false
const debugLog = false
let debugCounter = 0
const delay = 250

class Game{
  constructor{
    
  }

}
//globals
//SAVE SETTINGS DIFFERENT WIDTH NOT ALL VALID OPTIONS SHOWING
// let tileShape = 'hexagon'
// let liberties = 6
const width = 6
const numberOfTiles = 61
const leftIds = []
const upLeftIds = []
const downLeftIds = []
const rightIds = []
const upRightIds = []
const downRightIds = []
const upIds = []
const downIds = []

const showNumbers = true

let gridToneArray = []
const srcArray = [
  '1_C3.wav',
  // '2_Cs3.wav',
  '3_D3.wav',
  '4_Eb3.wav',
  '5_E3.wav',
  '6_F3.wav',
  // '7_Fs3.wav',
  '8_G3.wav',
  // '9_Gs3.wav',
  '10_A3.wav',
  '11_Bb3.wav',
  // '12_B3.wav',
  '13_C4.wav'
]

let gameStart = false
let level = 1
let gridArray = []
let gridClassArray = []
const history = []
let cpu
let cpuType = 'random'
let turnCount
let whiteCount
let blackCount
let emptyCount
let winner
let validMovesArr
let player
let opponent
let clickable = true
const noValidMoves = {
  'black': false,
  'white': false
}

let $grid
let $blackScore
let $whiteScore
let $turn
let $message
let $screens
let $start

let audioPlayer
const audioPlayerArr = []

function debug(note){
  if(debugLog){
    const argumentsArray = [].slice.apply(arguments.callee.caller.arguments)
    console.log(`debug:${debugCounter++} ${arguments.callee.caller.name}(${argumentsArray||'No Args'}) ${note||''}`)
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  init()
})

function resetVars(){
  debug()
  turnCount = 0
  clickable = true
  gridClassArray = []
  gridArray.removeClass('black').removeClass('white').removeClass('invert')
  addTile(gridArray[19], 'black')
  addTile(gridArray[25], 'white')
  addTile(gridArray[30], 'black')
  addTile(gridArray[24], 'white')

  function selectRandom(){
    const rndm = Math.random()
    const selected = Math.floor(rndm*numberOfTiles)
    if($(gridArray[selected]).hasClass('white')||$(gridArray[selected]).hasClass('black')) return selectRandom()
    return selected
  }

  const selected = selectRandom()
  // level = 1
  switch(level){
    case 1: break
    case 2:

      addTile(gridArray[selected],'invert')
      break
    case 3:
      addTile(gridArray[selected],'bomb')
      break
    case 4:
      addTile(gridArray[selected],'invert')
      break
  }

  history[turnCount] = JSON.parse(JSON.stringify(gridClassArray))

  nextTurn()

}
function endTurn(){
  $message.html('')

  history[turnCount+1] = JSON.parse(JSON.stringify(gridClassArray))

  //Allow click
  clickable = true

  //Increase the turn count
  turnCount++
}
function nextTurn(){
  //Work out scores
  calculateScores()
  //Display Scores
  updateScores()
  updatePlayerAndOpponent()
  $turn.html(`${player} turn`)
  getValidMoves()
}

function addTile(tile, player, sound=true){
  console.log('addtile', sound)
  debug()
  opponent = 'black'
  if(player === 'black') opponent = 'white'
  $(tile).removeClass(opponent).removeClass('valid')
  $(tile).addClass(player)


  const id = parseInt($(tile).attr('data-id'))
  gridClassArray[id] = player

  // if($(tile).hasClass('invert')){
  //   for(let i=0;i<numberOfTiles;i++){
  //     if($(gridArray[i]).hasClass('white')){
  //       $(gridArray[i]).removeClass('white')
  //       $(gridArray[i]).addClass('black')
  //     }else if($(gridArray[i]).hasClass('black')){
  //       $(gridArray[i]).removeClass('black')
  //       $(gridArray[i]).addClass('white')
  //     }
  //     if(gridClassArray[id] === 'white') gridClassArray[id] === 'black'
  //     if(gridClassArray[id] === 'black') gridClassArray[id] === 'white'
  //   }
  // }
  if(sound && gameStart){
    playSound(id)
  }
}

function isOccupied(tile){
  debug()
  if($(tile).hasClass('white'))return 'white'
  if($(tile).hasClass('black'))return 'black'
  return false
}

const directions = [-width,(-2*width)+1,-width+1,-1,0,1,width-1,(2*width)-1,width]

function createLookups(){

  // const $topTiles = $grid.find('.even:first-child')
  // console.log('$topTile',$topTiles)
  // const $bottomTiles = $grid.find('.even:last-child')
  //
  // const $rows = $grid.find('div')
  // const $leftTiles = $rows.find('.hex:first-child')
  // const $rightTiles = $rows.find('.hex:last-child')
  //
  // $topTiles.addClass('invert')
  // $bottomTiles.addClass('invert')
  // $leftTiles.addClass('invert')
  // $rightTiles.addClass('invert')

  // $leftTiles.merge()

  let numEdges = 11

  let i = 0
  leftIds.push(i)
  while(i<numberOfTiles-width){
    i+=width
    leftIds.push(i)
    i+=width-1
    leftIds.push(i)
  }

  i = width-1
  rightIds.push(i)
  while(i<numberOfTiles-width){
    i+=width-1
    rightIds.push(i)
    i+=width
    rightIds.push(i)
  }


  for(i=0;i<11;i++){
    upIds.push(i)
  }


  for(i=50;i<61;i++){
    downIds.push(i)
  }


  for(i=0;i<width;i++){
    upLeftIds.push(i)
  }
  for(i=0;i<leftIds.length;i+=2){
    upLeftIds.push(leftIds[i])
  }


  //UP RIGHT
  for(i=0;i<width-1;i++){
    upRightIds.push(i)
  }
  // for(i=0;i<upIds.length;i+=2){
  //   upRightIds.push(upIds[i])
  // }


  for(i=0;i<rightIds.length;i+=2){
    upRightIds.push(rightIds[i])
  }


  //DOWN LEFT
  for(i=55;i<numberOfTiles;i++){
    downLeftIds.push(i)
  }

  for(i=0;i<leftIds.length;i+=2){
    downLeftIds.push(leftIds[i])
  }


  //DOWN RIGHT
  for(i=55;i<numberOfTiles;i++){
    downRightIds.push(i)
  }

  for(i=0;i<rightIds.length;i+=2){
    downRightIds.push(rightIds[i])
  }


  console.log('leftIds',leftIds)
  console.log('rightIds',rightIds)
  console.log('upIds',upIds)
  console.log('downIds',downIds)
  console.log('upLeftIds',upLeftIds)
  console.log('upRightIds',upRightIds)
  console.log('downLeftIds',downLeftIds)
  console.log('downRightIds',downRightIds)
}

function getNeighbours(tile){
  const id = parseInt($(tile).attr('data-id'))
  const neighbourArr = []

  for(let i=0; i<=8; i++){

    const neighbourId = id + directions[i]
    //If going upLeft and has no neighbour
    if($(gridArray[neighbourId]).hasClass('hidden')){
      neighbourArr.push('hidden')
    }else if(upLeftIds.includes(id) && (i === 0) ) {
      neighbourArr.push('upLeft')

      //If going up and has no neighbour
    }else if(upIds.includes(id) && (i === 1)){
      neighbourArr.push('up')

      //If going upRight and has no neighbour
    }else if(upRightIds.includes(id) && (i === 2) ) {
      neighbourArr.push('upRight')

      //In left column and direction is left
    }else if(leftIds.includes(id) && (i === 3) ) {
      neighbourArr.push('left')

      //In right column and direction is right
    }else if(rightIds.includes(id) && (i === 5) ) {
      neighbourArr.push('right')

      //If going downLeft and has no neighbour
    }else if(downLeftIds.includes(id) && (i === 6) ) {
      neighbourArr.push('downLeft')

      //If going down and has no neighbour
    }else if(downIds.includes(id) && (i === 7)){
      neighbourArr.push('down')

      //If going downRight and has no neighbour
    }else if(downRightIds.includes(id) && (i === 8) ) {
      neighbourArr.push('downRight')

    }else{
      neighbourArr.push(gridArray[neighbourId])
    }
  }
  // console.log('tile',tile)
  // console.log('neighbourArr',neighbourArr)
  // console.log('\n')
  return neighbourArr
}


function validFlip(elem,index){

  //Create an array to store candidates for flipping
  const potentialArr = []

  //This neighbour-tile's id as an int
  const id = parseInt($(elem).attr('data-id'))

  //Prep id of next in search, will add direction to look later
  let nextId = id

  //If this neighbour-tile is an opponent, look on the other side of it
  if($(elem).hasClass(opponent)){
    //check to see if there is a player tile in this direction
    //max travel the twice width of the board -2
    for(let i=0;i<(2*width)-2;i++){

      //Do test to see which row or column nextId is in
      //If it is on an edge and is going in that direction, this is not a valid move
      if(upLeftIds.includes(id) && (index === 0) ) {
        console.log('upLeft Invalid')
        return false
      }
      if(upIds.includes(id) && (index === 1)){
        console.log('up Invalid')
        return false
      }
      if(upRightIds.includes(id) && (index === 2) ) {
        console.log('upRight Invalid')
        return false
      }
      //In left row and direction is left
      if(leftIds.includes(id) && (index === 3) ) {
        console.log('left Invalid')
        return false
      }
      //This is the original tile
      if(index === 4) {
        return false
      }
      //In right row and direction is right
      if(rightIds.includes(id) && (index === 5) ) {
        console.log('right Invalid')
        return false
      }
      if(downLeftIds.includes(id) && (index === 6) ) {
        console.log('downLeft Invalid')
        return false
      }
      if(downIds.includes(id) && (index === 7) ) {
        console.log('down Invalid')
        return false
      }
      if(downRightIds.includes(id) && (index === 8) ) {
        console.log('downRight Invalid')
        return false
      }

      //The nextId is the current nextId plus the direction, the direction is the index! (This is really neat!)
      nextId += directions[index]

      //Get the tile associated with this id
      const nextTile = gridArray[nextId]

      //If it is a player tile, this is a valid move
      if ($(nextTile).hasClass(player)){
        console.log('found player')
        potentialArr.unshift(elem)
        return potentialArr

        //If the next tile is an opponent tile, keep searching in this direction
      }else if ($(nextTile).hasClass(opponent)){

        // console.log('found another opponent')

        //Add this tile to the potentials flip array
        potentialArr.push(nextTile)

      }else{
        //This tile is empty it is not a valid move
        return false
      }
    }
  }
}
function checkTileIsValid(tile){
  debug()

  const flipArr = []
  //check to see if the tile is empty
  if(isOccupied(tile)) return false
  if($(tile).hasClass('hidden'))return false

  //check to see if there is an opponent tile next to this tile
  //create array of neighbours
  const neighbours = getNeighbours(tile)

  //for each neighbour check it is a valid move
  neighbours.some((elem, index)=>{
    const arr = validFlip(elem,index)
    if(arr) flipArr.push(arr)
  })

  //If the flip array contains some tiles to flip then return it
  //This is a valid move
  if(flipArr.length) return true

  //Otherwise return false, this move is not valid
  return false
}
function getTilesToFlip(tile){
  debug()
  const flipArr = []

  //check to see if there is an opponent tile next to this tile
  //create array of neighbours
  const neighbours = getNeighbours(tile)

  //for each neighbour check it is a valid move
  neighbours.forEach((elem, index)=>{
    const arr = validFlip(elem,index)
    if(arr) flipArr.push(arr)
  })

  //If the flip array contains some tiles to flip then return it
  //This is a valid move
  if(flipArr.length) return flipArr

  //Otherwise return false, this move is not valid
  return false
}

function calculateScores(){

  //Increase counter
  whiteCount = 0
  blackCount = 0
  let hiddenCount = 0
  emptyCount = 0
  //Check game if game is over
  for(let i=0;i<numberOfTiles;i++){
    const tileState = isOccupied(gridArray[i])
    if(tileState==='white') whiteCount++
    else if(tileState==='black') blackCount++
    else if(tileState==='hidden') hiddenCount++
    else emptyCount++
  }
}

function updateScores(){
  //Update Scores
  $blackScore.html(`Black: ${blackCount}`)
  $whiteScore.html(`White: ${whiteCount}`)
  winner = 'black'
  if(whiteCount>blackCount) winner = 'white'
  if(whiteCount===blackCount) winner = 'tie'
}

function gameOver(){
  console.log('Game Over')
  if(winner === 'tie')$message.html('It\'s a tie!')
  else $message.html(`${winner} wins!`)
  level++
  $screens.hide()
  $start.show()
}

function cpuPlay(){
  if(player === 'black' && cpu === true){
    $(gridArray).removeClass('valid')
    setTimeout(function(){
      cpuMove()
    },1000)
  }

  function cpuMove(){
    let rndm
    let selected
    let selectedLen
    let list

    if(validMovesArr.length===0) {
      gridArray[20].click()
      return
    }

    switch(cpuType){
      case 'first':
        for(let i=0;i<numberOfTiles;i++){
          if(validMovesArr[i]){
            gridArray[i].click()
            break
          }
        }
        break

      case 'random':
        list =[]
        for(let i=0;i<numberOfTiles;i++){
          if(validMovesArr[i]){
            list.push(gridArray[i])
          }
        }
        //id something in list, get random selection
        if(list.length){
          rndm = Math.random()
          selected = Math.floor(rndm*list.length)
          list[selected].click()
        }else{
          //is nothing in list, click on first grid square to trigger next turn
          gridArray[0].click()
        }
        break

      case 'greedy':
        selected = 0
        selectedLen = 0
        for(let i=0;i<numberOfTiles;i++){
          if(validMovesArr[i]){
            if(validMovesArr[i].length > selectedLen) {
              selected = gridArray[i]
              selectedLen = validMovesArr[i].length
            }
            selected.click()
          }
        }
        break
    }
  }
}


function getValidMoves(){
  debug()
  validMovesArr = []
  //calculate all valid moves
  for(let i=0;i<numberOfTiles;i++){
    validMovesArr[i] = !!checkTileIsValid(gridArray[i])
  }
  validMovesLog && console.log('validMovesArr',validMovesArr)
}

function playSound(id){
  const tone = gridToneArray[id]
  audioPlayerArr[tone].pause()
  audioPlayerArr[tone].currentTime = 0
  audioPlayerArr[tone].play()
}

function validHoverOn(e){
  // debug()

  const tile = $(e.currentTarget)
  const id = parseInt($(tile).attr('data-id'))

  //Remove class from all, (mouseout had some weird behaviours)
  for(let i=0;i<numberOfTiles;i++){
    $(gridArray[i]).removeClass('valid')
  }

  if(validMovesArr[id]){
    tile.addClass('valid')
  }
}

function updatePlayerAndOpponent(){
  opponent = turnCount%2 === 0 ? 'black':'white'
  player = turnCount%2 === 0 ? 'white':'black'
  debug(`player:${player} opponent:${opponent}`)

}
function invertCapture(tile){
  if($(tile).hasClass('invert')){
    for(let i=0;i<numberOfTiles;i++){
      if($(gridArray[i]).hasClass('white')){
        $(gridArray[i]).removeClass('white')
        $(gridArray[i]).addClass('black')
      }else if($(gridArray[i]).hasClass('black')){
        $(gridArray[i]).removeClass('black')
        $(gridArray[i]).addClass('white')
      }
      if(gridClassArray[i] === 'white') gridClassArray[i] === 'black'
      if(gridClassArray[i] === 'black') gridClassArray[i] === 'white'
    }
    $(tile).addClass(player)
    $(tile).removeClass(opponent)
  }
}
function play(e){
  if(!clickable)return
  debug()
  const tile = $(e.currentTarget)


  // console.log('validMovesArr.some((elem)=>elem',validMovesArr.some((elem)=>elem))

  if(!validMovesArr.some((elem)=>elem)){
    noValidMoves[player] = true
    console.log(noValidMoves)
    if(noValidMoves[opponent] === true){
      gameOver()
      return
    }

    console.log('No Valid Moves')
    endTurn()
    nextTurn()
    cpuPlay()

    $message.html('No Valid Moves')
    //Invalid move
    console.log('Invalid')
    return
  }

  noValidMoves[player] = false

  //check if it is a valid move
  const id = parseInt($(tile).attr('data-id'))

  //If the valid moves array contains this tile
  if(validMovesArr[id]){

    //disable click
    clickable = false

    //Add the tile that was clicked
    addTile(tile, player)



    const timerArr = []

    //Get tiles to flip
    const tilesToFlip = getTilesToFlip(tile)
    // console.log('tilesToFlip',tilesToFlip)
    //Flip each tile for this move
    // validMovesArr[id].forEach((elem, index)=>{
    tilesToFlip.forEach((elem, index)=>{
      // console.log('tilesToFlip.forEach elem', elem, 'index', index)
      const thisPlayer = player
      // const thisOpponent = opponent

      elem.forEach((thisTile, i)=>{
        const timerId = setTimeout(function(){
          if(index===0)addTile(thisTile, thisPlayer)
          else addTile(thisTile, thisPlayer, false)
          invertCapture(thisTile)
          timerArr.pop()
        },delay*(i+1))
        timerArr.push(timerId)

      })
      // console.log(turnCount,'delay*(index+1)',delay*(index+1),'index',index)
    })

    invertCapture(tile)

    const wait = timerArr.length*delay
    setTimeout(function(){

      endTurn()

      nextTurn()

      cpuPlay()

      //Check for end of Game
      if(emptyCount===0){
        gameOver()
      }
    },wait)
  }

}

function buildGame(){


  createLookups()
  // GET HTML ELEMENTS



  const $game = $('.game')
  $grid = $game.find('.hex-grid')


  //Clear grid
  // $grid.html('')

  //Build tiles
  let row = ''

  for(let i=0;i<(2*width)-1;i++){

    if(i%2===0) row = '<div class="even"></div>'
    if(i%2===1) row = '<div class="odd"></div>'

    $grid.append(row)

  }

  const $evens = $grid.find('.even')
  const $odds = $grid.find('.odd')
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
  // for(let i=0;i<2;i++){

  // if(i%2===0){
  for(let j=0;j<width;j++){
    // $evens.append('<div class="hex"></div>')
    $evens.append(hex)
  }
  // }
  // if(i%2===1){
  for(let j=0;j<width-1;j++){
    // $odds.append('<div class="hex"></div>')
    $odds.append(hex)
  }
  // }
  // }
  const $hexs = $grid.find('.hex')
  // $hexs

  // $($hexs).click(function (e) {
  //   if($(this).hasClass('white')||$(this).hasClass('black')){
  //     $(this).hide()
  //     $(document.elementFromPoint(e.clientX, e.clientY)).trigger('click')
  //     $(this).show()
  //
  //   }
  // })



  const $firstSegs = $hexs.find('.diamond:last-child .seg')
  if(showNumbers === true){
    $firstSegs.each(function( index ){
      this.append(index)
    })

  }
  // for(let i=0;i<numberOfTiles;i++){
  //   const tile = `<div class='tile' data-id=${i}>
  //   <div class='rotate'>
  //   <div class='counter'>
  //   ${i}
  //   </div>
  //   </div>
  //   </div>`
  //   $grid.append(tile)
  // }


  //Get DOM elements
  //Get an array of all tiles
  gridArray = $grid.find('.hex')
  for(let i=0;i<numberOfTiles;i++){
    $(gridArray[i]).attr('data-id',i)

  }



  const $topTiles = $grid.find('.even:first-child > .hex')

  const $bottomTiles = $grid.find('.even:last-child > .hex')
  const $rows = $grid.find('div')
  const $leftTiles = $evens.find('.hex:first-child')
  const $rightTiles = $evens.find('.hex:last-child')

  $topTiles.addClass('hidden')
  $bottomTiles.addClass('hidden')
  $leftTiles.addClass('hidden')
  $rightTiles.addClass('hidden')



  for(let i=0;i<9;i++){
    audioPlayer = document.createElement('audio')
    audioPlayer.src = 'assets/'+srcArray[i]
    audioPlayerArr.push(audioPlayer)

  }

  let j = 0
  for(let i=0;i<numberOfTiles;i++){
    gridToneArray[i] = j
    j = (j+7)%9
  }


  // console.log(audioPlayerArr)
  // console.log('gridToneArray',gridToneArray)


  // console.log(gridArray)
  // for(let i=0;i<numberOfTiles;i++){
  //   gridArray.text(i)
  // }
  // const size = (Math.floor(100/width)-1)+'%'
  // console.log('SIZE',size)
  // gridArray.css({
  //   'width': size,
  //   'height': size
  // })

  const $scores = $('.scores')
  $blackScore = $scores.find('.black')
  $whiteScore = $scores.find('.white')

  $turn = $('.turn')
  $message = $('.message')

  //reset variables
  resetVars()

  //Add on click
  gridArray.on('click', play)
  gridArray.on('mouseenter',validHoverOn)
}
function undoRedoUpdate(){

  gridClassArray = []
  for(let i=0;i<numberOfTiles;i++){
    const tile = gridArray[i]
    $(tile).removeClass('black').removeClass('white')
  }
  history[turnCount].forEach((elem,index)=>{
    const tile = gridArray[index]
    $(tile).addClass(elem)
    gridClassArray[index] = elem
  })
  nextTurn()
}
function undoMove(){

  function action(){
    // console.log('action')
    turnCount--
    if(turnCount<0)turnCount=0
    undoRedoUpdate()
  }

  //If playing computer, undo two moves
  if(cpu){
    setTimeout(action,delay)
  }

  action()

}
function redoMove(){
  function action(){
    turnCount++
    if(turnCount>=history.length)turnCount=history.length-1
    undoRedoUpdate()

  }

  //If playing CPU redo two moves
  if(cpu){
    setTimeout(action,delay)
  }

  action()

}

function saveSettings(e){
  e.preventDefault()

  const values = {}
  $.each($('.form').serializeArray(), function(i, field) {
    values[field.name] = field.value
  })

  cpuType = values['cpu-type']

  init()

  // console.log('Test values', values)
  // console.log('Test width', width, 'cpuType', cpuType )

}

function init(){
  debug()

  buildGame()

  $screens = $('.screen')
  $start = $('.start')
  const $game = $('.game')
  const $settings = $('.settings')
  const $startButton = $('.startButton')
  const $level1Button = $('.level1')
  const $level2Button = $('.level2')
  const $level3Button = $('.level3')
  // const $startButtonText = $startButton.find('h2')
  // const $startButtonSingle = $('.startButtonSingle')
  const $menuButton = $('.menuButton')
  const $resetButton = $('.reset')
  const $undoButton = $('.undo')
  const $redoButton = $('.redo')
  const $settingsButton = $('.settingsButton')
  const $form = $('.form')
  const $settingsSaveButton = $form.find('button')

  // $startButton.on('click', goToGame)
  $level1Button.on('click', ()=>goToGame(1))
  $level2Button.on('click', ()=>goToGame(2))
  $level3Button.on('click', ()=>goToGame(3))
  $startButton.on('click', ()=>goToGame(false))
  // $startButtonSingle.on('click', goToSingleGame)
  $menuButton.on('click', goToMenu)
  $settingsButton.on('click', goToSettings)
  $resetButton.on('click', resetVars)
  $undoButton.on('click', undoMove)
  $redoButton.on('click', redoMove)
  $settingsSaveButton.on('click', saveSettings)

  function goToGame(gameLevel){
    cpu = false
    if(gameLevel){
      level = gameLevel
      cpu = true
    }
    gameStart = true
    resetVars()
    $screens.hide()
    $game.show()
  }

  // function goToSingleGame(){
  //   gameStart = true
  //   cpu = true
  //   // console.log('cpu true')
  //   $screens.hide()
  //   $game.show()
  // }

  function goToMenu(){
    // $startButtonText
    // if(turnCount) $startButtonText.html('Continue')
    // else $startButtonText.html('Vs')
    // if(turnCount) $startButton.html('Continue Game')
    // else $startButton.html('New Game')
    $screens.hide()
    $start.show()
  }

  function goToSettings(){
    $screens.hide()
    $settings.show()
  }


}
