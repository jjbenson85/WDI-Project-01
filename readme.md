# General Assembly Project 1 : Simple front-end game

### Timeframe
7 days

## Technologies used

* JavaScript (ES6) + jQuery
* HTML5 + HTML5 Audio
* CSS + CSS Animation
* GitHub

## Installation

1. Clone or download the repo
1. Open the `index.html` in your browser of choice

## My Game - NOCTURN

![Nocturn](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-menu-level1.png?raw=true)

You can find a hosted version here ----> [jjbenson85.github.io/WDI-Project-01](https://jjbenson85.github.io/WDI-Project-01)

### Game overview
Nocturn is a grid based game based on the classic boardgame Reversi a.k.a Othello.

The aim of the game is to have the most cubes of your colour on the board. On your turn, you change a grey cube to your colour, white. Any opponent cubes in a line between the cube you placed and your existing cubes on the board change to your colour.

Your opponent then takes a turn and tries to capture your cubes!

You have to place a cube if you can, and you cannot place a cube if it will not capture an opponent piece. If you can not place a piece, you skip your turn.

When there are no more possible moves to play, the colour with the most pieces on the board wins!


### Game Instructions
1. The game begins on the main menu. This shows the levels that have been unlocked, represented by coloured cubes.  

 The home icon (in the bottom left of the screen) will bring you back to this screen when clicked.

 The black and white people button will start a two player game.

 To start the first level, click on the blue cube.

 ![Screenshot - Start Screen](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-menu-level1.png?raw=true)

2. For the first few levels, you are limited in the moves you can take, to show you how the game is played.

 ![screenshot - Level 1](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-level1.png?raw=true)

3. When you hover over the board, it shows you if you can place a cube.

  - Valid moves have a green border when hovered over.

  ![screenshot - Valid move](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-valid-move.png?raw=true)

 - Invalid moves show a red border.

 ![screenshot - Invalid move](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-invalid-move.png?raw=true)

4. The cube on the bottom right of the screen changes colour to indicate the current players turn.
The border of the bottom bar changes colour to show the current leader.

5. There are special cubes, that when taken perform an action.

  The 'invert' cube will turn all black cubes white and white cubes black every time it is captured.

  ![screenshot - Invert cube](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-invert.png?raw=true)

 The 'bomb' cube will remove itself and its neighbours from the board

 ![screenshot - Bomb cube](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-bomb.png?raw=true)


6. Pressing the menu button will return you to the menu, and show you the levels you have unlocked.

  ![screenshot - Main menu level 6 unlocked](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-menu-level6.png?raw=true)

7. The two player game uses the maximum sized board and has one invert cube on it.
Players take turns placing cubes.

  ![screenshot - Two-player game](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-2player.png?raw=true)

## Process

I started the project by building a small grid of square divs and creating the basic Reversi game logic.

The steps in creating the basic logic were:
  * Adding a css class to the grid to indicate the different players.
  * Only being able to add a class if the neighbour is an opponent.
  * Changing the class of the opponent tile if it is surrounded by player tiles.
  * Searching along the length of opponent tiles to enable more than one opponent to be changed at a time.
  * Preventing tile captures wrapping around the edges of the board.
  * Adding up the tiles to determine the scores.
  * Indicating the game is over when no more tiles can be added.
  * Creating a CPU player, with three different strategies.

  I then added some extra features
  * Converting the grid to an Isometric view.
  * Adding sounds and animations to the tile captures.
  * Converting the game to a Class.
  * Created a history array and undo and redo function
  * Creating a start screen with level selection
  * Created some level designs


  Once I had the logic, I decided to add some basic styling and create the isometric cube look.

  I was inspired to create this game using isometric projection from the game Monument Valley.

  ![monument-valley-game](https://user-images.githubusercontent.com/34242042/55107084-55856e80-50c8-11e9-8490-86ba8f5fb7f8.jpg)


  This created some challenges as the rows alternate in length which changed how the board edge detection would work. (My initial solution to this involved creating a lookup table for all of the edge pieces, but I changed this to a border of hidden tiles. The hidden tile test allows the board to vary in size and have different shapes that can alter during the game and still work, as well as reducing the amount of code.)

  I then created a history array, that stores the state of the board for every move. This allows for an undo and redo button. This was useful for checking bugs.

  I refactored the game to run in its own class. The class takes the a level as an argument which the builds the appropriate board design.

  I created a start screen which shows the levels as the player unlocks them.


### Challenges

###### Valid Moves vs Flipping Tiles

One of the big challenges of this game, is detecting wether a move is valid or not.

After every move, we perform a check to find all of the valid moves by testing each cube and storing its validity in an array.
```
getValidMoves(){
  this.$hexArray.each((i)=>{
    this.validMovesArr[i] = !!this.checkTileIsValid(this.$hexArray.eq(i))
    })
  }
  ```

To find out wether a move is a valid, we first check to see wether the cube clicked on is occupied. If it is then this is not a valid move and we return ```false```.


```
checkTileIsValid(tile){
  const flipArr = []

  if( $(tile).hasClass('white')||
      $(tile).hasClass('black')||
      $(tile).hasClass('hidden')) return false
```

We then get the id number of the tile we are testing and use this number to get an array of all of its neighbours.
```
  const id = this.getTileId(tile)
  const neighbours = this.neighbourLookup[id]
```
We test each of these neighbours to see if capturing in this direction is valid. If at least one of them is then we can return true.
```
  return neighbours.some((neighbourTile, index)=>{
    //If element is string it is not a valid tile
    if(typeof neighbourTile === 'string') return

    //Valid flip array returns false or an array
    return !!this.validFlip(neighbourTile,index)

  })
}
  ```

This algorithm checks to see if any cube has a valid move, but it does not store what the valid move captures.

To do that,we use a similar function, but instead of using the Array.some method, we use the Array.forEach, as it needs to test each direction and pushes the valid lines into an array
```
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
  ```

  These lines are then sorted in length order so that when they are flipped, there is sound for the longest line.
  ```

  //Sort array in size order so longest plays sounds
  return flipArr.sort(function(a, b){
    return b.length - a.length
  })

}
```

###### Searching the line

Both of the previous functions call the validFlip function, to check wether a move captures tiles in a certain direction.

We give it the first neighbour tile and an index.
This index is the position of the neighbour relative to the target cube.
```
validFlip(tile,index){

  //Create an array to store candidates for flipping
  const potentialArr = []

  //This neighbour-tile's id as an int
  const id = this.getTileId(tile)

  //Prep id of next in search, will add direction to look later
  let nextId = id
  ```
If the neighbour tile passed into the function had the class of the opponent, then this might be a valid move. If it doesn't, it's definitely not.
  ```
  //If this neighbour-tile is an opponent, look on the other side of it
  if($(tile).hasClass(this.opponent)){

```
We now need to search in this direction loooking for a tile with the players class on it. If we find one, it's a valid move.

The furthest we can possibly look is twice the width of the board, (but we should hit a border edge piece before then)
```    
    //max travel the twice width of the board -2
    for(let i=0;i<(2*this.width)-2;i++){
```
The id of the next tile that we want to check will be the neighbour id plus the value of the directions lookup in this direction (which is the index passed in earlier)
```
      //The nextId is the current nextId plus the direction, the direction is the index! (This is really neat!)
      nextId += this.gameConst.directions[index]
```
This may be a bit confusing!

gameConst.directions is an array which is used to find the id of neighbouring tiles. For instance, if you have tile id:10, its neighbour to the left will have an id one less than it (directions[3]=-1) id:9

```
directions: [-width,(-2*width)+1,-width+1,-1,0,1,width-1,(2*width)-1,width]
```

So if we are checking the left neighbour of a tile and we want to check to see the neighbour of this neighbour on the left we just add it's id to the value of directions for the direction we are travelling in.

We get this new tile and check to see if it is a player tile, in which case we return the array, or an opponent tile in which case we continue the search, or if it is neither we abandon this search.
```

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
```

### Wins

###### Level building function
I wanted to create an easy and fast way to design levels.

I though being able to represent each square as a character and creating an array of arrays to hold the characters would work well.

In the level.js file we have a single object called levelDesignArray, which contains the separate level designs.

Each level is an array  which contains rows. Each row is an array of strings, so the first square of the first row of the first level would be referenced ```levelDesignArray[0][0][0]```

Here is the layout for the first level (which is the two player level). It has four blocks in the middle that alternate black ('B') and white ('W'). Surrounding these are neutral ('-') tiles. Lastly a border of hidden ('X') tiles.
```
const levelDesignArray = {
  0: [['X','X','X','X','X','X','X','X'],
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
      ['X','X','X','X','X','X','X','X']],

      ...
```

In the GameLevel.js file, the levelBuilder function takes the level as an 2D array and loops through the rows and the columns, using an object as a lookup table to add classes to the appropriate tiles.



```
levelBuilder(arr){

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

      //All tiles are created with a hidden class, so to 'show' it we need to remove this.
      if(levelClass === 'show'){
        $rowTile.removeClass('hidden')

      //If the tile is not to be hidden, add the level class.
      //(This will may add the 'show' class, which has no effect)
      }else if(levelClass !== 'hide'){
        $rowTile.removeClass('hidden').addClass(levelClass)
      }

    }
  }
```

Finally in the GameLevel.js we pass the level to build to the levelBuilder function

```
const levelDesign = this.gameConst.levelDesignArray[this.gameLets.level]

this.levelBuilder(levelDesign)
```


###### SCSS colours
To generate the colours for the hexagons I made use of the SCSS colour functions lighten, darken and mix.

Each hexagon has three colours, one for each face.
On the level select screen the colours of each cube are different, going from blue to green to yellow to red to blue.

![Nocturn All Levels](https://user-images.githubusercontent.com/34242042/55100137-0be15780-50b9-11e9-9703-bbf1000dd40a.png)

To achieve this I set the four base colours.
I then generate 12 colours from these base colours by dividing them in to four groups of three.

The first colour in each group is a mix between two of the main colours, going from a ratio of 100:0, 75:25, 50:50, 25:75.

The subsequent colours are 10% and 20% darker than the first colour in its group.

Here is what it looks like for the Blue cubes.

![Nocturn SCSS Colours](https://user-images.githubusercontent.com/34242042/55100273-637fc300-50b9-11e9-9e4c-ad1bd0da21a4.png)

The colours are then added to cubes with the appropriate class.
```
.hex{
  &.level1{.diamond{
    &:first-child{.seg{background: $blue3;}}
    &:nth-child(2){.seg{background: $blue2;}}
    &:nth-child(3){.seg{background: $blue1;}}
  } }
```

In retrospect this could have been achieved using a Mixin which would have saved quite a few lines!

```
@mixin colorCube($col1, $col2, $col3){
  .diamond{
    &:first-child{.seg{background: $col3;}}
    &:nth-child(2){.seg{background: $col2;}}
    &:nth-child(3){.seg{background: $col1;}}
  }
}

.hex{
  &.level1{
    @include colorCube($blue1,$blue2, $blue3)
  }
  &.level2{
    @include colorCube($blue4,$blue5, $blue6)
  }
  ...
```

###### New Hexagon

Towards the end of the project I came up with a different way of creating  the hexagons, as shown in this test.

![New Hexagon Test](https://user-images.githubusercontent.com/34242042/55101350-d4c07580-50bb-11e9-9986-920c0462081f.png)

This technique has a couple of benefits over the current method.
1. Responsive
![Hex Test Responsive](https://user-images.githubusercontent.com/34242042/55102119-9af06e80-50bd-11e9-8bd7-c76192cde069.png)
2. Less Divs.

This technique only uses two divs per hexgon...
```
HTML
<div class="hex">
  <div class="diamond">
  </div>
</div>
```
...compared to ten per hexagon.
```
<div data-id="1"class="hex level level1 start-button-single">
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
      <div class="seg">
      </div>
    </div>
  </div>
</div>
```
It makes use of the :before and :after pseudo elements, and all the widths and heights are percentage based.

```
SCSS
.diamond{
  position: absolute;
  width: 71%;
  height: 71%;
  left: 14.5%;
  top: -12%;
  background: $blue1;
  border: 0.1vw solid black;
  border-radius: 4px;
  opacity: 1;
  transform: scaleY(0.577) rotate(45deg);
  &:after, &:before{
    content: '';
    opacity: 1;
    display: block;
    position: absolute;
    top: 100%;
    left: 100%;
    width: 100%;
    height: 100%;
    border: 0.1vw solid black;
    border-radius: 4px;
  }
  &:after{
    background: $blue2;
    transform: skewX(45deg);
    left: 50%;
  }
  &:before{
    background: $blue3;
    transform: skewY(45deg);
    top: 50%;
  }
}
```

Even though I didn't have enough time to use this method I'm really happy to have come up with it, as I couldn't find anything similar online.

## Future features

###### Use new Hexagon
Obviously given more time I would update the game to use the new hexagon method.

###### Responsive
By using the new method and changing a few things, the game could be responsive to different sized screens. It would be great to play this on my phone properly!

###### More sounds
I would like to have differen sounds for each player and to communicate when something has happened. I'd have liked to incorporate some sort of musical element to the game, for instance, after turning a row of blocks to a new colour, the melody that is played as the y changed could be looped and form generative music.

###### Improved performance
I think with a bit more refactoring and time the algorithms could be improved to give a better experience.
