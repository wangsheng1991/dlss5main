# Windows character-style handoff — 2026-11-02

Serves R1/R3/R4/R5: carry the game-character style conversion workflow into desktop delivery, keep enhancement scoped as an entry point, and distinguish planned capability from verified releases.

The owner authorized a detailed Windows implementation brief for their Windows-local AI and matching website/GitHub material. Desktop implementation remains with that AI; this change publishes an accurate handoff, not a new installer or new pricing.

- Current public Windows v0.1.1: batch cloud enhancement. Planned: import a character image, select a tested style recipe, confirm credits, generate, compare and save.
- Extracted the existing five Dashboard presets into a shared configuration without changing their prompts or order. The static `/desktop/character-style-v1.json` integration catalog is generated from the same configuration at build time, with API paths, geometry/upload limits, sample contract and explicit planned desktop status. No new serverless function, subscription or external service is introduced.
- The companion repository owns `docs/WINDOWS-CHARACTER-STYLE-20261102.md` and a pinned JSON snapshot. It spells out `mode=edit`, user authentication, ASCII upload-ticket names for Chinese local paths, idempotency/recovery, per-job credits, result saving and native Windows acceptance. The independent local RTX Studio remains a separate workflow.
- Download hero and shared client/prerendered section now clarify current versus planned capabilities and link the browser trial, specification and static catalog. Published Windows/macOS asset URLs are retained.
- New contract checks cover current/planned status, real guest media, five prompt recipes and editor geometry. Run typecheck, full offline tests and build; verify the generated catalog, both locale pages and the existing browser sample after deployment.
- External Penguin acceptance scripts named in AGENTS.md are not present in this workspace; their execution is not claimed.

No guarantee of identity preservation, performance, 4K output, local neural runtime availability or a release date is added.

Validation before deployment: TypeScript typecheck passed; 119/119 offline tests passed; production build and prerender check passed. Generated catalog is byte-for-byte equal to the pinned companion-repository snapshot; both locale prerendered download pages include the status, specification and catalog links. Tracking issue: https://github.com/wangsheng1991/dlss5-enhancer-cli/issues/1 .
