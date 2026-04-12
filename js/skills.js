// 스킬 탭과 레벨 그래프 렌더링, 최초 1회 애니메이션 조건을 관리한다.
import { getTranslation } from "./language.js";
import { SKILL_ICON_MARKUP } from "./skill-icons.js";

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
    const renderChart = ({ animate = false } = {}) => {
        const skills = SKILL_DATA[activeTab] ?? [];
        const rows = skills.map(createSkillRow);

        chart.classList.remove("is-animated");
        chart.replaceChildren(...rows);

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
