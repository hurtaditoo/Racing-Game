# Racing Game

This project is a **Racing Game** built with HTML, CSS, and JavaScript. The objective is to navigate through a road filled with obstacles, advancing through levels by switching vehicles and managing lives. Each level introduces a new vehicle with increasing difficulty.

## Demo
Play the game here: [Racing Game Demo](https://hurtaditoo.github.io/Racing-Game/)
It is recommended to change the screen zoom to 67%

## How to Play
- Use **Arrow Keys** to control the car:
  - **Up/Down:** Accelerate or decelerate.
  - **Left/Right:** Move the car sideways.
- Press **Space** to activate **Nitro**, a speed boost that helps you avoid obstacles.
- **Avoid obstacles** on the road to maintain your lives and progress through levels.

## Game Features

### Level Progression and Vehicle Change
- The game starts with a basic vehicle. As you progress through levels, new vehicles are unlocked with different characteristics.
- Each level-up triggers an audio cue and switches the vehicle, keeping the player’s current lives intact.

### Obstacle Generation
- Obstacles are randomly generated on the road and move towards the player.
- Colliding with obstacles decreases the player’s lives. The game ends when lives reach zero.

### Nitro Boost
- Players can activate a **Nitro Boost** by pressing the **Space** key, which provides a temporary speed increase.

### Background Scrolling
- The road background scrolls continuously to create a sense of motion, increasing speed as the player progresses through levels.

### Score and Ranking
- **Score System**: Players will earn points based on their performance and distance traveled.
- **Leaderboard**: A ranking system will track the top scores, allowing players to compete for the highest score.

### Main Menu and Music
- **Intro Screen**: A main menu will be added, allowing players to start the game from a welcome screen.
- **Menu Music**: Background music will play on the menu screen to enhance the game atmosphere.

## Code Structure

### Core Components
1. **`Game`**: Manages the overall gameplay, including levels, collisions, vehicle changes, and pause/play functionality.
2. **`Car`**: Handles the player’s vehicle, including movement, collision detection, and drawing on the canvas.
3. **`Obstacle`**: Generates obstacles on the road, including random positioning and speed.
4. **`Background`**: Manages the scrolling road background, simulating continuous motion.
5. **`Constants`**: Holds constants like vehicle images, control key codes, and vehicle dimensions for easy configuration.

### Files
- **HTML**: Defines the game layout and controls.
- **CSS**: Provides basic styling for the game and UI.
- **JavaScript Files**:
  - `game.js`: Core game mechanics (game start, reset, level progression, collisions).
  - `car.js`: Car functionality, movement, and life management.
  - `obstacle.js`: Obstacle generation and movement.
  - `background.js`: Background movement and drawing.
  - `window.js`: Initializes the game and handles play/pause button events.
  - `constants.js`: Stores constants for key codes and vehicle configurations.

## Iterations

### Iteration 1: Basic Setup
Initial setup with a simple vehicle moving on a scrolling road and obstacles appearing at random intervals.

### Iteration 2: Input Handling
Capture input from arrow keys and space bar to control vehicle speed and movement, including a Nitro boost.

### Iteration 3: Leveling and Vehicle Change
Implement vehicle change at each level-up. The player retains their lives across vehicles.

### Iteration 4: Obstacle Interaction
Add obstacle collision logic. Each collision decreases the player’s lives, with a game over screen shown when lives reach zero.

### Iteration 5: Pause/Play and Reset
Implement pause/play functionality with a button and reset on game over, restoring game state to its initial setup.

### Bonus: Additional Features
- **Visual Effects**: Blinking effect on collision and game over/winning screens.
- **Responsive UI**: Adjust button positions based on screen size and road position.

Enjoy the ride!
