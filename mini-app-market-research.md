# Mini-App Market Research

**Date:** 2026-10-18
**Budget:** $500 total (one-time + monthly + usage + reserve)
**Prepared for:** Solo founder, can code (Next.js/React), 20+ hrs/week
**Status:** Research only. No niche or brand is selected until explicitly confirmed.

---

## 0. Conclusions first

1. **Your $500 is not the constraint. Your lack of an audience is.** Every cost line in this business fits inside $500 with room to spare (domain ~$12, hosting free, DB free, email free). The thing you cannot buy with $500 is distribution. All planning below is therefore optimised for *cheap organic reach*, not for spend.

2. **Paid ads should be treated as unavailable.** At ~$150–250 of true ad budget you buy a few hundred clicks in the US. That is below the noise floor for validating a consumer product. Any "result" would be uninterpretable. I have excluded ads from every plan.

3. **"Consumers" is the wrong buyer definition as stated.** Casual consumers have low willingness to pay, high refund rates, and expensive acquisition. The three niches below instead target **consumers making a commercial-sized decision with their own money** — a seller protecting their income (Etsy/KDP), a couple committing five figures to one day (wedding), a homeowner committing $30k–$50k to a remodel. Same consumer checkout, same low friction, but a live budget and a reason to act this week.

4. **The obvious wedge in two niches is already occupied by free tools.** I found a free Etsy profit checker and a free contractor-bid comparison tool. "Charge for something already free" is the single most common way this business dies. Both are noted explicitly below.

5. **One-time pricing beats subscriptions here.** All three niches resolve the customer's problem within weeks or months. Recurring billing needs a credible recurring benefit; none of these three has one for most users. Removing that obligation also removes support burden and churn risk from your life.

6. **Recommended first app: the contractor bid normaliser (idea C1).** Highest verified pain intensity, proven paid precedent for the exact job, a beatable incumbent, trivial MVP, no external APIs, no sensitive data, and a price that is trivially justified against the size of the decision. Full reasoning in Section 6.

7. **Weakest of the three niches: Etsy/marketplace sellers.** Best recurring willingness-to-pay, but mature well-funded incumbents, a free tool already covering the obvious wedge, and a constant tax-advice trap that collides with your "no regulated advice" constraint.

---

## 1. Constraints and how I interpreted your answers

| Item | Your answer | Effect on research |
|---|---|---|
| Market | "Recommend one" | I recommend the English-speaking consumer market (Section 2) |
| Buyer | Consumers | Reframed as *consumers with commercial stakes* — flagged for your confirmation |
| Skills | Can code (Next.js/React) | MVP feasibility is high; no-code lock-in not a factor |
| Traffic | Social, short-form, communities, ads | Ads excluded; short-form must be **faceless** |
| Time | 20+ hrs/week | Enough for a real MVP plus consistent posting |
| Budget | $500 total, unchanged | Staged plan in Section 7 |
| Country | Not the US, Stripe available | Stripe OK; merchant-of-record option recommended for tax |
| Avoid | Being on camera | Rules out founder-led video; all video must be screen-record / text-on-screen / voiceover |
| Avoid | Sensitive personal data | Rules out health, fitness-tracking, finance, and resume/CV niches |
| Avoid | Regulated advice (medical/legal/financial) | Rules out tax, legal, medical, permit/code advice |
| Avoid | Gambling / adult / crypto | Rules out those verticals |

**Conflict flagged:** you selected "no hard constraints" *and* five specific constraints. I treated the specific five as binding.

**Note on "no sensitive personal data":** I read this strictly. It is why I did not shortlist job-seeker/resume tools (resumes are personal data), health or nutrition tools (health data is a special category under GDPR-style regimes), or personal-finance tools (financial data plus regulated advice).

---

## 2. Recommended market

**Target the English-speaking consumer market, US-anchored (US, UK, CA, AU), sold in English.**

Reasoning:
- You are not in the US but can take Stripe payments, so geography is not a blocker to selling globally.
- These niches are not language-bound: a contractor bid comparison or a wedding quote comparison works identically in English.
- The US is where the purchasing power and the tool-buying habit are, and where the communities I found are largest and most active.
- I could not research in your local language because you did not name your country. **If your country has a high-purchasing-power local market and you'd rather compete with less competition in your own language, tell me — that materially changes Sections 3 and 6.**

**Tax note for a non-US founder selling to US consumers:** US sales-tax nexus rules and EU/UK VAT are a real administrative burden. Consider a merchant of record (Lemon Squeezy or Paddle, both take roughly 5% + $0.50 and handle global tax) instead of raw Stripe. That costs ~2 percentage points more per sale and removes a category of compliance risk. Stripe remains fine if you handle tax yourself.

---

## 3. Evidence base

Everything below is what I actually retrieved. **Confidence is stated per item.** I have deliberately not converted any of it into invented search volumes, revenue figures, or market sizes.

### Verified facts

