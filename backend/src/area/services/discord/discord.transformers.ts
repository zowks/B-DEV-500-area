import { AreaDiscordEmbed } from "./interfaces/discordEmbed.interface";

export function transformAreaDiscordEmbedToRaw(
    embed: AreaDiscordEmbed
): object {
    return {
        title: embed.title,
        author: { name: embed.authorName, url: embed.authorUrl },
        color: embed.color,
        description: embed.description,
        footer: { text: embed.footer },
        image: { url: embed.imageUrl },
        thumbnail: { url: embed.thumbnailUrl },
        timestamp: embed.timestamp,
        type: embed.type,
        url: embed.url
    };
}
