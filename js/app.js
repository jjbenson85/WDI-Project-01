//globals
let turnCount

document.addEventListener('DOMContentLoaded', ()=>{
  init()
})

function resetVars(){
  turnCount = 0

}

function addTile(tile, player){
  tile.addClass(player)
}

function isEmpty(tile){

  if(tile.hasClass('white')||tile.hasClass('black')) return false
  return true
}

function checkIfValid(tile, player){
  //check to see if the tile is empty
  if(isEmpty(tile)) return false

  //check to see if there is an opponent tile next to this tile
  

    //If there is, check to see if there is either a opponent or player tile next to it
    //Add opponent tiles to array

    //As log as it isn't empty, keep looking

    //If it is empty, start again

    //if it finds a player tile, flip all tiles in array
}

function play(e){
  let player = turnCount++%2 == 0 ? 'black':'white'
  let tile = $(e.target)

  //check if it is a valid move
  console.log(checkIfValid(tile, player))
  //if it is valid add tile
  addTile(tile, player)

  //flip oposition tile


  //Increase counter

  //Check game if game is over

  //else do nothing




}
function init(){
  //VARIABLES
  const width = 4
  // const gridArray = []

  // GET HTML ELEMENTS
  // const $h1 = $('h1')
  const $grid = $('.grid')

  //Build tiles
  for(let i=0;i<width*width;i++){
    let square
    if(i==5 || i==10) square = `<div class='tile black' data-id=${i}></div>`
    else if(i==6||i==9) square = `<div class='tile white' data-id=${i}></div>`
    else square = `<div class='tile' data-id=${i}></div>`

    $grid.append(square)
  }

  //reset
  resetVars()

  //Add on click
  const gridArray = $grid.find('div')
  gridArray.on('click', play)
}
