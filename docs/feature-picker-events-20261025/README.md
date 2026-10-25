# Feature picker runtime analytics — 2026-10-25

Serves R1/R3: measure completion of the existing game-feature comparison workflow.
Only application file changed: src/components/FeaturePicker.tsx. No copy, DOM structure, class, ordering, prerender script, analytics bridge or dependencies changed. External CHANGE-LOG updated; protection baseline not captured or changed.
Completion requires change interaction with all three selects, including explicit unknown choices. A post-commit effect reports once per consecutive combination; A→B→A reports again. Goal/GPU retain fixed option values; game unknown maps to unsure. Verdict is the deduplicated rendered support statuses joined with | (supported, unsupported, unknown); no free input. Source event attaches only to NVIDIA DLSS 5 links; reviewed time is not clickable.
Local real handlers pushed events into the existing dataLayer, with no analytics mock. Raw browser-local.txt includes both languages, dedup assertions, and production javaScriptEnabled:false excerpts confirming readable static tables. verify.mjs additionally targets a result-area source link for the final online run.
All six gates passed; 110/110 tests. Gate scripts used existing local-fetch adapter against built output, without capture. No unrelated pre-existing working-tree files included.
