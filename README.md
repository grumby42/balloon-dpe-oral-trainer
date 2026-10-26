# Balloon DPE Oral Trainer

An offline, single-file oral-exam simulator for the **FAA Commercial Pilot – Lighter-Than-Air, Balloon (airborne heater)** practical test, built to **FAA-S-8081-18A** (Commercial Pilot PTS, Lighter-Than-Air, Nov 2023).

The commercial balloon certificate also carries balloon-only instructional privileges (14 CFR 61.133(a)(2)(ii)) — there is no separate CFI certificate — so the bank covers Fundamentals of Instructing and Technical Subjects alongside the flight Areas.

**Open `index.html` in any browser.** No install, no network, no tracking. Works on a phone.

## Three examiners

| Level | Examiner | How it grades |
|---|---|---|
| 1 | "DPE is basically giving it away" | ~1 question per Area. Semi-correct answers pass. Wrong answers get a hint and a retry. |
| 2 | "The DPE is understanding and works with you" | Every Area. Semi answers get a probing follow-up; one retry on a wrong answer. |
| 3 | "Strictest DPE ever + FAA inspector observing" | Every Task plus scenarios, 90-second clock (self-test). One probe on a semi; a wrong answer on a safety-critical item ends the test. |

Outcomes follow the PTS: any unsatisfactory Task fails its Area and the test, with a simulated Notice of Disapproval listing failed and untested Areas (or a temporary certificate showing the airborne-heater limitation under 61.133(b)(2)).

## Two modes

- **Candidate self-test** — answers shuffled and unlabeled; full explanations after each item.
- **Examiner console** — for an instructor running a mock oral: read the question aloud, see BOOK / SEMI / WRONG answers with explanations, tap what the candidate actually said, add notes, export a debrief.

## The question bank

- **220 questions**, every LBH Task in all 11 Areas covered by at least two (VIII-F High Altitude is gas-balloon only and is excluded).
- Every question has **one book answer**, **one or more semi-correct answers** (vague but accurate — the kind a candidate can reason their way to), and **one to three wrong answers**. Every answer carries an explanation of why it is right or wrong.
- 80 safety-critical items, 34 scenario/correlation items.
- Packs: core PTS coverage · expansion · numbers & aircraft limits (fog, cloud clearance, speeds, lag math, "state your balloon's limitations") · emergencies (aircraft, pilot, passenger medical/mental, ground crew) · fitness to fly & ADM (IMSAFE, 61.53, medications, PAVE, hazardous attitudes, DECIDE/3P/CARE/TEAM/5P, SRM/CRM).

### No length tells

Multiple-choice banks often give away the correct answer by making it the longest option. Here, candidates see **length-matched display versions** of every answer; the full model answer appears after they choose. The build **fails** if any question's book answer is ≥10% longer or shorter than all of its alternatives, or if any guess-by-length strategy beats 30% across the bank. Current hit rates: 24–25% for every strategy against 25% chance.

### Accuracy review

The full bank was reviewed from an examiner's and an FAA inspector's perspective against primary sources — eCFR, AIM, FAA-S-8081-18A, the Aviation Instructor's Handbook (FAA-H-8083-9B), the Balloon Flying Handbook (FAA-H-8083-11B), PHAK, NTSB/AAIB reports — and **168 corrections** were applied. See [`CORRECTIONS.md`](CORRECTIONS.md).

## Building from source

```bash
node tools/build.js          # merge packs, apply errata, run gates, write index.html
node tools/length-check.js   # report guess-by-length hit rates
npm i -D playwright && npx playwright install chromium
node tools/smoke.js          # headless test of every level and mode
```

```
src/app.html                  app shell (UI + DPE engine)
src/bank/01-core.js           PTS structure + core questions
src/bank/02-expansion.js      expansion pack
src/bank/03-limits-emergencies.js
src/bank/04-fitness-adm.js
src/bank/display-*.js         length-matched display text
src/errata.js                 accuracy-review corrections (applied at build)
tools/                        build, length check, smoke test
index.html                    built app (GitHub Pages serves this)
```

Builds are stamped `BALN-YYYYMMDD-HHMMZ` (UTC).

## Important

This is a **training aid**. It is not affiliated with or endorsed by the FAA, and it does not replace the current PTS/ACS, the regulations, the FAA handbooks, an authorized instructor, or **your balloon's flight manual — which governs every aircraft-specific limit and procedure**. Regulations and guidance change; verify against current sources before any practical test.

## License

MIT — see [LICENSE](LICENSE).