| # | Fact | Source | Date |
|---|---|---|---|
| E1 | eRank (Etsy tool) pricing: Free $0, $5.99/mo, $9.99/mo, $29.99/mo | https://erank.com/plans | retrieved 2026-10-18 |
| E2 | Etsy seller: *"I've seen a few posts recently from sellers saying they've made no money on a sale... It can be really complicated to figure out what you're actually making... because etsy fees are complicated."* | https://www.reddit.com/r/EtsySellers/comments/1gts96w/profit_margin_analysis_all_etsy_sellers_should_do/ | 2025-10-18 |
| E3 | Etsy seller tool accuracy complaint: *"Both eRank and Sale Samurai are wildly inaccurate... The estimated sales on eRank is absolutely terrible... They don't have sales data so it's an estimate."* | https://www.reddit.com/r/EtsySellers/comments/16yfean/both_erank_and_sale_samurai_are_wildly_inaccurate/ | 2023-10-03 |
| E4 | Zola (major wedding platform) is **free**, with paid add-ons: seating chart **$14.99**, premium guest texting **$79.99** | https://www.zola.com/expert-advice/best-wedding-planning-apps | 2026-01-16 |
| E5 | A paid, independent wedding budget spreadsheet advertises *"4.9 (412)"* reviews and *"12,000+ Couples planned"* | https://weddingbudgetspreadsheet.net/ | retrieved 2026-10-18 |
| E6 | Couple: *"completely overwhelmed trying to plan my wedding spreadsheets for the budget, WhatsApp groups with family, random tabs open for every vendor. It was a mess and I kept losing track of things."* | https://www.reddit.com/r/weddingplanning/comments/1sa9wwn/ | 2026-04-02 |
| E7 | Homeowner: *"Receiving multiple quotes for a bathroom remodel that range from $28k to $51k for the same scope creates a massive analysis paralysis... inconsistent formatting across bids makes it nearly impossible to tell from just looking at the line items."* | https://www.reddit.com/r/Remodel/comments/1rvm6g0/ | 2026-03-16 |
| E8 | GC In My Pocket (solo-built, homeowner-authored) sells: $80/yr app; one-time templates Bid Comparison **$12**, Budget Planner **$15**, Budget Tracker $12, Kitchen $9, Bathroom $9, Receipt Tracker $9, Draw Schedule $9, Project Schedule $12; bundle of all 8 for **$39**; free room-designer as lead magnet | https://gcinmypocket.com/ | retrieved 2026-10-18 |
| E9 | Free competitor for Etsy profit: Etsy CSV Profit Checker, *"Free, no signup, browser-only processing"* | https://marginreality.com/tools/etsy-csv-profit-checker | retrieved 2026-10-18 |
| E10 | Free competitor for contractor bid comparison: Opsite homeowner estimator comparison, AI-parses 2–4 estimates, verifies contractor licence via California CSLB | https://homeowners.useopsite.com/compare | retrieved 2026-10-18 |
| E11 | AutoFeed.ai (faceless video generation) pricing: *"Plans from $19/mo"* | https://www.autofeed.ai/ | retrieved 2026-10-18 |
| E12 | Established paid KDP tools exist: Book Bolt, Publisher Rocket | https://www.amzkdp.com/en/resources/book-bolt-vs-publisher-rocket-which-one-to-choose-for-kpd-2025 | 2025-12-16 |
| E13 | Established Etsy SEO tools exist and compete on data quality: eRank, Marmalead, Alura | https://stablecommerce.ai/blog/erank-vs-marmalead-vs-alura | 2026-03-14 |

### Interpretations supported by evidence

- **I1.** Willingness to pay exists in all three niches (E1, E4, E5, E8). These are not speculative markets.
- **I2.** Etsy sellers distrust *estimated* competitor data (E3) — an opening for tools built on the seller's **own** first-party numbers rather than estimates.
- **I3.** In both the remodel and wedding cases, money is committed in large blocks ($28k–$51k in E7; five-figure weddings implied by E4/E5), while the organising happens in spreadsheets and chat apps (E6, E7). The gap is *decision support*, not data collection.
- **I4.** A solo non-developer can build and sell in the remodel space at $9–$80 price points (E8). This is a direct precedent for your situation, and evidence the incumbent is not a large, well-defended company.
- **I5.** Free tools exist for the most obvious wedge in two niches (E9, E10), so differentiation cannot rest on "we compute the fee maths for you."

### Assumptions that still need testing (not proven by my research)

- **A1.** That enough homeowners actually *seek a tool* at the moment of comparing bids, rather than picking a contractor on trust or price.
- **A2.** That couples will pay for vendor-quote comparison specifically, rather than defaulting to the venue's preferred list.
- **A3.** That Etsy sellers will pay again for a second tool in a category where free alternatives exist.
- **A4.** That faceless short-form video can reach these buyers at meaningful volume without paid amplification.
- **A5.** Price points. Every price quoted in this document belongs to a *competitor*. None of them prove what *your* product can charge.

### Evidence limitations, stated plainly

- The two Reddit threads with the sharpest pain quotes have **low engagement** (E3: 1 point / 14 comments; E7: 3 points / 7 comments). A handful of upvotes is **not** proof of willingness to pay. I am citing them as evidence that the *problem is real and describable*, not as market validation.
- Exa's free tier rate-limited several queries, so coverage of the creator/faceless-video and pet niches is thin. I chose not to shortlist niches I could not evidence.
- I found no reliable, citable search-volume data. I have not estimated any.
- Prices for E5 could not be retrieved (the site did not render). E5's existence and social proof are verified; its price is not.

