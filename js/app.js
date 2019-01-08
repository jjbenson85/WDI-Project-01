//LOGS
const validMovesLog = false
const debugLog = false
let debugCounter = 0
const delay = 250

// class Game{
//   constructor(level){
//     this.level = level
//     console.log(this.level)
//   }
// }
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
let $hexArray = []
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

let $game
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

// function resetVars(){
//   debug()
//   turnCount = 0
//   clickable = true
//   gridClassArray = []
//   $hexArray.removeClass('black').removeClass('white').removeClass('invert')
//   addTile($hexArray[19], 'black')
//   addTile($hexArray[25], 'white')
//   addTile($hexArray[30], 'black')
//   addTile($hexArray[24], 'white')
//
//   function selectRandom(){
//     const rndm = Math.random()
//     const selected = Math.floor(rndm*numberOfTiles)
//     if($($hexArray[selected]).hasClass('white')||$($hexArray[selected]).hasClass('black')) return selectRandom()
//     return selected
//   }
//
//   const selected = selectRandom()
//   // level = 1
//   switch(level){
//     case 1: break
//     case 2:
//
//       addTile($hexArray[selected],'invert')
//       break
//     case 3:
//       addTile($hexArray[selected],'bomb')
//       break
//     case 4:
//       addTile($hexArray[selected],'invert')
//       break
//   }
//
//   history[turnCount] = JSON.parse(JSON.stringify(gridClassArray))
//
//   nextTurn()
//
// }
function endTurn(){
  $message.html('')

  history[turnCount+1] = JSON.parse(JSON.stringify(gridClassArray))

  //Allow click
  clickable = true

  //Increase the turn count
  turnCount++
}
// function nextTurn(){
//   //Work out scores
//   calculateScores()
//   //Display Scores
//   updateScores()
//   updatePlayerAndOpponent()
//   $turn.html(`${player} turn`)
//   getValidMoves()
// }

// function addTile(tile, player, sound=true){
//   console.log('addtile', sound)
//   debug()
//   opponent = 'black'
//   if(player === 'black') opponent = 'white'
//   $(tile).removeClass(opponent).removeClass('valid')
//   $(tile).addClass(player)
//
//
//   const id = parseInt($(tile).attr('data-id'))
//   gridClassArray[id] = player
//
//   // if($(tile).hasClass('invert')){
//   //   for(let i=0;i<numberOfTiles;i++){
//   //     if($($hexArray[i]).hasClass('white')){
//   //       $($hexArray[i]).removeClass('white')
//   //       $($hexArray[i]).addClass('black')
//   //     }else if($($hexArray[i]).hasClass('black')){
//   //       $($hexArray[i]).removeClass('black')
//   //       $($hexArray[i]).addClass('white')
//   //     }
//   //     if(gridClassArray[id] === 'white') gridClassArray[id] === 'black'
//   //     if(gridClassArray[id] === 'black') gridClassArray[id] === 'white'
//   //   }
//   // }
//   if(sound && gameStart){
//     playSound(id)
//   }
// }

// function isOccupied(tile){
//   debug()
//   if($(tile).hasClass('white'))return 'white'
//   if($(tile).hasClass('black'))return 'black'
//   return false
// }

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


  // console.log('leftIds',leftIds)
  // console.log('rightIds',rightIds)
  // console.log('upIds',upIds)
  // console.log('downIds',downIds)
  // console.log('upLeftIds',upLeftIds)
  // console.log('upRightIds',upRightIds)
  // console.log('downLeftIds',downLeftIds)
  // console.log('downRightIds',downRightIds)
}

