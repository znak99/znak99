const initializeSkillsVisibilityFix = () => {
    const skillsSection = document.querySelector(".section--skills");
    const chart = document.querySelector("[data-skills-chart]");
    const tabs = Array.from(document.querySelectorAll("[data-skill-tab]"));

    if (!skillsSection || !chart || tabs.length === 0) {
        return;
    }

    const state = {
        hasEnteredViewport: false,
        pendingMode: "",
    };

    // 차트 활성화 전에는 fill이 미리 보이지 않도록 항상 비활성 상태로 시작한다.
    const hideChart = () => {
        chart.classList.remove("is-animated");
    };

    // DOM이 다시 그려진 뒤 애니메이션을 안정적으로 재시작한다.
    const revealChart = ({ immediate = false } = {}) => {
        hideChart();

        const reveal = () => {
            chart.classList.add("is-animated");
        };

        if (immediate) {
            requestAnimationFrame(reveal);
            return;
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(reveal);
        });
    };

    const consumePendingMode = () => {
        if (!state.pendingMode) {
            return;
        }

        const mode = state.pendingMode;
        state.pendingMode = "";

        revealChart({ immediate: mode === "reveal" });
    };

    const chartMutationObserver = new MutationObserver(() => {
        if (!state.hasEnteredViewport) {
            hideChart();
            return;
        }

        if (state.pendingMode) {
            consumePendingMode();
            return;
        }

        // 언어 전환처럼 DOM만 다시 그려지는 경우에는 현재 표시 상태를 즉시 복구한다.
        revealChart({ immediate: true });
    });

    const viewportObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || state.hasEnteredViewport) {
                    return;
                }

                state.hasEnteredViewport = true;

                if (chart.children.length > 0) {
                    revealChart();
                } else {
                    state.pendingMode = "initial";
                }

                viewportObserver.disconnect();
            });
        },
        {
            threshold: 0.2,
        }
    );

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            if (!state.hasEnteredViewport) {
                return;
            }

            state.pendingMode = "tab";
            hideChart();
        });
    });

    document.addEventListener("portfolio:languagechange", () => {
        if (!state.hasEnteredViewport) {
            return;
        }

        state.pendingMode = "reveal";
    });

    hideChart();
    chartMutationObserver.observe(chart, { childList: true });
    viewportObserver.observe(skillsSection);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSkillsVisibilityFix, { once: true });
} else {
    initializeSkillsVisibilityFix();
}
