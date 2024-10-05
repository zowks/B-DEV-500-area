const englishTranslations = {
    "login": "Log in",
    "signup": "Sign up",
    "password": "Password",
    "language": "En",
    "newUser": "Don't have an account ?",
    "hasAnAccount": "Already have an account ?",
    "name": "Name",
    "lastName": "Last name",
    "tos": "Accept the ToS ?"
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
            "newUser": "Vous n'avez pas de compte ?",
            "hasAnAccount": "Vous avez déjà un compte ?",
            "name": "Prénom",
            "lastName": "Nom",
            "tos": "Accepter les ToS ?"
        }
    }
};

export default translations;
