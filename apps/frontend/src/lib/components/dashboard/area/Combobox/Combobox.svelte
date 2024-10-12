<script lang="ts">
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import * as Command from "$lib/components/ui/command";
    import * as Popover from "$lib/components/ui/popover";
    import { cn } from "$lib/utils.js";
    import { Button } from "$lib/components/ui/button";
    import { tick } from "svelte";
    import LL from "$i18n/i18n-svelte.js";
    import type { Choice } from "./Combobox";

    export let title: string;
    export let choices: Choice[];
    export let value: string;
    export let setValue: (value: string) => unknown;

    let open = false;

    $: selectedValue = choices.find(f => f.value === value)?.label ?? $LL.area.combobox.select({ element: title });

    const closeAndFocusTrigger = (triggerId: string) => {
        open = false;
        tick().then(() => document.getElementById(triggerId)?.focus());
    };
</script>

<div class="grid">
    <p class="mr-4 text-muted-foreground text-sm">{title}</p>
    <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                class="w-[350px] justify-between"
            >
                {selectedValue}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[350px] p-0">
            <Command.Root>
                <Command.Input placeholder={$LL.area.combobox.search({ element: title })} />
                <Command.Empty>{$LL.area.combobox.no({ element: title })}</Command.Empty>
                <Command.Group>
                    {#each choices as action}
                        <Command.Item
                            value={action.value}
                            onSelect={(currentValue) => {
                                setValue(currentValue);
                                closeAndFocusTrigger(ids.trigger);
                            }}
                        >
                            <Check
                                class={cn(
                                    "mr-2 h-4 w-4",
                                    value !== action.value && "text-transparent"
                                )}
                            />
                            {action.label}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>
</div>
