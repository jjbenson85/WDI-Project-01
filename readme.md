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
The game begins on the main menu. This shows the levels that have been unlocked, represented by coloured cubes.

The home icon (in the bottom left of the screen) will bring you back to this screen when clicked.

The black and white people button will start a two player game.

To start the first level, click on the blue cube.

![Screenshot - Start Screen](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-menu-level1.png?raw=true)

2. For the first few levels, you are limited in the moves you can take, to show you how the game is played.

![screenshot - Level 1](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-level1.png?raw=true)

3. Valid moves have a green border when hovered over. Invalid moves show a red border.

![screenshot - Level 1](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-level1.png?raw=true)

4. The cube on the bottom right of the screen changes colour to indicate the current players turn.
The border of the bottom bar changes colour to show the current leader.

5. There are special cubes, that when taken perform an action.

-The 'invert' cube will turn all black cubes white and white cubes black every time it is captured.

![screenshot - Mines](https://user-images.githubusercontent.com/40343797/45220908-b4f46c00-b2a7-11e8-9460-2a4dee40d0ae.png)


6. Pressing the menu button will return you to the menu, and show you the levels you have unlocked.

![screenshot - Main menu level 6 unlocked](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-menu-level6.png?raw=true)

7. The two player game uses the maximum sized board and has one invert square on it.
Players take turns placing cubes.
![screenshot - Main menu level 6 unlocked](https://github.com/jjbenson85/WDI-Project-01/blob/master/images/readme/Nocturn-menu-level6.png?raw=true)

## Process

The starting point for this game was creating the basic grid layout on which the submarine could move. This was created by a list of 'div's in the HTML. Each cell within the grid was an individual element. These cells are nestled within a container. The submarine, and fish were created by applying classes to the elements within the grid. When the submarine or fish is moved, their class is removed from the cell of their current position and applied to the new cell.

I created fish as objects which contain their points value, an array of their movement patterns, their age and the class which is being applied to the cell that they are in. The class relates to a css class with a corresponding background image of the fish type. When a fish is created it is added to an array of fish in play.

While the game is running, a function runs through the array of fish in play and moves each fish the corresponding amount within their movement patterns.

A function was also created which checks if a fish has been caught. This runs through the array of fish in play to check if its location is the same as that of the submarine. If it has been caught, it is removed from the array of fish in play and its corresponding points value to added to the player's score.

Once I had this mechanics working, I worked on adding a timer countdown which displayed as an air supply within the player's air tank. The height of the air supply element is a proportion of the amount of time left.

I then moved onto the task of allowing the position of the submarine to control the scrolling of the grid. This also required stoping the default behaviour of controls to prevent the user from scrolling through the grid to a position where the submarine was not visible.

As the game continued to develop I created a fish constructor function which created the fish objects and also contained the method which allowed the fish to move. I had initially also created a method which allowed the fish, when they were caught or swam off screen, to be removed from the fish in played array and remove their classes from the grid. However, I later changed this to a key within the fish object which specified whether the fish was active or not. During the game, a function now runs through the array of fish in play and removes any fish which have been set to no longer active.

The final significant element was creating a variable which specified whether the submarine was at the top of the surface when the air supply had reached zero. I created a modal with content which varied depending on whether the player had returned to the surface by the end of the game.

### Challenges

This game involves quite a lot of different things going on at the same time. It was a challenge to make sure the gaming mechanics were being being timed correctly. It was also important that I created code logic that could cope with expanding numbers of different fish characters in play at the same time.

There were several tricky tasks including the scrolling of the grid being controlled by the submarine and the animation of the fish.

### Wins

Creating cascading animations and sounds really helped the game come alive and gave me more creative control over the feel of the play. I invested a lot of time in the stying of the game, particularly the animations and air supply tank to give them a consistent and professional feel. I was particularly pleased with my 'Fish' constructor function which I then used to randomly generate different fish.

![Fish constructor function from app.js](https://user-images.githubusercontent.com/40343797/50378462-b7968980-062a-11e9-95b7-54e358bfb320.png)


When fish were created, they were added to an array of 'fishInPlay'. I was then able to call this function every 200 milliseconds to move every fish on the board.

```
function moveFish(){

  fishInPlay.forEach(fish => fish.move());

} // moves every fish 1 position in their respective movementPatternArrays
```

## Future features

If I had more time, I would like to try and make the game playable on a touchscreen device. I would need to make a control panel that would appear on a touch device to replace the keyboard inputs.

Different levels could be added to the game with different patterns of mine positioning and different fish spawning at different depths.

I would also like to improve the animations of the submarine (such as adding animated bubbles when it is moving) and improving the animations of the fish, particularly in allowing them to move diagonally.
