/*global levelDesignArray GameLevel*/


const width = 8
const gameConst={
  width: 8,
  numberOfTiles: 112,
  showNumbers: false,
  cpuType: 'greedy',
  delay: 250,
  srcArray: [
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
  ],
  directions: [-width,(-2*width)+1,-width+1,-1,0,1,width-1,(2*width)-1,width],
  levelDesignArray: levelDesignArray

}

const numberOfTiles = 112
const showNumbers = false
const cpuType = 'greedy'
const delay = 250
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

const gameLets={
  level: 16,
  prevLevel: 1,
  gridClassArray: [],
  history: [],
  cpu: 0,
  turnCount: 0,
  whiteCount: 0,
  blackCount: 0,
  player: 0,
  opponent: 0,
  clickable: true,
  noValidMoves: {
    'black': false,
    'white': false
  }
}

let level = 16
let prevLevel = 1
let gridClassArray = []
const history = []
let cpu
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


const gameDom={
  $footer: '',
  $turnIcon: '',
  $fireworks: ''
}
let $screens
let $start
let $footer
let $turnIcon
let $fireworks

document.addEventListener('DOMContentLoaded', ()=>{
  init()
})

const directions = [-width,(-2*width)+1,-width+1,-1,0,1,width-1,(2*width)-1,width]

function init(){

  const $game = $('.game')
  const $levelButtons = $('.level')
  const $menuButton = $('.home')

  $screens = $('.screen')
  $start = $('.start')
  $footer = $('footer')
  $turnIcon = $footer.find('.hex')

  gameDom.$footer = $footer
  gameDom.$turnIcon = $turnIcon

  $levelButtons.on('click', function(){
    let id = $(this).attr('data-id')
    id = parseInt(id)
    goToGame(id)
  })

  $menuButton.on('click', goToMenu)


  function goToGame(gameLevel){
    gameLets.cpu = !!level
    gameLets.level = gameLevel
    $turnIcon.removeClass('hidden').addClass('white')
    console.log('gameConst',gameConst)
    new GameLevel($($game),gameConst, gameLets, gameDom)

    $screens.hide()
    $game.show()
  }

  function goToMenu(){
    console.log('Go To menu level', level)
    $turnIcon.removeClass('white').removeClass('black').addClass('hidden')
    for(let i=prevLevel;i<=level;i++){
      const $startHexs = $start.find(`.level${i}`)
      setTimeout(function () {
        $startHexs.removeClass('hidden')
      }, 100*(i-prevLevel))
    }
    prevLevel = level
    $screens.hide()
    $start.show()
  }
}
