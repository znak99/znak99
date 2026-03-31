// 프로젝트 선택 버튼과 상단 featured 패널을 동기화한다.
import { DEFAULT_LANGUAGE, I18N } from "./i18n.js";

const DEFAULT_PROJECT_KEY = "simpleboard";
const FEATURED_HEIGHT_TRANSITION_MS = 420;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PROJECTS = {
    simpleboard: {
        titleKey: "projects_featured_title",
        textKey: "projects_featured_text",
        image: "assets/images/projects/simple-board-preview.png",
        github: "https://github.com/znak99/simpleboard",
        live: "https://simple-board.site"
    },
    portfolio: {
        titleKey: "projects_card_title_1",
        textKey: "projects_card_text_1",
        noteKey: "projects_card_note_1",
        tags: ["Responsive UI", "Content Structure", "Accessibility"]
    },
    language: {
        titleKey: "projects_card_title_2",
        textKey: "projects_card_text_2",
        noteKey: "projects_card_note_2",
        tags: ["Korean / Japanese / English", "Persistence", "Metadata"]
    },
    motion: {
        titleKey: "projects_card_title_3",
        textKey: "projects_card_text_3",
        noteKey: "projects_card_note_3",
        tags: ["Glass UI", "Interaction", "Animation"]
    },
    mobilelab: {
        titleKey: "projects_card_title_4",
        textKey: "projects_card_text_4",
        noteKey: "projects_card_note_4",
        tags: ["Mobile Flow", "Button Layout", "Density"]
    },
    backend: {
        titleKey: "projects_card_title_5",
        textKey: "projects_card_text_5",
        noteKey: "projects_card_note_5",
        tags: ["Service Logic", "API Design", "Structure"]
    },
    cloud: {
        titleKey: "projects_card_title_6",
        textKey: "projects_card_text_6",
        noteKey: "projects_card_note_6",
        tags: ["Deploy Flow", "Operations", "Scalability"]
    },
    dashboard: {
        titleKey: "projects_card_title_7",
        textKey: "projects_card_text_7",
        noteKey: "projects_card_note_7",
        tags: ["Dashboard", "Hierarchy", "Readability"]
    }
};

function getCurrentLanguage() {
    const language = document.documentElement.lang;
    return Object.hasOwn(I18N, language) ? language : DEFAULT_LANGUAGE;
}

function getTranslation() {
    return I18N[getCurrentLanguage()];
}

function formatProjectCount(count, translation) {
    const template = translation.projects_selector_count ?? "{count} PROJECTS";
    return template.replace("{count}", String(count));
}

function createProjectTags(tags = []) {
    const list = document.createElement("ul");
    list.className = "projects__featured-tags";

    tags.forEach((tag) => {
        const item = document.createElement("li");
        item.textContent = tag;
        list.append(item);
    });

    return list;
}

function createSummaryMedia(project, translation) {
    const summary = document.createElement("div");
    summary.className = "projects__featured-summary";

    const kicker = document.createElement("p");
    kicker.className = "projects__featured-summary-kicker";
    kicker.textContent = translation.projects_featured_label ?? "ABOUT THE PROJECT";

    const title = document.createElement("h4");
    title.className = "projects__featured-summary-title";
    title.textContent = translation[project.titleKey] ?? "";

    const note = document.createElement("p");
    note.className = "projects__featured-summary-note";
    note.textContent = translation[project.noteKey] ?? "";

    summary.append(kicker, title, note);

    if (Array.isArray(project.tags) && project.tags.length > 0) {
        summary.append(createProjectTags(project.tags));
    }

    return summary;
}

function createImageMedia(project, translation) {
    const image = document.createElement("img");
    image.className = "projects__featured-image";
    image.src = project.image;
    image.alt = translation[project.titleKey] ?? "Project preview";
    image.loading = "lazy";
    return image;
}

