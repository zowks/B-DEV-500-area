import { transformer } from "./generic.transformers";
import { ActionResource } from "./services/interfaces/service.interface";

describe("Tests that the variable template are applied correctly", () => {
    it("should replace all the {{TAGS}} by actual values", () => {
        const now = new Date();

        const input: ActionResource["data"] = {
            channelId: "YOUTUBE_CHANNEL_ID",
            channelName: "YOUTUBE_CHANNEL_NAME",
            description: "YOUTUBE_VIDEO_DESCRIPTION",
            id: "YOUTUBE_VIDEO_ID",
            likes: 10,
            publishedAt: now,
            tags: ["YOUTUBE_VIDEO_TAGS_1", "YOUTUBE_VIDEO_TAGS_2"],
            thumbnail: "YOUTUBE_VIDEO_THUMBNAIL_URL",
            title: "YOUTUBE_VIDEO_TITLE",
            url: "YOUTUBE_VIDEO_URL",
            views: 10
        };

        const output = {
            channelId: "-{{channelId}}-",
            channelName: "-{{channelName}}-",
            description: "-{{description}}-",
            id: "-{{id}}-",
            likes: "-{{likes}}-",
            publishedAt: "-{{publishedAt}}-",
            // tags: ["YOUTUBE_VIDEO_TAGS_1", "YOUTUBE_VIDEO_TAGS_2"],
            thumbnail: "-{{thumbnail}}-",
            title: "-{{title}}-",
            url: "-{{url}}-",
            views: "-{{views}}-"
        };

        const copy = { ...output };

        const updatedOutput = transformer(input, output);

        expect(output).toStrictEqual(copy);

        expect(updatedOutput).toStrictEqual({
            channelId: `-${input.channelId}-`,
            channelName: `-${input.channelName}-`,
            description: `-${input.description}-`,
            id: `-${input.id}-`,
            likes: `-${input.likes}-`,
            publishedAt: `-${input.publishedAt}-`,
            // tags: [`YOUTUBE_VIDEO_TAGS_1`, `YOUTUBE_VIDEO_TAGS_2`],
            thumbnail: `-${input.thumbnail}-`,
            title: `-${input.title}-`,
            url: `-${input.url}-`,
            views: `-${input.views}-`
        });
    });
});
