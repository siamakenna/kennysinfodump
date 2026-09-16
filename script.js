const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const main = document.querySelector("main");
const sections = Array.from(document.querySelectorAll("main > section"));
const routeGroups = {
  home: ["home", "now", "trail", "featured", "soft-recall", "research", "training", "mentorship", "how-i-work", "skills", "awards", "contact"],
  about: ["about", "photos", "training", "mentorship", "how-i-work"],
  research: ["featured", "research"],
  work: ["trail", "work"],
  projects: ["featured", "soft-recall", "projects"],
  awards: ["awards"],
  skills: ["skills"],
  contact: ["contact"],
};
const navRoutes = { featured: "research", "perturb-lm": "research", tmem106b: "research", now: "home", trail: "work", "soft-recall": "projects", training: "about", mentorship: "about", "how-i-work": "about" };

document.querySelector(".photo-moments").id = "photos";
document.querySelector("[data-year]").textContent = new Date().getFullYear();
// Share content between the landing page and focused views without duplicating it.
main.insertBefore(document.getElementById("skills"), document.getElementById("awards"));
main.insertBefore(document.getElementById("photos"), document.getElementById("about").nextElementSibling);

const closeMenu = (restoreFocus = false) => {
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  if (restoreFocus) menuToggle.focus();
};
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navLinks.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) closeMenu();
});
document.addEventListener("focusin", (event) => {
  if (!event.target.closest(".nav")) closeMenu();
});
window.matchMedia("(min-width: 1081px)").addEventListener("change", () => closeMenu());

const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

function showRoute(requested, focus = true) {
  const target = document.getElementById(requested);
  const section = target?.closest("main > section");
  const route = routeGroups[requested] ? requested : section ? requested : "home";
  const activeIds = routeGroups[route] || [section.id];
  document.body.classList.add("router-ready");
  document.body.dataset.route = route;
  sections.forEach((item) => {
    const active = activeIds.includes(item.id);
    item.hidden = !active;
    item.classList.toggle("is-active-route", active);
  });
  const currentNav = navRoutes[route] || route;
  navLinks.querySelectorAll("a").forEach((anchor) => {
    const current = anchor.hash === "#" + currentNav;
    anchor.classList.toggle("is-current", current);
    if (current) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
  });
  closeMenu();
  const destination = routeGroups[route]
    ? document.getElementById(activeIds[0])
    : target && !target.closest("[hidden]") ? target : document.getElementById("home");
  const heading = destination.querySelector("h1, h2, h3") || destination;
  const title = route === "home" ? "Research Portfolio" : heading.textContent.trim();
  document.title = "Makenna Rodriguez | " + title;
  const routeTitle = document.getElementById("route-title");
  routeTitle.hidden = route === "home";
  routeTitle.textContent = "Makenna Rodriguez: " + title;
  if (focus) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
  // Prevent native hash scrolling from fighting view changes or the sticky header.
  requestAnimationFrame(() => {
    if (route === "home" || routeGroups[route]) window.scrollTo({ top: 0, behavior: "instant" });
    else destination.scrollIntoView({ block: "start", behavior: "instant" });
  });
}
function routeFromHash() {
  try { return decodeURIComponent(location.hash.slice(1)) || "home"; }
  catch { return "home"; }
}
document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (anchor.hash === "#main") {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
    return;
  }
  event.preventDefault();
  if (location.hash !== anchor.hash) history.pushState(null, "", anchor.hash);
  showRoute(routeFromHash());
});
window.addEventListener("popstate", () => showRoute(routeFromHash()));
window.addEventListener("hashchange", () => showRoute(routeFromHash()));
showRoute(routeFromHash(), false);

const secretButtons = Array.from(document.querySelectorAll("[data-secret]"));
const secretStatus = document.querySelector(".secret-status");
const toast = document.querySelector(".secret-toast");
const unlockedSecrets = new Set();
let toastTimer;
const updateSecretStatus = () => {
  secretStatus.textContent = "hidden gems: " + unlockedSecrets.size + " / " + secretButtons.length;
};
secretButtons.forEach((button, index) => {
  button.setAttribute("aria-pressed", "false");
  button.title = button.getAttribute("aria-label");
  button.addEventListener("click", () => {
    unlockedSecrets.add(index);
    button.classList.add("is-unlocked");
    button.setAttribute("aria-pressed", "true");
    updateSecretStatus();
    toast.textContent = button.dataset.secret + (unlockedSecrets.size === 7 ? " All seven found." : "");
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 6500);
  });
});
updateSecretStatus();

const figureDialog = document.querySelector(".figure-dialog");
let figureTrigger;
document.querySelectorAll("[data-figure]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !figureDialog.showModal) return;
    event.preventDefault();
    figureTrigger = link;
    const image = figureDialog.querySelector("img");
    const sourceImage = link.querySelector("img") || link.closest("article").querySelector("img");
    image.src = link.href;
    image.alt = sourceImage.alt;
    figureDialog.querySelector(".figure-original").href = link.href;
    figureDialog.showModal();
    document.body.classList.add("figure-open");
  });
});
function restoreFigureFocus() {
  if (figureDialog.open) return;
  document.body.classList.remove("figure-open");
  figureTrigger?.focus({ preventScroll: true });
}
function closeFigure() {
  figureDialog.close();
  // Release the scroll lock immediately; the native close event can be deferred.
  restoreFigureFocus();
}
figureDialog.querySelector(".figure-close").addEventListener("click", closeFigure);
figureDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFigure();
});
figureDialog.addEventListener("click", (event) => {
  if (event.target !== figureDialog) return;
  const bounds = figureDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeFigure();
});
figureDialog.addEventListener("close", restoreFigureFocus);
