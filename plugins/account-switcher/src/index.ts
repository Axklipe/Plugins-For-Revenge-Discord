import { logger } from "@vendetta";
import Settings from "./Settings";

export default {
    onLoad: () => {
        logger.log("Account Switcher loaded");
    },
    onUnload: () => {
        logger.log("Account Switcher unloaded");
    },
    settings: Settings,
};