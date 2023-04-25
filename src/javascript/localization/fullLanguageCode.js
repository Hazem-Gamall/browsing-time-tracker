export const fullLanguageCode = {
    ar: "ar-EG",
    en: "en-US",
    get(language) {
        if (this[language]) {
            return this[language]
        }
        return language
    },
    get currentLocale(){
        return this.get(chrome.i18n.getUILanguage());
    }
}