---

## 4. Niche A — Marketplace micro-sellers (Etsy / Amazon KDP / print-on-demand)

**Why this niche:** individual sellers, personal checkout, but the money is their livelihood. Large, active, tool-buying communities. Faceless video works (screen recordings of spreadsheets and dashboards).

**Core verified pain:** sellers cannot reliably tell what they actually earn (E2), and they distrust the estimated data the paid tools give them (E3).

### A1 — Real Margin & COGS Tracker

1. **Target customer:** Etsy/KDP/POD seller with 20–500 listings. The seller pays, personally, from their own card.
2. **Core problem:** Tools compute *Etsy's* fees but ignore the seller's own cost of goods, packing, and labour. Sellers therefore underprice and discover losses months later (E2).
3. **Purchase trigger:** The moment a seller calculates a sale and finds "no money left", or Etsy changes its fee structure.
4. **Current workaround:** A hand-built Google Sheet, rebuilt per listing (E2 describes exactly this).
5. **Evidence of demand:** **Verified** that the pain is describable and public (E2). **Verified** that sellers pay for tools in this category (E1: eRank $5.99–$29.99/mo). **Not verified** that they'll pay for a second tool.
6. **App concept:** Seller imports their Etsy orders CSV and enters unit costs per listing; app returns true contribution margin per listing, ranks listings by profit, and flags loss-makers.
7. **MVP scope:** CSV import, a COGS field per listing, one margin table, one "loss-makers" list.
8. **Excluded features:** Multi-channel consolidation, forecasting, tax reports, team accounts, inventory sync.
9. **Differentiation:** First-party actuals over estimates (I2), and COGS awareness — the exact gap left by the free fee-only checker (E9). Must be *sharper* than the free tool, or it has no reason to exist.
10. **Pricing hypothesis:** $19–$29 one-time, or $9/mo. Grounded in eRank's $5.99–$29.99 tiers (E1).
11. **Acquisition:** r/EtsySellers and r/Etsy (value-first posts only), Etsy-seller YouTube and TikTok creators, a free "loss-leader finder" as the lead magnet.
12. **Feasibility:** Low. CSV parsing plus arithmetic. No external APIs. No recurring cost.
13. **Repeat use:** Genuine — sellers re-check margins monthly. This is the one idea here that could support a subscription honestly.
14. **Main failure risk:** The free checker (E9) adds COGS and destroys the wedge. Also commoditised by spreadsheets.
15. **Validation test:** Post a free "Etsy fee calculator with your own COGS" in one thread. Measure: do sellers ask to save/share results? That behaviour, not praise, indicates a product.

### A2 — Fee-Aware Pricing & Discount Simulator

1. **Target customer:** Same seller, at the moment of setting or changing a price.
2. **Core problem:** Etsy's fee stack (transaction fee, listing fee, payment processing, and Offsite Ads at 12–15%) makes "should I discount 15%?" genuinely unanswerable by intuition.
3. **Purchase trigger:** Planning a sale, a price rise, or a free-shipping switch.
4. **Current workaround:** Guesswork and conservative underpricing.
5. **Evidence of demand:** **Interpretation** built on E2 and E1. Not directly verified for this specific job.
6. **App concept:** Enter price, cost, shipping, and whether Offsite Ads apply; get net profit, break-even volume, and effective hourly rate. Side-by-side "current vs proposed".
7. **MVP scope:** One calculator, presets for the four Etsy fee components, before/after comparison.
8. **Excluded features:** Competitor price scraping, bulk editing, auto-sync.
9. **Differentiation:** Models *Offsite Ads*, which most free calculators ignore. Thin moat.
10. **Pricing hypothesis:** $9–$19 one-time. Low ceiling, because a calculator is easy to give away free.
11. **Acquisition:** Short-form screen recordings ("this 15% discount cost me money").
12. **Feasibility:** Very low. Days, not weeks.
13. **Repeat use:** Occasional. Suits one-time pricing.
14. **Main failure risk:** Free calculators already do 80% of this. High commoditisation risk.
15. **Validation test:** Ship the free calculator, gate only the Offsite Ads scenario, measure upgrade clicks.

### A3 — Restock & Cash Planner

1. **Target customer:** Physical-goods seller holding inventory.
2. **Core problem:** Cash is trapped in slow stock and reorder is reactive.
3. **Purchase trigger:** A stockout on a best-seller, or a cash crunch.
4. **Current workaround:** Gut feeling, or an inventory spreadsheet.
5. **Evidence of demand:** **Assumption.** I found no specific evidence for this job. Weakest idea in this niche.
6. **App concept:** Enter sales rate and lead time; get reorder points and cash tied up per SKU.
7. **MVP scope:** Manual entry only; one reorder table.
8. **Excluded features:** Integrations, purchase orders, supplier management.
9. **Differentiation:** Weak. Spreadsheets and free inventory templates cover this.
10. **Pricing hypothesis:** $12–$19 one-time.
11. **Acquisition:** Same channels as A1.
12. **Feasibility:** Low.
13. **Repeat use:** Moderate.
14. **Main failure risk:** Nobody cares enough to change behaviour.
15. **Validation test:** Ask sellers what they currently do. If the answer is "I just eyeball it", the problem is not painful enough to sell against.

