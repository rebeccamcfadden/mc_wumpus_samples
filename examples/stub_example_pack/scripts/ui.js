import * as ui from "@minecraft/server-ui";
export default class UIExample {
    // this class has methods to demonstrate how to use the minecraft UI API
    static testPopup(player, message) {
        // show a simple popup to the player
        const form = new ui.ActionFormData().title("Confirmation").body(message).button("Yes").button("No");
        form.show(player).then((response) => {
            if (response.selection === 0) {
                // call method if yes
                player.sendMessage("you selected yes");
            }
            else {
                // call method if no
                player.sendMessage("you selected no");
            }
        });
    }
}
