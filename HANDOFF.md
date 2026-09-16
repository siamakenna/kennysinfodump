# September 2026 Refresh Handoff

## 1. Branch and Scope

Branch: `site/september-2026-refresh`, continued from the existing refresh in this checkout. Baseline: `cbc46d6`. No merge into `main`; the older parent-folder draft was not overwritten. This is a content and usability refresh, not a replacement design.

## 2. Changes

Preserved KENNY.exe, the electric-blue/holographic portal, original photographs and seven original gems. Updated the hero, current research arc, fall conference route, flagship research stories, Soft Recall release, Neuromatch credential, NINDS role, mentorship, nonprofit title, toolkit, and recent milestones. Older awards remain in a disclosure.

Added actual research artifacts, data tables, conservative captions, local figure enlargement, accessible focused navigation, mobile menu controls, page headings, skip navigation, focus restoration and reduced-motion handling. Removed subheading-overlap effects without replacing the existing theme.

## 3. Files

- `index.html`: content, metadata, image dimensions, accessible markup and scientific artifacts.
- `script.js`: hash navigation, focus/menu handling, original seven-gem behavior and figure viewer.
- `refresh.css`: scoped readability and responsive corrections; `styles.css` remains unchanged.
- Ten added assets, individually listed in [ASSET-INVENTORY.md](ASSET-INVENTORY.md).
- `qa/verify.mjs`, `qa/check-content.py`, `qa/check-links.mjs`: repeatable browser, content and link checks.
- `qa/results.json`, `qa/links.json`, `qa/screenshots/`: final QA evidence.
- `README.md`, this handoff and asset inventory: maintenance, source and review instructions.

## 4-6. Assets, Figures and External Links

The inventory documents every added asset and the broader candidate selection. Research figures: Perturb-LM workflow B, repaired results A, September strict comparator plot and CSV, two TMEM montages; existing local sdAb poster preserved. Neuromatch adds an authentic certificate thumbnail and PDF; About adds a supplied research-talk photo.

New or refreshed destinations:

