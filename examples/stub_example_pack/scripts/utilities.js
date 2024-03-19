import * as mc from "@minecraft/server";
import TestRunner from "./tests/test_main";
import UIExample from "./ui";
export default class Utility {
    static init() {
        mc.system.afterEvents.scriptEventReceive.subscribe(event => {
            let event_name = event.id;
            Utility.sendDebugMessage('Received event: ' + event_name + (event.message ? ' ' + event.message : ''));
            // if the event doesn't have the required namespace, ignore it
            if (!event_name.includes(Utility.packNamespace + ':')) {
                return;
            }
            //strip the required namespace off the event name
            Utility.handleDebugCommand(event_name.split(':')[1], event.message, Utility.getPlayer1());
        });
    }
    static getPlayer1() {
        let players = mc.world.getAllPlayers();
        if (players.length > 0) {
            return players[0];
        }
        return undefined;
    }
    static handleDebugCommand(event, message = undefined, player = undefined) {
        if (event === 'debug') {
            Utility.debug = !Utility.debug;
            Utility.sendDebugMessage('Debug mode: ' + Utility.debug);
        }
        else if (event === 'test' && message) {
            if (message === 'list') {
                TestRunner.listTests();
                return;
            }
            TestRunner.runTest(message);
        }
        else if (event === 'ui_example') {
            // show an example ui popup
            if (player) {
                // call the method from the UIExample class
                UIExample.testPopup(player, 'This is a test popup');
            }
            else {
                mc.world.sendMessage('No player found to show the popup');
            }
        }
        // register any custom commands you need here
        // else if (event === 'my_custom_command') {
        // 	do things here
        // 	usage in game: /scriptevent wumpus:my_custom_command
        // }
        else {
            // catch any unknown events
            Utility.sendDebugMessage('Unknown event: ' + event);
        }
    }
    static sendDebugMessage(message) {
        if (Utility.debug) {
            mc.world.sendMessage(message);
        }
    }
    static assert(condition, message) {
        if (!condition) {
            Utility.sendDebugMessage(message);
            return false;
        }
        return true;
    }
}
Utility.debug = false;
Utility.packNamespace = 'wumpus';
