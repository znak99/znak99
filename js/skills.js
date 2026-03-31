// 스킬 탭과 레벨 그래프 렌더링, 최초 1회 애니메이션 조건을 관리한다.
import { DEFAULT_LANGUAGE, I18N } from "./i18n.js";

const DEFAULT_TAB = "frontend";
const SKILLS_ANIMATION_STAGGER_MS = 70;
const SKILLS_VISIBILITY_THRESHOLD = 0.18;
const HINT_TRANSITION_OUT_MS = 120;
const TOUCH_HINT_DURATION_MS = 3000;
const TRANSIENT_HINT_MEDIA_QUERY = "(max-width: 1024px), (hover: none), (pointer: coarse)";
const SKILL_LEVEL_DESCRIPTIONS = {
    25: "skills_level_desc_25",
    50: "skills_level_desc_50",
    75: "skills_level_desc_75",
    100: "skills_level_desc_100"
};

const SKILL_ICON_MARKUP = {
    code: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M8.5 7.5 4.5 12l4 4.5M15.5 7.5l4 4.5-4 4.5M13.25 5 10.75 19"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
            />
        </svg>
    `,
    react: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <ellipse cx="12" cy="12" rx="8.4" ry="3.4" fill="none" stroke="currentColor" stroke-width="1.6" />
            <ellipse
                cx="12"
                cy="12"
                rx="8.4"
                ry="3.4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                transform="rotate(60 12 12)"
            />
            <ellipse
                cx="12"
                cy="12"
                rx="8.4"
                ry="3.4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                transform="rotate(120 12 12)"
            />
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
    `,
    swiftui: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect
                x="5"
                y="6"
                width="8"
                height="8"
                rx="2.2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <rect
                x="11"
                y="10"
                width="8"
                height="8"
                rx="2.2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <path
                d="M9 10c1.2-2 2.8-3.2 5-3.9"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    uikit: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect
                x="4.5"
                y="5"
                width="15"
                height="14"
                rx="3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <path
                d="M4.5 9.2h15"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <circle cx="7.3" cy="7.1" r="0.9" fill="currentColor" />
            <circle cx="10.2" cy="7.1" r="0.9" fill="currentColor" />
        </svg>
    `,
    compose: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="m12 4.2 6.2 4.1L12 12.4 5.8 8.3 12 4.2Zm0 6.4 6.2 4.1L12 18.8l-6.2-4.1L12 10.6Zm0 6 4 2.4-4 1.8-4-1.8 4-2.4Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
        </svg>
    `,
    androidView: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect
                x="7"
                y="3.5"
                width="10"
                height="17"
                rx="2.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <path
                d="M10 9.2h4M10 12.2h4M10 15.2h4"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    flutter: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M7.2 15.8 12.9 10l2.9 2.9-5 5H7.2Zm0-8.7L12.9 1.4h4L9.8 8.6H7.2Zm5.1 5 2-2 5.5 5.5h-4.1l-3.4-3.5Z"
                fill="currentColor"
            />
        </svg>
    `,
    spring: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M18.2 5.8c-5.3.3-9.1 2.8-10.2 6.9-.4 1.7-.1 3.4.8 5.1 1-2.1 2.8-3.8 5.4-5.1-1.4 1.3-2.4 2.8-3.1 4.5 5 .5 8.8-3.2 8-11.4-.3 0-.6 0-.9 0Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    fastapi: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m13.6 3.3-7.2 9.2h4.7L9.8 20.7l7.8-10h-4Z" fill="currentColor" />
        </svg>
    `,
    django: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M7 5.5h6.6a4.5 4.5 0 0 1 0 13H7V5.5Zm3 3v7h3a2 2 0 1 0 0-7h-3Z"
                fill="currentColor"
            />
        </svg>
    `,
    flask: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M9 4h6M10 4v4.3l-3.9 6.8A1.9 1.9 0 0 0 7.8 18h8.4a1.9 1.9 0 0 0 1.7-2.9L14 8.3V4"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
            <path
                d="M9.2 13.2h5.6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    express: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="6.5" cy="7.5" r="1.6" fill="currentColor" />
            <circle cx="17.5" cy="7.5" r="1.6" fill="currentColor" />
            <circle cx="12" cy="16.5" r="1.6" fill="currentColor" />
            <path
                d="M8.1 7.5h7.8M12 9.1v5.8"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    ai: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M6 7.5A3.5 3.5 0 0 1 9.5 4h6A3.5 3.5 0 0 1 19 7.5v4A3.5 3.5 0 0 1 15.5 15H11l-4 3v-3.2A3.4 3.4 0 0 1 6 11.5v-4Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
            <path
                d="m16.8 4.5.7 1.4 1.5.3-1.1 1.1.3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1.1 1.5-.3.7-1.4Z"
                fill="currentColor"
            />
        </svg>
    `,
    git: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="7" cy="6" r="1.7" fill="currentColor" />
            <circle cx="17" cy="12" r="1.7" fill="currentColor" />
            <circle cx="7" cy="18" r="1.7" fill="currentColor" />
            <path
                d="M7 7.8v8.4c0-2.6 3.1-4.2 10-4.2"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    docker: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="6" y="8" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="8" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="13" y="8" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="4.5" width="3" height="3" rx="0.6" fill="currentColor" />
            <path
                d="M4.5 13.2h12.1c1.8 0 2.9-.7 3.5-2 .7.2 1.2.6 1.4 1.3-.6 2.9-2.7 4.8-6 4.8H9.1c-2.4 0-4.1-1.5-4.6-4.1Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
        </svg>
    `,
    figma: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="9" cy="6.5" r="3.5" fill="currentColor" />
            <circle cx="15" cy="6.5" r="3.5" fill="currentColor" opacity="0.9" />
            <rect x="5.5" y="9.5" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.86" />
            <rect x="5.5" y="16.5" width="7" height="4.5" rx="2.2" fill="currentColor" opacity="0.78" />
            <path
                d="M12.5 13a3.5 3.5 0 1 1 3.5 3.5h-3.5V13Z"
                fill="currentColor"
                opacity="0.94"
            />
        </svg>
    `,
    generic: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M12 4 19 8v8l-7 4-7-4V8l7-4Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
        </svg>
    `
};

const SKILL_DATA = {
    frontend: [
        { name: "HTML / CSS / JavaScript", level: 80, icon: "code", iconRgb: "247 146 87" },
        { name: "React", level: 45, icon: "react", iconRgb: "111 220 255" },
        { name: "iOS (SwiftUI)", level: 67, icon: "swiftui", iconRgb: "126 177 255" },
        { name: "iOS (UI Kit)", level: 38, icon: "uikit", iconRgb: "129 208 255" },
        { name: "Android (Jetpack Compose)", level: 34, icon: "compose", iconRgb: "122 225 170" },
        { name: "Android (View System)", level: 42, icon: "androidView", iconRgb: "151 230 117" },
        { name: "Flutter", level: 55, icon: "flutter", iconRgb: "106 184 255" }
    ],
    backend: [
        { name: "Java (Spring)", level: 82, icon: "spring", iconRgb: "124 214 112" },
        { name: "Python (FastAPI)", level: 72, icon: "fastapi", iconRgb: "98 218 194" },
        { name: "Python (Django)", level: 70, icon: "django", iconRgb: "98 187 132" },
        { name: "Python (Flask)", level: 30, icon: "flask", iconRgb: "246 198 103" },
        { name: "JavaScript (Express)", level: 45, icon: "express", iconRgb: "171 190 255" }
    ],
    tools: [
        { name: "AI (ChatGPT, Claude)", level: 76, icon: "ai", iconRgb: "119 214 255" },
        { name: "Git / GitHub", level: 68, icon: "git", iconRgb: "255 132 108" },
        { name: "Docker", level: 55, icon: "docker", iconRgb: "112 193 255" },
        { name: "Figma", level: 70, icon: "figma", iconRgb: "244 139 116" }
    ]
};

function getCurrentLanguage() {
    const language = document.documentElement.lang;
    return Object.hasOwn(I18N, language) ? language : DEFAULT_LANGUAGE;
}

function getTranslation() {
    return I18N[getCurrentLanguage()];
}

function createSkillRow(skill, index) {
    const item = document.createElement("article");
    item.className = "skills-board__row";
    item.style.setProperty("--skill-delay", `${index * SKILLS_ANIMATION_STAGGER_MS}ms`);

    const head = document.createElement("div");
    head.className = "skills-board__row-head";

    const meta = document.createElement("div");
    meta.className = "skills-board__row-meta";

    const icon = document.createElement("span");
    icon.className = "skills-board__row-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.style.setProperty("--skill-icon-rgb", skill.iconRgb ?? "191 255 211");
    icon.innerHTML = SKILL_ICON_MARKUP[skill.icon] ?? SKILL_ICON_MARKUP.generic;

    const name = document.createElement("span");
    name.className = "skills-board__row-name";
    name.textContent = skill.name;

    const value = document.createElement("span");
    value.className = "skills-board__row-value";
    value.textContent = `${skill.level}%`;

    meta.append(icon, name);
    head.append(meta, value);

    const track = document.createElement("div");
    track.className = "skills-board__row-track";

    const fill = document.createElement("span");
    fill.className = "skills-board__row-fill";
    fill.style.setProperty("--skill-level", `${skill.level}%`);

    track.append(fill);
    item.append(head, track);

    return item;
}

export function initializeSkillsBoard() {
    const section = document.querySelector(".section--skills");
    const chart = document.querySelector("[data-skills-chart]");
    const tabs = [...document.querySelectorAll(".skills-board__tab")];
    const levelPoints = [...document.querySelectorAll(".skills-board__axis-point")];
    const hint = document.getElementById("skills-board-hint");
    const panel = document.getElementById("skills-board-panel");

    if (!section || !chart || tabs.length === 0 || !hint || !panel) {
        return;
    }

    const transientHintMedia = window.matchMedia(TRANSIENT_HINT_MEDIA_QUERY);
    let activeTab = DEFAULT_TAB;
    let hasPlayedInitialChartAnimation = false;
    let hintTransitionTimerId = 0;
    let touchHintTimerId = 0;
    let activeHintLevel = null;

    const isTransientHintMode = () => transientHintMedia.matches;

    const updateHintMessage = (message) => {
        window.clearTimeout(hintTransitionTimerId);
        hint.classList.add("is-updating");

        hintTransitionTimerId = window.setTimeout(() => {
            hint.textContent = message;
            hint.classList.remove("is-updating");
        }, HINT_TRANSITION_OUT_MS);
    };

    const setHint = (level = null, { temporary = false } = {}) => {
        const translation = getTranslation();
        const translationKey = level
            ? SKILL_LEVEL_DESCRIPTIONS[level]
            : (isTransientHintMode() ? "skills_level_hint_touch" : "skills_level_hint_default");
        const message = translation[translationKey];

        window.clearTimeout(touchHintTimerId);
        activeHintLevel = level;
        updateHintMessage(typeof message === "string" ? message : "");

        if (temporary && level) {
            touchHintTimerId = window.setTimeout(() => {
                activeHintLevel = null;
                setHint();
            }, TOUCH_HINT_DURATION_MS);
        }
    };

    const updateLevelPointTooltips = () => {
        const translation = getTranslation();

        levelPoints.forEach((point) => {
            const level = Number(point.dataset.skillLevel);
            const descriptionKey = SKILL_LEVEL_DESCRIPTIONS[level];
            const description = translation[descriptionKey];

            if (typeof description === "string") {
                point.dataset.tooltip = description;
                point.setAttribute("aria-label", `${level}% - ${description}`);
            }
        });

        setHint(activeHintLevel);
    };

    const updateTabs = () => {
        tabs.forEach((tab) => {
            const isActive = tab.dataset.skillTab === activeTab;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", String(isActive));

            if (isActive) {
                panel.setAttribute("aria-labelledby", tab.id);
            }
        });
    };

    // 첫 화면 로드에서는 그래프를 미리 채우지 않고, 실제로 보일 때만 애니메이션한다.
    const renderChart = ({ animate = false, revealImmediately = false } = {}) => {
        const skills = SKILL_DATA[activeTab] ?? [];
        const rows = skills.map(createSkillRow);

        chart.classList.remove("is-animated");
        chart.replaceChildren(...rows);

        if (revealImmediately) {
            rows.forEach((row) => row.classList.add("is-visible", "is-static"));
            chart.classList.add("is-animated");
            return;
        }

        if (animate) {
            window.requestAnimationFrame(() => {
                chart.classList.add("is-animated");
                rows.forEach((row) => row.classList.add("is-visible"));
            });
        }
    };

    const activateTab = (nextTab) => {
        if (!Object.hasOwn(SKILL_DATA, nextTab)) {
            return;
        }

        activeTab = nextTab;
        updateTabs();

        if (hasPlayedInitialChartAnimation) {
            renderChart({ animate: true });
            return;
        }

        renderChart();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!hasPlayedInitialChartAnimation && entry.isIntersecting) {
                hasPlayedInitialChartAnimation = true;
                renderChart({ animate: true });
            }
        });
    }, { threshold: SKILLS_VISIBILITY_THRESHOLD });

    observer.observe(section);

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const nextTab = tab.dataset.skillTab;

            if (nextTab && nextTab !== activeTab) {
                activateTab(nextTab);
            }
        });
    });

    levelPoints.forEach((point) => {
        const level = Number(point.dataset.skillLevel);

        point.addEventListener("mouseenter", () => {
            if (!isTransientHintMode()) {
                setHint(level);
            }
        });

        point.addEventListener("focus", () => {
            setHint(level);
        });

        point.addEventListener("click", () => {
            if (isTransientHintMode()) {
                setHint(level, { temporary: true });
                return;
            }

            setHint(level);
        });

        point.addEventListener("mouseleave", () => {
            if (!isTransientHintMode() && document.activeElement !== point) {
                activeHintLevel = null;
                setHint();
            }
        });

        point.addEventListener("blur", () => {
            if (!isTransientHintMode()) {
                activeHintLevel = null;
                setHint();
            }
        });
    });

    document.addEventListener("portfolio:languagechange", () => {
        updateLevelPointTooltips();
        updateTabs();
    });

    const handleHintModeChange = () => {
        activeHintLevel = null;
        setHint();
    };

    if (typeof transientHintMedia.addEventListener === "function") {
        transientHintMedia.addEventListener("change", handleHintModeChange);
    } else {
        transientHintMedia.addListener(handleHintModeChange);
    }

    updateLevelPointTooltips();
    updateTabs();
    renderChart();
}
