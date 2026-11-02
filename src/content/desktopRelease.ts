// Verified against the public GitHub v0.1.0 release on 2026-11-02.
export const DESKTOP_RELEASE = {
  name: 'DLSS5 Enhance',
  version: '0.1.0',
  platform: 'macOS Intel (x64)',
  fileName: 'DLSS5.Enhance-0.1.0.dmg',
  bytes: 125711820,
  url: 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/download/v0.1.0/DLSS5.Enhance-0.1.0.dmg',
  repository: 'https://github.com/wangsheng1991/dlss5-enhancer-cli',
} as const;

// Windows x64 installer: publish only after the native installed-app smoke check passes.
export const WINDOWS_RELEASE = {
  version: '0.1.1',
  fileName: 'DLSS5.Enhance-0.1.1-win-x64-Setup.exe',
  url: 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/download/v0.1.1/DLSS5.Enhance-0.1.1-win-x64-Setup.exe',
} as const;