// function getNeighbours(tile){
//   const id = parseInt($(tile).attr('data-id'))
//   const neighbourArr = []
//
//   for(let i=0; i<=8; i++){
//
//     const neighbourId = id + directions[i]
//     //If going upLeft and has no neighbour
//     if($($hexArray[neighbourId]).hasClass('hidden')){
//       neighbourArr.push('hidden')
//     }else if(upLeftIds.includes(id) && (i === 0) ) {
//       neighbourArr.push('upLeft')
//
//       //If going up and has no neighbour
//     }else if(upIds.includes(id) && (i === 1)){
//       neighbourArr.push('up')
//
//       //If going upRight and has no neighbour
//     }else if(upRightIds.includes(id) && (i === 2) ) {
//       neighbourArr.push('upRight')
//
//       //In left column and direction is left
//     }else if(leftIds.includes(id) && (i === 3) ) {
//       neighbourArr.push('left')
//
//       //In right column and direction is right
//     }else if(rightIds.includes(id) && (i === 5) ) {
//       neighbourArr.push('right')
//
//       //If going downLeft and has no neighbour
//     }else if(downLeftIds.includes(id) && (i === 6) ) {
//       neighbourArr.push('downLeft')
//
//       //If going down and has no neighbour
//     }else if(downIds.includes(id) && (i === 7)){
//       neighbourArr.push('down')
//
//       //If going downRight and has no neighbour
//     }else if(downRightIds.includes(id) && (i === 8) ) {
//       neighbourArr.push('downRight')
//
//     }else{
//       neighbourArr.push($hexArray[neighbourId])
//     }
//   }
//   // console.log('tile',tile)
//   // console.log('neighbourArr',neighbourArr)
//   // console.log('\n')
//   return neighbourArr
// }
// function validFlip(elem,index){
//
//   //Create an array to store candidates for flipping
//   const potentialArr = []
//
//   //This neighbour-tile's id as an int
//   const id = parseInt($(elem).attr('data-id'))
//
//   //Prep id of next in search, will add direction to look later
//   let nextId = id
//
//   //If this neighbour-tile is an opponent, look on the other side of it
//   if($(elem).hasClass(opponent)){
//     //check to see if there is a player tile in this direction
//     //max travel the twice width of the board -2
//     for(let i=0;i<(2*width)-2;i++){
//
//       //Do test to see which row or column nextId is in
//       //If it is on an edge and is going in that direction, this is not a valid move
//       if(upLeftIds.includes(id) && (index === 0) ) {
//         console.log('upLeft Invalid')
//         return false
//       }
//       if(upIds.includes(id) && (index === 1)){
//         console.log('up Invalid')
//         return false
//       }
//       if(upRightIds.includes(id) && (index === 2) ) {
//         console.log('upRight Invalid')
//         return false
//       }
//       //In left row and direction is left
//       if(leftIds.includes(id) && (index === 3) ) {
//         console.log('left Invalid')
//         return false
//       }
//       //This is the original tile
//       if(index === 4) {
//         return false
//       }
//       //In right row and direction is right
//       if(rightIds.includes(id) && (index === 5) ) {
//         console.log('right Invalid')
//         return false
//       }
//       if(downLeftIds.includes(id) && (index === 6) ) {
//         console.log('downLeft Invalid')
//         return false
//       }
//       if(downIds.includes(id) && (index === 7) ) {
//         console.log('down Invalid')
//         return false
//       }
//       if(downRightIds.includes(id) && (index === 8) ) {
//         console.log('downRight Invalid')
//         return false
//       }
//
//       //The nextId is the current nextId plus the direction, the direction is the index! (This is really neat!)
//       nextId += directions[index]
//
//       //Get the tile associated with this id
//       const nextTile = $hexArray[nextId]
//
//       //If it is a player tile, this is a valid move
//       if ($(nextTile).hasClass(player)){
//         console.log('found player')
//         potentialArr.unshift(elem)
//         return potentialArr
//
//         //If the next tile is an opponent tile, keep searching in this direction
//       }else if ($(nextTile).hasClass(opponent)){
//
//         // console.log('found another opponent')
//
//         //Add this tile to the potentials flip array
//         potentialArr.push(nextTile)
//
//       }else{
//         //This tile is empty it is not a valid move
//         return false
//       }
//     }
//   }
// }
// function checkTileIsValid(tile){
//   debug()
//
//   const flipArr = []
//   //check to see if the tile is empty
//   if(isOccupied(tile)) return false
//   if($(tile).hasClass('hidden'))return false
//
//   //check to see if there is an opponent tile next to this tile
//   //create array of neighbours
//   const neighbours = getNeighbours(tile)
//   console.log('neighbours',neighbours)
//   //for each neighbour check it is a valid move
//   neighbours.some((elem, index)=>{
//     console.log(elem, index)
//     const arr = validFlip(elem,index)
//     if(arr) flipArr.push(arr)
//   })
//
//   //If the flip array contains some tiles to flip then return it
//   //This is a valid move
//   if(flipArr.length) return true
//
//   //Otherwise return false, this move is not valid
//   return false
// }
// function getTilesToFlip(tile){
//   debug()
//   const flipArr = []
//
//   //check to see if there is an opponent tile next to this tile
//   //create array of neighbours
//   const neighbours = getNeighbours(tile)
//
//   //for each neighbour check it is a valid move
//   neighbours.forEach((elem, index)=>{
//     const arr = validFlip(elem,index)
//     if(arr) flipArr.push(arr)
//   })
//
//   //If the flip array contains some tiles to flip then return it
//   //This is a valid move
//   if(flipArr.length) return flipArr
//
//   //Otherwise return false, this move is not valid
//   return false
// }

