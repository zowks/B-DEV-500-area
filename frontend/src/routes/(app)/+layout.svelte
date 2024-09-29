<script lang="ts">
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import ArrowDown from "lucide-svelte/icons/arrow-down";
    import { resetMode, setMode, toggleMode } from "mode-watcher";
    import {
        Root as DropdownMenuRoot,
        Trigger as DropdownMenuTrigger,
        Content as DropdownMenuContent,
        Item as DropdownMenuItem
    } from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
</script>

<div class="flex justify-between items-center m-2">
    <Button on:click={toggleMode} variant="outline" size="icon" class="ml-auto rounded-r-none">
        <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
    </Button>
    <DropdownMenuRoot>
        <DropdownMenuTrigger asChild let:builder>
            <Button builders={[builder]} variant="outline" size="default" class="px-0.5 rounded-l-none border-l-0">
                <ArrowDown class="h-[1.2rem] w-[1.2rem]" />
                <span class="sr-only">Select theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem on:click={() => setMode("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem on:click={() => setMode("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem on:click={() => resetMode()}>System</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenuRoot>
</div>
<slot />
