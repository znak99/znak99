import { I18N } from "./i18n.js";

// Projects 섹션에서 사용하는 더미 문구를 기존 번역 사전에 합쳐 넣는다.
Object.assign(I18N.ko, {
    projects_eyebrow: "PROJECTS",
    projects_title: "더미 프로젝트로 구조와 방향성을 먼저 정리하고 있습니다.",
    projects_text:
        "실제 작업물과 실무 경험이 정리되면 이 영역은 대표 프로젝트 중심으로 다시 구성할 예정입니다. 지금은 레이아웃, 정보 밀도, 카드 흐름을 점검하기 위한 임시 데이터입니다.",
    projects_featured_label: "FEATURED DIRECTION",
    projects_featured_title: "멀티링구얼 포트폴리오 리빌드",
    projects_featured_text:
        "현재 포트폴리오 전체를 기준으로, 섹션 구조와 반응형 흐름, 언어 전환 경험을 먼저 다듬는 방향의 더미 프로젝트입니다. 이후 실제 성과와 프로젝트 정보에 맞춰 상세 내용을 교체할 예정입니다.",
    projects_featured_meta_label_1: "Range",
    projects_featured_meta_value_1: "랜딩 / 다국어 / 반응형 UI",
    projects_featured_meta_label_2: "Core Stack",
    projects_featured_meta_value_2: "HTML / CSS / JavaScript",
    projects_featured_meta_label_3: "Status",
    projects_featured_meta_value_3: "구조 설계 및 콘텐츠 정리 단계",
    projects_featured_stage_label: "Current Note",
    projects_featured_stage_value: "더미 데이터로 정보 흐름과 시각 밸런스를 점검 중입니다.",
    projects_card_label_1: "CASE 01",
    projects_card_title_1: "Responsive Portfolio System",
    projects_card_text_1:
        "섹션 단위로 콘텐츠를 정리하고, 모바일부터 데스크톱까지 일관된 구조를 만드는 연습용 더미 프로젝트입니다.",
    projects_card_note_1: "레이아웃 시스템과 정보 계층 정리를 우선한 카드입니다.",
    projects_card_label_2: "CASE 02",
    projects_card_title_2: "Language Switch Prototype",
    projects_card_text_2:
        "한국어, 일본어, 영어 전환 흐름을 정리하고 저장 상태와 전환 경험을 점검하기 위한 더미 프로젝트입니다.",
    projects_card_note_2: "상태 관리와 다국어 UI 흐름을 다루는 구성을 가정했습니다.",
    projects_card_label_3: "CASE 03",
    projects_card_title_3: "Interaction Motion Study",
    projects_card_text_3:
        "헤더, 배경, 그래프 애니메이션처럼 포트폴리오 전반의 인터랙션 밀도를 다듬기 위한 더미 프로젝트입니다.",
    projects_card_note_3: "유리 질감과 테크 무드 안에서 모션을 조율하는 방향입니다.",
});

// 일본어 사용자를 위한 Projects 더미 문구를 함께 확장한다.
Object.assign(I18N.ja, {
    projects_eyebrow: "PROJECTS",
    projects_title: "ダミープロジェクトで構成と方向性を先に整理しています。",
    projects_text:
        "実際の制作物や実務経験がまとまった後、このエリアは代表プロジェクト中心に再構成する予定です。今はレイアウト、情報量、カードの流れを確認するための仮データです。",
    projects_featured_label: "FEATURED DIRECTION",
    projects_featured_title: "多言語ポートフォリオのリビルド",
    projects_featured_text:
        "現在のポートフォリオ全体を基準に、セクション構成、レスポンシブの流れ、言語切り替え体験を先に整える想定のダミープロジェクトです。後で実際の実績とプロジェクト情報に合わせて差し替える予定です。",
    projects_featured_meta_label_1: "Range",
    projects_featured_meta_value_1: "ランディング / 多言語 / レスポンシブ UI",
    projects_featured_meta_label_2: "Core Stack",
    projects_featured_meta_value_2: "HTML / CSS / JavaScript",
    projects_featured_meta_label_3: "Status",
    projects_featured_meta_value_3: "構成設計とコンテンツ整理の段階",
    projects_featured_stage_label: "Current Note",
    projects_featured_stage_value: "仮データで情報の流れと視覚バランスを確認しています。",
    projects_card_label_1: "CASE 01",
    projects_card_title_1: "Responsive Portfolio System",
    projects_card_text_1:
        "セクション単位でコンテンツを整理し、モバイルからデスクトップまで一貫した構成を作る練習用のダミープロジェクトです。",
    projects_card_note_1: "レイアウトシステムと情報階層の整理を優先したカードです。",
    projects_card_label_2: "CASE 02",
    projects_card_title_2: "Language Switch Prototype",
    projects_card_text_2:
        "韓国語、日本語、英語の切り替えフローを整理し、保存状態と切り替え体験を確認するためのダミープロジェクトです。",
    projects_card_note_2: "状態管理と多言語 UI フローを扱う想定の構成です。",
    projects_card_label_3: "CASE 03",
    projects_card_title_3: "Interaction Motion Study",
    projects_card_text_3:
        "ヘッダー、背景、グラフアニメーションのように、ポートフォリオ全体のインタラクション密度を整えるためのダミープロジェクトです。",
    projects_card_note_3: "ガラス質感とテックムードの中でモーションを調整する方向です。",
});

// 영어 사용자를 위한 Projects 더미 문구도 같은 구조로 추가한다.
Object.assign(I18N.en, {
    projects_eyebrow: "PROJECTS",
    projects_title: "The section is currently mapped with dummy projects to define structure and direction first.",
    projects_text:
        "Once real work and practical experience are curated, this area will be rebuilt around representative projects. For now, the content is placeholder data used to validate layout, density, and card flow.",
    projects_featured_label: "FEATURED DIRECTION",
    projects_featured_title: "Multilingual Portfolio Rebuild",
    projects_featured_text:
        "This placeholder project frames the portfolio itself as a case study focused on section structure, responsive flow, and language-switch experience first. The details will be replaced later with real outcomes and project information.",
    projects_featured_meta_label_1: "Range",
    projects_featured_meta_value_1: "Landing / i18n / Responsive UI",
    projects_featured_meta_label_2: "Core Stack",
    projects_featured_meta_value_2: "HTML / CSS / JavaScript",
    projects_featured_meta_label_3: "Status",
    projects_featured_meta_value_3: "Structure planning and content shaping",
    projects_featured_stage_label: "Current Note",
    projects_featured_stage_value: "Dummy data is being used to tune information flow and visual balance.",
    projects_card_label_1: "CASE 01",
    projects_card_title_1: "Responsive Portfolio System",
    projects_card_text_1:
        "A placeholder project focused on organizing content by section and building a consistent structure from mobile through desktop.",
    projects_card_note_1: "This card prioritizes layout systems and information hierarchy.",
    projects_card_label_2: "CASE 02",
    projects_card_title_2: "Language Switch Prototype",
    projects_card_text_2:
        "A placeholder project used to shape Korean, Japanese, and English switching flow along with saved state and transition experience.",
    projects_card_note_2: "This direction assumes UI state handling and multilingual content flow.",
    projects_card_label_3: "CASE 03",
    projects_card_title_3: "Interaction Motion Study",
    projects_card_text_3:
        "A placeholder project dedicated to tuning the interaction density across the portfolio, including header, background, and graph motion.",
    projects_card_note_3: "The focus is on balancing motion inside a glassy, technical mood.",
});
