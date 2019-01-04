//globals
const width = 4
let gridArray = []
let turnCount
let toFlipArray = []
let potentialFlipArray = []
let loopCounter = 0

const debugLog = true
let debugCounter = 0

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
  turnCount = 1

}

function addTile(tile, player, opponent){
  debug()
  $(tile).removeClass(opponent)
  $(tile).addClass(player)
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

    if(inLeft(id) && (i === 0 || i === 3 || i === 6) ) {
      console.log('inLeft')
      neighbourId = -1

    }

    if(inRight(id) && (i === 2 || i === 5 || i === 8) ){
    // if(inRight(id)){
      console.log('inRight')

       neighbourId = -1

     }
    if(inBottom(id) && (i === 6 || i === 7 || i === 8) ){
      console.log('inBottom')

       neighbourId = -1

     }
    if(inTop(id) && (i === 0 || i === 1 || i === 2) ) {
      console.log('inTop')

      neighbourId = -1

    }

    console.log(`newGetNeighbours i:${i} neighbourId:${neighbourId}`)
    console.log(gridArray[neighbourId])

    neighbourArr.push(gridArray[neighbourId])

  }

  return neighbourArr


}


function getNeighbours(tile){
  debug()
  let id = $(tile).attr('data-id')
  id = parseInt(id)
  const array = []
  // const idArray = []

  let skipCol
  let skipRow
  let counter = -1

  // const edge = getEdge(tile)

  //In left column
  if(inLeft(id)) skipCol = -1

  //In right column
  if(inRight(id)) skipCol = 1

  //In Top Row
  if(inTop(id)) skipRow = -1

  //In Bottom Row
  if(inBottom(id)) skipRow = 1

  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      counter++

      let neighbour = id + (i*width) + j
      let test = id + directions[counter]

      console.log('counter',counter,'neighbour',neighbour,'test',test)

      if(i === skipRow) {
        // console.log('neighbour',neighbour,'skipRow',skipRow)
        neighbour = -1
      }else if(j === skipCol){
        // console.log('neighbour',neighbour,'skipCol',skipCol)
        neighbour = -1
      }

      const neighbourTile = gridArray[neighbour]

      array.push(neighbourTile)
      // idArray.push(neighbour)
    }
  }




  // console.log('id',id,'idArray',idArray)
  return array
}


function checkIfValid(tile, player, opponent){
  debug()

  const array = []

  //check to see if the tile is empty
  if(isOccupied(tile)) return false


  //check to see if there is an opponent tile next to this tile
  //create array of neighbours
  // const neighbours = getNeighbours(tile)
  const neighbours = newGetNeighbours(tile)
  console.log('neighbours',neighbours)

  //check if neighbour is an opponent
  neighbours.forEach((elem, index)=>{
    const potentialArr = []
    const id = parseInt($(elem).attr('data-id'))
    let nextId = id
    console.log('for each neighbour', index)

    if($(elem).hasClass(opponent)){
      console.log(elem)
      //check to see if there is a player tile in this direction
      for(let i=0;i<width;i++){

        //Do test to see which row or column nextId is in
        //If it is on an edge and is going in that direction, stop!




        if(inLeft(nextId) && (index === 0 || index === 3 || index === 6) ){
          console.log(`i:${i} inLeft`)
          return false
        }
        if(inRight(nextId) && (index === 2 || index === 5 || index === 8) ){
          console.log(`i:${i} inRight`)
           return false
         }
        if(inBottom(nextId) && (index === 6 || index === 7 || index === 8) ){
          console.log(`i:${i} inBottom`)
           return false
         }
        if(inTop(nextId) && (index === 0 || index === 1 || index === 2) ){
          console.log(`i:${i} inTop`)
           return false
         }

         nextId += directions[index]

        console.log('nextId',nextId)
        const nextTile = gridArray[nextId]
        console.log('nextTile',nextTile)

        if ($(nextTile).hasClass(player)){
          console.log('found Player Tile', array)
          array.concat(potentialArr)
          array.push(elem)
          return array

        }else if ($(nextTile).hasClass(opponent)){
          console.log('found Opponent Tile')
          potentialArr.push(nextTile)

        }else{
          console.log('found empty Tile')
          return false
        }

      }

    }

  })
  if(array.length) return array
  return false
}

function play(e){
  debug()
  const player = turnCount%2 === 0 ? 'black':'white'
  const opponent = turnCount%2 === 0 ? 'white':'black'
  const tile = $(e.target)

  //check if it is a valid move
  const tilesToFlip = checkIfValid(tile, player, opponent)
  console.log('tilesToFlip',tilesToFlip)
  if(tilesToFlip){
    //if it is valid add tile
    tilesToFlip.forEach((elem)=>{
      console.log('elem',elem)
      addTile(elem, player, opponent)
    })
    addTile(tile, player, opponent)
    turnCount++
    console.log('Valid')
  }else{
    console.log('Invalid')

  }

  //flip oposition tile


  //Increase counter

  //Check game if game is over
  if(turnCount===(width*width)-4){
    window.alert('Game Over')
  }
  //else do nothing




}
function init(){
  debug()
  //VARIABLES

  // const gridArray = []

  // GET HTML ELEMENTS
  // const $h1 = $('h1')
  const $grid = $('.grid')

  //Build tiles
  for(let i=0;i<width*width;i++){
    let square
    if(i==2 || i==5 || i==6 || i==6 || i==7 || i==10) square = `<div class='tile black' data-id=${i}>${i}</div>`
    else if(i==3||i==9) square = `<div class='tile white' data-id=${i}>${i}</div>`
    else square = `<div class='tile' data-id=${i}>${i}</div>`

    $grid.append(square)
  }

  //reset
  resetVars()

  //Add on click
  gridArray = $grid.find('div')
  gridArray.on('click', play)
}
