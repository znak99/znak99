// 페이지 초기화 순서를 관리하는 진입점이다.
import { initializeBackgroundMotion } from "./background.js";
import { initializeContactActions } from "./contact.js";
import { initializeHeader } from "./header.js";
import { initializeLanguageSwitcher } from "./language.js";
import { initializeProjectsSection } from "./projects.js";
import { initializeSkillsBoard } from "./skills.js";

function finishInitialLoad() {
    const loadingScreen = document.getElementById("loadingScreen");

    window.requestAnimationFrame(() => {
        window.__portfolioBoot?.markReady?.();
        document.documentElement.classList.remove("is-loading");

        if (loadingScreen) {
            loadingScreen.setAttribute("aria-hidden", "true");
        }
    });
}

async function initializePortfolio() {
    try {
        initializeBackgroundMotion();
        initializeContactActions();
        initializeHeader();
        initializeLanguageSwitcher();
        await initializeProjectsSection();
        initializeSkillsBoard();
    } catch (error) {
        // 초기화 실패 시 콘솔에 기록하고 로딩 화면은 정상 종료한다.
        console.error("[portfolio] 초기화 오류:", error);
    } finally {
        finishInitialLoad();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
} else {
    initializePortfolio();
}
