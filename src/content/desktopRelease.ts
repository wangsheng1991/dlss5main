// Public release metadata and downloaded asset SHA-256 checked on 2026-11-21.
export const DESKTOP_RELEASE = {
  name: 'DLSS5 Enhance',
  version: '0.1.0',
  platform: 'macOS Intel (x64)',
  fileName: 'DLSS5.Enhance-0.1.0.dmg',
  bytes: 125711820,
  sha256: '0104ea3c060692f4a8c6d71e87fe978ad0b57dd71b126dfb4baa53530facd0da',
  publishedAt: '2026-10-26',
  releaseNotes: 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/tag/v0.1.0',
  url: 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/download/v0.1.0/DLSS5.Enhance-0.1.0.dmg',
  repository: 'https://github.com/wangsheng1991/dlss5-enhancer-cli',
} as const;

// Windows x64 installer: publish only after the native installed-app smoke check passes.
export const WINDOWS_RELEASE = {
  name: 'DLSS5 Enhance',
  version: '0.1.1',
  platform: 'Windows x64',
  bytes: 121681117,
  sha256: '352541f0cde4e4909c8a9a6a160849d04ff1a35d0f6220416d73402e3ac3c401',
  publishedAt: '2026-11-02',
  releaseNotes: 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/tag/v0.1.1',
  fileName: 'DLSS5.Enhance-0.1.1-win-x64-Setup.exe',
  url: 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/download/v0.1.1/DLSS5.Enhance-0.1.1-win-x64-Setup.exe',
} as const;
