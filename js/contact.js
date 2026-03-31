// Contact 섹션의 이메일 복사 동작을 처리한다.
import { DEFAULT_LANGUAGE, I18N } from "./i18n.js";

const COPIED_STATE_DURATION_MS = 2000;
const BUTTON_PRESS_DURATION_MS = 220;
const TOAST_HIDE_TRANSITION_MS = 280;
const TOAST_FRAGMENT_COUNT = 16;
const TOAST_FRAGMENT_DURATION_MS = 620;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getCurrentLanguage() {
    const language = document.documentElement.lang;
    return Object.hasOwn(I18N, language) ? language : DEFAULT_LANGUAGE;
}

function getTranslation() {
    return I18N[getCurrentLanguage()];
}

async function copyTextToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    helper.style.pointerEvents = "none";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
}

export function initializeContactActions() {
    const contactButtons = [...document.querySelectorAll(".contact__button")];
    const copyButton = document.querySelector("[data-contact-copy-email]");
    const copyToast = document.querySelector("[data-contact-copy-toast]");
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    if (!copyButton || !copyToast) {
        return;
    }

    let copiedStateTimerId = 0;
    let toastTimerId = 0;
    let toastHideResetTimerId = 0;

    const playButtonPress = (button) => {
        button.classList.remove("is-pressing");
        void button.offsetWidth;
        button.classList.add("is-pressing");
        window.setTimeout(() => {
            button.classList.remove("is-pressing");
        }, BUTTON_PRESS_DURATION_MS);
    };

    const spawnToastFragments = () => {
        if (reducedMotionMedia.matches) {
            return;
        }

        const rect = copyToast.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
            return;
        }

        const burst = document.createElement("div");
        burst.className = "contact__copy-burst";
        burst.style.left = `${rect.left}px`;
        burst.style.top = `${rect.top}px`;
        burst.style.width = `${rect.width}px`;
        burst.style.height = `${rect.height}px`;

        for (let index = 0; index < TOAST_FRAGMENT_COUNT; index += 1) {
            const fragment = document.createElement("span");
            const width = 12 + Math.random() * 18;
            const height = 6 + Math.random() * 10;
            const left = Math.random() * Math.max(1, rect.width - width);
            const top = Math.random() * Math.max(1, rect.height - height);
            const offsetX = (Math.random() - 0.5) * 120;
            const offsetY = -22 + Math.random() * 92;
            const rotate = `${(-140 + Math.random() * 280).toFixed(1)}deg`;
            const scale = (0.28 + Math.random() * 0.52).toFixed(2);
            const delay = `${(Math.random() * 0.08).toFixed(3)}s`;

            fragment.className = "contact__copy-fragment";
            fragment.style.setProperty("--fragment-left", `${left.toFixed(1)}px`);
            fragment.style.setProperty("--fragment-top", `${top.toFixed(1)}px`);
            fragment.style.setProperty("--fragment-width", `${width.toFixed(1)}px`);
            fragment.style.setProperty("--fragment-height", `${height.toFixed(1)}px`);
            fragment.style.setProperty("--fragment-x", `${offsetX.toFixed(1)}px`);
            fragment.style.setProperty("--fragment-y", `${offsetY.toFixed(1)}px`);
            fragment.style.setProperty("--fragment-rotate", rotate);
            fragment.style.setProperty("--fragment-scale", scale);
            fragment.style.setProperty("--fragment-delay", delay);
            burst.append(fragment);
        }

        document.body.append(burst);
        window.setTimeout(() => {
            burst.remove();
        }, TOAST_FRAGMENT_DURATION_MS + 120);
    };

    const showCopyToast = () => {
        const translation = getTranslation();

        copyToast.textContent = translation.contact_email_copied ?? "Email copied to clipboard.";
        copyToast.classList.remove("is-hiding");
        copyToast.classList.add("is-visible");
        window.clearTimeout(toastTimerId);
        window.clearTimeout(toastHideResetTimerId);
        toastTimerId = window.setTimeout(() => {
            spawnToastFragments();
            copyToast.classList.remove("is-visible");
            copyToast.classList.add("is-hiding");
            toastHideResetTimerId = window.setTimeout(() => {
                copyToast.classList.remove("is-hiding");
            }, TOAST_HIDE_TRANSITION_MS);
        }, COPIED_STATE_DURATION_MS);
    };

    copyButton.addEventListener("click", async () => {
        const emailAddress = copyButton.dataset.contactEmail ?? "";

        if (!emailAddress) {
            return;
        }

        try {
            await copyTextToClipboard(emailAddress);
            window.clearTimeout(copiedStateTimerId);
            copyButton.classList.add("is-copied");
            showCopyToast();
            copiedStateTimerId = window.setTimeout(() => {
                copyButton.classList.remove("is-copied");
            }, COPIED_STATE_DURATION_MS);
        } catch {
            // 클립보드 접근이 막힌 경우에는 조용히 종료한다.
        }
    });

    contactButtons.forEach((button) => {
        button.addEventListener("pointerdown", () => {
            playButtonPress(button);
        });

        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                playButtonPress(button);
            }
        });
    });

    document.addEventListener("portfolio:languagechange", () => {
        if (copyToast.classList.contains("is-visible")) {
            const translation = getTranslation();
            copyToast.textContent = translation.contact_email_copied ?? "Email copied to clipboard.";
        }
    });
}
