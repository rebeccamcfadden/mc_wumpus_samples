import { world, system } from "@minecraft/server";

function mainTick() {
    try {
        if (system.currentTick % 100 === 0) {
            var my_name = "Steve";
            // write code here to get the player's name
            world.sendMessage("Hello " + my_name + "! Tick: " + system.currentTick);
        }
    }
    catch (e) {
        world.sendMessage("Error: " + e);
    }
    system.run(mainTick);
}

system.run(mainTick);