// function calculateScores(){
//
//   //Increase counter
//   whiteCount = 0
//   blackCount = 0
//   let hiddenCount = 0
//   emptyCount = 0
//   //Check game if game is over
//   for(let i=0;i<numberOfTiles;i++){
//     const tileState = isOccupied($hexArray[i])
//     if(tileState==='white') whiteCount++
//     else if(tileState==='black') blackCount++
//     else if(tileState==='hidden') hiddenCount++
//     else emptyCount++
//   }
// }
//
// function updateScores(){
//   //Update Scores
//   $blackScore.html(`Black: ${blackCount}`)
//   $whiteScore.html(`White: ${whiteCount}`)
//   winner = 'black'
//   if(whiteCount>blackCount) winner = 'white'
//   if(whiteCount===blackCount) winner = 'tie'
// }

// function gameOver(){
//   console.log('Game Over')
//   if(winner === 'tie')$message.html('It\'s a tie!')
//   else $message.html(`${winner} wins!`)
//   level++
//   $screens.hide()
//   $start.show()
// }

// function cpuPlay(){
//   if(player === 'black' && cpu === true){
//     $($hexArray).removeClass('valid')
//     setTimeout(function(){
//       cpuMove()
//     },1000)
//   }

//   function cpuMove(){
//     let rndm
//     let selected
//     let selectedLen
//     let list
//
//     if(validMovesArr.length===0) {
//       $hexArray[20].click()
//       return
//     }
//
//     switch(cpuType){
//       case 'first':
//         for(let i=0;i<numberOfTiles;i++){
//           if(validMovesArr[i]){
//             $hexArray[i].click()
//             break
//           }
//         }
//         break
//
//       case 'random':
//         list =[]
//         for(let i=0;i<numberOfTiles;i++){
//           if(validMovesArr[i]){
//             list.push($hexArray[i])
//           }
//         }
//         //id something in list, get random selection
//         if(list.length){
//           rndm = Math.random()
//           selected = Math.floor(rndm*list.length)
//           list[selected].click()
//         }else{
//           //is nothing in list, click on first grid square to trigger next turn
//           $hexArray[0].click()
//         }
//         break
//
//       case 'greedy':
//         selected = 0
//         selectedLen = 0
//         for(let i=0;i<numberOfTiles;i++){
//           if(validMovesArr[i]){
//             if(validMovesArr[i].length > selectedLen) {
//               selected = $hexArray[i]
//               selectedLen = validMovesArr[i].length
//             }
//             selected.click()
//           }
//         }
//         break
//     }
//   }
// }

//
// function getValidMoves(){
//   debug()
//   validMovesArr = []
//   //calculate all valid moves
//   for(let i=0;i<numberOfTiles;i++){
//     validMovesArr[i] = !!checkTileIsValid($hexArray[i])
//   }
//   validMovesLog && console.log('validMovesArr',validMovesArr)
// }

// function playSound(id){
//   const tone = gridToneArray[id]
//   audioPlayerArr[tone].pause()
//   audioPlayerArr[tone].currentTime = 0
//   audioPlayerArr[tone].play()
// }

// function validHoverOn(e){
//   // debug()
//
//   const tile = $(e.currentTarget)
//   const id = parseInt($(tile).attr('data-id'))
//
//   //Remove class from all, (mouseout had some weird behaviours)
//   for(let i=0;i<numberOfTiles;i++){
//     $($hexArray[i]).removeClass('valid')
//   }
//
//   if(validMovesArr[id]){
//     tile.addClass('valid')
//   }
// }

