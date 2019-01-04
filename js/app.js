//LOGS
const validMovesLog = false
const debugLog = false
let debugCounter = 0


//globals
const width = 8
let gridArray = []
let gridClassArray = []
const history = []
let turnCount
let whiteCount
let blackCount
let emptyCount
let winner
let validMovesArr
let player
let opponent
const noValidMoves = {
  'black': false,
  'white': false
}

let $grid
let $blackScore
let $whiteScore
let $turn
let $message

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

  gridClassArray = []

  for(let i=0;i<width*width;i++){
    const tile = gridArray[i]
    $(tile).removeClass('black').removeClass('white')

    //Work out middle squares for any even integer sized board
    const half = (width/2)-1
    const white = half + width*half
    const white2 = white+ width +1
    const black = white + 1
    const black2 = white + width

    if(i === black || i === black2) addTile(tile, 'black', 'white') //$(tile).addClass('black')
    else if(i === white || i === white2) addTile(tile, 'white', 'black')//$(tile).addClass('white')


  }
  history[turnCount] = JSON.parse(JSON.stringify(gridClassArray))
  calculateScores()
  updateScores()
  updatePlayerAndOpponent()
  $turn.html(`${player} turn`)
  getValidMoves(player,opponent)

}

function addTile(tile, player, opponent){
  debug()
  $(tile).removeClass(opponent).removeClass('valid')
  $(tile).addClass(player)

  const id = parseInt($(tile).attr('data-id'))
  gridClassArray[id] = player
}

function isOccupied(tile){
  debug()
  if($(tile).hasClass('white'))return 'white'
  if($(tile).hasClass('black'))return 'black'
  return false
}

const directions = [-width-1,-width,-width+1,-1,0,1,width-1,width,width+1]

function inLeft(id){
  if((id%width)===0) return true
}

function inRight(id){
  if((id%width)===width-1) return true
}

function inTop(id){
  if(id<width) return true
}

function inBottom(id){
  if(id>(width*width)-width) return true
}

function newGetNeighbours(tile){
  const id = parseInt($(tile).attr('data-id'))
  const neighbourArr = []

  for(let i=0; i<=8; i++){

    let neighbourId = id + directions[i]

    //In left row and search direction is left
    if(inLeft(id) && (i%3 === 0) ) {
      neighbourId = -1

    }

    //In right row and search direction is right
    if(inRight(id) && (i%3 === 2) ){
      neighbourId = -1
    }

    //In Bottom row and search direction is down
    if(inBottom(id) && (i >= 6) ){
      neighbourId = -1
    }

    //In Top row and search direction is up
    if(inTop(id) && (i <= 2) ) {
      neighbourId = -1
    }

    neighbourArr.push(gridArray[neighbourId])

  }

  return neighbourArr

}