- [NECB official program](https://newenglandcompbio.org/), [SACNAS conference](https://www.sacnas.org/conference), [SfN conference](https://www.sfn.org/meetings/neuroscience-2026/general-information/).
- [NIH Poster Day program, page 79](https://www.training.nih.gov/documents/129/PPD-Program_Book_2026_v6.pdf#page=79), [Penn State STAIR profile](https://stair.psu.edu/get-involved/virtual-student-training/).
- [Perturb-LM source](https://github.com/siamakenna/perturb-LM), [methods audit](https://github.com/siamakenna/perturb-LM/blob/main/docs/METADATA_AND_PREPROCESSING_AUDIT.md), [public prototype](https://web-pi-wheat-64.vercel.app/).
- [TMEM source](https://github.com/siamakenna/tmem-neuron-aligner), [curated review](https://github.com/siamakenna/tmem-neuron-aligner/blob/main/docs/CURATED_REVIEW_20260901.md).
- [Soft Recall itch.io](https://siamakenna.itch.io/soft-recall-demo), [web build](https://siamakenna.github.io/soft-recall-demo/), [source](https://github.com/siamakenna/soft-recall-demo), [release notes](https://github.com/siamakenna/soft-recall-demo/blob/main/docs/release/RELEASE_NOTES_0.3.0.md).
- [Neuromatch workspace](https://github.com/siamakenna/neuromatch_personal), [official credential verification](https://portal.neuromatchacademy.org/certificate/4d4ae313-941c-4609-bd6b-7379af82d16b).
- Existing GitHub profile, portfolio, CommonAxon, GardenByte, LinkedIn and presentation links retained. Complete destination/status list: `qa/links.json`.

## 7. Seven Gems

| Gem | Location / navigation |
| --- | --- |
| Skateboard | Home hero |
| Microscope | About |
| Neural probe | Research experience, below the flagship research |
| Poster | Outputs, after the work cards |
| Moss | Projects, after the smaller software builds |
| Data | Milestones |
| ASL / access | Skills |

All seven original labels and messages are preserved. Fresh load starts at 0 / 7; every gem unlocks once per page session. Enter, Space and repeated pointer activation were tested at 1440px and 390px; both runs reached 7 / 7. Reload intentionally starts a new hunt.

## 8. Section 25 QA

Final machine results are recorded in `qa/results.json`; screenshots supplement, rather than replace, functional checks. Final run: 61 passed, 1 unresolved automated figure-sequence failure. This is not an all-green release certification.

| Requirement | Result / evidence |
| --- | --- |
| Internal navigation | Eight menu routes at 1440, 1080, 768, 390 and 320px; nested links, back/forward and unknown-hash fallback tested. |
| Mobile navigation | Menu open/select/close, Escape, focus return and layout checks at mobile breakpoints. |
| Seven gems and counter | Both desktop and mobile reached 7 / 7; duplicates do not increment. |
| Local still poster | Original JPEG byte-identical to baseline; direct local image and viewer, no embedded remote document. |
| Prohibited integration / terminology | Repository-wide search returned no matches for all four prompt-specified patterns. No prohibited runtime dependency or poster embedding. |
| Images | All 12 main images decode; every image has alt text and intrinsic dimensions. Figure A's full title inspected. |
| GitHub links | All linked profiles, repositories and source-document URLs returned HTTP 200. |
| Soft Recall links | Both published destinations loaded; Begin reached an interactive bedroom in each. Not a complete game playthrough or a byte-for-byte release parity check. |
| Program links | NECB, SACNAS, SfN and Penn State reachable. NIH book content/name/page verified and initially HTTP 200; a repeat automated request returned 403. Intermittent host blocking remains unresolved, not silently treated as a pass. |
| Console | No captured JavaScript or console errors in local regression run. |
| Reduced motion | Emulated setting disables animations and transitions. |
| Keyboard | Skip link, menu, route focus, native disclosures, all gems and image-viewer Escape/focus return exercised. |
| Accessibility | Eight route audits using axe-core; automated results in evidence. Complex hero/logo effects still require human contrast judgment; this is not a formal WCAG certification. |

Visual review covered desktop/mobile hero, navigation, readable headings, research figures and tables, microscopy, certificate, poster and footer/gem state. No main content exceeded the tested viewport widths. Figure viewers intentionally permit internal scrolling to inspect full-resolution images.

UNRESOLVED UI CHECK: In the automated Chromium sequence, opening F05_N025 immediately after closing J05_N015 sometimes does not open its dialog. Direct opening and manual in-app pointer tests of all five research figures passed, but the sequential automated failure remains recorded rather than suppressed. Scroll-lock cleanup was made synchronous; certificate and poster dialog regressions pass. Before merge, repeat the J05 -> Escape -> F05 sequence in an ordinary desktop and mobile browser. The local F05 image itself decodes and is also available directly. One earlier test session stalled at the browser-daemon level; the final report uses the fresh isolated session, not that interrupted run.

## 9. Required Policy Confirmations

The prohibited vendor integration and its URLs are absent. Outreach terminology specified for removal is absent. The local poster has no embedded frame. Exactly seven hidden gems remain. The final user-facing report spells out these confirmations; their literal search terms are not reintroduced into this repository's documentation.

## 10. Section 26 Scientific Review and Unresolved Items

- PASS: Six September mAP values match the public versioned CSV at six decimals; the original SVG and CSV are copied unchanged. 1,079 total / 180 evaluable / 899 nonevaluable is stated as evaluability, not model failure.
- PASS: No claim of language-model morphological understanding, biological superiority of lexical methods, or definitive universal ranking. Current comparator limits remain explicit.
- UNRESOLVED: The source repository still flags verification of the exact saved M0 query artifact. The portfolio preserves that limitation and does not claim the audit is complete.
- UNRESOLVED: Figure A's three secondary-condition results have not been independently reconciled to current versioned outputs. The supplied figure is retained as an explicitly dated August artifact; all 12 table values match that artifact. Its primary paired interval is also recorded in the repository's earlier reconciliation. No secondary result is promoted as independently validated current evidence.
- PASS: TMEM channel separation, nine visits, days 8-39, six wells / three matched pairs, 128-square crops and curated QC align with public documentation. No tracking accuracy, phenotype effect, effect size, p-value or rupture conclusion added.
- PASS: Neuromatch completion, date and hours confirmed on the official certificate page. The 55,000-neuron project scope is author-supplied; no performance metric, brain-area conclusion or invented figure added.
- AUTHOR-ATTESTED: SACNAS/SfN attendance and presentation acceptance, Central US SynBio acceptance/non-attendance, mentoring details and current role scope. These are not mislabeled as independently verified named program entries. NECB A204 and NIH 5-120 do have named public entries.
- OMITTED: Unapproved sdAb quantitative panels, internal TMEM meeting material, unreconciled pitch montage, unsupported scientific metrics and fabricated project imagery. Full selection decisions are in the asset inventory.
- UNRESOLVED: LinkedIn returns HTTP 999 to automated requests; retained the supplied URL without claiming its contents were verified. Legacy shared Google documents return HTTP 200, but permissions may differ for other visitors.
- NOT CLAIMED: Complete end-to-end game QA, identical itch.io/web deployment versions, formal screen-reader certification, every device/browser combination, or completion of the underlying research projects. Portfolio testing used Chromium plus manual in-app browser checks; native iOS/Android and full Firefox testing remain outside verified coverage.

## 11. Preview

Local preview: [http://localhost:4173/](http://localhost:4173/). The server must still be running. This preview is separate from the live GitHub Pages site. Desktop/mobile screenshots are in `qa/screenshots/`.

Without a terminal: open this checkout's `index.html` in a browser. The site is static, with relative local assets and hash routes, and requires no build step. GitHub Pages deployment is unchanged until a reviewed branch is merged into the Pages source branch.

## 12. Recommended Next Step Before Merge

Review the preview, Figure A's historical caveat, the public-use status of supplied assets and conference details. Resolve the M0 artifact/secondary-results provenance before treating those figures as publication-ready final evidence. Recheck NIH and LinkedIn in a normal browser. Then review the branch diff in GitHub; do not merge automatically.

No-terminal workflow: GitHub Desktop > File > Add Local Repository > select the `september-2026-refresh` folder > choose `site/september-2026-refresh` > Fetch origin. Review changes and use Create Pull Request when ready. Keep the PR unmerged until the review items above are accepted or resolved.

## Repeatable Checks

With a local server running: `node qa/verify.mjs`, then `node qa/check-links.mjs`; content-only validation: `python3 qa/check-content.py`. Browser QA uses the pinned agent-browser 0.38.0 CLI from npm. Default scratch evidence goes to `/tmp/kenny-portfolio-qa`; set `QA_OUTPUT` to retain another run separately. No testing package is loaded by the public website.
