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
            forgotPassword: {
                trigger: "Forgot your password?",
                title: "Forgot password",
                unavailable: "Password reset is not yet available.",
                contact: "Please contact the support to reset your password.",
                action: "Understood"
            },
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
        },
        errors: {
            missingEmail: "Email is required",
            incorrectEmail: "Email is incorrect",
            missingPassword: "Password is required",
            incorrectPassword: "Password is incorrect (must be at least 8 characters)"
        }
    }
} satisfies BaseTranslation;

export default en;
