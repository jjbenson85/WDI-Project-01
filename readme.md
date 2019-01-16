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

  This created some challenges as the rows alternate in length which changed how the board edge detection would work. (My initial solution to this involved creating a lookup table for all of the edge pieces, but I changed this to a border of hidden tiles. The hidden tile test allows the board to vary in size and have different shapes that can alter during the game and still work, as well as reducing the amount of code.)

  I then created a history array, that stores the state of the board for every move. This allows for an undo and redo button. This was useful for checking bugs.

  I refactored the game to run in its own class. The class takes the a level as an argument which the builds the appropriate board design.

  I created a start screen which shows the levels as the player unlocks them.


### Challenges

Searching the line

Creating the hexagon

Edge detecting


### Wins

Searching the line direction function

Level building function

Scss colours

New Hexagon

## Future features

Use new Hexagon
Responsive
More sounds
Improve timing
Improve performance on mobile