// function updatePlayerAndOpponent(){
//   opponent = turnCount%2 === 0 ? 'black':'white'
//   player = turnCount%2 === 0 ? 'white':'black'
//   debug(`player:${player} opponent:${opponent}`)
//
// }
// function invertCapture(tile){
//   if($(tile).hasClass('invert')){
//     for(let i=0;i<numberOfTiles;i++){
//       if($($hexArray[i]).hasClass('white')){
//         $($hexArray[i]).removeClass('white')
//         $($hexArray[i]).addClass('black')
//       }else if($($hexArray[i]).hasClass('black')){
//         $($hexArray[i]).removeClass('black')
//         $($hexArray[i]).addClass('white')
//       }
//       if(gridClassArray[i] === 'white') gridClassArray[i] === 'black'
//       if(gridClassArray[i] === 'black') gridClassArray[i] === 'white'
//     }
//     $(tile).addClass(player)
//     $(tile).removeClass(opponent)
//   }
// }
// function play(e){
//   if(!clickable)return
//   debug()
//   const tile = $(e.currentTarget)
//
//
//   // console.log('validMovesArr.some((elem)=>elem',validMovesArr.some((elem)=>elem))
//
//   if(!validMovesArr.some((elem)=>elem)){
//     noValidMoves[player] = true
//     console.log(noValidMoves)
//     if(noValidMoves[opponent] === true){
//       gameOver()
//       return
//     }
//
//     console.log('No Valid Moves')
//     endTurn()
//     nextTurn()
//     cpuPlay()
//
//     $message.html('No Valid Moves')
//     //Invalid move
//     console.log('Invalid')
//     return
//   }
//
//   noValidMoves[player] = false
//
//   //check if it is a valid move
//   const id = parseInt($(tile).attr('data-id'))
//
//   //If the valid moves array contains this tile
//   if(validMovesArr[id]){
//
//     //disable click
//     clickable = false
//
//     //Add the tile that was clicked
//     addTile(tile, player)
//
//
//
//     const timerArr = []
//
//     //Get tiles to flip
//     const tilesToFlip = getTilesToFlip(tile)
//     // console.log('tilesToFlip',tilesToFlip)
//     //Flip each tile for this move
//     // validMovesArr[id].forEach((elem, index)=>{
//     tilesToFlip.forEach((elem, index)=>{
//       // console.log('tilesToFlip.forEach elem', elem, 'index', index)
//       const thisPlayer = player
//       // const thisOpponent = opponent
//
//       elem.forEach((thisTile, i)=>{
//         const timerId = setTimeout(function(){
//           if(index===0)addTile(thisTile, thisPlayer)
//           else addTile(thisTile, thisPlayer, false)
//           invertCapture(thisTile)
//           timerArr.pop()
//         },delay*(i+1))
//         timerArr.push(timerId)
//
//       })
//       // console.log(turnCount,'delay*(index+1)',delay*(index+1),'index',index)
//     })
//
//     invertCapture(tile)
//
//     const wait = timerArr.length*delay
//     setTimeout(function(){
//
//       endTurn()
//
//       nextTurn()
//
//       cpuPlay()
//
//       //Check for end of Game
//       if(emptyCount===0){
//         gameOver()
//       }
//     },wait)
//   }
//
// }
class GameLevel{
  constructor($game,level){
    this.level = level
    console.log(this.level)
    this.$game = $game


    this.getHtmlElements()
    this.buildRows()
    this.buildTiles()
    this.numberTiles()
    this.hideTiles()
    this.createAudio()
    this.resetVariables()
    this.updatePlayerAndOpponent()
    this.getValidMoves()
    this.addClickEvents()

  }



  getHtmlElements(){
    // this.$game = $gameDiv//$('.game')
    this.$grid = $(this.$game).find('.hex-grid')
    $(this.$grid).empty()

    const $scores = $('.scores')
    $blackScore = $scores.find('.black')
    $whiteScore = $scores.find('.white')

    $turn = $('.turn')
    $message = $('.message')
  }
  buildRows(){
    //Build rows
    console.log(this.myProp)
    console.log(' build Rows $(this.grid)',$(this.$grid) )
    let row = ''
    for(let i=0;i<(2*width)-1;i++){
      if(i%2===0) row = '<div class="even"></div>'
      if(i%2===1) row = '<div class="odd"></div>'
      $(this.$grid).append(row)
    }
    console.log(' build Rows $(this.grid)',$(this.$grid) )
  }
  buildTiles(){
    //Build tiles
    // console.log('buildTiles $grid', this.$grid)
    this.$evens = $(this.$grid).find('.even')
    this.$odds = $(this.$grid).find('.odd')
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
    for(let j=0;j<width;j++){
      $(this.$evens).append(hex)
    }
    for(let j=0;j<width-1;j++){
      $(this.$odds).append(hex)
    }
    this.$hexArray = $(this.$grid).find('.hex')
    // console.log('buildTiles this.$hexArray', this.$hexArray)

  }

  numberTiles(){
    // $hexArray.length?
    for(let i=0;i<numberOfTiles;i++){
      $(this.$hexArray[i]).attr('data-id',i)
    }

    if(showNumbers === true){
      const $firstSegs = $(this.$hexArray).find('.diamond:last-child .seg')
      $firstSegs.each(function( index ){
        this.append(index)
      })
    }
  }

  hideTiles(){
    const $topTiles = $(this.$grid).find('.even:first-child > .hex')
    const $bottomTiles = $(this.$grid).find('.even:last-child > .hex')
    // const $rows = $grid.find('div')
    const $leftTiles = $(this.$evens).find('.hex:first-child')
    const $rightTiles = $(this.$evens).find('.hex:last-child')

    $topTiles.addClass('hidden')
    $bottomTiles.addClass('hidden')
    $leftTiles.addClass('hidden')
    $rightTiles.addClass('hidden')

    for(let i=0;i<numberOfTiles;i++){
      $(this.$hexArray[i]).addClass('hidden')
    }
    // $(this.$hexArray[4]).removeClass('hidden')
    // $(this.$hexArray[5]).removeClass('hidden')
    // $(this.$hexArray[6]).removeClass('hidden')
  }

