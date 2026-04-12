// 스킬 보드에서 사용하는 아이콘 SVG 마크업 모음.
export const SKILL_ICON_MARKUP = {
    code: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M8.5 7.5 4.5 12l4 4.5M15.5 7.5l4 4.5-4 4.5M13.25 5 10.75 19"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
            />
        </svg>
    `,
    react: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <ellipse cx="12" cy="12" rx="8.4" ry="3.4" fill="none" stroke="currentColor" stroke-width="1.6" />
            <ellipse
                cx="12"
                cy="12"
                rx="8.4"
                ry="3.4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                transform="rotate(60 12 12)"
            />
            <ellipse
                cx="12"
                cy="12"
                rx="8.4"
                ry="3.4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                transform="rotate(120 12 12)"
            />
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
    `,
    swiftui: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect
                x="5"
                y="6"
                width="8"
                height="8"
                rx="2.2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <rect
                x="11"
                y="10"
                width="8"
                height="8"
                rx="2.2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <path
                d="M9 10c1.2-2 2.8-3.2 5-3.9"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    uikit: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect
                x="4.5"
                y="5"
                width="15"
                height="14"
                rx="3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <path
                d="M4.5 9.2h15"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <circle cx="7.3" cy="7.1" r="0.9" fill="currentColor" />
            <circle cx="10.2" cy="7.1" r="0.9" fill="currentColor" />
        </svg>
    `,
    compose: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="m12 4.2 6.2 4.1L12 12.4 5.8 8.3 12 4.2Zm0 6.4 6.2 4.1L12 18.8l-6.2-4.1L12 10.6Zm0 6 4 2.4-4 1.8-4-1.8 4-2.4Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
        </svg>
    `,
    androidView: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect
                x="7"
                y="3.5"
                width="10"
                height="17"
                rx="2.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
            />
            <path
                d="M10 9.2h4M10 12.2h4M10 15.2h4"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    flutter: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M7.2 15.8 12.9 10l2.9 2.9-5 5H7.2Zm0-8.7L12.9 1.4h4L9.8 8.6H7.2Zm5.1 5 2-2 5.5 5.5h-4.1l-3.4-3.5Z"
                fill="currentColor"
            />
        </svg>
    `,
    spring: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M18.2 5.8c-5.3.3-9.1 2.8-10.2 6.9-.4 1.7-.1 3.4.8 5.1 1-2.1 2.8-3.8 5.4-5.1-1.4 1.3-2.4 2.8-3.1 4.5 5 .5 8.8-3.2 8-11.4-.3 0-.6 0-.9 0Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    fastapi: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m13.6 3.3-7.2 9.2h4.7L9.8 20.7l7.8-10h-4Z" fill="currentColor" />
        </svg>
    `,
    django: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M7 5.5h6.6a4.5 4.5 0 0 1 0 13H7V5.5Zm3 3v7h3a2 2 0 1 0 0-7h-3Z"
                fill="currentColor"
            />
        </svg>
    `,
    flask: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M9 4h6M10 4v4.3l-3.9 6.8A1.9 1.9 0 0 0 7.8 18h8.4a1.9 1.9 0 0 0 1.7-2.9L14 8.3V4"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
            <path
                d="M9.2 13.2h5.6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    express: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="6.5" cy="7.5" r="1.6" fill="currentColor" />
            <circle cx="17.5" cy="7.5" r="1.6" fill="currentColor" />
            <circle cx="12" cy="16.5" r="1.6" fill="currentColor" />
            <path
                d="M8.1 7.5h7.8M12 9.1v5.8"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    ai: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M6 7.5A3.5 3.5 0 0 1 9.5 4h6A3.5 3.5 0 0 1 19 7.5v4A3.5 3.5 0 0 1 15.5 15H11l-4 3v-3.2A3.4 3.4 0 0 1 6 11.5v-4Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
            <path
                d="m16.8 4.5.7 1.4 1.5.3-1.1 1.1.3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1.1 1.5-.3.7-1.4Z"
                fill="currentColor"
            />
        </svg>
    `,
    git: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="7" cy="6" r="1.7" fill="currentColor" />
            <circle cx="17" cy="12" r="1.7" fill="currentColor" />
            <circle cx="7" cy="18" r="1.7" fill="currentColor" />
            <path
                d="M7 7.8v8.4c0-2.6 3.1-4.2 10-4.2"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
        </svg>
    `,
    docker: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="6" y="8" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="8" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="13" y="8" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="9.5" y="4.5" width="3" height="3" rx="0.6" fill="currentColor" />
            <path
                d="M4.5 13.2h12.1c1.8 0 2.9-.7 3.5-2 .7.2 1.2.6 1.4 1.3-.6 2.9-2.7 4.8-6 4.8H9.1c-2.4 0-4.1-1.5-4.6-4.1Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
        </svg>
    `,
    figma: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="9" cy="6.5" r="3.5" fill="currentColor" />
            <circle cx="15" cy="6.5" r="3.5" fill="currentColor" opacity="0.9" />
            <rect x="5.5" y="9.5" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.86" />
            <rect x="5.5" y="16.5" width="7" height="4.5" rx="2.2" fill="currentColor" opacity="0.78" />
            <path
                d="M12.5 13a3.5 3.5 0 1 1 3.5 3.5h-3.5V13Z"
                fill="currentColor"
                opacity="0.94"
            />
        </svg>
    `,
    generic: `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="M12 4 19 8v8l-7 4-7-4V8l7-4Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.7"
            />
        </svg>
    `
};
