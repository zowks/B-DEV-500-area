import { YOUTUBE_ACTIONS } from "./youtube.actions";
import { YOUTUBE_REACTIONS } from "./youtube.reactions";

export default {
    name: "youtube",
    actions: Object.entries(YOUTUBE_ACTIONS).map(
        ([name, { description, fields }]) => ({
            name,
            description,
            fields
        })
    ),
    reactions: Object.entries(YOUTUBE_REACTIONS).map(
        ([name, { description, fields }]) => ({ name, description, fields })
    )
};
