const delay = 250
const width = 8
const numberOfTiles = 112
// const leftIds = []
// const upLeftIds = []
// const downLeftIds = []
// const rightIds = []
// const upRightIds = []
// const downRightIds = []
// const upIds = []
// const downIds = []
const showNumbers = false
const srcArray = [
  '1_C3.m4a',
  // '2_Cs3.m4a',
  '3_D3.m4a',
  '4_Eb3.m4a',
  '5_E3.m4a',
  '6_F3.m4a',
  // '7_Fs3.m4a',
  '8_G3.m4a',
  // '9_Gs3.m4a',
  '10_A3.m4a',
  '11_Bb3.m4a',
  // '12_B3.m4a',
  '13_C4.m4a'
]

let gameStart = false
let level = 16
const $hexArray = []
let gridClassArray = []
const history = []
let cpu
let cpuType = 'greedy'
let turnCount
let whiteCount
let blackCount
let player
let opponent
let clickable = true
const noValidMoves = {
  'black': false,
  'white': false
}
let $turn
let $message
let $screens
let $start
let $footer
let $turnIcon
let $fireworks

document.addEventListener('DOMContentLoaded', ()=>{
  init()
})

const directions = [-width,(-2*width)+1,-width+1,-1,0,1,width-1,(2*width)-1,width]
const directionLookUp = {
  'upLeft': [],
  'up': [],
  'upRight': [],
  'left': [],
  'here': [],
  'right': [],
  'downleft': [],
  'down': [],
  'downRight': []

}
// function createLookups(){
//
//
//
//
//
//
//   const numEdges = 11
//
//   let i = 0
//   leftIds.push(i)
//   while(i<numberOfTiles-width){
//     i+=width
//     leftIds.push(i)
//     directionLookUp.left.push(i)
//     i+=width-1
//     leftIds.push(i)
//     directionLookUp.left.push(i)
//   }
//
//   i = width-1
//   rightIds.push(i)
//   while(i<numberOfTiles-width){
//     i+=width-1
//     rightIds.push(i)
//     i+=width
//     rightIds.push(i)
//   }
//
//
//   for(i=0;i<11;i++){
//     upIds.push(i)
//   }
//
//
//   for(i=50;i<61;i++){
//     downIds.push(i)
//   }
//
//
//   for(i=0;i<width;i++){
//     upLeftIds.push(i)
//   }
//   for(i=0;i<leftIds.length;i+=2){
//     upLeftIds.push(leftIds[i])
//   }
//
//
//   //UP RIGHT
//   for(i=0;i<width-1;i++){
//     upRightIds.push(i)
//   }
//
//   for(i=0;i<rightIds.length;i+=2){
//     upRightIds.push(rightIds[i])
//   }
//
//
//   //DOWN LEFT
//   for(i=55;i<numberOfTiles;i++){
//     downLeftIds.push(i)
//   }
//
//   for(i=0;i<leftIds.length;i+=2){
//     downLeftIds.push(leftIds[i])
//   }
//
//
//   //DOWN RIGHT
//   for(i=55;i<numberOfTiles;i++){
//     downRightIds.push(i)
//   }
//
//   for(i=0;i<rightIds.length;i+=2){
//     downRightIds.push(rightIds[i])
//   }
//
// }

class GameLevel{
  constructor($game,level){
    this.level = level
    console.log('Level:',this.level)
    this.$game = $game


    this.getHtmlElements()
    this.buildRows()
    this.buildTiles()
    this.numberTiles()
    this.hideTiles()
    this.createAudio()
    this.resetVariables()
    this.createLookups()
    this.updatePlayerAndOpponent()
    this.getValidMoves()
    this.addClickEvents()

  }



