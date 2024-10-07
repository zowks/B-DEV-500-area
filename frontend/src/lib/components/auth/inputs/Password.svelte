<script lang="ts">
    import { Eye, EyeOff } from "lucide-svelte";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Toggle } from "$lib/components/ui/toggle/index.js";
    import LL from "$i18n/i18n-svelte";

    export let passwordError: string | undefined = undefined;

    let showPassword = false;
</script>

<div class="grid gap-2">
    <div class="flex items-center">
        <Label for="password">{$LL.auth.password()}</Label>
        <slot />
    </div>
    <div class="flex">
        <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autocomplete="new-password"
            placeholder={showPassword ? $LL.auth.password() : "••••••••"}
            required
            minlength={8}
        >
        </Input>
        <Toggle
            aria-label="toggle password visibility"
            class="hover:bg-transparent data-[state=on]:bg-transparent"
            bind:pressed={showPassword}
        >
            {#if showPassword}
                <EyeOff class="h-4 w-4" />
            {:else}
                <Eye class="h-4 w-4" />
            {/if}
        </Toggle>
    </div>
    {#if passwordError}
        <p class="text-sm text-red-500">{passwordError}</p>
    {/if}
</div>
