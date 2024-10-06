import type { Translation } from "../i18n-types";

const fr = {
    error: {
        goHome: "Aller à la page d'accueil",
        api: {
            unknown: "Une erreur inconnue est survenue",
            unauthorized: "Vous n'êtes pas autorisé à effectuer cette action",
            incorrectFields: "Un ou plusieurs champs sont incorrects",
            emailAlreadyTaken: "L'adresse mail est déjà utilisée",
            termsDenied: "Vous devez accepter les conditions d'utilisation",
            invalidCredentials: "Identifiants incorrects"
        }
    },
    header: {
        selectLanguage: "Sélectionner la langue",
        toggleTheme: "Changer le thème",
        selectTheme: "Sélectionner le thème",
        light: "Clair",
        dark: "Sombre",
        system: "Système"
    },
    apk: {
        title: "Télécharger l'APK Android",
        download: "Télécharger"
    },
    auth: {
        email: "Adresse mail",
        password: "Mot de passe",
        signIn: {
            title: "Se connecter",
            subtitle: "Entrez vos identifiants ci-dessous pour vous connecter à votre compte",
            forgotPassword: {
                trigger: "Mot de passe oublié ?",
                title: "Mot de passe oublié",
                unavailable: "La réinitialisation du mot de passe n'est pas encore disponible.",
                contact: "Veuillez contacter le support pour réinitialiser votre mot de passe.",
                action: "Compris"
            },
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
        },
        errors: {
            missingEmail: "L'adresse mail est requise",
            incorrectEmail: "L'adresse mail est incorrecte",
            missingPassword: "Le mot de passe est requis",
            incorrectPassword: "Le mot de passe est incorrect (doit contenir au moins 8 caractères)"
        }
    }
} satisfies Translation;

export default fr;