---

## 5. Niche B — Wedding planning (engaged couples)

**Why this niche:** the highest-stakes single-day purchase most consumers will ever make, done once, with no professional help for most couples. Pain is acute and documented (E6). Audiences are heavily concentrated in short-form video, which matches your strongest free channel. No sensitive personal data, no regulated advice.

**Pricing anchor:** Zola charges $14.99 for a seating chart and $79.99 for premium guest texting *on top of a free product* (E4) — proof couples pay for narrow, specific jobs.

### B1 — Vendor Quote Normaliser

1. **Target customer:** The partner doing the admin, 2–8 months before the wedding (E6 is written by exactly this person).
2. **Core problem:** Photographers, caterers, and venues quote in incomparable formats with different inclusions, so "which is better value" is unanswerable.
3. **Purchase trigger:** Receiving 2–4 quotes in the same week for the same category.
4. **Current workaround:** Losing track across tabs and WhatsApp (E6, verbatim).
5. **Evidence of demand:** **Verified pain** in the structurally identical remodel case (E7). For wedding vendors specifically this is an **interpretation** — I did not find a direct couple complaint about quote comparison. Flagged as assumption A2.
6. **App concept:** Enter each quote's price and inclusions; get a normalised per-head and per-item comparison plus a "what's missing" checklist.
7. **MVP scope:** Manual entry for 2–4 quotes, per-head normalisation, inclusion checkboxes, printable comparison.
8. **Excluded features:** Document AI parsing, vendor marketplace, messaging.
9. **Differentiation:** Normalises to a common scope. Neither Zola nor The Knot does this, and they are incentivised not to (they monetise vendor referrals).
10. **Pricing hypothesis:** $19–$29 one-time. Justified against typical five-figure budgets, and consistent with Zola charging $14.99 for a single utility (E4).
11. **Acquisition:** r/weddingplanning (strict: value-first only), TikTok/Reels "how to compare wedding quotes", Pinterest.
12. **Feasibility:** Low. Logic plus forms. No APIs, no sensitive data.
13. **Repeat use:** One-time by nature. Correctly priced as such.
14. **Main failure risk:** Couples default to the venue's preferred vendor list and never shop around.
15. **Validation test:** A single free "wedding quote comparison checklist" PDF gated by email; count downloads, then offer the tool.

### B2 — Guest List & Multi-Channel RSVP Consolidator

1. **Target customer:** The couple managing RSVPs from several directions at once.
2. **Core problem:** RSVPs arrive by WhatsApp, text, paper, and app, and never reconcile into one list (E6).
3. **Purchase trigger:** Sending invitations.
4. **Current workaround:** A spreadsheet plus a family WhatsApp group (E6).
5. **Evidence of demand:** **Verified** pain (E6). **Verified** that couples pay for guest tooling (E4: $79.99 guest texting).
6. **App concept:** One guest list; paste or forward replies; app reconciles to a running confirmed/declined/awaiting count with meal choices.
7. **MVP scope:** Guest list, RSVP status, meal selection, plus-ones, one export.
8. **Excluded features:** Invitation design, website builder, gift registry, texting.
9. **Differentiation:** Consolidation rather than another silo. Directly attacks the "10 different apps" complaint (E6).
10. **Pricing hypothesis:** $15–$25 one-time. Anchored below Zola's $79.99 (E4) and above a $0 spreadsheet.
11. **Acquisition:** r/weddingplanning, TikTok RSVP-organisation content, Pinterest.
12. **Feasibility:** Low. CRUD plus imports.
13. **Repeat use:** One-time.
14. **Main failure risk:** Zola and The Knot are free and adequate for most couples; you'd win only on the messy multi-channel case.
15. **Validation test:** Landing page targeting "RSVP tracker for WhatsApp + paper + app"; measure email capture rate before building.

### B3 — Plan-vs-Actual Budget & Vendor Payment Schedule

1. **Target customer:** Couple tracking deposits and balances over 12+ months.
2. **Core problem:** Budgets are set once and never reconciled against actual payments and due dates.
3. **Purchase trigger:** A deposit due, or a first overspend.
4. **Current workaround:** A downloaded spreadsheet (E5 shows this is a paid market), or a free template.
5. **Evidence of demand:** **Verified** — independent paid spreadsheets sell with 412 reviews claimed (E5). This is the best-evidenced *paid* product I found in this niche.
6. **App concept:** Categories, planned vs actual, vendor payment schedule with due dates, overrun warnings.
7. **MVP scope:** Budget table, payments, due-date reminders, over/under total.
8. **Excluded features:** Bank sync, multi-user, vendor marketplace.
9. **Differentiation:** Web-based and mobile-first, versus the download-a-spreadsheet incumbent (E5). Modest — this is the most crowded idea in the niche.
10. **Pricing hypothesis:** $15–$29 one-time. E5's tier structure suggests a premium tier is viable.
11. **Acquisition:** Same as B1/B2.
12. **Feasibility:** Low.
13. **Repeat use:** Moderate over the planning period, then ends.
14. **Main failure risk:** You are competing with a $0 Google Sheets template and a free Zola budget tool.
15. **Validation test:** Run a paid pre-order at $12 against a stated delivery date and count real purchases, not signups.

