// Run against the local preview with Node and agent-browser installed via npm.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const base = process.env.PREVIEW_URL || "http://localhost:4173/";
const out = resolve(process.env.QA_OUTPUT || "/tmp/kenny-portfolio-qa");
mkdirSync(out, { recursive: true });
const results = [];
function browser(...args) {
  const executable = process.env.AGENT_BROWSER_BIN || "npx";
  const prefix = process.env.AGENT_BROWSER_BIN ? [] : ["--yes", "agent-browser@0.38.0"];
  const output = execFileSync(executable, [...prefix, "--json", ...args], { encoding: "utf8", timeout: 60000, maxBuffer: 8e6 });
  const response = JSON.parse(output);
  assert.equal(response.success, true, response.error);
  return response.data;
}
const evaluate = (code) => browser("eval", code).result;
function check(name, run) {
  try { const detail = run(); results.push({ name, status: "PASS", detail }); console.log("PASS " + name); }
  catch (error) { results.push({ name, status: "FAIL", detail: error.message }); console.log("FAIL " + name + ": " + error.message); }
  writeFileSync(resolve(out, "results.json"), JSON.stringify(results, null, 2));
}
const routes = ["home", "about", "research", "work", "projects", "awards", "skills", "contact"];
browser("open", base);
browser("wait", "--load", "networkidle");
check("Initial seven-gem state", () => {
  assert.equal(evaluate('document.querySelectorAll("[data-secret]").length'), 7);
  assert.equal(evaluate('document.querySelector(".secret-status").textContent'), "hidden gems: 0 / 7");
});
check("Local resources and internal destinations", () => {
  const info = evaluate(`({urls:[...document.querySelectorAll('[src], link[href], a[href]')].map(e=>e.getAttribute('src')||e.getAttribute('href')),ids:[...document.querySelectorAll('[id]')].map(e=>e.id),images:[...document.querySelectorAll('main img')].map(e=>({src:e.getAttribute('src'),alt:e.alt,width:e.width,height:e.height}))})`);
  assert.equal(new Set(info.ids).size, info.ids.length, "Duplicate IDs");
  for (const url of info.urls) {
    if (url.startsWith("#")) assert.ok(info.ids.includes(url.slice(1)), "Missing target " + url);
    else if (!/^(https?:|mailto:|tel:|data:)/.test(url)) assert.ok(existsSync(resolve(url)), "Missing local asset " + url);
  }
  for (const image of info.images) assert.ok(image.alt && image.width && image.height, "Missing alt/dimensions " + image.src);
  writeFileSync(resolve(out, "external-urls.json"), JSON.stringify(evaluate('[...new Set([...document.querySelectorAll(\'a[href^="https:"]\')].map(e=>e.href))]'), null, 2));
  return { images: info.images.length, targets: info.ids.length };
});
for (const width of [1440, 1080, 768, 390, 320]) {
  browser("set", "viewport", String(width), "900");
  for (const route of routes) check(`Navigation and layout ${width}px / ${route}`, () => {
    if (width <= 1080) browser("click", ".menu-toggle");
    browser("click", `.nav-links a[href="#${route}"]`);
    const info = evaluate(`({route:document.body.dataset.route,nav:document.querySelector('.nav-links [aria-current]')?.hash,expanded:document.querySelector('.menu-toggle').getAttribute('aria-expanded'),hiddenFocus:!!document.activeElement.closest('[hidden]'),focusTop:document.activeElement.getBoundingClientRect().top,overflow:[...document.querySelectorAll('main h1,main h2,main h3,main h4,main p,main a,main button')].filter(e=>!e.closest('[hidden]')&&e.getBoundingClientRect().width&& !e.closest('.table-scroll')).filter(e=>{const r=e.getBoundingClientRect();return r.left < -1 || r.right>innerWidth+1}).map(e=>e.tagName+':'+e.textContent.slice(0,60))})`);
    assert.equal(info.route, route);
    assert.equal(info.nav, "#" + route);
    assert.equal(info.expanded, "false");
    assert.equal(info.hiddenFocus, false);
    assert.ok(info.focusTop >= 0 && info.focusTop < 900, "Destination focus outside viewport: " + info.focusTop);
    assert.deepEqual(info.overflow, []);
    if ([1440, 390].includes(width)) browser("screenshot", resolve(out, `${width}-${route}.png`));
  });
}
browser("set", "viewport", "1440", "1000");
browser("open", base);
check("Keyboard skip link", () => {
  browser("press", "Tab");
  assert.equal(evaluate("document.activeElement.textContent.trim()"), "Skip to content");
  browser("press", "Enter");
  assert.equal(evaluate("document.activeElement.id"), "main");
});
for (const width of [1440, 390]) check(`All seven gems, repeat clicks and keyboard ${width}px`, () => {
  browser("set", "viewport", String(width), "900");
  browser("open", base);
  const gems = ["skate", "microscope", "probe", "poster", "moss", "data", "asl"];
  const paths = ["home", "about", "research", "work", "projects", "awards", "skills"];
  for (let i = 0; i < gems.length; i++) {
    if (width <= 1080) browser("click", ".menu-toggle");
    browser("click", `.nav-links a[href="#${paths[i]}"]`);
    browser("focus", `.${gems[i]}-gem`);
    browser("press", i % 2 ? "Space" : "Enter");
    assert.equal(evaluate('document.querySelector(".secret-status").textContent'), `hidden gems: ${i + 1} / 7`);
    browser("click", `.${gems[i]}-gem`);
    assert.equal(evaluate('document.querySelector(".secret-status").textContent'), `hidden gems: ${i + 1} / 7`);
  }
  browser("screenshot", resolve(out, `${width}-seven-gems.png`));
  return "7 / 7; repeated activation did not increment; Enter and Space both used";
});
check("Mobile menu Escape and focus restoration", () => {
  browser("click", ".menu-toggle"); browser("press", "Escape");
  assert.equal(evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), "false");
  assert.equal(evaluate('document.activeElement.className'), "menu-toggle");
});
check("Direct nested link, history and unknown route", () => {
  browser("open", base + "#perturb-lm");
  assert.equal(evaluate("document.body.dataset.route"), "perturb-lm");
  browser("click", ".menu-toggle"); browser("click", '.nav-links a[href="#about"]');
  browser("back"); assert.equal(evaluate("document.body.dataset.route"), "perturb-lm");
  browser("forward"); assert.equal(evaluate("document.body.dataset.route"), "about");
  browser("open", base + "#not-a-route"); assert.equal(evaluate("document.body.dataset.route"), "home");
});
for (const route of ["featured", "training", "work"]) check(`Figure dialogs, images and focus return / ${route}`, () => {
  browser("open", base + "#" + route);
  const figures = evaluate(`([...document.querySelectorAll('main > section:not([hidden]) [data-figure]')].map(e=>e.getAttribute('href')))`);
  for (const href of figures) {
    const selector = `a[data-figure][href="${href}"]`;
    browser("click", selector);
    browser("wait", "--fn", 'document.querySelector("dialog img").complete && document.querySelector("dialog img").naturalWidth > 0');
    assert.equal(evaluate('document.querySelector("dialog").open'), true, "Dialog not open: " + href);
    browser("press", "Escape");
    assert.equal(evaluate('document.querySelector("dialog").open'), false);
    assert.equal(evaluate('document.body.classList.contains("figure-open")'), false);
    assert.equal(evaluate('document.activeElement.getAttribute("href")'), href);
  }
  return figures;
});
check("All main images decode", () => {
  const images = evaluate('[...document.querySelectorAll("main img")].map(e=>e.src)');
  for (const src of images) assert.equal(evaluate(`new Promise(resolve=>{const i=new Image(); i.onload=()=>resolve(true);i.onerror=()=>resolve(false);i.src=${JSON.stringify(src)}})`), true, src);
  return images.length;
});
check("Reduced motion", () => {
  browser("set", "media", "light", "reduced-motion"); browser("open", base);
  assert.equal(evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'), true);
  assert.deepEqual(evaluate('[...document.querySelectorAll("body *")].filter(e=>getComputedStyle(e).animationName!=="none" || getComputedStyle(e).transitionDuration!=="0s").map(e=>e.className)'), []);
});
for (const route of routes) check(`Automated accessibility / ${route}`, () => {
  browser("open", base + "#" + route);
  const audit = browser("a11y");
  writeFileSync(resolve(out, `a11y-${route}.json`), JSON.stringify(audit, null, 2));
  assert.deepEqual(audit.violations, []);
  return { violations: audit.counts.violations, manualReview: audit.incomplete.map(i=>i.id) };
});
check("Runtime errors", () => {
  const errors = browser("errors");
  const consoleLog = browser("console");
  writeFileSync(resolve(out, "console.json"), JSON.stringify({ errors, consoleLog }, null, 2));
  assert.deepEqual(errors.errors || [], []);
  return errors;
});
check("Repository policy scan", () => {
  const paths = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {encoding:"utf8"}).split("\0").filter(Boolean);
  const patterns = ["lova" + "ble", "y2k-" + "butterfly", "cold" + ".email", "if" + "rame"].map(p=>new RegExp(p,"i"));
  const matches = paths.filter(p=>/\.(html|css|js|mjs|md|json|csv|svg|txt)$/.test(p)).filter(p=>patterns.some(re=>re.test(readFileSync(p,"utf8"))));
  assert.deepEqual(matches, []);
  return { filesScanned: paths.length };
});
browser("close");
console.log(JSON.stringify({pass:results.filter(r=>r.status==="PASS").length,fail:results.filter(r=>r.status==="FAIL").length,output:out}));
process.exitCode = results.some(r=>r.status==="FAIL") ? 1 : 0;
