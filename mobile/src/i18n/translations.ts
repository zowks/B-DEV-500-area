const englishTranslations = {
    "Welcome to React": "Welcome to React and react-i18next",
    "Scientist": "Scientist",
    "Freelance": "Freelance",
    "Dimension": "Dimension",
    "Age": "Age",
    "Species": "Species",
    "Human": "Human",
    "Change language": "Change language",
    foo: {
        bar: "Example text in sub-object"
    }
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
            "Welcome to React": "Bienvenue à React et react-i18next",
            "Scientist": "Scientifique",
            "Freelance": "Freelance",
            "Dimension": "Dimension",
            "Age": "Âge",
            "Species": "Espèce",
            "Human": "Humain",
            "Change language": "Changer la langue",
            foo: {
                bar: "Test d'exemple dans un sous-objet"
            }
        }
    }
};

export default translations;