function checkIfValid(tile, player, opponent){
  debug()

  let flipArr = []

  //check to see if the tile is empty
  if(isOccupied(tile)) return false


  //check to see if there is an opponent tile next to this tile
  //create array of neighbours
  const neighbours = newGetNeighbours(tile)

  //check if neighbour is an opponent
  neighbours.forEach((elem, index)=>{

    //Create an array to store candidates for flipping
    const potentialArr = []

    //This neighbour-tiles id as an int
    const id = parseInt($(elem).attr('data-id'))

    //Prep id of next in search, will add direction to look later
    let nextId = id

    //If this neighbour-tile is an opponent, look on the other side of it
    if($(elem).hasClass(opponent)){


      //check to see if there is a player tile in this direction
      //max travel the width of the board
      for(let i=0;i<width;i++){

        //Do test to see which row or column nextId is in
        //If it is on an edge and is going in that direction, this is not a valid move
        if(inLeft(nextId) && (index%3 === 0) ){
          return false
        }
        if(inRight(nextId) && (index%3 === 2) ){
          return false
        }
        if(inBottom(nextId) && (index >= 6) ){
          return false
        }
        if(inTop(nextId) && (index <= 0) ){
          return false
        }

        //The nextId is the current nextId plus the direction, the direction is the index! (This is really neat!)
        nextId += directions[index]

        //Get the tile associated with this id
        const nextTile = gridArray[nextId]

        //If it is a player tile, this is a valid move
        if ($(nextTile).hasClass(player)){

          //Add the potential flips from this search to the flip array
          flipArr = flipArr.concat(potentialArr)

          //Add the tile-neighbour tile to the front array
          flipArr.unshift(elem)

          //Return the array, this counts as a valid move
          return flipArr

          //If the next tile is an opponent tile, keep searching in this direction
        }else if ($(nextTile).hasClass(opponent)){

          //Add this tile to the potentials flip array
          potentialArr.push(nextTile)

        }else{
          //This tile is empty it is not a valid move
          return false
        }

      }

    }

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
  emptyCount = 0
  //Check game if game is over
  //Count occupied squares?
  for(let i=0;i<width*width;i++){
    const tileState = isOccupied(gridArray[i])
    if(tileState==='white') whiteCount++
    else if(tileState==='black') blackCount++
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

  if(winner === 'tie')$message.html('It\'s a tie!')
  else $message.html(`${winner} wins!`)

  // if(window.confirm('Game Over \n Play Again?')) resetVars()

}

function nextPlayerTurn(){
  //history
  history[turnCount+1] = JSON.parse(JSON.stringify(gridClassArray))

  //Update to show the next players turn
  $turn.html(`${opponent} turn`)

  //Increase the turn count
  turnCount++

  debug(`player:${player} opponent:${opponent}`)
  updatePlayerAndOpponent()
  debug(`player:${player} opponent:${opponent}`)

  getValidMoves(player,opponent)

}

function getValidMoves(player,opponent){
  debug()
  validMovesArr = []
  //calculate all valid moves
  for(let i=0;i<width*width;i++){
    const testTile = gridArray[i]
    const tilesToFlip = checkIfValid(testTile, player, opponent)
    if(tilesToFlip){
      validMovesArr[i] = tilesToFlip
      // $(gridArray[i]).html(`${i} VALID`)
    }else{
      // $(gridArray[i]).html(`${i}`)
    }
  }
}

function validHoverOn(e){
  // debug()
  const tile = $(e.currentTarget)
  const id = parseInt($(tile).attr('data-id'))

  for(let i=0;i<width*width;i++){
    $(gridArray[i]).removeClass('valid')
  }

  if(validMovesArr[id]){
    tile.addClass('valid')
  }
}

function validHoverOff(e){
  // // debug()
  // const tile = $(e.currentTarget)
  // tile.removeClass('valid')

}

function updatePlayerAndOpponent(){
  player = turnCount%2 === 0 ? 'black':'white'
  opponent = turnCount%2 === 0 ? 'white':'black'
  debug(`player:${player} opponent:${opponent}`)

}

function play(e){
  debug()
  const tile = $(e.currentTarget)

  validMovesLog && console.log('validMovesArr',validMovesArr)

  if(validMovesArr.length === 0){
    noValidMoves[player] = true

    if(noValidMoves[opponent] === true) gameOver()

    console.log('No Valid Moves')
    nextPlayerTurn()
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

    //Add the tile that was clicked
    addTile(tile, player, opponent)

    const timerArr = []
    const delay = 250
    //Flip each tile for this move
    validMovesArr[id].forEach((elem, index)=>{
      const thisPlayer = player
      const thisOpponent = opponent
      const timerId = setTimeout(function(){
        addTile(elem, thisPlayer, thisOpponent)
        timerArr.pop()
      },delay*(index+1))
      timerArr.push(timerId)
    })

    const wait = timerArr.length*delay
    setTimeout(function(){

      nextPlayerTurn()
      $message.html('')

      // console.log('Valid')

      //Work out scores
      calculateScores()

      //Display Scores
      updateScores()

      //Check for end of Game
      if(emptyCount===0){
        gameOver()
      }
    },wait)
  }

}

function buildGame(){
  // GET HTML ELEMENTS
  $grid = $('.grid')

  //Build tiles
  for(let i=0;i<width*width;i++){
    const tile = `<div class='tile' data-id=${i}>
                    <div class='rotate'>
                      <div class='counter'>
                        ${i}
                      </div>
                    </div>
                  </div>`
    $grid.append(tile)
  }

  //Get DOM elements
  //Get an array of all tiles
  gridArray = $grid.find('.tile')

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
  gridArray.on('mouseout',validHoverOff)
}
function undoRedoUpdate(){

  // console.log('history',history, 'turnCount', turnCount)
  gridClassArray = []
  for(let i=0;i<width*width;i++){
    const tile = gridArray[i]
    $(tile).removeClass('black').removeClass('white')
  }
  history[turnCount].forEach((elem,index)=>{
    const tile = gridArray[index]
    // $(tile).removeClass('black').removeClass('white')
    $(tile).addClass(elem)
    gridClassArray[index] = elem
  })
  calculateScores()
  updateScores()
  updatePlayerAndOpponent()
  $turn.html(`${player} turn`)
  getValidMoves(player,opponent)
}
function undoMove(){
  turnCount--
  if(turnCount<0)turnCount=0
  undoRedoUpdate()
}
function redoMove(){
  turnCount++
  if(turnCount>=history.length)turnCount=history.length-1
  undoRedoUpdate()

}

function init(){
  debug()

  buildGame()

  let $start = $('.start')
  let $game = $('.game')
  let $startButton = $('.startButton')
  let $menuButton = $('.menuButton')
  let $resetButton = $('.reset')
  let $undoButton = $('.undo')
  let $redoButton = $('.redo')

  $startButton.on('click', startGame)
  $menuButton.on('click', goToMenu)
  $resetButton.on('click', resetVars)
  $undoButton.on('click', undoMove)
  $redoButton.on('click', redoMove)

  // startGame()

  function startGame(){
    $start.hide()
    $game.show()
  }
  function goToMenu(){
    if(turnCount) $startButton.html('Continue Game')
    else $startButton.html('New Game')
    $game.hide()
    $start.show()
  }


}
