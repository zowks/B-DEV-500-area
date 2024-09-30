import type { Translation } from "../i18n-types";

const fr = {
    error: {
        goHome: "Aller à la page d'accueil"
    },
    header: {
        selectLanguage: "Sélectionner la langue",
        toggleTheme: "Changer le thème",
        selectTheme: "Sélectionner le thème",
        light: "Clair",
        dark: "Sombre",
        system: "Système"
    },
    auth: {
        email: "Adresse mail",
        password: "Mot de passe",
        signIn: {
            title: "Se connecter",
            subtitle: "Entrez vos identifiants ci-dessous pour vous connecter à votre compte",
            forgotPassword: "Mot de passe oublié ?",
            action: "Connexion"
        },
        signUp: {
            title: "S'inscrire",
            subtitle: "Entrez vos identifiants ci-dessous pour créer un compte",
            action: "Inscription"
        },
        signOut: {
            title: "Se déconnecter",
            action: "Déconnexion"
        },
        noAccount: "Vous n'avez pas de compte ?",
        alreadyHaveAccount: "Vous avez déjà un compte ?",
        placeholders: {
            email: "mail@exemple.fr"
        }
    }
} satisfies Translation;

export default fr;
