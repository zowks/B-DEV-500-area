<script lang="ts">
    import type { PageServerData } from "./$types";
    import type { Services } from "~/app";
    import { Separator } from "$lib/components/ui/separator";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import Combobox from "$lib/components/dashboard/area/Combobox/Combobox.svelte";
    import type { Choice } from "$lib/components/dashboard/area/Combobox/Combobox";
    import AreaForm from "$lib/components/dashboard/area/AreaForm/AreaForm.svelte";
    import LL from "$i18n/i18n-svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { applyAction, enhance } from "$app/forms";

    export let data: PageServerData;

    const services = data.services;
    const servicesActions = services?.filter(service => service.actions && service.actions.length) || [];
    const servicesReactions = services?.filter(service => service.reactions && service.reactions.length) || [];

    const actions: Record<string, Services[number]["actions"][number]> = {};
    const reactions: Record<string, Services[number]["reactions"][number]> = {};

    const actionsList = servicesActions.reduce((acc: Choice[], serviceAction) => acc.concat(serviceAction.actions.map(action => {
        const id = `${serviceAction.name}.${action.name}`;

        actions[id] = action;
        // TODO: i18n & good looking
        return { label: `${serviceAction.name} - ${action.name}`, value: id };
    })), []);

    const reactionsList = servicesReactions.reduce((acc: Choice[], serviceReaction) => acc.concat(serviceReaction.reactions.map(reaction => {
        const id = `${serviceReaction.name}.${reaction.name}`;

        reactions[id] = reaction;
        // TODO: i18n & good looking
        return { label: `${serviceReaction.name} - ${reaction.name}`, value: id };
    })), []);

    let action: string = "";
    let reaction: string = "";
</script>

<div class="p-4">
    <Dialog.Root open>
        <Dialog.Content class="sm:max-w-[425px]">
                <Dialog.Header>
                    <Dialog.Title>{$LL.area.createArea()}</Dialog.Title>
                    <Dialog.Description>
                        {$LL.area.createAreaDescription()}
                    </Dialog.Description>
                </Dialog.Header>
                <div class="grid gap-4 py-4">
                    <Combobox title="Action" choices={actionsList} value={action} setValue={(value) => action = value} />
                    <Combobox title="REAction" choices={reactionsList} value={reaction} setValue={(value) => reaction = value} />
                    <form
                        method="POST"
                        use:enhance={async ({ formData }) => {
                            if (actions[action] && actions[action].oauthScopes)
                                formData.set("scope", actions[action].oauthScopes.join(" "));
                            return async ({ result }) => await applyAction(result);
                        }}
                        action="?/oauth"
                    >
                        <Button type="submit">
                            <img src="/icons/services/google.png" alt="google service" class="mr-2 h-4 w-4" />
                            {$LL.area.oauth.action()}
                        </Button>
                    </form>
                    {#if action && reaction}
                        {#if actions[action].auth === "oauth"}
                            <p></p>
                        {:else if actions[action].auth === "apiKey"}
                            <p>API Key</p>
                        {:else if actions[action].auth === "webhook"}
                            <p>Webhook</p>
                        {/if}
                        <Separator />
                        <ScrollArea class="h-96">
                            <AreaForm action={action} reaction={reaction} />
                        </ScrollArea>
                    {/if}
                </div>
        </Dialog.Content>
    </Dialog.Root>
</div>
