<script lang="ts">
    import type { HTMLInputTypeAttribute } from "svelte/elements";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Separator } from "$lib/components/ui/separator";

    type Field = {
        name: string;
        displayName: string;
        type: HTMLInputTypeAttribute;
        description: string;
    };

    // TODO: replace with backend data or at least move it to common
    const FIELDS: Record<string, Field[]> = {
        "youtube.on_liked_video": [
            { name: "id", displayName: "ID", type: "text", description: "The identifier of the video" },
            { name: "url", displayName: "URL", type: "text", description: "The URL of the video" },
            { name: "title", displayName: "Title", type: "text", description: "The title of the video" },
            {
                name: "description",
                displayName: "Description",
                type: "text",
                description: "The description of the video"
            },
            {
                name: "channelName",
                displayName: "Channel name",
                type: "text",
                description: "The channel from which the video comes from"
            },
            {
                name: "channelId",
                displayName: "Channel ID",
                type: "text",
                description: "The channel identifier from which the video comes from"
            },
            { name: "likes", displayName: "Likes", type: "text", description: "The number of likes on the video" },
            { name: "views", displayName: "Views", type: "text", description: "The number of view on the video" },
            {
                name: "publishedAt",
                displayName: "Published at",
                type: "date",
                description: "The date at which the video was published"
            },
            { name: "tags", displayName: "Tags", type: "text", description: "The tags of the video" },
            {
                name: "thumbnail",
                displayName: "Thumbnail",
                type: "text",
                description: "The thumbnail URL of the video"
            }
        ],
        "discord.send_embed": [
            { name: "title", displayName: "Title", type: "text", description: "The title of the Embed" },
            {
                name: "description",
                displayName: "Description",
                type: "text",
                description: "The description of the Embed"
            },
            { name: "url", displayName: "URL", type: "Text", description: "The URL of the Embed" },
            {
                name: "timestamp",
                displayName: "Timestamp",
                type: "date",
                description: "The timestamp of the Embed content"
            },
            { name: "color", displayName: "Color", type: "color", description: "Color code of the Embed" },
            { name: "footer", displayName: "Footer", type: "text", description: "The footer information" },
            {
                name: "imageUrl",
                displayName: "Image URL",
                type: "text",
                description: "(HTTP(S)) source URL of the image"
            },
            {
                name: "thumbnailUrl",
                displayName: "Thumbnail URL",
                type: "text",
                description: "(HTTP(S)) source URL of the thumbnail"
            },
            {
                name: "authorName",
                displayName: "Author name",
                type: "text",
                description: "The name of the Embed author"
            },
            { name: "authorUrl", displayName: "Author URL", type: "text", description: "The URL of the Embed author" }
        ]
    };

    export let action: string;
    export let reaction: string;
</script>

<div class="space-y-4">
    <p class="text-xs">
        Here are the list of fields you can use for {action}.<br />
        You can use them in the fields below to customize your REAction.<br />
        To use them, type <strong>{"{{<field_name}}"}</strong> in the field.<br />
        For example, to set a combination of the video title and channel name in the Embed title,
        type <strong>{"{{<title> by <channelName>}}"}</strong> in the title field below.
    </p>
    <Separator />
    {#each FIELDS[reaction] as field}
        <div class="flex w-[95%] max-w-sm flex-col gap-1.5">
            <Label for={field.name}>{field.displayName}</Label>
            <Input type={field.type} id={field.name} placeholder={field.displayName} />
            <p class="text-muted-foreground text-sm">{field.description}</p>
        </div>
    {/each}
</div>
