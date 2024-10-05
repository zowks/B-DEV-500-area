<script lang="ts">
    import { enhance, applyAction } from "$app/forms";
    import hashPassword from "@common/hash/hashPassword";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Label } from "$lib/components/ui/label";
    import LL from "$i18n/i18n-svelte";
    import type { ActionData } from "./$types";

    export let form: ActionData;

    let checked = false;
</script>

<div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">{$LL.auth.signUp.title()}</h1>
            <p class="text-muted-foreground text-balance">
                {$LL.auth.signUp.subtitle()}
            </p>
        </div>
        <form
            method="POST"
            use:enhance={async ({ formData }) => {
                formData.set("password", await hashPassword(formData.get("password")));
                formData.set("terms", checked.toString());
                return async ({ result }) => await applyAction(result);
            }}
            class="grid gap-4"
        >
            <div class="grid gap-2">
                <Label for="email">{$LL.auth.email()}</Label>
                <Input id="email" name="email" type="email" autocomplete="email" placeholder={$LL.auth.placeholders.email()} required />
                {#if form?.emailError}
                    <p class="text-sm text-red-500">{form?.emailError}</p>
                {/if}
            </div>
            <div class="grid gap-2">
                <Label for="firstname">{$LL.auth.firstname()}</Label>
                <Input id="firstname" name="firstname" type="text" autocomplete="given-name" placeholder="John" required />
            </div>
            <div class="grid gap-2">
                <Label for="lastname">{$LL.auth.lastname()}</Label>
                <Input id="lastname" name="lastname" type="text" autocomplete="family-name" placeholder="Doe" required />
            </div>
            <div class="grid gap-2">
                <Label for="password">{$LL.auth.password()}</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    placeholder="••••••••"
                    required
                    minlength={8}
                />
                {#if form?.passwordError}
                    <p class="text-sm text-red-500">{form?.passwordError}</p>
                {/if}
            </div>
            <div>
            </div>
            <div class="flex items-center space-x-2">
                <Checkbox id="terms" name="terms" bind:checked aria-labelledby="terms-label" required />
                <Label
                    id="terms-label"
                    for="terms"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {$LL.auth.acceptTerms()}
                </Label>
            </div>
            <Button type="submit" class="w-full">{$LL.auth.signUp.action()}</Button>
            {#if form?.errorMessage}
                <p class="text-center text-sm text-red-500">{form?.errorMessage}</p>
            {/if}
            <!-- TODO: OAuth buttons -->
        </form>
        <div class="mt-4 text-center text-sm">
            {$LL.auth.alreadyHaveAccount()}
            <a href="sign-in" class="underline"> {$LL.auth.signIn.title()} </a>
        </div>
    </div>
</div>
