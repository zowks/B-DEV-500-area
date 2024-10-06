<script lang="ts">
    import { enhance } from "$app/forms";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import EmailInput from "$lib/components/auth/inputs/Email.svelte";
    import PasswordInput from "$lib/components/auth/inputs/Password.svelte";
    import LL from "$i18n/i18n-svelte";
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">{$LL.auth.signIn.title()}</h1>
            <p class="text-muted-foreground text-balance">
                {$LL.auth.signIn.subtitle()}
            </p>
        </div>
        <form method="POST" use:enhance class="grid gap-4">
            <EmailInput emailError={form?.emailError} />
            <PasswordInput passwordError={form?.passwordError}>
                <!-- TODO: Forgot password -->
                <AlertDialog.Root closeOnOutsideClick>
                    <AlertDialog.Trigger class="ml-auto inline-block text-sm underline">
                        {$LL.auth.signIn.forgotPassword.trigger()}
                    </AlertDialog.Trigger>
                    <AlertDialog.Content>
                        <AlertDialog.Header>
                            <AlertDialog.Title>{$LL.auth.signIn.forgotPassword.title()}</AlertDialog.Title>
                            <AlertDialog.Description>
                                {$LL.auth.signIn.forgotPassword.unavailable()}<br />
                                {$LL.auth.signIn.forgotPassword.contact()}
                            </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                            <AlertDialog.Action>{$LL.auth.signIn.forgotPassword.action()}</AlertDialog.Action>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </PasswordInput>
            <Button type="submit" class="w-full">{$LL.auth.signIn.action()}</Button>
            <!-- TODO: OAuth buttons -->
        </form>
        <div class="mt-4 text-center text-sm">
            {$LL.auth.noAccount()}
            <a href="sign-up" class="underline"> {$LL.auth.signUp.title()} </a>
        </div>
    </div>
</div>