---

## 6. Niche C — Owner-builder home remodels

**Why this niche:** the largest single money decision in the research ($28k–$51k, E7), a documented, quantified, emotionally loaded pain, and a *beatable* incumbent — a solo non-developer selling $9–$15 templates and an $80/yr app (E8).

### C1 — Contractor Bid Normaliser & Scope Comparator  ← **RECOMMENDED FIRST APP**

1. **Target customer:** Homeowner managing their own kitchen/bathroom/whole-home remodel, collecting 2–5 contractor bids. Payer is the homeowner personally.
2. **Core problem:** Bids arrive in inconsistent formats. Comparing a $28k bid to a $51k bid by eyeballing line items is impossible, because scope differs invisibly (E7, verbatim).
3. **Purchase trigger:** The week 2–4 bids land on the table and the homeowner realises they can't tell them apart (E7 is precisely this moment).
4. **Current workaround:** Printing bids side by side and guessing; or choosing on trust. E7 states most homeowners "end up just" doing something unrigorous — the alternative is analysis paralysis.
5. **Evidence of demand:** **Verified and quantified** (E7: $28k–$51k, "massive analysis paralysis", "inconsistent formatting"). **Verified paid precedent for this exact job**: GC In My Pocket sells a Bid Comparison template at $12 and an $80/yr app that leads with "Compare contractor bids on the same scope" (E8). **Verified that a free competitor exists** (E10).
6. **App concept:** Enter each bid's total and tick what it includes/excludes (permits, demolition, disposal, rough-in, tile, fixtures, paint, contingency). The app computes normalised comparable totals and shows the gap between headline price and true comparable price, plus questions to ask each contractor.
7. **MVP scope:** 2–5 bids, a fixed inclusion checklist, per-bid normalised total, a side-by-side table, a printable summary. No accounts required to see a result.
8. **Excluded features:** AI PDF parsing, contractor licence verification, messaging, payments, scheduling, mobile app, accounts/teams.
9. **Differentiation:** Incumbents compare *prices*; this compares *scope*. It answers "is the cheaper bid cheaper because it omits the thing I'll have to pay for later?" — the actual question (E7). It is browser-based and instant, unlike the $12 Excel template (E8). And it gives away the result before asking for money.
10. **Pricing hypothesis:** $19–$29 one-time for full unlock, anchored by E8's $12 template (weaker product) and $80/yr app (heavier product). Justified trivially against a $30k decision. Bundle with C2/C3 later at $39–$49.
11. **Acquisition:** r/Remodel, r/HomeImprovement, r/DIY (value-first: post the *method*, not the product); short-form screen recordings ("why the cheaper bid is $12k more expensive"); renovation YouTube creators; the free comparison as a shareable artefact.
12. **Feasibility:** Very low. Forms, a checklist, arithmetic, one print view. No external APIs, no AI, no recurring cost, no sensitive data. Fits Next.js and your 20 hrs/week comfortably.
13. **Repeat use:** One-time. Correctly priced as one-time, and honest about it.
14. **Main failure risk:** The free incumbent (E10) is adequate and costs nothing. Mitigation: it is California-licence focused and lead-gen driven; compete on scope normalisation, instant use, and no file upload. Second risk: **the buying window is narrow** (available only while bids are live) and the purchase is once-per-decade, so it must be cheaply acquired.
15. **Validation test:** Publish a free interactive bid comparison (headline totals + inclusion checklist) and measure **completion of a comparison**, then offer a $19 unlocked summary. Completing a comparison on real bids is behavioural evidence; praise is not. Target: 20+ completed comparisons from organic posts before writing more code.

### C2 — Plan-vs-Actual Budget Tracker with Change Orders

1. **Target customer:** Homeowner mid-project.
2. **Core problem:** Change orders quietly consume contingency; nobody tracks plan against actual.
3. **Purchase trigger:** The first change order.
4. **Current workaround:** Spreadsheet template (sold as a paid product at $12–$15, E8).
5. **Evidence of demand:** **Verified paid market** (E8 sells Budget Planner $15, Budget Tracker $12).
6. **App concept:** Budget lines, actual spend, change-order log, contingency remaining.
7. **MVP scope:** Budget lines, expenses, change orders, remaining contingency.
8. **Excluded features:** Receipt OCR, bank sync, contractor portal.
9. **Differentiation:** Web-based and mobile. Crowded by E8's templates.
10. **Pricing hypothesis:** $15–$19 one-time.
11. **Acquisition:** Same as C1; natural upsell from C1.
12. **Feasibility:** Low.
13. **Repeat use:** Regular during the project — the best retention in this niche.
14. **Main failure risk:** Competition from free Google Sheets templates and E8.
15. **Validation test:** Offer to C1 buyers first; measure attach rate.

