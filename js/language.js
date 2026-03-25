// 언어 전환과 메타데이터 동기화를 관리한다.
import { DEFAULT_LANGUAGE, I18N, LOCALE_CODES, SITE_TITLE, STORAGE_KEYS } from "./i18n.js";

const TRANSLATABLE_SELECTOR = "[data-i18n]";
const LANGUAGE_BUTTON_SELECTOR = ".lang-switch__button";
const MENU_TOGGLE_SELECTOR = "[data-menu-toggle]";

const metaElements = {
    description: document.querySelector('meta[name="description"]'),
    ogTitle: document.querySelector('meta[property="og:title"]'),
    ogDescription: document.querySelector('meta[property="og:description"]'),
    ogLocale: document.querySelector('meta[property="og:locale"]'),
    twitterTitle: document.querySelector('meta[name="twitter:title"]'),
    twitterDescription: document.querySelector('meta[name="twitter:description"]')
};

const translatableElements = [...document.querySelectorAll(TRANSLATABLE_SELECTOR)];
const languageButtons = [...document.querySelectorAll(LANGUAGE_BUTTON_SELECTOR)];

function resolveLanguage(language) {
    return I18N[language] ? language : DEFAULT_LANGUAGE;
}

function readStoredLanguage() {
    try {
        return localStorage.getItem(STORAGE_KEYS.language);
    } catch {
        return null;
    }
}

function persistLanguage(language) {
    try {
        localStorage.setItem(STORAGE_KEYS.language, language);
    } catch {
        // 저장소를 쓸 수 없는 환경에서는 현재 언어만 유지한다.
    }
}

// 일부 번역 대상은 텍스트 대신 속성을 갱신한다.
function applyTranslation(element, value) {
    const attributeName = element.dataset.i18nAttr;

    if (attributeName) {
        element.setAttribute(attributeName, value);
        return;
    }

    element.textContent = value;
}

// 현재 언어에 맞춰 문서 메타 정보를 함께 맞춘다.
function updateMetadata(language, dictionary) {
    document.title = SITE_TITLE;

    metaElements.description?.setAttribute("content", dictionary.meta_description);
    metaElements.ogTitle?.setAttribute("content", SITE_TITLE);
    metaElements.ogDescription?.setAttribute("content", dictionary.meta_description);
    metaElements.ogLocale?.setAttribute("content", LOCALE_CODES[language] ?? LOCALE_CODES[DEFAULT_LANGUAGE]);
    metaElements.twitterTitle?.setAttribute("content", SITE_TITLE);
    metaElements.twitterDescription?.setAttribute("content", dictionary.meta_description);
}

function updateLanguageButtons(language) {
    languageButtons.forEach((button) => {
        const isActive = button.dataset.lang === language;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

export function updateMenuButtonLabel(isMenuOpen) {
    const menuToggle = document.querySelector(MENU_TOGGLE_SELECTOR);

    if (!menuToggle) {
        return;
    }

    const language = resolveLanguage(document.documentElement.lang);
    const dictionary = I18N[language];

    menuToggle.setAttribute(
        "aria-label",
        isMenuOpen ? dictionary.menu_close_label : dictionary.menu_open_label
    );
}

export function setLanguage(nextLanguage) {
    const language = resolveLanguage(nextLanguage);
    const dictionary = I18N[language];

    document.documentElement.lang = language;

    translatableElements.forEach((element) => {
        const key = element.dataset.i18n;
        const value = dictionary[key];

        if (value) {
            applyTranslation(element, value);
        }
    });

    updateMetadata(language, dictionary);
    updateLanguageButtons(language);
    updateMenuButtonLabel(document.querySelector(MENU_TOGGLE_SELECTOR)?.getAttribute("aria-expanded") === "true");
    persistLanguage(language);
}

export function initializeLanguageSwitcher() {
    languageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.lang);
        });
    });

    setLanguage(readStoredLanguage() ?? DEFAULT_LANGUAGE);
}