  addTile(tile, player, sound=true){
    // console.log('addtile', tile)
    // debug()
    opponent = 'black'
    if(player === 'black') opponent = 'white'
    $(tile).removeClass(opponent).removeClass('valid')
    $(tile).addClass(player)


    const id = parseInt($(tile).attr('data-id'))
    // console.log('addTile id',id)
    gridClassArray[id] = player

    // if($(tile).hasClass('invert')){
    //   for(let i=0;i<numberOfTiles;i++){
    //     if($($hexArray[i]).hasClass('white')){
    //       $($hexArray[i]).removeClass('white')
    //       $($hexArray[i]).addClass('black')
    //     }else if($($hexArray[i]).hasClass('black')){
    //       $($hexArray[i]).removeClass('black')
    //       $($hexArray[i]).addClass('white')
    //     }
    //     if(gridClassArray[id] === 'white') gridClassArray[id] === 'black'
    //     if(gridClassArray[id] === 'black') gridClassArray[id] === 'white'
    //   }
    // }
    if(sound && gameStart){
      this.playSound(id)
    }
  }

  createAudio(){
    this.audioPlayerArr = []
    this.gridToneArray = []
    for(let i=0;i<9;i++){
      this.audioPlayer = document.createElement('audio')
      this.audioPlayer.src = 'assets/'+srcArray[i]
      this.audioPlayerArr.push(this.audioPlayer)

    }

    let j = 0
    for(let i=0;i<numberOfTiles;i++){
      this.gridToneArray[i] = j
      j = (j+7)%9
    }
  }

  playSound(id){
    // console.log('playSound(id)',id)
    const tone = this.gridToneArray[id]
    this.audioPlayerArr[tone].pause()
    this.audioPlayerArr[tone].currentTime = 0
    this.audioPlayerArr[tone].play()
  }

  selectRandom(){
    const rndm = Math.random()
    const selected = Math.floor(rndm*numberOfTiles)
    if($(this.$hexArray[selected]).hasClass('white')||$(this.$hexArray[selected]).hasClass('black')) return this.selectRandom()
    return selected
  }

  updatePlayerAndOpponent(){
    opponent = turnCount%2 === 0 ? 'black':'white'
    player = turnCount%2 === 0 ? 'white':'black'
    debug(`player:${player} opponent:${opponent}`)

  }

