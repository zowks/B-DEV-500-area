<script lang="ts">
    import type { PageData } from "./$types";
    import { buttonVariants } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import Combobox from "$lib/components/dashboard/area/Combobox/Combobox.svelte";
    import type { Choice } from "$lib/components/dashboard/area/Combobox/Combobox";
    import LL from "$i18n/i18n-svelte";

    export let data: PageData;

    const services = data.services;
    const actions = services?.filter(service => service.actions && service.actions.length) || [];
    const reactions = services?.filter(service => service.reactions && service.reactions.length) || [];

    const actionsList = actions.reduce((acc: Choice[], { name, actions }) => acc.concat(actions.map(action => ({
        label: `${name} - ${action.name}`, // TODO: i18n & good looking & PUTAING DE TYPES
        value: `${name}.${action.name}`
    }))), []);

    const reactionsList = reactions.reduce((acc: Choice[], { name, reactions }) => acc.concat(reactions.map(reaction => ({
        label: `${name} - ${reaction.name}`, // TODO: i18n & good looking & PUTAING DE TYPES
        value: `${name}.${reaction.name}`
    }))), []);

    let action: string = "";
    let reaction: string = "";
</script>

<div class="p-4">
    <Dialog.Root>
        <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
            {$LL.area.createArea()}
        </Dialog.Trigger>
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
            </div>
        </Dialog.Content>
    </Dialog.Root>
</div>