### C3 — Draw Schedule & Payment-to-Progress Tracker

1. **Target customer:** Homeowner paying a contractor in stages.
2. **Core problem:** Paying ahead of completed work. E8 calls this "the #1 way homeowners get burned" (our own words aside, E8 sells this as a template at $9).
3. **Purchase trigger:** The first payment request.
4. **Current workaround:** Verbal agreements and handshake milestones.
5. **Evidence of demand:** **Verified** that a paid template exists for exactly this job (E8, $9).
6. **App concept:** Define milestones, tie payments to them, track paid vs earned, flag overpayment risk.
7. **MVP scope:** Milestone list, payment log, paid-vs-complete indicator.
8. **Excluded features:** Escrow, contracts, legal language, dispute support.
9. **Differentiation:** Simple and visual. **Careful:** must not stray into legal or contract advice (your constraint).
10. **Pricing hypothesis:** $9–$15 one-time.
11. **Acquisition:** Same as C1.
12. **Feasibility:** Very low.
13. **Repeat use:** Regular during the build.
14. **Main failure risk:** Bothered by "is this legal advice?" perception; keep it a tracker, never an adviser.
15. **Validation test:** Bundle into C1's upsell and measure.

---

## 7. Competitor study — shortlisted ideas

### C1 — Contractor Bid Normaliser

| | GC In My Pocket (Bid Comparison) | Opsite Homeowner Compare | comparecontractorquotes.com |
|---|---|---|---|
| Audience / positioning | Homeowner doing own remodel; practical, honest, solo-built | Homeowners; free lead-gen for a contractor platform | Homeowners |
| Main features | 5 bids side by side in Excel, catch what's missing | Upload 2–4 estimates, AI parses, verifies CA contractor licence | Quote comparison |
| Pricing | **$12 one-time** (bundle of 8 = $39); app **$80/yr** | **Free** | Not retrieved |
| Strengths | Proven, honest, cheap, real social proof via app | Free; automated; licence check adds trust | Focused on the job |
| Complaints / limits | Excel-based; manual; heavy app upsell | California-only licence check; requires PDF upload; AI parsing may misread | Unverified |
| Our opportunity | Browser-based, instant, scope-first, mobile-friendly, no Excel | Compete outside California; skip upload; make scope normalisation the core | — |

**Read:** The paid incumbent proves the price point; the free incumbent proves the job matters. Neither clearly owns *scope* comparison, which is the exact failure E7 describes.

### B1 — Wedding Vendor Quote Normaliser

| | Zola (free planning suite) | The Knot / free spreadsheet templates | Vow & Ledger (paid spreadsheet) |
|---|---|---|---|
| Positioning | All-in-one free app, monetised via vendors and add-ons | Same, at scale | Independent romantic budget spreadsheet |
| Features | Budget, guest list, website, seating ($14.99), texting ($79.99) | Broad planning, vendor marketplace | 40+ budget categories, vendor tracker |
| Pricing | **Free** + paid add-ons (E4) | **Free** | Paid, price not retrieved (E5) |
| Strengths | Enormous distribution; free; adequate | Enormous distribution | Independent, well-reviewed (412) |
| Complaints / limits | Vendor-referral incentives; features in silos | Same | Spreadsheet only |
| Our opportunity | Quote *comparison* is not served by either, and they are incentivised against it | — | Web-based, mobile-first |

**Read:** Free incumbents are strong on budget and guest list. The unserved job is **comparing vendor quotes**, which is structurally the same problem as C1.

### A1 — Real Margin & COGS Tracker

| | eRank | MarginReality (free CSV checker) | Google Sheets |
|---|---|---|---|
| Positioning | Full Etsy SEO suite | Free instant profit check | DIY |
| Features | Keywords, competitors, audits, AI helper | Subtracts fees from a CSV, scores shop, browser-only | Anything |
| Pricing | **Free / $5.99 / $9.99 / $29.99** (E1) | **Free, no signup** (E9) | Free |
| Strengths | Data, brand, breadth, established | Free, instant, private | Flexible |
| Complaints / limits | Estimated data distrusted (E3); SEO-centric, not profit-centric | Fees only; no COGS; one-shot | Manual, error-prone |
| Our opportunity | COGS + per-listing history + multi-channel | Must beat free on a feature free doesn't have | — |

**Read:** The free checker already does the obvious thing. Any Etsy entry must be built on something the free tool structurally cannot do — the seller's *own cost data over time*.

---

## 8. Weighted ranking

**Weights and why.** Your binding constraints are cheap acquisition and a small budget, so reachability and differentiation are weighted above raw market size. Evidence of demand leads because unproven demand is how this fails fastest.

| Criterion | Weight | Rationale |
|---|---|---|
| Evidence of demand | 20% | Unproven demand kills fastest |
| Willingness to pay | 15% | Verified paid competitors matter most |
| Customer reachability | 15% | Your real bottleneck; no audience |
| Differentiation | 15% | Avoids competing with free |
| MVP feasibility | 10% | You code; effort is cheap |
| Operating economics | 10% | Must run without recurring cost |
| Support & maintenance | 5% | Solo, part-time risk |
| Fit with skills/time/budget | 10% | 20 hrs/week, $500 |

