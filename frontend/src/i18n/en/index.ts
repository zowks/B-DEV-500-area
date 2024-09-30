import type { BaseTranslation } from "../i18n-types";

const en = {
    error: {
        goHome: "Go to homepage",
    },
    header: {
        selectLanguage: "Select language",
        toggleTheme: "Toggle theme",
        selectTheme: "Select theme",
        light: "Light",
        dark: "Dark",
        system: "System"
    },
    auth: {
        email: "Email",
        password: "Password",
        signIn: {
            title: "Sign in",
            subtitle: "Enter your credentials below to login to your account",
            forgotPassword: "Forgot your password?",
            action: "Sign in"
        },
        signUp: {
            title: "Sign up",
            subtitle: "Enter your credentials below to create an account",
            action: "Sign up"

        },
        signOut: {
            title: "Sign out",
            action: "Sign out"
        },
        noAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        placeholders: {
            email: "email@example.com"
        }
    }
} satisfies BaseTranslation;

export default en;
