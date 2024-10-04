<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import LL from "$i18n/i18n-svelte";
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">{$LL.auth.signUp.title()}</h1>
            <p class="text-muted-foreground text-balance">
                {$LL.auth.signUp.subtitle()}
            </p>
        </div>
        <form method="POST" use:enhance class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">{$LL.auth.email()}</Label>
                <Input id="email" name="email" type="email" autocomplete="email" value={form?.email || ""} placeholder={$LL.auth.placeholders.email()} required />
                {#if form?.emailError}
                    <p class="text-sm text-red-500">{form?.emailError}</p>
                {/if}
            </div>
            <div class="grid gap-2">
                <Label for="password">{$LL.auth.password()}</Label>
                <Input id="password" name="password" type="password" autocomplete="new-password" placeholder="••••••••" required />
                {#if form?.passwordError}
                    <p class="text-sm text-red-500">{form?.passwordError}</p>
                {/if}
            </div>
            <Button type="submit" class="w-full">{$LL.auth.signUp.action()}</Button>
            <!-- TODO: OAuth buttons -->
        </form>
        <div class="mt-4 text-center text-sm">
            {$LL.auth.alreadyHaveAccount()}
            <a href="sign-in" class="underline"> {$LL.auth.signIn.title()} </a>
        </div>
    </div>
</div>
