const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("[data-year]");
const butterflyCursor = document.querySelector(".butterfly-cursor");

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const canUseButterflyCursor =
  butterflyCursor && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUseButterflyCursor) {
  document.body.classList.add("has-butterfly-cursor");

  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;
  let flapTimeout;

  window.addEventListener(
    "mousemove",
    (event) => {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const angle = Math.max(-24, Math.min(24, dx * 0.28));

      butterflyCursor.style.transform = `translate3d(${event.clientX - 34}px, ${event.clientY - 26}px, 0) rotate(${angle}deg)`;
      butterflyCursor.classList.add("is-visible", "is-flapping");

      clearTimeout(flapTimeout);
      flapTimeout = window.setTimeout(() => {
        butterflyCursor.classList.remove("is-flapping");
      }, Math.hypot(dx, dy) > 2 ? 260 : 120);

      lastX = event.clientX;
      lastY = event.clientY;
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", () => {
    butterflyCursor.classList.remove("is-visible", "is-flapping");
  });
}

const portfolioStaticFallback = {
  research: document.querySelectorAll("#research .timeline-item").length,
  works: document.querySelectorAll("#work .work-card, #work .feature-card").length,
  awards: document.querySelectorAll("#awards .awards-grid article").length,
};

const expectedPortfolioCounts = {
  research: 12,
  works: 5,
  awards: 3,
};

document.querySelectorAll("[data-sdk-section]").forEach((section) => {
  const name = section.dataset.sdkSection;
  const count = portfolioStaticFallback[name] || 0;
  section.dataset.contentSource = "static-fallback";
  section.dataset.staticFallbackCount = String(count);
  section.dataset.expectedCount = String(expectedPortfolioCounts[name] || count);
});
