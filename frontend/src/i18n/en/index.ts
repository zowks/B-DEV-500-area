import type { BaseTranslation } from "../i18n-types";

const en = {
    error: {
        goHome: "Go to homepage",
        api: {
            unknown: "An unknown error occurred",
            unauthorized: "You are not authorized to perform this action",
            incorrectFields: "One or more fields are incorrect",
            emailAlreadyTaken: "The email is already taken",
            termsDenied: "You must accept the terms and conditions",
            invalidCredentials: "Invalid credentials"
        }
    },
    header: {
        selectLanguage: "Select language",
        toggleTheme: "Toggle theme",
        selectTheme: "Select theme",
        light: "Light",
        dark: "Dark",
        system: "System"
    },
    apk: {
        title: "Download the Android APK",
        download: "Download"
    },
    auth: {
        email: "Email",
        password: "Password",
        firstname: "Firstname",
        lastname: "Lastname",
        acceptTerms: "Accept terms and conditions",
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
            incorrectPassword: "Password is incorrect (must be at least 8 characters)",
            missingField: "One or more fields are missing"
        }
    },
    area: {
        createArea: "Create an AREA",
        createAreaDescription: "Link an Action and a REAction to create an AREA",
        combobox: {
            select: "Select an {element}",
            search: "Search an {element}",
            no: "No {element} found"
        },
        oauth: {
            action: "Sign in with Google"
        }
    }
} satisfies BaseTranslation;

export default en;
