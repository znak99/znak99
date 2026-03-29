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

const SKILL_DATA = {
    frontend: [
        { name: "HTML", level: 82 },
        { name: "CSS", level: 78 },
        { name: "JavaScript", level: 72 },
        { name: "Responsive UI", level: 74 },
        { name: "Accessibility", level: 62 }
    ],
    backend: [
        { name: "Node.js", level: 42 },
        { name: "Express", level: 38 },
        { name: "REST API", level: 46 },
        { name: "Database Basics", level: 34 },
        { name: "Auth Flow", level: 31 }
    ],
    tools: [
        { name: "Git / GitHub", level: 68 },
        { name: "Figma", level: 52 },
        { name: "VS Code", level: 79 },
        { name: "Chrome DevTools", level: 66 },
        { name: "Deployment Flow", level: 41 }
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

    const name = document.createElement("span");
    name.className = "skills-board__row-name";
    name.textContent = skill.name;

    const value = document.createElement("span");
    value.className = "skills-board__row-value";
    value.textContent = `${skill.level}%`;

    head.append(name, value);

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
