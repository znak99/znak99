// 페이지 초기화 순서를 관리하는 진입점이다.
import { initializeBackgroundMotion } from "./background.js";
import { initializeHeader } from "./header.js";
import { initializeLanguageSwitcher } from "./language.js";
import { initializeSkillsBoard } from "./skills.js";

function finishInitialLoad() {
    const loadingScreen = document.getElementById("loadingScreen");

    window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-loading");

        if (loadingScreen) {
            loadingScreen.setAttribute("aria-hidden", "true");
        }
    });
}

function initializePortfolio() {
    try {
        initializeBackgroundMotion();
        initializeHeader();
        initializeLanguageSwitcher();
        initializeSkillsBoard();
    } finally {
        finishInitialLoad();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
} else {
    initializePortfolio();
}
