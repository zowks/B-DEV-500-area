import { DISCORD_ACTIONS } from "./discord.actions";
import { DISCORD_REACTIONS } from "./discord.reactions";

export default {
    name: "discord",
    actions: Object.entries(DISCORD_ACTIONS).map(
        ([name, { description, fields }]) => ({
            name,
            description,
            fields
        })
    ),
    reactions: Object.entries(DISCORD_REACTIONS).map(
        ([name, { description, fields }]) => ({ name, description, fields })
    )
};
