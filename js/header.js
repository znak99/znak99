document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const desktopNavLinks = document.querySelectorAll(".nav__link");
    const mobileNavLinks = document.querySelectorAll(".mobile-menu__link");
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

    const langButtons = document.querySelectorAll(".lang-switch__button");
    const translatableElements = document.querySelectorAll("[data-i18n]");
    const sections = document.querySelectorAll("section[id]");

    /* 언어 적용 */
    function setLanguage(lang) {
        const dictionary = window.I18N?.[lang];

        if (!dictionary) {
            return;
        }

        document.documentElement.lang = lang;

        translatableElements.forEach((element) => {
            const key = element.dataset.i18n;

            if (dictionary[key]) {
                element.textContent = dictionary[key];
            }
        });

        langButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.lang === lang);
        });

        localStorage.setItem("language", lang);
    }

    /* 저장된 언어 불러오기 */
    function loadSavedLanguage() {
        const savedLanguage = localStorage.getItem("language") || "ko";
        setLanguage(savedLanguage);
    }

    /* 스크롤에 따른 헤더 상태 변경 */
    function updateHeaderState() {
        if (window.scrollY > 20) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    }

    /* 모바일 메뉴 열기 */
    function openMobileMenu() {
        mobileMenu.classList.add("is-open");
        menuToggle.classList.add("is-active");
        menuToggle.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("aria-hidden", "false");
    }

    /* 모바일 메뉴 닫기 */
    function closeMobileMenu() {
        mobileMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
    }

    /* 모바일 메뉴 토글 */
    function toggleMobileMenu() {
        if (mobileMenu.classList.contains("is-open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /* 현재 섹션에 맞는 메뉴 활성화 */
    function updateActiveLink() {
        let currentId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 140;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentId = section.id;
            }
        });

        allNavLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("is-active", isActive);
        });
    }

    /* 언어 버튼 클릭 처리 */
    langButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.lang);
        });
    });

    /* 햄버거 버튼 클릭 처리 */
    menuToggle.addEventListener("click", toggleMobileMenu);

    /* 모바일 메뉴 링크 클릭 시 닫기 */
    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* 메뉴 바깥 클릭 시 닫기 */
    document.addEventListener("click", (event) => {
        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedMenuButton = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {
            closeMobileMenu();
        }
    });

    /* ESC 입력 시 메뉴 닫기 */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    /* 스크롤 이벤트 처리 */
    window.addEventListener("scroll", () => {
        updateHeaderState();
        updateActiveLink();
    });

    /* 화면 확장 시 모바일 메뉴 초기화 */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    loadSavedLanguage();
    updateHeaderState();
    updateActiveLink();
});