Scores are 1–5. **Evidence confidence is reported separately and is not part of the score.**

| Idea | Demand 20 | WTP 15 | Reach 15 | Diff 15 | MVP 10 | Econ 10 | Support 5 | Fit 10 | **Weighted** | Evidence confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| **C1 Bid normaliser** | 5 | 5 | 3 | 4 | 5 | 5 | 4 | 5 | **4.50** | High (E7, E8, E10) |
| **B1 Vendor quote normaliser** | 3 | 4 | 5 | 4 | 5 | 5 | 4 | 5 | **4.20** | Medium (E4, E6; A2 unproven) |
| **B3 Budget plan-vs-actual** | 4 | 4 | 5 | 2 | 5 | 5 | 3 | 5 | **4.10** | High for paid market (E5) |
| **B2 RSVP consolidator** | 4 | 3 | 5 | 3 | 5 | 5 | 3 | 5 | **4.05** | Medium (E4, E6) |
| **A1 COGS margin tracker** | 4 | 4 | 4 | 3 | 4 | 5 | 3 | 4 | **3.90** | Medium (E1, E2, E3, E9) |
| **C2 Budget tracker** | 4 | 4 | 3 | 2 | 5 | 5 | 4 | 5 | **3.90** | High paid market (E8) |
| **A2 Pricing simulator** | 3 | 3 | 4 | 2 | 5 | 5 | 4 | 5 | **3.55** | Low–Medium |
| **C3 Draw schedule** | 3 | 3 | 3 | 2 | 5 | 5 | 4 | 5 | **3.45** | Medium (E8) |
| **A3 Restock planner** | 2 | 2 | 4 | 2 | 4 | 5 | 4 | 4 | **3.05** | Low (assumption only) |

**How to read this.** These are decision aids under explicitly chosen weights, **not probabilities of success**. Swapping the weights changes the order — if you weight reachability at 30%, B1 and B2 overtake C1.

---

## 9. Recommendation

**Strongest niche:** Owner-builder home remodels (C).

**Launch first:** **C1 — Contractor Bid Normaliser & Scope Comparator.**

Why it wins:
- The pain is **verified, quantified, and quoted** at the exact moment of purchase (E7).
- **Proven paid precedent for this exact job** at $12, plus an $80/yr app built by a solo non-developer (E8) — so the market is real and the incumbent is beatable.
- The MVP is forms plus arithmetic. No APIs, no AI, no recurring cost, no sensitive data, no regulated advice. It fits $500 and 20 hrs/week with room to spare.
- The price is trivially defensible against a $28k–$51k decision, so the value conversation is short.
- The output is inherently shareable ("here's what your bids actually compare to"), which is your cheapest distribution.

**Backup option:** **B1 — Wedding Vendor Quote Normaliser.** Same product pattern, better channel fit (short-form video audiences for weddings are enormous), but its demand evidence is inferred from the remodel case rather than verified for weddings. If you want to lean hard on short-form video and you're comfortable testing an inferred pain, take B1 instead.

**The assumptions that could change this recommendation:**

| If this turns out false | Then |
|---|---|
| A1 — homeowners won't seek a tool while comparing bids | Switch to B1/B2 |
| A4 — faceless video can't reach homeowners at volume | Switch to B1/B2 (short-form-native audiences) |
| E10 — the free Opsite tool is actually good and widely used | Differentiation collapses; drop C1 |
| Your country's local market is high-purchasing-power with weak local competition | Re-run Section 3 in your language; the calculus may improve materially |
| You want recurring revenue | Re-open A1, accepting a subscription support burden |

**What I do not recommend:** building all three apps in the chosen niche. Build C1, sell it, and only then decide whether C2 or C3 has an upsell market.

---

## 10. Validation plan within $500

Your budget is not the constraint. **Distribution is.** Every stage therefore buys evidence, not reach.

### Cost model (checked against current free tiers)

| Category | One-time | Monthly | Notes |
|---|---|---|---|
| Domain | ~$12/yr | — | Namecheap/Cloudflare |
| Hosting | $0 | $0 | Vercel/Netlify free tier is adequate at this scale |
| Database | $0 | $0 | Supabase/Neon free tier |
| Auth | $0 | $0 | Supabase Auth free tier; avoid until needed |
| Email | $0 | $0 | Resend/MailerLite free tiers |
| Analytics | $0 | $0 | Vercel Analytics free / Umami self-hosted |
| Payments | — | ~2.9% + $0.30/sale (Stripe) | Or ~5% + $0.50 with a merchant of record that handles global tax |
| Ads | **$0** | **$0** | Excluded — cannot validate at this budget |
| Reserve | **$100** | — | Untouched unless something breaks |
| **Committed so far** | **~$12–15** | **~$0** | |

**Key finding: stages 1–3 together should cost under $40.** You should reach a real willingness-to-pay signal with over 90% of your capital still unspent. If a plan requires spending most of the $500 before revenue, treat that as a warning sign.

