# iPhone Frame Desktop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 데스크탑/태블릿(≥768px)에서 앱을 아이폰 폼팩터 프레임으로 중앙 표시, 모바일은 그대로 풀스크린 유지.

**Architecture:** `globals.css`의 `@media (min-width: 768px)` 블록에서 `body`는 어두운 배경 + 중앙 flex, `.mobile-viewport`는 고정 390×844px + 라운드 + 그림자. 새 파일 없음, JS 없음, 순수 CSS.

**Tech Stack:** CSS Media Query, Tailwind (body 배경 보조)

---

### Task 1: globals.css — 데스크탑 프레임 미디어쿼리 추가

**Files:**
- Modify: `src/styles/globals.css`

**Step 1: `.mobile-viewport` 아래에 미디어쿼리 블록 추가**

```css
@media (min-width: 768px) {
  body {
    background: #050507;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
  }

  .mobile-viewport {
    width: 390px;
    height: 844px;
    min-height: unset;
    border-radius: 44px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 40px 120px -30px rgba(0,0,0,0.9),
      0 0 60px -10px rgba(200,255,62,0.04);
  }
}
```

**Step 2: 확인 — 브라우저 DevTools에서 768px 이상으로 뷰포트 조절, 중앙 정렬 + 둥근 프레임 확인**

**Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: iPhone-style frame on desktop (≥768px)"
```

---

### Task 2: layout.tsx — body overflow 조정

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: `body` 클래스에서 `overflow-hidden` 제거 (데스크탑에서 body 스크롤 막히지 않도록), `overscroll-none`은 유지**

모바일은 `.mobile-viewport`의 `overflow: hidden`이 처리하므로 body에는 불필요.

```tsx
<body className='overscroll-none'>
```

**Step 2: TypeScript 체크**

```bash
npx -p typescript tsc --noEmit
```

Expected: app 소스 에러 없음

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix: remove overflow-hidden from body to allow desktop centering"
```
