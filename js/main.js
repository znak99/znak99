// 페이지 초기화 순서를 관리하는 진입점이다.
import { initializeBackgroundMotion } from "./background.js";
import { initializeHeader } from "./header.js";
import { initializeLanguageSwitcher } from "./language.js";

function initializePortfolio() {
    initializeBackgroundMotion();
    initializeHeader();
    initializeLanguageSwitcher();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
} else {
    initializePortfolio();
}
