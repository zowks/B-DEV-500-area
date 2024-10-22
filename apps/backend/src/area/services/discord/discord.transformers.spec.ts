import { transformAreaDiscordEmbedToRaw } from "./discord.transformers";
import { AreaDiscordEmbed } from "./interfaces/discordEmbed.interface";

describe("AREA Discord embed to raw Discord embed", () => {
    it("should transform and AREA Discord embed to an object the Discord API can handle", () => {
        const areaDiscordEmbed: AreaDiscordEmbed = {
            authorName: "AUTHOR_NAME",
            authorUrl: "AUTHOR_URL",
            color: 0xffffff,
            description: "DESCRIPTION",
            footer: "FOOTER",
            imageUrl: "IMAGE_URL",
            thumbnailUrl: "THUMBNAIL_URL",
            timestamp: new Date(),
            title: "TITLE",
            type: "rich",
            url: "URL"
        };
        const embed = transformAreaDiscordEmbedToRaw(areaDiscordEmbed);
        expect(embed).toStrictEqual({
            title: areaDiscordEmbed.title,
            author: {
                name: areaDiscordEmbed.authorName,
                url: areaDiscordEmbed.authorUrl
            },
            color: areaDiscordEmbed.color,
            description: areaDiscordEmbed.description,
            footer: {
                text: areaDiscordEmbed.footer
            },
            image: { url: areaDiscordEmbed.imageUrl },
            thumbnail: { url: areaDiscordEmbed.thumbnailUrl },
            timestamp: areaDiscordEmbed.timestamp,
            type: areaDiscordEmbed.type,
            url: areaDiscordEmbed.url
        });
    });
});
