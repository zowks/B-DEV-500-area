const englishTranslations = {
    "login": "Log in",
    "signup": "Sign up",
    "password": "Password",
    "language": "En",
    "newUser": "Don't have an account ?"
};

type Translation = {
    translation: typeof englishTranslations;
};

const translations: Record<string, Translation> = {
    en: {
        translation: englishTranslations
    },
    fr: {
        translation: {
            "login": "Se connecter",
            "signup": "Créer un compte",
            "password": "Mot de passe",
            "language": "Fr",
            "newUser": "Vous n'avez pas de compte ?"
        }
    }
};

export default translations;
