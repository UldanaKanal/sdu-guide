import React, { createContext, useContext, useEffect, useState } from "react";
import yaml from "js-yaml";

const LanguageContext = createContext({
    translations: {},
    setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
    const [translations, setTranslations] = useState({});
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("language") || "en";
        setLanguage(savedLang);
    }, []);

    useEffect(() => {
        if (!language) return;
        localStorage.setItem("language", language);

        fetch(`/locales/${language}.yml`)
            .then((res) => res.text())
            .then((data) => {
                const parsed = yaml.load(data);
                setTranslations(parsed || {});
            })
            .catch((error) => console.error("Error loading translations:", error));
    }, [language]);

    return (
        <LanguageContext.Provider value={{ translations, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
