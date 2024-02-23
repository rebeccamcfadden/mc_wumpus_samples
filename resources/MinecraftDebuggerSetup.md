# Minecraft Debugger Setup

This Visual Studio Code extension will assist in debugging your JavaScript code when used in the GameTest experiment in Minecraft Bedrock Edition clients and within Bedrock Dedicated Server. See more about the GameTest feature and JavaScript capabilities at https://aka.ms/gametest, and see https://aka.ms/mcscriptdebugging for more on how to get started with script debugging in Minecraft.

**Supported features**
* Setting breakpoints
* Stepping through the code
* The Locals pane
* Watches

**Unsupported scenarios**
* Changing variable state
* Immediate mode
* Debugging of "Additional Modding Capabilities" JavaScript


## Getting Started

Your first step will be to install the Visual Studio Code Extension from the Visual Studio Marketplace.

[Install the Minecraft Bedrock Edition Debugger extension](https://aka.ms/vscodescriptdebugger)

See more information on Minecraft Bedrock Edition, GameTest, and debugging at https://aka.ms/mcscriptdebugging.

### For debugging Minecraft Education Edition client inside Visual Studio Code

1. Open the folder containing the project you want to work on - likely you should open Visual Studio Code at `%appdata%\Minecraft Education Edition\games\com.mojang\development_behavior_packs\(behaviorpackname)`.
3. Create `launch.json` within a `.vscode` subfolder of that project folder:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "minecraft-js",
      "request": "attach",
      "name": "Debug with Minecraft",
      "mode": "connect",
      "localRoot": "${workspaceFolder}/",
      "port": 19144
    }
  ]
}
```

3. Start Minecraft and load into a world with your scripting behavior pack.
4. Run the command `/script debugger listen 19144` 
5. Set a break point inside of your Javascript code.
6. Within Visual Studio Code, hit Run | Start Debugging to connect the Visual Studio Code Debugger to Minecraft.

You should see your breakpoints get triggered as the code executes. You can add watches or view locals to see more information about the state of JavaScript in your project. If there is an error connecting the vscode debugger to Minecraft, you should see more information in the `console` output.
