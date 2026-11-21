# Download release facts — 2026-11-21

Serves CORE-POSITIONING R1/R3: make the actual software handover and its limits inspectable; do not substitute enhancement for the character-style/Studio core.

## Before / after

Before: the existing download page linked Windows x64 v0.1.1 and macOS Intel v0.1.0, stated unsigned-preview/cloud-client boundaries, and printed the macOS byte size. It did not provide a consolidated release record or installer SHA-256 values and verification commands.

After: a single additive section inside DownloadClientEntry provides two source-linked cards, publication dates, pre-release/unsigned status, exact filenames, byte sizes, platform boundaries, full SHA-256 values and local verification commands. Both /download and /zh/download use this component, including prerendered HTML. Every previous sentence, link and relative ordering is preserved. Title/description/H1/canonical/robots/hreflang are unchanged. The existing separate local RTX Studio requirements remain intact.

| Published asset | Release date (UTC) | Exact bytes | SHA-256 |
|---|---|---:|---|
| Windows x64 v0.1.1, DLSS5.Enhance-0.1.1-win-x64-Setup.exe | 2026-11-02 | 121681117 | 352541f0cde4e4909c8a9a6a160849d04ff1a35d0f6220416d73402e3ac3c401 |
| macOS Intel x64 v0.1.0, DLSS5.Enhance-0.1.0.dmg | 2026-10-26 | 125711820 | 0104ea3c060692f4a8c6d71e87fe978ad0b57dd71b126dfb4baa53530facd0da |

Sources: [Windows release](https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/tag/v0.1.1), [macOS release](https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/tag/v0.1.0), [tagged Windows README](https://github.com/wangsheng1991/dlss5-enhancer-cli/blob/v0.1.1/README.md). GitHub's public metadata marks both as pre-release, not drafts. Both binaries were downloaded and hashed locally on 2026-11-21; actual bytes and SHA-256 match release asset metadata. The Windows published SHA256.txt also matches. We did not execute either installer or claim a new paid-generation/native compatibility test.

## Requirements and boundaries

Windows: the published release targets x64 and excludes ARM and Windows 7/8. It does not specify a complete minimum OS version, so the new section says that instead of inventing one. macOS: Intel x64, no native Apple Silicon build in this release; published notes do not state a minimum macOS version. No guessed RAM/disk requirements are introduced.

Downloading requires no account. Cloud processing requires internet, an account and credits and no local RTX; it is not offline inference. The existing separate RTX Studio beta keeps its request path and its own requirements. Windows character styling remains planned/not shipped, with the existing online alternative preserved. No APK, NVIDIA runtime or universal game-support promise. Hash equality is file identity against the recorded release, not a signature or security certification. No advice to bypass OS security is added.

## Validation

- npm run lint passed; npm test 125/125; npm run build passed.
- RELEASE-ASSETS: 2/2 PASS — downloaded byte sizes and SHA-256 match GitHub release digests.
- DOWNLOAD-FACTS: 2/2 PASS — original body retained verbatim; head unchanged; sizes and hashes in SSR.
- React review: static, typed shared component, no extra network requests/effects/dependencies; stable file keys, semantic section/headings/dl, plain source links and copyable commands.
- Local browser at 390×844: page scrollWidth 390, both cards fit, long filenames/hashes/commands wrap without horizontal overflow. Visually inspected full Windows checksum card.
- Post-deployment production checks are archived in /Users/wangsheng/code/shou/artifacts/download-facts-20261121/ (not a claim of improved search rankings/CTR).

No GSC, sitemap submission or search-engine settings changes. No source changes to the APK metadata patch.
