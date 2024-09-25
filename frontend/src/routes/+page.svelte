<script lang="ts">
    import { type LoginResponse } from "@common/types/API/login/LoginResponse";

    type SubmitLoginEvent = SubmitEvent & {
        currentTarget: (EventTarget & HTMLFormElement)
    };

    let token: string = "Veuillez vous connecter";

    const onSubmitLogin = async (event: SubmitLoginEvent) => {
        event.preventDefault();

        if (!event.currentTarget) {
            console.error('No event target');
            return;
        }
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: event.currentTarget.email.value,
                password: event.currentTarget.password.value
            })
        });
        const parsedResponse = await response.json() as LoginResponse;

        if (response.ok && parsedResponse.code === 200)
            token = parsedResponse.data.token;
        else
            token = parsedResponse.message;
    };
</script>

<h1>Welcome to AREA</h1>
<form on:submit={(event) => onSubmitLogin(event)}>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" autocomplete="email">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" autocomplete="current-password">
    <button type="submit">Login</button>
</form>
<p>Token = {token}</p>
