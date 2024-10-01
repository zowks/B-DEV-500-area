<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import LL from "$i18n/i18n-svelte";
</script>

<div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">{$LL.auth.signIn.title()}</h1>
            <p class="text-muted-foreground text-balance">
                {$LL.auth.signIn.subtitle()}
            </p>
        </div>
        <div class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">{$LL.auth.email()}</Label>
                <Input id="email" type="email" placeholder={$LL.auth.placeholders.email()} required />
            </div>
            <div class="grid gap-2">
                <div class="flex items-center">
                    <Label for="password">{$LL.auth.password()}</Label>
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
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" class="w-full">{$LL.auth.signIn.action()}</Button>
            <!-- TODO: OAuth buttons -->
        </div>
        <div class="mt-4 text-center text-sm">
            {$LL.auth.noAccount()}
            <a href="sign-up" class="underline"> {$LL.auth.signUp.title()} </a>
        </div>
    </div>
</div>
