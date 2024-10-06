import axios from "axios";
import { AreaDiscordEmbed } from "./interfaces/discordEmbed.interface";
import {
    AreaServiceAuth,
    ReactionDescription
} from "../interfaces/service.interface";
import { transformAreaDiscordEmbedToRaw } from "./discord.transformers";

function sendEmbed(
    auth: AreaServiceAuth,
    embed: AreaDiscordEmbed
): Promise<void> {
    const rawEmbed = transformAreaDiscordEmbedToRaw(embed);
    return axios.post(
        auth.webhook,
        {
            embeds: [rawEmbed]
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}

export const DISCORD_REACTIONS: { [name: string]: ReactionDescription } = {
    send_embed: {
        description: "Sends an embed message through a Discord webhook.",
        oauthScopes: [],
        fields: [
            {
                name: "webhook",
                description: "The Discord webhook to execute."
            }
        ],
        produce: sendEmbed
    }
};
