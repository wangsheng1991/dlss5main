# Download delivery — 2026-11-02

Serves R1–R5: keep style conversion and Studio delivery visible, separate the enhancement entry point, publish only verified artifacts, and share browser/prerendered copy.

The hero separates published desktop downloads, the game-character online sample, and the local Windows RTX Studio private-beta application. Downloading a published installer requires neither email nor login. Cloud processing still requires an account and credits. The local Studio beta remains a distinct workflow.

The macOS Intel v0.1.0 preview is an existing public GitHub asset. Windows x64 v0.1.1 was built and tested natively on GitHub Windows runner, including per-user installation under a path containing spaces and Chinese characters, installed-app startup, bridge, PNG inspection and screenshot. All 14 CLI/engine tests passed. Release: https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/tag/v0.1.1. Installer SHA-256: 352541f0cde4e4909c8a9a6a160849d04ff1a35d0f6220416d73402e3ac3c401. Paid generation and the owner workstation are not yet tested. No subscription upgrade is authorized.

Both locale routes share the hero component and copy with prerendering. The Chinese client canonical now matches its prerendered /zh/download route.

Validation: typecheck passed; existing metadata test exposed the need to retain mobile-browser guidance, which is preserved. All 116 website tests, typecheck and build passed. Prerendered and hydrated hero links point directly to published installers. External acceptance scripts named in AGENTS.md are absent from this workspace; their execution is not claimed. Production verification follows deployment.
