# Specification

## Summary
**Goal:** Build a credit card listing and comparison web app (CardCompare) with a Motoko backend serving card data and a modern frontend for browsing and comparing cards.

**Planned changes:**
- Create a Motoko backend data store with at least 8 pre-populated credit cards (fields: name, issuer, annualFee, APR min/max, rewardsRate, signupBonus, categories, creditScoreRequired, description), with query functions to fetch all cards and filter by category.
- Build a responsive card grid listing page showing each card's name, issuer, annual fee, rewards rate, signup bonus, and a Compare toggle button.
- Add category filter buttons (cashback, travel, balance transfer, rewards) and sorting controls (by annual fee, APR, rewards rate).
- Implement a comparison feature: select up to 3 cards, show a sticky bottom bar when 2+ are selected with a "Compare Now" button, and open a side-by-side comparison table of all card attributes.
- Apply a clean modern theme: white/light-gray background, deep teal and warm gold accents, sans-serif typography, card drop shadows with hover animations, and generous whitespace throughout.

**User-visible outcome:** Users can browse a styled grid of credit cards, filter and sort them, select up to 3 cards, and view a side-by-side comparison table of all card details.
