// 다국어 상태와 메타데이터, 언어 전환 효과를 한곳에서 관리한다.
import { DEFAULT_LANGUAGE, SITE_TITLE, STORAGE_KEYS, LOCALE_CODES, I18N } from "./i18n.js";

const SUPPORTED_LANGUAGES = new Set(Object.keys(I18N));
const LANGUAGE_BUTTON_SELECTOR = ".lang-switch__button[data-lang]";
const TRANSLATABLE_SELECTOR = "[data-i18n]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const LANGUAGE_TRANSITION_OUT_MS = 110;
const LANGUAGE_TRANSITION_RESET_MS = 280;

let currentLanguage = DEFAULT_LANGUAGE;
let isLanguageTransitionRunning = false;
let reducedMotionMedia = null;
let transitionOutTimerId = 0;
let transitionResetTimerId = 0;
let pendingLanguage = null;

function isSupportedLanguage(language) {
    return typeof language === "string" && SUPPORTED_LANGUAGES.has(language);
}

function getTranslation(language = currentLanguage) {
    return I18N[isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE];
}

function getStoredLanguage() {
    try {
        const storedLanguage = localStorage.getItem(STORAGE_KEYS.language);
        return isSupportedLanguage(storedLanguage) ? storedLanguage : null;
    } catch {
        return null;
    }
}

function storeLanguage(language) {
    try {
        localStorage.setItem(STORAGE_KEYS.language, language);
    } catch {
        // 로컬 저장소를 쓸 수 없는 환경은 조용히 무시한다.
    }
}

function detectSystemLanguage() {
    const locales = Array.isArray(navigator.languages) && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || ""];

    if (locales.some((locale) => String(locale).toLowerCase().startsWith("ko"))) {
        return "ko";
    }

    if (locales.some((locale) => String(locale).toLowerCase().startsWith("ja"))) {
        return "ja";
    }

    return "en";
}

function resolveInitialLanguage() {
    const bootstrappedLanguage = document.documentElement.dataset.language;

    if (isSupportedLanguage(bootstrappedLanguage)) {
        return bootstrappedLanguage;
    }

    return getStoredLanguage() ?? detectSystemLanguage();
}

function setMetaContent(selector, value) {
    const element = document.querySelector(selector);

    if (element && typeof value === "string") {
        element.setAttribute("content", value);
    }
}

function applyTranslations(language) {
    const translation = getTranslation(language);

    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;

    document.title = SITE_TITLE;
    setMetaContent('meta[name="description"]', translation.meta_description);
    setMetaContent('meta[property="og:title"]', SITE_TITLE);
    setMetaContent('meta[property="og:description"]', translation.meta_description);
    setMetaContent('meta[property="og:locale"]', LOCALE_CODES[language] ?? LOCALE_CODES[DEFAULT_LANGUAGE]);
    setMetaContent('meta[name="twitter:title"]', SITE_TITLE);
    setMetaContent('meta[name="twitter:description"]', translation.meta_description);

    document.querySelectorAll(TRANSLATABLE_SELECTOR).forEach((element) => {
        const key = element.dataset.i18n;
        const value = translation[key];

        if (typeof value !== "string") {
            return;
        }

        const attribute = element.dataset.i18nAttr;

        if (attribute) {
            element.setAttribute(attribute, value);
            return;
        }

        element.textContent = value;
    });

    currentLanguage = language;
    updateLanguageButtons(language);
    updateMenuButtonLabel(undefined, language);
    document.dispatchEvent(new CustomEvent("portfolio:languagechange", {
        detail: { language }
    }));
}

function updateLanguageButtons(language) {
    document.querySelectorAll(LANGUAGE_BUTTON_SELECTOR).forEach((button) => {
        const isActive = button.dataset.lang === language;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function setLanguage(language, { persist = true } = {}) {
    const nextLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

    applyTranslations(nextLanguage);

    if (persist) {
        storeLanguage(nextLanguage);
    }
}

function changeLanguageWithTransition(language) {
    const nextLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

    if (nextLanguage === currentLanguage && !isLanguageTransitionRunning) {
        return;
    }

    if (reducedMotionMedia?.matches) {
        setLanguage(nextLanguage);
        return;
    }

    pendingLanguage = nextLanguage;
    window.clearTimeout(transitionOutTimerId);
    window.clearTimeout(transitionResetTimerId);

    if (!isLanguageTransitionRunning) {
        isLanguageTransitionRunning = true;
        document.body.classList.add("is-language-changing");
    }

    transitionOutTimerId = window.setTimeout(() => {
        const finalLanguage = pendingLanguage ?? currentLanguage;
        setLanguage(finalLanguage);

        window.requestAnimationFrame(() => {
            document.body.classList.remove("is-language-changing");
        });

        transitionResetTimerId = window.setTimeout(() => {
            isLanguageTransitionRunning = false;
            pendingLanguage = null;
        }, LANGUAGE_TRANSITION_RESET_MS);
    }, LANGUAGE_TRANSITION_OUT_MS);
}

export function updateMenuButtonLabel(isOpen = false, language = currentLanguage) {
    const menuToggle = document.getElementById("menuToggle");

    if (!menuToggle) {
        return;
    }

    const translation = getTranslation(language);
    menuToggle.setAttribute("aria-label", isOpen ? translation.menu_close_label : translation.menu_open_label);
}

export function initializeLanguageSwitcher() {
    reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    const initialLanguage = resolveInitialLanguage();
    setLanguage(initialLanguage, { persist: false });

    document.querySelectorAll(LANGUAGE_BUTTON_SELECTOR).forEach((button) => {
        button.addEventListener("click", () => {
            const nextLanguage = button.dataset.lang;

            if (isSupportedLanguage(nextLanguage)) {
                changeLanguageWithTransition(nextLanguage);
            }
        });
    });
}