export function initializeProjectsSection() {
    const section = document.querySelector(".section--projects");
    const featured = section?.querySelector(".projects__featured");
    const featuredLabel = section?.querySelector('[data-project-target="label"]');
    const featuredCount = section?.querySelector('[data-project-target="count"]');
    const featuredTitle = section?.querySelector('[data-project-target="title"]');
    const featuredText = section?.querySelector('[data-project-target="text"]');
    const featuredMedia = section?.querySelector('[data-project-target="media"]');
    const featuredActions = section?.querySelector('[data-project-target="actions"]');
    const githubLink = section?.querySelector('[data-project-target="github"]');
    const liveLink = section?.querySelector('[data-project-target="live"]');
    const buttons = [...(section?.querySelectorAll("[data-project-key]") ?? [])];

    if (
        !section
        || !featured
        || !featuredLabel
        || !featuredCount
        || !featuredTitle
        || !featuredText
        || !featuredMedia
        || !featuredActions
        || !githubLink
        || !liveLink
        || buttons.length === 0
    ) {
        return;
    }

    let activeProjectKey = buttons.find((button) => button.classList.contains("is-active"))?.dataset.projectKey
        ?? DEFAULT_PROJECT_KEY;

    if (!Object.hasOwn(PROJECTS, activeProjectKey)) {
        activeProjectKey = DEFAULT_PROJECT_KEY;
    }

    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let heightResetTimerId = 0;

    const updateButtons = () => {
        buttons.forEach((button) => {
            const isActive = button.dataset.projectKey === activeProjectKey;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", String(isActive));
            button.setAttribute("aria-controls", "projects-featured");
            button.tabIndex = 0;
        });
    };

    const scrollFeaturedLabelToCenter = () => {
        const labelRect = featuredLabel.getBoundingClientRect();
        const targetTop = window.scrollY + labelRect.top - ((window.innerHeight - labelRect.height) / 2);

        window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: reducedMotionMedia.matches ? "auto" : "smooth"
        });
    };

    const applyProjectContent = () => {
        const translation = getTranslation();
        const project = PROJECTS[activeProjectKey] ?? PROJECTS[DEFAULT_PROJECT_KEY];
        const title = translation[project.titleKey] ?? "";
        const text = translation[project.textKey] ?? "";

        featuredCount.textContent = formatProjectCount(buttons.length, translation);
        featuredLabel.textContent = translation.projects_featured_label ?? "ABOUT THE PROJECT";
        featuredTitle.textContent = title;
        featuredText.textContent = text;
        featuredMedia.replaceChildren(
            project.image
                ? createImageMedia(project, translation)
                : createSummaryMedia(project, translation)
        );

        if (project.github) {
            githubLink.hidden = false;
            githubLink.href = project.github;
            githubLink.setAttribute(
                "aria-label",
                translation.projects_featured_github_aria ?? "Open GitHub repository"
            );
        } else {
            githubLink.hidden = true;
        }

        if (project.live) {
            liveLink.hidden = false;
            liveLink.href = project.live;
        } else {
            liveLink.hidden = true;
        }

        featuredActions.hidden = !project.github && !project.live;
        updateButtons();
    };

    const resetFeaturedHeight = () => {
        window.clearTimeout(heightResetTimerId);
        featured.style.height = "";
        featured.classList.remove("is-resizing");
    };

    const render = ({ animateHeight = false } = {}) => {
        if (!animateHeight || reducedMotionMedia.matches) {
            applyProjectContent();
            resetFeaturedHeight();
            return;
        }

        const startHeight = featured.getBoundingClientRect().height;
        featured.style.height = `${startHeight}px`;
        featured.classList.add("is-resizing");

        applyProjectContent();
        featured.style.height = "auto";
        const endHeight = featured.getBoundingClientRect().height;
        featured.style.height = `${startHeight}px`;

        if (Math.abs(endHeight - startHeight) < 1) {
            resetFeaturedHeight();
            return;
        }

        void featured.offsetHeight;

        window.requestAnimationFrame(() => {
            featured.style.height = `${endHeight}px`;
        });

        window.clearTimeout(heightResetTimerId);
        heightResetTimerId = window.setTimeout(() => {
            resetFeaturedHeight();
        }, FEATURED_HEIGHT_TRANSITION_MS);
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const nextProjectKey = button.dataset.projectKey;

            if (
                !nextProjectKey
                || !Object.hasOwn(PROJECTS, nextProjectKey)
                || nextProjectKey === activeProjectKey
            ) {
                return;
            }

            activeProjectKey = nextProjectKey;
            render({ animateHeight: true });

            window.requestAnimationFrame(() => {
                scrollFeaturedLabelToCenter();
            });
        });
    });

    featured.addEventListener("transitionend", (event) => {
        if (event.propertyName === "height") {
            resetFeaturedHeight();
        }
    });

    document.addEventListener("portfolio:languagechange", () => {
        render();
    });
    updateButtons();
    render();
}