### Stage 1 — Validate the problem

- **Action:** Join r/Remodel, r/HomeImprovement, r/DIY. Answer 15–20 bid-comparison questions with genuine help. Never link. Record the words people use.
- **Max spend:** $0.
- **Evidence to collect:** verbatim language, how often the question recurs, and whether people describe *paralysis* (problem) or merely *curiosity* (no product).
- **Continue if:** you can quote 5+ distinct people describing bid comparison as hard or stressful.
- **Revise if:** they ask mainly about *finding* contractors (a different, harder business) rather than *comparing* them.
- **Stop if:** the question never appears unprompted.

### Stage 2 — Demonstrate the solution

- **Action:** Build the free comparison as a single working page. Real bids, real checklist, real normalised totals. Email capture **after** the result is shown.
- **Max spend:** ~$15 (domain).
- **Evidence to collect:** comparisons completed, email captures, and the completion rate.
- **Continue if:** 20+ comparisons completed from organic posts.
- **Revise if:** people visit but don't finish (the checklist is too long or too technical).
- **Stop if:** near-zero completions after genuine community participation.

### Stage 3 — Test willingness to pay

- **Action:** Offer the unlocked printable summary at **$19**. Be explicit that the full product is in development, state the delivery date, and offer a no-questions refund.
- **Max spend:** ~$25 (domain, payment fees).
- **Evidence to collect:** **actual payments.** Not upvotes, not waitlist signups, not "I'd buy this."
- **Continue if:** 10+ paid pre-orders from organic reach. That is real signal.
- **Revise if:** 1–9 sales — real interest, wrong price or positioning. Test $29 and $12.
- **Stop if:** 0 sales after 100+ completed free comparisons. Do not build the paid product.

### Stage 4 — Build the smallest useful version

- **Action:** Only on Stage 3 success. Add saving a comparison, the printable summary, and accounts if genuinely needed.
- **Max spend:** up to $150 cumulative.
- **Evidence to collect:** activation (a completed comparison), delivery as promised, refund rate.
- **Continue if:** refunds below ~10% and users report using it with a real contractor.
- **Stop if:** refunds spike or users can't find the value without hand-holding.

### Stage 5 — Observe and decide

- **Action:** Work the channels that produced sales. Ask five buyers what they'd have paid.
- **Max spend:** remainder, reserve intact.
- **Continue if:** sales continue without paid reach.
- **Expand if:** buyers ask for C2/C3 unprompted — that is your bundle signal.
- **Stop if:** sales stop the moment you stop posting.

### Unit economics — conservative, with explicit assumptions

Assumptions: price $19 one-time; one-time costs excluded; no refunds modelled in the base case; no paid acquisition.

| Scenario | Price | Fee | Contribution/sale | Sales to recover $500 |
|---|---|---|---|---|
| Stripe | $19.00 | ~$0.85 (2.9% + $0.30) | **~$18.15** | ~28 |
| Merchant of record | $19.00 | ~$1.45 (5% + $0.50) | **~$17.55** | ~29 |
| Refund rate 10% | $19.00 | — | **~$16.30** | ~31 |

- **Acquisition break-even:** with organic-only acquisition, **the first sale is already profitable.**
- **If you ever add paid ads:** at a $1.50 CPC and a 2% conversion rate, a sale costs ~$75 to acquire against ~$18 of contribution. That is why ads are excluded: you would lose roughly $57 per sale.
- **No lifetime value is claimed.** These are one-time purchases with no assumed retention.

---

## 11. Pricing recommendation

**Recommended: one-time purchase, $19, with a $29 "pro" tier** (multiple comparisons + printable pack) and, later, a $39–$49 bundle with C2/C3.

Reasoning:
- Recurring billing needs a credible recurring benefit. Comparing contractor bids happens once per project; a subscription would be dishonest and would generate cancellation support for no reason.
- $19 sits correctly between the $12 spreadsheet incumbent (weaker product, E8) and the $80/yr app (heavier product, E8), and is negligible against a $30k decision.
- One-time pricing removes API and support obligations: there is no per-use cost, so no "unlimited lifetime" promise can ever be broken.
- The free tier is the whole top of funnel. Give the result away; charge for the saved, printable, multi-bid artefact.

**Do not** use countdown timers or fake discounts. The one ethically clean discount is a genuine pre-order price during Stage 3, clearly labelled as such.

---

## 12. What I could not verify, and what I need from you

**Not verified:** wedding-specific quote-comparison pain (assumption A2); any search volumes; E5's price; the quality and real usage of the free competitors (E9, E10); whether faceless video reaches these buyers (A4).

**I need your decision before I write the launch blueprint:**

1. **The niche and the first app.** My recommendation is C1. My alternative is B1 if you want to lean on short-form video.
2. **Confirmation of the consumer reframing.** Everything here assumes buyers making a commercial-sized personal decision. If you insist on casual consumers, I'll re-run the research, but I expect to report that the economics don't work.
3. **Your country**, if you want me to check local-language competition — this is the single largest unexamined opportunity in this document.

No niche or brand is selected until you confirm it.