  getHtmlElements(){
    // this.$game = $gameDiv//$('.game')
    this.$grid = $(this.$game).find('.hex-grid')
    $(this.$grid).empty()

    const $scores = $('.scores')
    // $blackScore = $scores.find('.black')
    // $whiteScore = $scores.find('.white')

    $turn = $('.turn')
    $message = $('.message')
  }
  buildRows(){
    //Build rows
    // console.log(' build Rows $(this.grid)',$(this.$grid) )
    let row = ''
    for(let i=0;i<(2*width)-1;i++){
      if(i%2===0) row = '<div class="even"></div>'
      if(i%2===1) row = '<div class="odd"></div>'
      $(this.$grid).append(row)
    }
    // console.log(' build Rows $(this.grid)',$(this.$grid) )
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
    // const $topTiles = $(this.$grid).find('.even:first-child > .hex')
    // const $bottomTiles = $(this.$grid).find('.even:last-child > .hex')
    // // const $rows = $grid.find('div')
    // const $leftTiles = $(this.$evens).find('.hex:first-child')
    // const $rightTiles = $(this.$evens).find('.hex:last-child')
    //
    // $topTiles.addClass('hidden')
    // $bottomTiles.addClass('hidden')
    // $leftTiles.addClass('hidden')
    // $rightTiles.addClass('hidden')

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
    if(player === 'black') {
      opponent = 'white'
      // blackCount++
    }else{
      opponent = 'black'
      // whiteCount++
    }
    // this.updateScores()
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
      this.audioPlayer.src = 'sounds/'+srcArray[i]
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

  createLookups(){


    this.neighbourLookup = []

    for(let i=0;i<numberOfTiles;i++){
      this.neighbourLookup[i] = this.getNeighbours(this.$hexArray[i])
    }
    // console.log(this.neighbourLookup)
    //
    //
    //
    // const numEdges = 11
    //
    // let i = 0
    // leftIds.push(i)
    // while(i<numberOfTiles-width){
    //   i+=width
    //   leftIds.push(i)
    //   directionLookUp.left.push(i)
    //   i+=width-1
    //   leftIds.push(i)
    //   directionLookUp.left.push(i)
    // }
    //
    // i = width-1
    // rightIds.push(i)
    // while(i<numberOfTiles-width){
    //   i+=width-1
    //   rightIds.push(i)
    //   i+=width
    //   rightIds.push(i)
    // }
    //
    //
    // for(i=0;i<11;i++){
    //   upIds.push(i)
    // }
    //
    //
    // for(i=50;i<61;i++){
    //   downIds.push(i)
    // }
    //
    //
    // for(i=0;i<width;i++){
    //   upLeftIds.push(i)
    // }
    // for(i=0;i<leftIds.length;i+=2){
    //   upLeftIds.push(leftIds[i])
    // }
    //
    //
    // //UP RIGHT
    // for(i=0;i<width-1;i++){
    //   upRightIds.push(i)
    // }
    //
    // for(i=0;i<rightIds.length;i+=2){
    //   upRightIds.push(rightIds[i])
    // }
    //
    //
    // //DOWN LEFT
    // for(i=55;i<numberOfTiles;i++){
    //   downLeftIds.push(i)
    // }
    //
    // for(i=0;i<leftIds.length;i+=2){
    //   downLeftIds.push(leftIds[i])
    // }
    //
    //
    // //DOWN RIGHT
    // for(i=55;i<numberOfTiles;i++){
    //   downRightIds.push(i)
    // }
    //
    // for(i=0;i<rightIds.length;i+=2){
    //   downRightIds.push(rightIds[i])
    // }

  }


  selectRandom(arr){
    const rndm = Math.random()
    const selected = arr[Math.floor(rndm*arr.length)]
    //if($(this.$hexArray[selected]).hasClass('white')||$(this.$hexArray[selected]).hasClass('black')) return this.selectRandom()
    return selected
  }

  updatePlayerAndOpponent(){
    opponent = turnCount%2 === 0 ? 'black':'white'
    player = turnCount%2 === 0 ? 'white':'black'
    // debug(`player:${player} opponent:${opponent}`)
    // if(this.gameEnd===false){
      $turnIcon.removeClass(opponent).addClass(player)
    // }

  }
  createLevel(boardSquares,blackSquares,whiteSquares){
    boardSquares.forEach((elem)=>{
      $(this.$hexArray[elem]).removeClass('hidden')
    })
    blackSquares.forEach((elem)=>{
      $(this.$hexArray[elem]).addClass('black')
    })
    whiteSquares.forEach((elem)=>{
      $(this.$hexArray[elem]).addClass('white')
    })
  }
  levelBuilder(arr){
    console.log('levelBuilder')
    const lookUp = {
      'X': 'hidden',
      '-': 'show',
      'W': 'white',
      'B': 'black',
      'i': 'invert',
      'b': 'bomb'
    }

    console.log($(this.$grid).children('div'))
    console.log(arr)
    const $rows = $(this.$grid).children('div')
    console.log('$rows',$rows)

    for(let i=0;i<15;i++){
      const levelRow = arr[i]
      // console.log('levelRow',levelRow)
      const $gridRow = $($rows).eq(i)
      const $rowTiles = $gridRow.children('div')
      console.log('gridRow',$gridRow)
      // console.log('i ',i)

      for(let j=0;j<10;j++){
        const levelTile = levelRow[j]
        // console.log('levelTile',levelTile, typeof levelTile)
        const $rowTile = $rowTiles.eq(j)
        const levelClass = lookUp[levelTile]
        // console.log('levelClass',levelClass)
        // const $gridTile = $($gridRow).eq(j)
        // console.log('j ',j)
        if(levelClass === 'show'){
          $rowTile.removeClass('hidden')
        }else if(levelClass === 'hide'){
          // $rowTile.removeClass('hidden')
        }else{
          $rowTile.removeClass('hidden').addClass(levelClass)
          console.log('$rowTile ',$rowTile)
        }

      }
    }
  }
  resetVariables(){
    turnCount = 0
    clickable = true
    // this.gameEnd = false
    gridClassArray = []
    // $balance.css('width','50%')
    // $tracker.css('opacity','0.5')
    $footer.removeClass('white').removeClass('black')
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

    // level = 1
    let selected
    let startingSquares = []
    let boardSquares  = []
    let blackSquares  = []
    let whiteSquares  = []
    let levelDesign = []
    switch(level){
      case 0:
        levelDesign =[['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','-','-','-','-','-','-','X'],
                        ['X','-','-','-','-','-','X'],
                      ['X','-','-','-','-','-','-','X'],
                        ['X','-','-','B','-','-','X'],
                      ['X','-','-','W','W','-','-','X'],
                        ['X','-','-','B','-','-','X'],
                      ['X','-','-','-','-','-','-','X'],
                        ['X','-','-','i','-','-','X'],
                      ['X','-','-','-','-','-','-','X'],
                        ['X','-','-','-','-','-','X'],
                      ['X','-','-','-','-','-','-','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X']]

      // this.levelBuilder(levelDesign)
        // for(let i=0; i < numberOfTiles;i++){
        //   // $(this.$hexArray[i]).removeClass('hidden')
        //   console.log(i)
        //   boardSquares.push(i)
        //   //boardSquares.push((width*width)-i)
        // }
        // $(this.$hexArray[19]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[25]).removeClass('hidden').addClass('white')
        // $(this.$hexArray[30]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[24]).removeClass('hidden').addClass('white')
        // boardSquares = [12,13,14,15,
        //   18,19,20,
        //   23,24,25,26,
        //   29,30,31,
        //   34,35,36,37,
        //   40,41,42,
        //   45,46,47,48]
        // startingSquares = [19,25,30,24]
        // blackSquares = [19,30]
        // whiteSquares = [24,25]
        //
        // selected = startingSquares[0]
        // while(startingSquares.includes(selected)){
        //   selected = this.selectRandom(boardSquares)
        // }
        // $(this.$hexArray[selected]).addClass('invert')
        // startingSquares.push(selected)
        //
        // while(startingSquares.includes(selected)){
        //   selected = this.selectRandom(boardSquares)
        // }
        // $(this.$hexArray[selected]).addClass('bomb')
        break

      case 1:
        // $(this.$hexArray[25]).removeClass('hidden').addClass('white')
        // $(this.$hexArray[30]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[35]).removeClass('hidden')
        // boardSquares = [25,30,35]
        // blackSquares = [30]
        // whiteSquares = [25]
        levelDesign =[['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','W','X','X','X'],
                        ['X','X','X','B','X','X','X'],
                      ['X','X','X','-','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X']]
        break

      case 2:
        // $(this.$hexArray[46]).removeClass('hidden')
        // $(this.$hexArray[41]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[36]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[31]).removeClass('hidden').addClass('white')
        // this.addTile(this.$hexArray[selected],'invert')
        // boardSquares = [46,41,36,31,52,47,42,37]
        // blackSquares = [41,36]
        // whiteSquares = [31]
        levelDesign =[['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','-','X','X','X','X'],
                        ['X','X','-','-','X','X','X'],
                      ['X','X','W','-','W','X','X','X'],
                        ['X','X','B','B','X','X','X'],
                      ['X','X','X','-','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X']]
        break

      case 3:
        // $(this.$hexArray[41]).removeClass('hidden')
        // $(this.$hexArray[35]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[29]).removeClass('hidden').addClass('white')
        // $(this.$hexArray[36]).removeClass('hidden').addClass('black')
        // $(this.$hexArray[31]).removeClass('hidden').addClass('white')

        // boardSquares = [41,35,29,36,31]
        // blackSquares = [35,36]
        // whiteSquares = [29,31]
        levelDesign =[['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','W','X','X','X','X'],
                        ['X','X','-','-','X','X','X'],
                      ['X','X','W','B','W','X','X','X'],
                        ['X','-','B','B','X','X','X'],
                      ['X','W','B','-','B','W','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X']]
        break

      case 4:

      levelDesign =[['X','X','X','X','X','X','X','W'],
                      ['X','X','X','X','X','X','B'],
                    ['X','X','X','X','X','X','B','X'],
                      ['X','X','X','X','X','B','X'],
                    ['X','X','X','X','X','B','X','X'],
                      ['X','X','X','X','B','X','X'],
                    ['X','X','X','X','B','X','X','X'],
                      ['X','X','X','B','X','X','X'],
                    ['X','X','X','-','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]
      break
        break

      case 5:
        // boardSquares = [19,24,25,29,30,31,34,35,36,37,40,41,42,46,47,52]
        // blackSquares = [30,41]
        // whiteSquares = [35,36]
        // startingSquares = [30,41,35,36]
        // selected = startingSquares[0]
        // $(this.$hexArray[47]).addClass('invert')
        // while(startingSquares.includes(selected)){
        //   selected = this.selectRandom(boardSquares)
        // }
        // console.log('selected',selected)
        levelDesign =[['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','-','X','X','X','X'],
                        ['X','X','-','B','X','X','X'],
                      ['X','X','-','W','W','X','X','X'],
                        ['X','X','-','B','X','X','X'],
                      ['X','X','X','-','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X'],
                        ['X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X','X']]

        break

      case 6:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','-','X','X','X'],
                    ['X','X','X','-','-','X','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','-','W','W','-','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','X','-','-','X','X','X'],
                      ['X','X','X','-','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 7:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','-','-','-','X','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','-','W','W','-','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','X','-','-','-','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 8:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','X','-','W','W','-','X','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','X','-','i','-','-','X','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break
      // levelDesign =[['X','X','X','X','X','X','X','X'],
      //                 ['X','X','X','X','X','X','X'],
      //               ['X','X','X','X','X','X','X','X'],
      //                 ['X','X','X','X','X','X','X'],
      //               ['X','X','X','X','X','X','X','X'],
      //                 ['X','X','-','-','-','X','X'],
      //               ['X','X','-','-','-','-','X','X'],
      //                 ['X','X','-','B','-','X','X'],
      //               ['X','X','-','W','W','-','X','X'],
      //                 ['X','X','-','B','-','X','X'],
      //               ['X','X','-','-','-','-','X','X'],
      //                 ['X','X','-','i','-','X','X'],
      //               ['X','X','X','X','X','X','X','X'],
      //                 ['X','X','X','X','X','X','X'],
      //               ['X','X','X','X','X','X','X','X']]
      //
      // break

      case 9:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','-','X','X','X'],
                    ['X','X','X','-','-','X','X','X'],
                      ['X','X','-','i','-','X','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','-','-','W','W','-','-','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','X','-','b','-','X','X'],
                    ['X','X','X','-','-','X','X','X'],
                      ['X','X','X','-','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 10:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','-','X','X','-','X','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','-','W','W','-','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','-','i','-','-','X','X'],
                      ['X','-','-','','-','-','X'],
                    ['X','X','-','X','X','-','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 11:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X'],
                      ['X','X','b','X','X','X','X'],
                    ['X','X','-','-','X','X','X','X'],
                      ['X','-','-','-','X','X','X'],
                    ['X','b','-','-','-','X','X','X'],
                      ['X','-','-','B','-','X','X'],
                    ['X','X','-','W','W','-','X','X'],
                      ['X','X','-','B','-','-','X'],
                    ['X','X','X','-','-','-','b','X'],
                      ['X','X','X','-','-','-','X'],
                    ['X','X','X','X','-','-','X','X'],
                      ['X','X','X','X','b','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 12:
      levelDesign =[['X','X','X','-','-','X','X','X'],
                      ['X','X','X','-','X','X','X'],
                    ['X','-','-','X','X','-','-','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','-','X','-','-','X','-','X'],
                      ['X','X','X','b','X','X','X'],
                    ['X','-','X','-','-','X','-','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','-','b','W','W','b','-','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','-','-','-','-','-','-','X'],
                      ['X','-','X','b','X','-','X'],
                    ['X','-','X','X','X','X','-','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 13:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','-','i','-','-','i','-','X'],
                      ['X','i','i','-','i','i','X'],
                    ['X','-','i','-','-','i','-','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','X','-','W','W','-','X','X'],
                      ['X','X','-','B','-','X','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','-','-','X','-','-','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 14:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','-','-','-','-','-','X','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','X','X','X','X','-','X','X'],
                      ['X','X','X','X','-','-','X'],
                    ['X','X','X','X','X','-','X','X'],
                      ['X','X','X','B','-','-','X'],
                    ['X','X','X','W','W','-','X','X'],
                      ['X','X','X','B','-','-','X'],
                    ['X','X','X','X','-','-','X','X'],
                      ['X','-','-','X','-','-','X'],
                    ['X','X','-','-','-','-','X','X'],
                      ['X','X','-','-','-','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 15:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','-','X','X','X','X'],
                    ['X','X','-','-','-','X','X','X'],
                      ['X','-','-','-','-','X','X'],
                    ['X','-','-','X','-','-','X','X'],
                      ['X','-','X','X','-','-','X'],
                    ['X','-','-','X','X','-','-','X'],
                      ['X','-','-','X','X','-','X'],
                    ['X','-','B','-','X','-','-','X'],
                      ['X','W','W','-','_','-','X'],
                    ['X','X','B','-','-','-','-','X'],
                      ['X','X','-','-','-','-','X'],
                    ['X','X','X','-','-','-','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break

      case 16:
      levelDesign =[['X','X','X','X','X','X','X','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','-','-','-','-','-','-','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','-','-','-','-','-','-','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','-','-','W','W','-','-','X'],
                      ['X','-','-','B','-','-','X'],
                    ['X','-','-','-','-','-','-','X'],
                      ['X','-','-','i','-','-','X'],
                    ['X','-','-','-','-','-','-','X'],
                      ['X','-','-','-','-','-','X'],
                    ['X','-','-','-','-','-','-','X'],
                      ['X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X']]

      break
    }
    this.levelBuilder(levelDesign)

    // this.createLevel(boardSquares,blackSquares,whiteSquares)
    for(let i = 0;i<numberOfTiles;i++){
      gridClassArray[i] = $(this.$hexArray).eq(i).attr('class').split(' ')[1]
      console.log(gridClassArray[i])
    }
    history[turnCount] = JSON.parse(JSON.stringify(gridClassArray))

    // neXtTurn()
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
      }
      // else if(upLeftIds.includes(id) && (i === 0) ) {
      //   neighbourArr.push('upLeft')
      //
      //   //If going up and has no neighbour
      // }else if(upIds.includes(id) && (i === 1)){
      //   neighbourArr.push('up')
      //
      //   //If going upRight and has no neighbour
      // }else if(upRightIds.includes(id) && (i === 2) ) {
      //   neighbourArr.push('upRight')
      //
      //   //In left column and direction is left
      // }else if(leftIds.includes(id) && (i === 3) ) {
      //   neighbourArr.push('left')
      //
      //   //In right column and direction is right
      // }else if(rightIds.includes(id) && (i === 5) ) {
      //   neighbourArr.push('right')
      //
      //   //If going downLeft and has no neighbour
      // }else if(downLeftIds.includes(id) && (i === 6) ) {
      //   neighbourArr.push('downLeft')
      //
      //   //If going down and has no neighbour
      // }else if(downIds.includes(id) && (i === 7)){
      //   neighbourArr.push('down')
      //
      //   //If going downRight and has no neighbour
      // }else if(downRightIds.includes(id) && (i === 8) ) {
      //   neighbourArr.push('downRight')
      //
      // }
      else{
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
        // if(upLeftIds.includes(id) && (index === 0) ) {
        //   // console.log('upLeft Invalid')
        //   return false
        // }
        // if(upIds.includes(id) && (index === 1)){
        //   // console.log('up Invalid')
        //   return false
        // }
        // if(upRightIds.includes(id) && (index === 2) ) {
        //   // console.log('upRight Invalid')
        //   return false
        // }
        // //In left row and direction is left
        // if(leftIds.includes(id) && (index === 3) ) {
        //   // console.log('left Invalid')
        //   return false
        // }
        // //This is the original tile
        // if(index === 4) {
        //   return false
        // }
        // //In right row and direction is right
        // if(rightIds.includes(id) && (index === 5) ) {
        //   // console.log('right Invalid')
        //   return false
        // }
        // if(downLeftIds.includes(id) && (index === 6) ) {
        //   // console.log('downLeft Invalid')
        //   return false
        // }
        // if(downIds.includes(id) && (index === 7) ) {
        //   // console.log('down Invalid')
        //   return false
        // }
        // if(downRightIds.includes(id) && (index === 8) ) {
        //   // console.log('downRight Invalid')
        //   return false
        // }

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
    // const neighbours = this.getNeighbours(tile)
    const id = parseInt($(tile).attr('data-id'))
    const neighbours = this.neighbourLookup[id]
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
    // const neighbours = this.getNeighbours(tile)
    const id = parseInt($(tile).attr('data-id'))
    const neighbours = this.neighbourLookup[id]

    //for each neighbour check it is a valid move
    neighbours.forEach((elem, index)=>{
      const arr = this.validFlip(elem,index)
      if(arr) flipArr.push(arr)
    })

    //Sort array in size order so longest plays sounds
    flipArr.sort(function(a, b){
      return b.length - a.length
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
    // let hiddenCount = 0
    // emptyCount = 0
    //Check game if game is over
    for(let i=0;i<numberOfTiles;i++){
      const tileState = this.isOccupied(this.$hexArray[i])
      if(tileState==='white') whiteCount++
      else if(tileState==='black') blackCount++
      // else if(tileState==='hidden') hiddenCount++
      // else emptyCount++
    }
    console.log('whiteCount',whiteCount,'blackCount',blackCount)
    this.winner = 'black'
    if(whiteCount>blackCount) this.winner = 'white'
    if(whiteCount===blackCount) this.winner = 'tie'

    // let balance
    // if(blackCount>whiteCount) balance = (blackCount/whiteCount)*80
    // else if(blackCount<whiteCount) balance = (whiteCount/blackCount)*80
    // else balance = 40
    // balance += 10
    // $balance.css('width',`${balance}%`)

  }
  updateScores(){
    // let balance
    // if(blackCount<whiteCount) balance = (blackCount/whiteCount)*80
    // else if(blackCount>whiteCount) balance = (whiteCount/blackCount)*80
    // else balance = 40
    // balance += 10
    // $balance.css('width',`${balance}%`)
    // $tracker.css('opacity',`${balance/100}`)
    $footer.removeClass('white').removeClass('black').addClass(this.winner)

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
    let selectedTile

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
        for(let i = 0 ; i<numberOfTiles;i++){
          if(this.validMovesArr[i] === true){
            const tile = this.$hexArray[i]
            const availableMoves = this.getTilesToFlip(tile)
            const len = availableMoves[0].length
            if (len > selectedLen) {
              selected = i
              selectedLen = len
            }
          }

        }
        selectedTile = this.$hexArray[selected]
        selectedTile.click()
        // for(let i=0;i<numberOfTiles;i++){
        //   if(this.validMovesArr[i]){
        //     if(this.validMovesArr[i].length > selectedLen) {
        //       selected = $(this.$hexArray[i])
        //       selectedLen = this.validMovesArr[i].length
        //     }
        //     selected.click()
        //   }
        // }
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
    console.log('Game Over winner is', this.winner)
    // if(winner === 'tie')$message.html('It\'s a tie!')
    // else $message.html(`${winner} wins!`)
    // this.gameEnd = true
    const that = this
    if(this.winner === 'white'){
      //disable clicks
      if(level===16 || cpu === false){
        $fireworks = $('.fireworks-container')
        $fireworks.show()
        return
      }
      this.$hexArray.off()

      console.log('White Wins')
      level++
    }else{
      console.log('Black Wins')
      if(cpu === false){
        $fireworks = $('.fireworks-container')
        $fireworks.show()
        return
      }
      setTimeout(function() {
        that.resetVariables()
        that.updatePlayerAndOpponent()
        that.getValidMoves()
      }, 500)
      return
    }
    this.$grid.addClass('hideLeft')
    setTimeout(function() {
      that.$grid.addClass('hideRight')
      that.$grid.removeClass('hideLeft')
      $fireworks.hide()
      console.log('$fireworks',$fireworks)
      new GameLevel($(that.$game),level)
    }, 500)
    setTimeout(function() {
      that.$grid.removeClass('hideRight')
      // new GameLevel($(that.$game),level)
    }, 1000)
    // $gameOver.show()
    // $screens.hide()
    // $start.show()
  }
  specialCapture(tile){
    if($(tile).hasClass('invert')){
      for(let i=0;i<numberOfTiles;i++){
        if($(this.$hexArray[i]).hasClass('white')){
          $(this.$hexArray[i]).removeClass('white')
          $(this.$hexArray[i]).addClass('black')
        }else if($(this.$hexArray[i]).hasClass('black')){
          $(this.$hexArray[i]).removeClass('black')
          $(this.$hexArray[i]).addClass('white')
        }
      }
      $(tile).addClass(player)
      $(tile).removeClass(opponent)
    }
    if($(tile).hasClass('bomb')){
      // const remove = this.getNeighbours(tile)
      const id = parseInt($(tile).attr('data-id'))
      const neighbours = this.neighbourLookup[id]
      $(neighbours).removeClass('white').removeClass('black').addClass('hidden')
      // $(tile).addClass(player)
      // $(tile).removeClass(opponent)
    }
  }
  play(e){
    if(!clickable)return
    // debug()
    const tile = $(e.currentTarget)

    //Check if there are some valid moves to play
    //If neither player has valid Moves
    //Game Over
    if(!this.validMovesArr.some((elem)=>elem)){
      noValidMoves[player] = true

      console.log('No Valid Moves')
      this.endTurn()
      this.nextTurn()
      const nextPlayerValid = (this.validMovesArr.some((elem)=>elem))
      console.log(nextPlayerValid)
      if(!nextPlayerValid){
        // this.$hexArray.off()
        this.gameOver()
        return
      }

      this.cpuPlay()

      // $message.html('No Valid Moves')
      //Invalid move
      // console.log('Invalid')
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

      //Sort array in size order so longest plays sounds
      // tilesToFlip.sort(function(a, b){
      //   return b.length - a.length
      // })

      tilesToFlip.forEach((elem, index)=>{

        elem.forEach((thisTile, i)=>{

          const timerId = setTimeout(function(){

            //Swap to longest line
            //First line to add will play sound
            if(index===0) that.addTile(thisTile, thisPlayer)
            //Subsequent lines will not play sound
            else that.addTile(thisTile, thisPlayer, false)
            that.specialCapture(thisTile)
            timerArr.pop()
          },delay*(i+1))

          timerArr.push(timerId)

        })
      })

      this.specialCapture(tile)

      const wait = timerArr.length*delay
      setTimeout(function(){
        that.endTurn()
        that.nextTurn()
        that.cpuPlay()
        //Check for end of Game
        // if(emptyCount===0){
        //   this.gameOver()
        // }
      },wait)
    }

  }
  undoRedoUpdate(){

    gridClassArray = []
    for(let i=0;i<numberOfTiles;i++){
      const tile = this.$hexArray[i]
      $(tile).removeClass('black').removeClass('white')
    }
    console.log('history', history, turnCount)
    history[turnCount].forEach((elem,index)=>{
      const tile = this.$hexArray[index]
      if(elem != undefined){
        $(tile).addClass(elem)
        gridClassArray[index] = elem

      }
    })
    this.nextTurn()
  }
  undoMove(){

    function action(that){
      // console.log('action')
      turnCount--
      if(turnCount<0)turnCount=0
      that.undoRedoUpdate()
    }

    const that = this
    //If playing computer, undo two moves
    if(cpu){
      setTimeout(function(){action(that)},500)
    }

    action(that)

  }

  addClickEvents(){
    // console.log('from the click handler', this)
    //Add on click
    const $undoButton = $('.undo')
    $undoButton.on('click', (e) => this.undoMove(e))
    $(this.$hexArray).on('click', (e) => this.play(e))
    $(this.$hexArray).on('mouseenter', (e) => this.validHoverOn(e, $(this.$hexArray)))
  }
}

// buildGame(){
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
// }


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
  console.log('undo move')
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

// function saveSettings(e){
//   e.preventDefault()
//
//   const values = {}
//   $.each($('.form').serializeArray(), function(i, field) {
//     values[field.name] = field.value
//   })
//
//   cpuType = values['cpu-type']
//
//   init()
//
//   // console.log('Test values', values)
//   // console.log('Test width', width, 'cpuType', cpuType )
//
// }
// function navbarScroll(){
//   var prevScrollpos = window.pageYOffset
//   window.addEventListener('scroll', function() {
//     console.log('A')
//     var currentScrollPos = window.pageYOffset
//     if (prevScrollpos > currentScrollPos) {
//       document.getElementById('navbar').style.top = '0'
//     } else {
//       console.log('B')
//       document.getElementById('navbar').style.top = '-50px'
//     }
//     prevScrollpos = currentScrollPos
//   })
// }
function init(){

  const $game = $('.game')
  const $twoPlayerButton = $('.two-player')
  const $levelButtons = $('.level')
  const $menuButton = $('.home')

  // const $redoButton = $('.redo')

  $screens = $('.screen')
  $start = $('.start')
  $footer = $('footer')
  $turnIcon = $footer.find('.hex')


  $levelButtons.on('click', function(){
    let id = $(this).attr('data-id')
    id = parseInt(id)
    goToGame(id)
  })

  $twoPlayerButton.on('click', ()=>goToGame(0,false))
  $menuButton.on('click', goToMenu)


  function goToGame(gameLevel){
    cpu = false
    if(gameLevel){
      level = gameLevel
      cpu = true
    }else{
      level = 0
    }
    gameStart = true
    $turnIcon.removeClass('hidden').addClass('white')
    new GameLevel($($game),level)

    $screens.hide()
    $game.show()
  }


  function goToMenu(){
    console.log('Go To menu level', level)
    $turnIcon.removeClass('white').removeClass('black').addClass('hidden')
    for(let i=2;i<=level;i++){
      const $startHexs = $start.find(`.level${i}`)
      console.log('$startHexs i',i)
      setTimeout(function () {
        $startHexs.removeClass('hidden')
      }, 100*(i-2))

    }

    $screens.hide()
    $start.show()
  }

}
