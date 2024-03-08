# How to Enable a Newer Version of the Script API

If you're having issues with the limited functionality of version 1.3.0 of "@minecraft/server", there is an option to enable the 1.4.0-beta version. This version has more features and bug fixes, but keep in mind that it is not the full 1.4.0 version and there may be some inconsistencies. To enable the 1.4.0-beta version, you will need to update the dependencies in your `manifest.json` file, as well as make some hidden modifications to your world settings.

## Updating the Dependencies
The dependencies in your `manifest.json` file should look like this:

```jsonc
"dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.4.0-beta"
    },
    // include the server-ui module if you are using it
    {
      "module_name": "@minecraft/server-ui",
      "version": "1.2.0-beta"
    }
]
```

## Adjusting the `level.dat` File
After updating the dependencies, you will need to make some adjustments to your `level.dat` file for your Minecraft world. 

### Prerequisites
To be able to read and modify `.dat` files, you will need a text editor that can handle NBT files. We recommend installing the [NBT Viewer](https://marketplace.visualstudio.com/items?itemName=misodee.vscode-nbt) extension in Visual Studio Code.

### Steps
1. Open the world folder for your Minecraft world.
    - The world folder is located in `%appdata%\Minecraft Education Edition\games\com.mojang\minecraftWorlds`.
    - Look through the available worlds to find one where the `levelname.txt` matches your world name.
2. Open the world's `level.dat` file in a text editor. If there is a `level.dat.old`, you will need to open that as well.
    - With the NBT Viewer extension, you can either use the Default view or view the file as "Stringified" NBT (SNBT). SNBT is similar to JSON and likely easier to read and modify.
3. Find the `experiments` entry. 
    - If using the Default view, you will need to click on the `experiments` entry to expand it.
4. Change the `experiments_ever_used` and `saved_with_toggled_experiments` values from `0` to `1`. 
5. Add a entry with key `gametest` and value 1 under `experiments`.
    - If viewing as SNBT, the `experiments` entry should look like this:
    ```snbt
    "experiments": {
        "experiments_ever_used": 1b,
        "saved_with_toggled_experiments": 1b,
        "gametest": 1b
    }
    ```
    - If using the Default view, you will need to click on the `experiments` entry to expand it and then use the `Add Tag` button at the top left to add a new entry with the key `gametest` and the value `1b`.

After making these changes, you should be able to use the 1.4.0-beta version of the Script API in your world. If you encounter any issues, you can revert the changes to the `level.dat` file and switch back to the 1.3.0 version of the `@minecraft/server` module (and version 1.1.0 of `@minecraft/server-ui`).
