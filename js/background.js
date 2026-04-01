// 배경 블롭의 이동과 반사를 제어한다.
import { REDUCED_MOTION_QUERY } from "./i18n.js";

const ORB_CONFIGS = [
    { selector: ".orb-1", velocityX: 16, velocityY: 12 },
    { selector: ".orb-2", velocityX: -18, velocityY: 10 },
    { selector: ".orb-3", velocityX: 14, velocityY: -16 }
];

const ORB_VISIBLE_RATIO = 0.62;
const MAX_DELTA_TIME = 0.033;
const RESIZE_RESET_DELAY = 120;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function initializeBackgroundMotion() {
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    const orbStates = ORB_CONFIGS.map((config) => {
        const element = document.querySelector(config.selector);

        if (!element) {
            return null;
        }

        return {
            element,
            x: 0,
            y: 0,
            velocityX: config.velocityX,
            velocityY: config.velocityY,
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0
        };
    }).filter(Boolean);

    if (orbStates.length === 0) {
        return;
    }

    let animationFrameId = 0;
    let previousTime = 0;
    let resizeTimerId = 0;

    // 현재 뷰포트를 기준으로 각 블롭의 이동 가능 범위를 다시 계산한다.
    const recalculateBounds = () => {
        orbStates.forEach((state) => {
            state.x = 0;
            state.y = 0;
            state.element.style.transform = "";

            const rect = state.element.getBoundingClientRect();
            const visibleWidth = rect.width * ORB_VISIBLE_RATIO;
            const visibleHeight = rect.height * ORB_VISIBLE_RATIO;
            const allowedLeft = -rect.width + visibleWidth;
            const allowedTop = -rect.height + visibleHeight;
            const allowedRight = window.innerWidth - visibleWidth;
            const allowedBottom = window.innerHeight - visibleHeight;

            state.minX = allowedLeft - rect.left;
            state.maxX = allowedRight - rect.left;
            state.minY = allowedTop - rect.top;
            state.maxY = allowedBottom - rect.top;
        });
    };

    const stopAnimation = (shouldResetPosition = false) => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
        }

        previousTime = 0;

        if (shouldResetPosition) {
            orbStates.forEach((state) => {
                state.x = 0;
                state.y = 0;
                state.element.style.transform = "";
            });
        }
    };

    const animate = (currentTime) => {
        if (!previousTime) {
            previousTime = currentTime;
        }

        const deltaTime = Math.min((currentTime - previousTime) / 1000, MAX_DELTA_TIME);
        previousTime = currentTime;

        orbStates.forEach((state) => {
            state.x += state.velocityX * deltaTime;
            state.y += state.velocityY * deltaTime;

            if (state.x <= state.minX || state.x >= state.maxX) {
                state.x = clamp(state.x, state.minX, state.maxX);
                state.velocityX *= -1;
            }

            if (state.y <= state.minY || state.y >= state.maxY) {
                state.y = clamp(state.y, state.minY, state.maxY);
                state.velocityY *= -1;
            }

            state.element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
        });

        animationFrameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
        if (reducedMotionMedia.matches || animationFrameId) {
            return;
        }

        previousTime = 0;
        animationFrameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
        window.clearTimeout(resizeTimerId);
        resizeTimerId = window.setTimeout(() => {
            stopAnimation(true);
            recalculateBounds();
            startAnimation();
        }, RESIZE_RESET_DELAY);
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            stopAnimation();
            return;
        }

        recalculateBounds();
        startAnimation();
    };

    const handleReducedMotionChange = (event) => {
        if (event.matches) {
            stopAnimation(true);
            return;
        }

        recalculateBounds();
        startAnimation();
    };

    recalculateBounds();
    startAnimation();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (typeof reducedMotionMedia.addEventListener === "function") {
        reducedMotionMedia.addEventListener("change", handleReducedMotionChange);
    } else {
        reducedMotionMedia.addListener(handleReducedMotionChange);
    }
}
