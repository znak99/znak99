// 언어 전환 시 갑작스러운 문구 변경을 줄이기 위해 짧은 페이드 전환을 만든다.
const LANGUAGE_TRANSITION_OUT_MS = 110;
const LANGUAGE_TRANSITION_RESET_MS = 280;
const LANGUAGE_TRANSITION_BYPASS = "languageTransitionBypass";

function initializeLanguageTransition() {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isTransitionRunning = false;

    document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest(".lang-switch__button[data-lang]");

        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        if (button.dataset[LANGUAGE_TRANSITION_BYPASS] === "true") {
            delete button.dataset[LANGUAGE_TRANSITION_BYPASS];
            return;
        }

        if (
            reduceMotionQuery.matches
            || isTransitionRunning
            || button.classList.contains("is-active")
            || button.getAttribute("aria-pressed") === "true"
        ) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        isTransitionRunning = true;
        document.body.classList.add("is-language-changing");

        window.setTimeout(() => {
            button.dataset[LANGUAGE_TRANSITION_BYPASS] = "true";
            button.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true
            }));

            window.requestAnimationFrame(() => {
                document.body.classList.remove("is-language-changing");
            });

            window.setTimeout(() => {
                isTransitionRunning = false;
            }, LANGUAGE_TRANSITION_RESET_MS);
        }, LANGUAGE_TRANSITION_OUT_MS);
    }, true);
}

initializeLanguageTransition();
