// 프로젝트 데이터를 my-projects.json에서 불러와 선택 버튼과 featured 패널을 동기화한다.
import { REDUCED_MOTION_QUERY } from "./i18n.js";
import { getCurrentLanguage, getTranslation } from "./language.js";

const FEATURED_HEIGHT_TRANSITION_MS = 420;

async function loadProjects() {
    const response = await fetch("my-projects.json");

    if (!response.ok) {
        throw new Error(`my-projects.json 로드 실패: ${response.status}`);
    }

    return response.json();
}

function getProjectI18n(project, language) {
    return project.i18n?.[language] ?? project.i18n?.en ?? {};
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

function createSummaryMedia(project, language) {
    const i18n = getProjectI18n(project, language);

    const summary = document.createElement("div");
    summary.className = "projects__featured-summary";

    const translation = getTranslation();
    const kicker = document.createElement("p");
    kicker.className = "projects__featured-summary-kicker";
    kicker.textContent = translation.projects_featured_label ?? "ABOUT THE PROJECT";

    const title = document.createElement("h4");
    title.className = "projects__featured-summary-title";
    title.textContent = i18n.title ?? "";

    const note = document.createElement("p");
    note.className = "projects__featured-summary-note";
    note.textContent = i18n.note ?? "";

    summary.append(kicker, title, note);

    if (Array.isArray(project.tags) && project.tags.length > 0) {
        summary.append(createProjectTags(project.tags));
    }

    return summary;
}

function createImageMedia(project) {
    const wrapper = document.createElement("div");
    wrapper.className = "projects__media-wrapper";

    const image = document.createElement("img");
    image.className = "projects__featured-image";
    image.src = project.image;
    image.alt = "";
    image.loading = "lazy";

    wrapper.append(image);

    if (project.github) {
        const overlay = document.createElement("div");
        overlay.className = "projects__media-overlay";
        overlay.setAttribute("aria-hidden", "true");

        const btn = document.createElement("button");
        btn.className = "projects__media-github-btn";
        btn.type = "button";
        btn.tabIndex = -1;
        const translation = getTranslation();
        btn.textContent = translation.projects_image_github_hover ?? "Explore on GitHub";
        btn.addEventListener("click", () => {
            window.open(project.github, "_blank", "noreferrer");
        });

        overlay.append(btn);
        wrapper.append(overlay);
    }

    return wrapper;
}

function buildSelectorButton(project, isActive) {
    const button = document.createElement("button");
    button.className = "projects__selector-button" + (isActive ? " is-active" : "");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", isActive ? "true" : "false");
    button.dataset.projectKey = project.key;

    const img = document.createElement("img");
    img.className = "projects__selector-thumb";
    img.src = project.thumb ?? "";
    img.alt = "";
    img.loading = "lazy";

    const overlay = document.createElement("span");
    overlay.className = "projects__selector-overlay";

    const titleSpan = document.createElement("span");
    titleSpan.className = "projects__selector-title";

    overlay.append(titleSpan);
    button.append(img, overlay);

    return button;
}

export async function initializeProjectsSection() {
    let data;

    try {
        data = await loadProjects();
    } catch (error) {
        console.error("[portfolio] 프로젝트 데이터 로드 오류:", error);
        return;
    }

    const projectsList = Array.isArray(data?.projects) ? data.projects : [];
    const defaultKey = projectsList[0]?.key ?? "";
    const projectsMap = new Map(projectsList.map((p) => [p.key, p]));

    const section = document.querySelector(".section--projects");
    const featured = section?.querySelector(".projects__featured");
    const featuredLabel = section?.querySelector('[data-project-target="label"]');
    const featuredCount = section?.querySelector('[data-project-target="count"]');
    const featuredTitle = section?.querySelector('[data-project-target="title"]');
    const featuredText = section?.querySelector('[data-project-target="text"]');
    const featuredMedia = section?.querySelector('[data-project-target="media"]');
    const featuredSkills = section?.querySelector('[data-project-target="skills"]');
    const featuredActions = section?.querySelector('[data-project-target="actions"]');
    const githubLink = section?.querySelector('[data-project-target="github"]');
    const liveLink = section?.querySelector('[data-project-target="live"]');
    const selectorEl = section?.querySelector(".projects__selector");

    if (
        !section
        || !featured
        || !featuredLabel
        || !featuredCount
        || !featuredTitle
        || !featuredText
        || !featuredSkills
        || !featuredMedia
        || !featuredActions
        || !githubLink
        || !liveLink
        || !selectorEl
        || projectsList.length === 0
    ) {
        return;
    }

    // 선택 버튼을 JSON 데이터 기준으로 동적 생성한다.
    projectsList.forEach((project) => {
        selectorEl.append(buildSelectorButton(project, project.key === defaultKey));
    });

    const buttons = [...selectorEl.querySelectorAll("[data-project-key]")];

    let activeProjectKey = defaultKey;

    if (!projectsMap.has(activeProjectKey)) {
        activeProjectKey = projectsList[0]?.key ?? "";
    }

    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let heightResetTimerId = 0;

    // 선택 버튼의 활성 상태, 접근성 속성, 버튼 제목을 갱신한다.
    const updateButtons = () => {
        const language = getCurrentLanguage();

        buttons.forEach((button) => {
            const isActive = button.dataset.projectKey === activeProjectKey;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", String(isActive));
            button.setAttribute("aria-controls", "projects-featured");
            button.tabIndex = 0;

            const project = projectsMap.get(button.dataset.projectKey);
            const titleEl = button.querySelector(".projects__selector-title");

            if (project && titleEl) {
                titleEl.textContent = getProjectI18n(project, language).title ?? "";
            }
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

    // 현재 선택된 프로젝트의 제목, 설명, 미디어, 링크를 featured 패널에 반영한다.
    const applyProjectContent = () => {
        const translation = getTranslation();
        const language = getCurrentLanguage();
        const project = projectsMap.get(activeProjectKey) ?? projectsList[0];
        const i18n = getProjectI18n(project, language);

        featuredCount.textContent = formatProjectCount(buttons.length, translation);
        featuredLabel.textContent = translation.projects_featured_label ?? "ABOUT THE PROJECT";
        featuredTitle.textContent = i18n.title ?? "";
        featuredText.textContent = i18n.text ?? "";

        const skills = Array.isArray(project.skills) ? project.skills : [];
        featuredSkills.hidden = skills.length === 0;
        featuredSkills.replaceChildren(
            ...skills.map((skill) => {
                const tag = document.createElement("span");
                tag.className = "projects__featured-skill";
                tag.textContent = skill;
                return tag;
            })
        );

        featuredMedia.replaceChildren(
            project.image
                ? createImageMedia(project)
                : createSummaryMedia(project, language)
        );

        if (project.github) {
            githubLink.hidden = false;
            githubLink.href = project.github;
            githubLink.setAttribute("aria-label", i18n.githubAria ?? "Open GitHub repository");
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

    // 콘텐츠를 갱신하고 필요 시 높이 변화를 애니메이션으로 처리한다.
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
                || !projectsMap.has(nextProjectKey)
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

    render();
}
