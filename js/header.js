// 헤더 상호작용과 현재 섹션 강조를 관리한다.
import { updateMenuButtonLabel } from "./language.js";

const HEADER_SCROLL_THRESHOLD = 20;
const DESKTOP_MEDIA_QUERY = "(min-width: 769px)";
const MANUAL_SCROLL_INTENT_WINDOW_MS = 900;
const ACTIVE_SECTION_OFFSET = 28;
const BOTTOM_SECTION_THRESHOLD = 12;
const SCROLL_TRIGGER_KEYS = new Set([
    "ArrowDown",
    "ArrowUp",
    "PageDown",
    "PageUp",
    "Home",
    "End",
    " ",
    "Spacebar"
]);

function isInteractiveElement(target) {
    return target instanceof HTMLElement
        && (
            target.isContentEditable
            || target.closest("input, textarea, select, button, a, summary")
        );
}

export function initializeHeader() {
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const sections = [...document.querySelectorAll("main section[id]")];
    const allNavLinks = [
        ...document.querySelectorAll(".nav__link"),
        ...document.querySelectorAll(".mobile-menu__link")
    ];

    if (!header || !menuToggle || !mobileMenu || sections.length === 0) {
        return;
    }

    const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    let hasPlayedInitialScrollSweep = false;
    let manualScrollIntentUntil = 0;

    const markManualScrollIntent = (duration = MANUAL_SCROLL_INTENT_WINDOW_MS) => {
        manualScrollIntentUntil = performance.now() + duration;
    };

    // 메뉴 패널과 버튼 상태를 한곳에서 맞춘다.
    const setMenuState = (isOpen) => {
        mobileMenu.classList.toggle("is-open", isOpen);
        menuToggle.classList.toggle("is-active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));

        if ("inert" in mobileMenu) {
            mobileMenu.inert = !isOpen;
        }

        updateMenuButtonLabel(isOpen);
    };

    const updateHeaderState = () => {
        header.classList.toggle("is-scrolled", window.scrollY > HEADER_SCROLL_THRESHOLD);

        // 최초 수동 스크롤 입력 직후의 실제 스크롤에서만 스윕을 실행한다.
        if (
            !hasPlayedInitialScrollSweep &&
            window.scrollY > HEADER_SCROLL_THRESHOLD &&
            performance.now() <= manualScrollIntentUntil
        ) {
            header.classList.add("has-scroll-sweep");
            hasPlayedInitialScrollSweep = true;
        }
    };

    // 현재 섹션 ID에 해당하는 네비게이션 링크를 활성 상태로 표시한다.
    const updateActiveLinks = (currentId) => {
        allNavLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    // 헤더 바로 아래 기준선을 통과한 마지막 섹션을 현재 위치로 본다.
    const resolveActiveSection = () => {
        const activeLine = window.scrollY + header.offsetHeight + ACTIVE_SECTION_OFFSET;
        const scrollBottom = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        let currentSectionId = sections[0].id;

        if (scrollBottom >= documentHeight - BOTTOM_SECTION_THRESHOLD) {
            updateActiveLinks(sections.at(-1)?.id ?? currentSectionId);
            return;
        }

        sections.forEach((section) => {
            if (section.offsetTop <= activeLine) {
                currentSectionId = section.id;
            }
        });

        if (currentSectionId) {
            updateActiveLinks(currentSectionId);
        }
    };

    const closeMobileMenu = () => setMenuState(false);

    menuToggle.addEventListener("click", () => {
        setMenuState(!mobileMenu.classList.contains("is-open"));
    });

    document.querySelectorAll(".mobile-menu__link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    allNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("href")?.slice(1);

            if (targetId) {
                updateActiveLinks(targetId);
            }
        });
    });

    // 휠 입력은 가장 명확한 수동 스크롤 의도이므로 짧게 허용 창을 연다.
    window.addEventListener("wheel", (event) => {
        if (event.isTrusted) {
            markManualScrollIntent();
        }
    }, { passive: true });

    // 터치 스크롤도 동일하게 수동 스크롤 의도로 본다.
    window.addEventListener("touchmove", (event) => {
        if (event.isTrusted) {
            markManualScrollIntent();
        }
    }, { passive: true });

    // 스크롤 의도 감지와 모바일 메뉴 닫기를 단일 keydown 핸들러에서 처리한다.
    document.addEventListener("keydown", (event) => {
        if (
            event.isTrusted &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey &&
            SCROLL_TRIGGER_KEYS.has(event.key) &&
            !isInteractiveElement(event.target)
        ) {
            markManualScrollIntent(1200);
        }

        if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
            closeMobileMenu();
            menuToggle.focus();
        }
    });

    document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Node)) {
            return;
        }

        const clickedInsideMenu = mobileMenu.contains(target);
        const clickedMenuButton = menuToggle.contains(target);

        if (!clickedInsideMenu && !clickedMenuButton) {
            closeMobileMenu();
        }
    });

    const handleScroll = () => {
        updateHeaderState();
        resolveActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resolveActiveSection);

    const handleDesktopLayoutChange = (event) => {
        if (event.matches) {
            closeMobileMenu();
        }
    };

    if (typeof desktopMediaQuery.addEventListener === "function") {
        desktopMediaQuery.addEventListener("change", handleDesktopLayoutChange);
    } else {
        desktopMediaQuery.addListener(handleDesktopLayoutChange);
    }

    setMenuState(false);
    updateHeaderState();
    resolveActiveSection();
}
