# How to Enable the Content Log

The Minecraft content log allows you to view errors that result from loaded script and other behavior and resource pack files. To enable this for Minecraft Education Edition, follow these steps:

1. Go to the directory `%appdata%\Minecraft Education Edition\games\com.mojang\minecraftpe`
2. Open `options.txt` in a text-editor of your choice
3. Change `content_log_file` and `content_log_gui` from `0` to `1`.
```
content_log_file:1
content_log_gui:1
```
4. You should then be able to run Minecraft EDU and use the keyboard shortcut `CTRL-H` to open the content log GUI. The content log files can also be found in `%appdata%\Minecraft Education Edition\logs`.