/**
 * 作品URLはここだけ書き換えればOK（GitHub Pages向け）
 */
const URLS = {
  springLP:
    "https://lp.be-engineer.tech/pages/new_year_2026.html?utm_source=flyer&utm_medium=offline&utm_campaign=spring_event_2026&utm_term=programming_camp&utm_content=text_link",
  works: {
    work1: "https://v0-programming-language-website-dusky.vercel.app/",
    work2: "https://v0-ghost-website.vercel.app/",
    work3: "https://v0-japanese-castles-website.vercel.app/",
  },
};

const TITLES = {
  work1: "中学１年生（１年目）｜Programming Language Website",
  work2: "中学３年生（２年目）｜Ghost Website",
  work3: "高校１年生（２年目）｜Japanese Castles Website",
};

const modal = document.getElementById("workModal");
const frame = document.getElementById("workFrame");
const modalTitle = document.getElementById("modalTitle");
const openNew = document.getElementById("modalOpenNew");

let lastActiveElement = null;
let scrollY = 0;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

function smoothScrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (modal.classList.contains("is-open")) return;

  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  el.scrollIntoView({ behavior, block: "start" });

  // 位置をURLに残す（ジャンプさせないため pushState）
  try {
    history.pushState(null, "", `#${id}`);
  } catch {
    // noop
  }
}

function lockScroll() {
  scrollY = window.scrollY || 0;
  document.body.classList.add("is-modal-open");
  // iOS/モバイルでも確実に固定するため body を固定化
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockScroll() {
  document.body.classList.remove("is-modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

function openModal(workKey) {
  const url = URLS.works[workKey];
  if (!url) return;

  lastActiveElement = document.activeElement;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  modalTitle.textContent = TITLES[workKey] || "作品を表示";
  if (openNew) openNew.setAttribute("href", url);

  // 先に空にしてから設定（連打時のチラつき軽減）
  frame.src = "about:blank";
  // 少し待ってからURLをセット（Safari系で反映が安定しやすい）
  window.setTimeout(() => {
    frame.src = url;
  }, 10);

  lockScroll();

  const closeBtn = modal.querySelector("[data-modal-close]");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!modal.classList.contains("is-open")) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  // 実行停止（音/CPUなどの残りを防ぐ）
  frame.src = "about:blank";
  if (openNew) openNew.setAttribute("href", "#");

  unlockScroll();

  if (lastActiveElement && typeof lastActiveElement.focus === "function") {
    lastActiveElement.focus();
  }
  lastActiveElement = null;
}

// 作品ボタン
document.querySelectorAll("[data-work]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-work");
    openModal(key);
  });
});

// CTAリンク（春LP）
document.querySelectorAll("[data-spring-link]").forEach((a) => {
  a.setAttribute("href", URLS.springLP);
  a.setAttribute("target", "_blank");
  a.setAttribute("rel", "noopener noreferrer");
});

// 閉じる：× / 背景
modal.querySelectorAll("[data-modal-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

// ESCで閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// フォーカストラップ（簡易）
document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  if (!modal.classList.contains("is-open")) return;

  const focusables = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
  if (list.length === 0) return;

  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;

  if (e.shiftKey) {
    if (active === first || !modal.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (active === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// 画面回転等で body 固定のズレをケア
window.addEventListener("resize", () => {
  if (!modal.classList.contains("is-open")) return;
  document.body.style.top = `-${scrollY}px`;
});


