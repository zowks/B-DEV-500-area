import { DISCORD_ACTIONS } from "./discord.actions";
import { DISCORD_REACTIONS } from "./discord.reactions";

export default {
    name: "discord",
    actions: Object.entries(DISCORD_ACTIONS).map(
        ([name, { description, auth, oauthScopes }]) => ({
            name,
            description,
            auth,
            oauthScopes
        })
    ),
    reactions: Object.entries(DISCORD_REACTIONS).map(
        ([name, { description, auth, oauthScopes }]) => ({
            name,
            description,
            auth,
            oauthScopes
        })
    )
};
