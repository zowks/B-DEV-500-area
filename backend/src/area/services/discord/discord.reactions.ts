import axios from "axios";
import { AreaDiscordEmbed } from "./interfaces/discord_embed.interface";
import { ReactionDescription } from "../interfaces/service.interface";
import { transformAreaDiscordEmbedToRaw } from "./discord.transformers";

function sendEmbed(
    fields: { webhook: string },
    embed: AreaDiscordEmbed
): Promise<void> {
    const rawEmbed = transformAreaDiscordEmbedToRaw(embed);
    return axios.post(
        fields.webhook,
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
        params: [
            {
                name: "webhook",
                type: "string",
                description: "The Discord webhook to execute."
            }
        ],
        produce: sendEmbed
    }
};
