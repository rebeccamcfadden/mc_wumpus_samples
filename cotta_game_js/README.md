# Build a gameplay experience with Javascript

This tutorial is based off a Typescript sample available from [https://github.com/microsoft/minecraft-scripting-samples/](https://github.com/microsoft/minecraft-scripting-samples/). TypeScript is a more helpfully structured dialect of JavaScript; however, because TypeScript requires compilation of your TypeScript source into JavaScript that Minecraft can use, there is a bit more project structure you would need to establish. Therefore, we've adapted this project to Javascript. From this project, you can build out and expand simple gameplay styles. You can also use this project as a starter for your own scripting projects.

## Prerequisites

### Install Visual Studio Code, if you haven't already

Visit the [Visual Studio Code website](https://code.visualstudio.com) and install Visual Studio Code.

## Getting Started

1. Download a copy of the starter project from GitHub by visiting [https://github.com/rebeccamcfadden/mc_wumpus_samples](https://github.com/rebeccamcfadden/mc_wumpus_samples) and, under the Code button, selecting `Download ZIP`. (You can also use this [direct download link](https://download-directory.github.io/?url=https://github.com/rebeccamcfadden/mc_wumpus_samples/tree/main/cotta_game_js)). 

2. The `cotta_game_js` folder contains a starter TypeScript project for Minecraft.  Note that there is a `cotta_game_complete_js` folder that will show you the finished product and code. Do try to complete the sample yourself, as it will help you understand the basics of scripting in Minecraft.

3. Unzip the downloaded pack into the `%appdata%\Minecraft Education Edition\games\com.mojang\development_behavior_packs` folder.

If you haven't already, you can install the Minecraft Debugger and Blockception's Visual Studio Code plugin, which are plugins to Visual Studio Code that can help with Minecraft development.

### Chapter 1. Customize the behavior pack

Go to the Files tree view and open `behavior_packs\starterbp_js\manifest.json`

Update the name and description properties to something like "Cotta Behavior Pack" and "My Javascript Project".

Update the first and second UUID properties to make it unique to your project. See [this article](https://learn.microsoft.com/minecraft/creator/documents/behaviorpack) for tips on working with behavior packs and creating your own unique UUIDs.

### Chapter 2. Let's test the parts of our project

Launch Minecraft and create a new world:

1. Call it **Cotta Test**.
2. Select a Creative game mode.
3. Select a Flat world option, under the Advanced section of the Create New World screen.
4. Under Behavior Packs, under Available, you should see your Cotta Behavior Pack. Select it and Activate it.
5. Create the world and go into it.

Now you're in. Great!

By default, this starter pack comes with a simple script that will display a message every five seconds:

`[Script Engine] Hello starter! Tick: <number>`

This means your behavior pack is working just fine. Awesome!

### Chapter 3. Scripting your gameplay

Let's go back to Visual Studio Code and change up some code.

Open up `scripts/main.js` within Visual Studio Code.

#### Add some initialization code

Remove all the existing script code in **main.js**. Replace it with this to start:

```javascript
import { world, system, BlockPermutation, EntityInventoryComponent, ItemStack, DisplaySlotId } from "@minecraft/server";

const START_TICK = 100;
const ARENA_X_SIZE = 30;
const ARENA_Z_SIZE = 30;
const ARENA_X_OFFSET = 0;
const ARENA_Y_OFFSET = -60;
const ARENA_Z_OFFSET = 0;

// global variables
let curTick = 0;

function initializeBreakTheTerracotta() {
    const overworld = world.getDimension("overworld");
    // eliminate pesky nearby mobs
    let entities = overworld.getEntities({
        excludeTypes: ["player"],
    });
    for (let entity of entities) {
        entity.kill();
    }
    let players = world.getAllPlayers();
    // set up scoreboard
    players[0]?.runCommand("scoreboard objectives add score dummy Level");
    players[0]?.runCommand("scoreboard objectives setdisplay sidebar score");
    for (let player of players) {
        player.runCommand("scoreboard players set @s score 0");
        let inv = player.getComponent("inventory");
        inv.container?.addItem(new ItemStack("diamond_sword"));
        inv.container?.addItem(new ItemStack("dirt", 64));
        player.teleport({
            x: ARENA_X_OFFSET - 3,
            y: ARENA_Y_OFFSET,
            z: ARENA_Z_OFFSET - 3,
        }, {
            dimension: overworld,
            rotation: { x: 0, y: 0 },
        });
    }
    world.sendMessage("BREAK THE TERRACOTTA");
}

function gameTick() {
  try {
    curTick++;

    if (curTick === START_TICK) {
      initializeBreakTheTerracotta();
    }
  } catch (e) {
    console.warn("Tick error: " + e);
  }

  system.run(gameTick);
}

system.run(gameTick);
```

This code does some work to initialize our gameplay for Minecraft by running several commands.

First, we queue up a run to our main tick function, gameTick. Note that at the end, we will requeue a game tick, which will run within the next tick frame. This will give us a callback that fires 20 times a second, and within this, we can put all of our game logic. We want the game to initialize some code; namely, the `initializeBreakTheTerracotta` function.

Note that we wait until `START_TICK` (100 ticks in) before the world is actually initialized. This gives Minecraft time to fully load up and get ready.

Within the initialize function, we run commands that:

* Clear out any existing mobs near the player in the world.
* Set up a scoreboard objective for overall Level of the player, meaning the number of terracotta breaks they have
* Give the current player a diamond sword and some dirty dirt
* Use chat to give the player an instructional message

Now, let's go back to Minecraft.

We'll want to reload the scripts from here - any time you make a script change, you can run the `/reload` command to reload the JavaScript files that have been changed. If you make changes to other non-js files in the behavior pack, you'll need to save and quit and re-enter the world to see the changes.

You should see your initialization changes: a new scoreboard, new items in your inventory, and a script message.

Note that as you work through this tutorial, we are going to run the initialization code more than once, so your player is going to get multiples of these items during this development and test phase. If that bothers you, feel free to toss out these items before you close the world.

#### Build your arena with some helper code

We're going to start by adding some handy helper utility code functions. This will show you how you can organize your code into separate modules or classes.

Add a new file to your `scripts` folder called `Utilities.ts`. Correct capitalization matters, so make sure the `U` is capitalized. Add the following code:

```javascript
import { world, BlockPermutation } from "@minecraft/server";

export default class Utilities {
    static fillBlock(blockPerm, xFrom, yFrom, zFrom, xTo, yTo, zTo) {
        const overworld = world.getDimension("overworld");
        for (let i = xFrom; i <= xTo; i++) {
            for (let j = yFrom; j <= yTo; j++) {
                for (let k = zFrom; k <= zTo; k++) {
                    overworld.getBlock({ x: i, y: j, z: k })?.setPermutation(blockPerm);
                }
            }
        }
    }

    static fourWalls(perm, xFrom, yFrom, zFrom, xTo, yTo, zTo) {
        const overworld = world.getDimension("overworld");
        for (let i = xFrom; i <= xTo; i++) {
            for (let k = yFrom; k <= yTo; k++) {
                overworld.getBlock({ x: i, y: k, z: zFrom })?.setPermutation(perm);
                overworld.getBlock({ x: i, y: k, z: zTo })?.setPermutation(perm);
            }
        }
        for (let j = zFrom + 1; j < zTo; j++) {
            for (let k = yFrom; k <= yTo; k++) {
                overworld.getBlock({ x: xFrom, y: k, z: j })?.setPermutation(perm);
                overworld.getBlock({ x: xTo, y: k, z: j })?.setPermutation(perm);
            }
        }
    }
}
```

The first utility function here (`Utilities.fillBlock`) is relatively straightforward:

Across three dimensions (within three loops), it will basically set a block in the overworld to a particular type. This function just makes a big chunk of blocks.

The second utility function here (`Utilities.fourWalls`) basically creates a walled enclave. The first inner loop creates two stripes of blocks left to right (across X). The second inner loop creates two stripes of blocks south to north (across Z) - thus completing four walls that join each other.

Go back to **main.js**. Let's use these functions in our initialization function.

First, we'll need an import function. Add a new line above `const START_TICK = 100;` and make this the second line of the file:

```javascript
import Utilities from "./Utilities.js";
```

Then, within `initializeBreakTheTerracotta`, let's add our arena initialization beneath the `world.sendMessage("BREAK THE TERRACOTTA!");` line of code:

```javascript
 let airBlockPerm = BlockPermutation.resolve("minecraft:air");
 let cobblestoneBlockPerm = BlockPermutation.resolve("minecraft:cobblestone");

 if (airBlockPerm) {
   Utilities.fillBlock(
     airBlockPerm,
     ARENA_X_OFFSET - ARENA_X_SIZE / 2 + 1,
     ARENA_Y_OFFSET,
     ARENA_Z_OFFSET - ARENA_Z_SIZE / 2 + 1,
     ARENA_X_OFFSET + ARENA_X_SIZE / 2 - 1,
     ARENA_Y_OFFSET + 10,
     ARENA_Z_OFFSET + ARENA_Z_SIZE / 2 - 1
   );
 }

 if (cobblestoneBlockPerm) {
   Utilities.fourWalls(
     cobblestoneBlockPerm,
     ARENA_X_OFFSET - ARENA_X_SIZE / 2,
     ARENA_Y_OFFSET,
     ARENA_Z_OFFSET - ARENA_Z_SIZE / 2,
     ARENA_X_OFFSET + ARENA_X_SIZE / 2,
     ARENA_Y_OFFSET + 10,
     ARENA_Z_OFFSET + ARENA_Z_SIZE / 2
   );
}
```

The first line just fills a cuboid with air - basically clearing out the arena of any previous items. The second line re-installs and adds four walls of cobblestone.

Exit out of your Minecraft world and restart it to load your changes. After a brief delay, you should find yourself in an arena.

Now, let's give ourselves some terracotta to break.

### Chapter 4. Add some gameplay basics - scoring and objectives

First, let's track some more game variables. Inside **main.js**, add this directly beneath the `let curTick = 0` line of code:

```javascript
let score = 0;
let cottaX = 0;
let cottaZ = 0;
let spawnCountdown = 1;
```

Add the following to the `gameTick` function, beneath the `curTick++` line of code:

```javascript
    if (curTick > START_TICK && curTick % 20 === 0) {
      // no terracotta exists, and we're waiting to spawn a new one.
      if (spawnCountdown > 0) {
        spawnCountdown--;

        if (spawnCountdown <= 0) {
          spawnNewTerracotta();
        }
      } else {
        checkForTerracotta();
      }
    }
```

Now add the `spawnNewTerracotta()` and `checkForTerracotta()` functions after the last function and before the last `system.run(gameTick);` line of code:

```javascript
function spawnNewTerracotta() {
  const overworld = world.getDimension("overworld");

  // create new terracotta
  cottaX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
  cottaZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

  world.sendMessage("Creating new terracotta!");
  let block = overworld.getBlock({ x: cottaX + ARENA_X_OFFSET, y: 1 + ARENA_Y_OFFSET, z: cottaZ + ARENA_Z_OFFSET });

  if (block) {
    block.setPermutation(BlockPermutation.resolve("minecraft:yellow_glazed_terracotta"));
  }
}

function checkForTerracotta() {
  const overworld = world.getDimension("overworld");

  let block = overworld.getBlock({ x: cottaX + ARENA_X_OFFSET, y: 1 + ARENA_Y_OFFSET, z: cottaZ + ARENA_Z_OFFSET });

  if (block && !block.permutation.matches("minecraft:yellow_glazed_terracotta")) {
    // we didn't find the terracotta! set a new spawn countdown
    score++;
    spawnCountdown = 2;
    cottaX = -1;

    let players = world.getAllPlayers();

    for (let player of players) {
      player.runCommand("scoreboard players set @s score " + score);
    }

    world.sendMessage("You broke the terracotta! Creating new terracotta in a few seconds.");
    cottaZ = -1;
  }
}
```

Congratulations! You've just created a very basic and very easy game where you can run around and break terracotta with your sword.

To play, you will need to run the command `/gamemode s` to put Minecraft into survival mode so that you can break the terracotta.

After the terracotta is broken, your score will increment, and a new block is spawned.

#### Add a challenge - let's add some mobs

OK, let's add this function after the `checkForTerracotta()` function:

```javascript
function spawnMobs() {
  const overworld = world.getDimension("overworld");

  // spawn mobs = create 1-2 mobs
  let spawnMobCount = Math.floor(Math.random() * 2) + 1;

  for (let j = 0; j < spawnMobCount; j++) {
    let zombieX = Math.floor(Math.random() * (ARENA_X_SIZE - 2)) - ARENA_X_SIZE / 2;
    let zombieZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 2)) - ARENA_Z_SIZE / 2;

    overworld.spawnEntity("minecraft:zombie", {
      x: zombieX + ARENA_X_OFFSET,
      y: 1 + ARENA_Y_OFFSET,
      z: zombieZ + ARENA_Z_OFFSET,
    });
  }
}
```

This function will spawn 1-2 zombies within the arena, at a random location. You can change the kinds of mobs to spawn, the number, and more within this function.

Let's call that function within our `gameTick` method:

```javascript
  const spawnInterval = Math.ceil(200 / ((score + 1) / 3));
  if (curTick > START_TICK && curTick % spawnInterval === 0) {
    spawnMobs();
  }
```

For gameplay, we want mobs to spawn more frequently as your score goes up. To do this, the frequency at which `spawnMobs` is called depends on the `spawnInterval` variable. `spawnInterval` is the span of time between spawning new mobs. Because we divide this interval by our current score, this means that as our score goes up, the interval of time between spawning mobs gets shorter. This makes the challenge harder over time.

As you play, zombies should spawn and start chasing you. They'll spawn slowly at first, but as you break blocks they'll start to accumulate and bother you while you try to break terracotta blocks.

### Add more challenges!

Let's add a new gameplay twist: randomly spawning obstructions in the form of leaves.

Add this function to **main.js** to randomly place some fuzzy leaves:

```javascript
function addFuzzyLeaves() {
  const overworld = world.getDimension("overworld");

  for (let i = 0; i < 10; i++) {
    const leafX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
    const leafY = Math.floor(Math.random() * 10);
    const leafZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

    overworld
      .getBlock({ x: leafX + ARENA_X_OFFSET, y: leafY + ARENA_Y_OFFSET, z: leafZ + ARENA_Z_OFFSET })
      ?.setPermutation(BlockPermutation.resolve("minecraft:leaves"));
  }
}
```

And call that function in your gameTick() function:

```javascript
  if (curTick > START_TICK && curTick % 29 === 0) {
    addFuzzyLeaves();
  }
```

You may wonder why the interval here is 29. The main idea was to select a number to avoid the chance that on a particular tick we do everything at once (create new leaves, spawn mobs AND check terracotta state), so we try to have offset schedules for all of these different game activities.

Now exit out and reload your game. As you run around, you should see new leaves get spawned. This should add a little bit more challenge to your gameplay!

### Summary

With this starter, you've seen how to build a nice little arena game.

Like the randomly spawning leaves, you can see how you can add different gameplay elements into your arena. Maybe rather than leaves, you want to randomly generate some parkour platforms - or some treasures or weapons, or different types of mobs. Experiment and build your own custom competition arenas!