  resetVariables(){
    turnCount = 0
    clickable = true
    gridClassArray = []
    // console.log('resetVariables this.$hexArray', this.$hexArray)
    $(this.$hexArray).removeClass('black').removeClass('white').removeClass('invert')
    // this.addTile($(this.$hexArray[12]), 'black')
    // this.addTile($(this.$hexArray[7]), 'white')
    // this.addTile($(this.$hexArray[30]), 'black')
    // this.addTile($(this.$hexArray[24]), 'white')
    // $(this.$hexArray[7]).removeClass('hidden')
    // $(this.$hexArray[12]).removeClass('hidden')
    // $(this.$hexArray[17]).removeClass('hidden')
    // function selectRandom(this){
    //   const rndm = Math.random()
    //   const selected = Math.floor(rndm*numberOfTiles)
    //   if($(this.$hexArray[selected]).hasClass('white')||$(this.$hexArray[selected]).hasClass('black')) return selectRandom()
    //   return selected
    // }

    const selected = this.selectRandom()
    // level = 1
    switch(level){
      case 1:
        $(this.$hexArray[7]).removeClass('hidden').addClass('white')
        $(this.$hexArray[12]).removeClass('hidden').addClass('black')
        $(this.$hexArray[17]).removeClass('hidden')
        break
      case 2:
        $(this.$hexArray[46]).removeClass('hidden')
        $(this.$hexArray[41]).removeClass('hidden').addClass('black')
        $(this.$hexArray[36]).removeClass('hidden').addClass('black')
        $(this.$hexArray[31]).removeClass('hidden').addClass('white')
        // this.addTile(this.$hexArray[selected],'invert')
        break
      case 3:
        $(this.$hexArray[41]).removeClass('hidden')
        $(this.$hexArray[35]).removeClass('hidden').addClass('black')
        $(this.$hexArray[29]).removeClass('hidden').addClass('white')
        $(this.$hexArray[36]).removeClass('hidden').addClass('black')
        $(this.$hexArray[31]).removeClass('hidden').addClass('white')
        this.addTile(this.$hexArray[selected],'invert')
        break
      case 4:
        for(let i=0; i < numberOfTiles;i++){
          $(this.$hexArray[i]).removeClass('hidden')
        }
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        $(this.$hexArray[25]).removeClass('hidden').addClass('white')
        $(this.$hexArray[30]).removeClass('hidden').addClass('black')
        $(this.$hexArray[24]).removeClass('hidden').addClass('white')
        this.addTile(this.$hexArray[selected],'bomb')
        break
      case 5:
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        break
      case 6:
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        break
      case 7:
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        break
      case 8:
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        break
      case 9:
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        break
      case 10:
        $(this.$hexArray[selected]).addClass('invert')
        $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        break
    }

    history[turnCount] = JSON.parse(JSON.stringify(gridClassArray))

    // nextTurn()
  }
  isOccupied(tile){
    if($(tile).hasClass('white'))return 'white'
    if($(tile).hasClass('black'))return 'black'
    return false
  }
  getNeighbours(tile){
    const id = parseInt($(tile).attr('data-id'))
    const neighbourArr = []

    for(let i=0; i<=8; i++){

      const neighbourId = id + directions[i]
      //If going upLeft and has no neighbour
      if($(this.$hexArray[neighbourId]).hasClass('hidden')){
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
        neighbourArr.push(this.$hexArray[neighbourId])
      }
    }
    // console.log('tile',tile)
    // console.log('neighbourArr',neighbourArr)
    // console.log('\n')
    return neighbourArr
  }
  validFlip(elem,index){

    //Create an array to store candidates for flipping
    const potentialArr = []

    //This neighbour-tile's id as an int
    const id = parseInt($(elem).attr('data-id'))

    //Prep id of next in search, will add direction to look later
    let nextId = id
    // console.log('valid flip', id, elem)
    //If this neighbour-tile is an opponent, look on the other side of it
    if($(elem).hasClass(opponent)){
      // console.log('has opponent')
      //check to see if there is a player tile in this direction
      //max travel the twice width of the board -2
      for(let i=0;i<(2*width)-2;i++){

        //Do test to see which row or column nextId is in
        //If it is on an edge and is going in that direction, this is not a valid move
        if(upLeftIds.includes(id) && (index === 0) ) {
          // console.log('upLeft Invalid')
          return false
        }
        if(upIds.includes(id) && (index === 1)){
          // console.log('up Invalid')
          return false
        }
        if(upRightIds.includes(id) && (index === 2) ) {
          // console.log('upRight Invalid')
          return false
        }
        //In left row and direction is left
        if(leftIds.includes(id) && (index === 3) ) {
          // console.log('left Invalid')
          return false
        }
        //This is the original tile
        if(index === 4) {
          return false
        }
        //In right row and direction is right
        if(rightIds.includes(id) && (index === 5) ) {
          // console.log('right Invalid')
          return false
        }
        if(downLeftIds.includes(id) && (index === 6) ) {
          // console.log('downLeft Invalid')
          return false
        }
        if(downIds.includes(id) && (index === 7) ) {
          // console.log('down Invalid')
          return false
        }
        if(downRightIds.includes(id) && (index === 8) ) {
          // console.log('downRight Invalid')
          return false
        }

        //The nextId is the current nextId plus the direction, the direction is the index! (This is really neat!)
        nextId += directions[index]

        // console.log('has opponent nextId', nextId)
        //Get the tile associated with this id
        const nextTile = this.$hexArray[nextId]
        // console.log('has opponent nextTile', $(nextTile))
        // console.log('player',player)

        //If it is a player tile, this is a valid move
        if ($(nextTile).hasClass(player)){
          // console.log('found player')
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
  checkTileIsValid(tile){
    const flipArr = []
    //check to see if the tile is empty
    if(this.isOccupied(tile)) return false
    if($(tile).hasClass('hidden'))return false

    //check to see if there is an opponent tile next to this tile
    //create array of neighbours
    const neighbours = this.getNeighbours(tile)
    // console.log('neighbours',neighbours)
    //for each neighbour check it is a valid move
    neighbours.some((elem, index)=>{
      if(typeof elem === 'string') return
      const arr = this.validFlip(elem,index)
      // console.log(elem, index, arr)
      if(arr) flipArr.push(arr)
    })

    //If the flip array contains some tiles to flip then return it
    //This is a valid move
    if(flipArr.length) return true

    //Otherwise return false, this move is not valid
    return false
  }

  getValidMoves(){
    // debug()
    this.validMovesArr = []
    //calculate all valid moves

    for(let i=0;i<numberOfTiles;i++){
      // this.validMovesArr[i] = !!checkTileIsValid($(this.$hexArray)[i])
      this.validMovesArr[i] = !!this.checkTileIsValid($(this.$hexArray)[i])
    }
    // console.log('validMovesArr',this.validMovesArr)
  }

  validHoverOn(e, arr){
    // debug()
    // console.log('what we passed', arr)
    const tile = $(e.currentTarget)
    const id = parseInt($(tile).attr('data-id'))

    // console.log('validHoverOn this',$(this))
    //Remove class from all, (mouseout had some weird behaviours)
    // console.log('VALID HOVER',id)
    // console.log('tile',tile)
    if(this.validMovesArr[id]){
      for(let i=0;i<numberOfTiles;i++){
        arr.removeClass('valid')
      }
      tile.addClass('valid')
      // console.log('$(this.validMovesArr[id])',$(this.validMovesArr))
    }
  }

  getTilesToFlip(tile){
    const flipArr = []

    //check to see if there is an opponent tile next to this tile
    //create array of neighbours
    const neighbours = this.getNeighbours(tile)

    //for each neighbour check it is a valid move
    neighbours.forEach((elem, index)=>{
      const arr = this.validFlip(elem,index)
      if(arr) flipArr.push(arr)
    })

    //If the flip array contains some tiles to flip then return it
    //This is a valid move
    if(flipArr.length) return flipArr

    //Otherwise return false, this move is not valid
    return false
  }
  endTurn(){
    $message.html('')

    history[turnCount+1] = JSON.parse(JSON.stringify(gridClassArray))

    //Allow click
    clickable = true

    //Increase the turn count
    turnCount++
  }
  calculateScores(){

    //Increase counter
    whiteCount = 0
    blackCount = 0
    let hiddenCount = 0
    emptyCount = 0
    //Check game if game is over
    for(let i=0;i<numberOfTiles;i++){
      const tileState = this.isOccupied($hexArray[i])
      if(tileState==='white') whiteCount++
      else if(tileState==='black') blackCount++
      else if(tileState==='hidden') hiddenCount++
      else emptyCount++
    }
  }
  updateScores(){
    //Update Scores
    $blackScore.html(`Black: ${blackCount}`)
    $whiteScore.html(`White: ${whiteCount}`)
    winner = 'black'
    if(whiteCount>blackCount) winner = 'white'
    if(whiteCount===blackCount) winner = 'tie'
  }
  nextTurn(){
    //Work out scores
    this.calculateScores()
    //Display Scores
    this.updateScores()
    this.updatePlayerAndOpponent()
    $turn.html(`${player} turn`)
    this.getValidMoves()
  }
  cpuMove(){
    let rndm
    let selected
    let selectedLen
    let list

    if(this.validMovesArr.length===0) {
      $(this.$hexArray[20]).click()
      return
    }

    switch(cpuType){
      case 'first':
        for(let i=0;i<numberOfTiles;i++){
          if(this.validMovesArr[i]){
            $(this.$hexArray[i]).click()
            break
          }
        }
        break

      case 'random':
        list =[]
        for(let i=0;i<numberOfTiles;i++){
          if(this.validMovesArr[i]){
            list.push($(this.$hexArray)[i])
          }
        }
        //id something in list, get random selection
        if(list.length){
          rndm = Math.random()
          selected = Math.floor(rndm*list.length)
          list[selected].click()
        }else{
          //is nothing in list, click on first grid square to trigger next turn
          $(this.$hexArray[0]).click()
        }
        break

      case 'greedy':
        selected = 0
        selectedLen = 0
        for(let i=0;i<numberOfTiles;i++){
          if(this.validMovesArr[i]){
            if(this.validMovesArr[i].length > selectedLen) {
              selected = $(this.$hexArray[i])
              selectedLen = this.validMovesArr[i].length
            }
            selected.click()
          }
        }
        break
    }
  }
  cpuPlay(){
    if(player === 'black' && cpu === true){
      $(this.$hexArray).removeClass('valid')
      const that = this
      setTimeout(function(){
        that.cpuMove()
      },1000)
    }
  }
  gameOver(){
    console.log('Game Over')
    if(winner === 'tie')$message.html('It\'s a tie!')
    else $message.html(`${winner} wins!`)
    level++
    $screens.hide()
    $start.show()
  }
  invertCapture(tile){
    if($(tile).hasClass('invert')){
      for(let i=0;i<numberOfTiles;i++){
        if($(this.$hexArray[i]).hasClass('white')){
          $(this.$hexArray[i]).removeClass('white')
          $(this.$hexArray[i]).addClass('black')
        }else if($(this.$hexArray[i]).hasClass('black')){
          $(this.$hexArray[i]).removeClass('black')
          $(this.$hexArray[i]).addClass('white')
        }
        // if(this.gridClassArray[i] === 'white') this.gridClassArray[i] === 'black'
        // if(this.gridClassArray[i] === 'black') this.gridClassArray[i] === 'white'
      }
      $(tile).addClass(player)
      $(tile).removeClass(opponent)
    }
  }
  play(e){
    if(!clickable)return
    debug()
    const tile = $(e.currentTarget)

    if(!this.validMovesArr.some((elem)=>elem)){
      noValidMoves[player] = true
      console.log(noValidMoves)
      if(noValidMoves[opponent] === true){
        this.gameOver()
        return
      }

      console.log('No Valid Moves')
      this.endTurn()
      this.nextTurn()
      this.cpuPlay()

      $message.html('No Valid Moves')
      //Invalid move
      console.log('Invalid')
      return
    }

    noValidMoves[player] = false

    //check if it is a valid move
    const id = parseInt($(tile).attr('data-id'))

    //If the valid moves array contains this tile
    if(this.validMovesArr[id]){

      //disable click
      clickable = false

      //Add the tile that was clicked
      this.addTile(tile, player)

      const timerArr = []

      //Get tiles to flip
      const tilesToFlip = this.getTilesToFlip(tile)
      //Flip each tile for this move
      const that = this
      const thisPlayer = player
      tilesToFlip.forEach((elem, index)=>{

        elem.forEach((thisTile, i)=>{

          const timerId = setTimeout(function(){

            if(index===0) that.addTile(thisTile, thisPlayer)
            else that.addTile(thisTile, thisPlayer, false)
            that.invertCapture(thisTile)
            timerArr.pop()
          },delay*(i+1))

          timerArr.push(timerId)

        })
      })

      this.invertCapture(tile)

      const wait = timerArr.length*delay
      setTimeout(function(){
        that.endTurn()
        that.nextTurn()
        that.cpuPlay()
        //Check for end of Game
        if(emptyCount===0){
          this.gameOver()
        }
      },wait)
    }

  }
  addClickEvents(){
    // console.log('from the click handler', this)
    //Add on click
    $(this.$hexArray).on('click', (e) => this.play(e))
    $(this.$hexArray).on('mouseenter', (e) => this.validHoverOn(e, $(this.$hexArray)))
  }
}

function buildGame(){
  // GET HTML ELEMENTS
//   $game = $('.game')
//   $grid = $game.find('.hex-grid')
//
//   //Build tiles
//   let row = ''
//
//   for(let i=0;i<(2*width)-1;i++){
//     if(i%2===0) row = '<div class="even"></div>'
//     if(i%2===1) row = '<div class="odd"></div>'
//     $grid.append(row)
//   }
//
//   const $evens = $grid.find('.even')
//   const $odds = $grid.find('.odd')
//   const hex = `<div class="hex">
//     <div class="diamond">
//       <div class="scale">
//         <div class="seg"></div>
//       </div>
//     </div>
//     <div class="diamond">
//       <div class="scale">
//         <div class="seg"></div>
//       </div>
//     </div>
//     <div class="diamond">
//       <div class="scale">
//         <div class="seg"></div>
//       </div>
//     </div>
// </div>`
//   for(let j=0;j<width;j++){
//     $evens.append(hex)
//   }
//   for(let j=0;j<width-1;j++){
//     $odds.append(hex)
//   }
//   // const $hexs = $grid.find('.hex')
//
//   //Get DOM elements
//   //Get an array of all tiles
//   $hexArray = $grid.find('.hex')
//   for(let i=0;i<numberOfTiles;i++){
//     $($hexArray[i]).attr('data-id',i)
//   }
//   const $firstSegs = $hexArray.find('.diamond:last-child .seg')
//   if(showNumbers === true){
//     $firstSegs.each(function( index ){
//       this.append(index)
//     })
//   }

  // const $topTiles = $grid.find('.even:first-child > .hex')
  // const $bottomTiles = $grid.find('.even:last-child > .hex')
  // const $rows = $grid.find('div')
  // const $leftTiles = $evens.find('.hex:first-child')
  // const $rightTiles = $evens.find('.hex:last-child')
  //
  // $topTiles.addClass('hidden')
  // $bottomTiles.addClass('hidden')
  // $leftTiles.addClass('hidden')
  // $rightTiles.addClass('hidden')



  // for(let i=0;i<9;i++){
  //   audioPlayer = document.createElement('audio')
  //   audioPlayer.src = 'assets/'+srcArray[i]
  //   audioPlayerArr.push(audioPlayer)
  //
  // }
  //
  // let j = 0
  // for(let i=0;i<numberOfTiles;i++){
  //   gridToneArray[i] = j
  //   j = (j+7)%9
  // }
  //
  // const $scores = $('.scores')
  // $blackScore = $scores.find('.black')
  // $whiteScore = $scores.find('.white')
  //
  // $turn = $('.turn')
  // $message = $('.message')
  //
  // //reset variables
  // resetVars()
  //
  // //Add on click
  // $hexArray.on('click', play)
  // $hexArray.on('mouseenter',validHoverOn)
}


function undoRedoUpdate(){

  gridClassArray = []
  for(let i=0;i<numberOfTiles;i++){
    const tile = $hexArray[i]
    $(tile).removeClass('black').removeClass('white')
  }
  history[turnCount].forEach((elem,index)=>{
    const tile = $hexArray[index]
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
  createLookups()

  const $game = $('.game')
  // const gameLevel1 = new GameLevel($game,'level 1')

  // buildGame()


  $screens = $('.screen')
  $start = $('.start')
  const $settings = $('.settings')
  const $startButton = $('.startButton')
  const $level1Button = $('.level1')
  const $level2Button = $('.level2')
  const $level3Button = $('.level3')
  const $level4Button = $('.level4')
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
  $level4Button.on('click', ()=>goToGame(4))
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
    // resetVars()
    // $game.empty()
    const gameLevel1 = new GameLevel($($game),level)
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
