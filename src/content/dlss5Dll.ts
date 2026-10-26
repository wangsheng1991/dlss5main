import { SITE_URL } from '../config/site';
export type DllLocale = 'en' | 'zh';
export const DLL_SOURCE = 'https://github.com/NVIDIA/DLSS/tree/main/lib/Windows_x86_64/rel';
export const DLL_ROWS = [
 ['nvngx_dlss.dll', 'NVIDIA Deep Learning SuperSampling', '310.9.16.0', '58,956,912', 'd00b5b0ab29c3ca101b70c3a5ecb3a01b7ef33766a3383a28a18623083e6123e', '512.15'],
 ['nvngx_dlssd.dll', 'NVIDIA DLSS Ray Reconstruction', '310.9.16.0', '48,343,664', 'b49435ae346f227feafe7bbe937d88277ea0ee7323975ec06488f377fdb46cee', '537.02'],
 ['nvngx_dlssg.dll', 'NVIDIA DLSS-G MFGLW', '310.9.16.0', '7,506,544', '8d59d49b36410dd6b62fef2503a5871d347415bd85d943fa0848563a95dd50c7', '520.00'],
];
export const DLL_COPY = {
 en: {
 title: 'DLSS runtime DLL files: facts and email requests',
 assertions: [
 'These files are not a DLSS 5 unlocker or a crack; copying them into a game directory will not enable DLSS 5 in a game that does not support it.',
 'They are NVIDIA’s original DLSS runtime libraries for Super Resolution, Ray Reconstruction and Frame Generation, forwarded unchanged.',
 'Replacing DLLs may be blocked by anti-cheat, may cause crashes, and game updates may overwrite them; we provide no injectors, patches or bypass methods and promise no outcome.',
 ],
 tableTitle: 'Original-file inventory',
 source: 'Source: NVIDIA’s official SDK repository, lib/Windows_x86_64/rel/. Retrieved and checked on 2026-10-26. The files were not modified, renamed, patched or repackaged. Byte counts and SHA-256 values below are the recorded file metadata; the NGX minimum driver field is what each binary states, not a DLSS 5 compatibility verdict.',
 headers: ['File', 'ProductName', 'Version', 'Bytes', 'SHA-256', 'NGX minimum driver'],
 deliveryTitle: 'Request by email',
 delivery: 'Sign in and submit your purpose, target game or development scenario, and machine configuration. After manual review, we reply by email with the files and the SHA-256 list above; recipients check the files themselves.',
 licence: 'No public direct links, no mirror site, and no requests to forward files on someone else’s behalf. These files come from NVIDIA’s official SDK. Use and redistribution are governed by NVIDIA’s SDK licence; we have no separate redistribution authorization and only forward unchanged originals at your request.',
 boundary: 'This page is a request entrance, not a binary download or a promise of delivery. Our independent Studio game-character style conversion workflow is separate from NVIDIA’s game runtime.',
 login: 'Sign in to submit a request. JavaScript is required to submit the form.',
 loginLink: 'Sign in',
 fields: ['Purpose', 'Target game or development scenario', 'Machine configuration'],
 submit: 'Record request', busy: 'Recording…', success: 'Recorded, awaiting a reply. Email notification and file delivery have not been confirmed.', error: 'The request could not be recorded. Please try again.',
 links: ['DLSS GPU compatibility checker', 'Measurements and limits', 'Download paths and Studio', 'DLSS 5 games launch tracker'],
 repository: 'Product-documentation and compatibility-record repository',
 },
 zh: {
 title: 'DLSS 运行时 DLL 文件：事实与邮件申请',
 assertions: [
 '这三个文件不是 DLSS 5 的解锁器，也不是破解；把它们复制到游戏目录不会让不支持 DLSS 5 的游戏用上 DLSS 5。',
 '它们是 NVIDIA 的 DLSS 运行时库（超分／光线重建／帧生成三条），原样转交，未修改。',
 '替换 DLL 可能被反作弊拦截、可能崩溃、游戏更新会覆盖回去；我们不提供注入器、补丁或绕过方法，也不承诺任何结果。',
 ],
 tableTitle: '原始文件清单',
 source: '来源：NVIDIA 官方 SDK 仓库 lib/Windows_x86_64/rel/ 路径，取回与核对日期 2026-10-26。文件未修改、未改名、未 patch、未二次打包。下表字节数与 SHA-256 是文件核对记录；NGX 最低驱动是各二进制里的字段，不是 DLSS 5 兼容性结论。',
 headers: ['文件', 'ProductName', '版本', '大小（字节）', 'SHA-256', 'NGX 最低驱动'],
 deliveryTitle: '邮件申请',
 delivery: '登录后提交用途、目标游戏或开发场景、机器配置。我们人工核对后回信，邮件里附文件与上面的 SHA-256 清单；收件人自行校验。',
 licence: '不提供公开直链、不做镜像站、不接受代传。这些文件来自 NVIDIA 官方 SDK，使用与再分发受 NVIDIA 的 SDK 许可约束，我们没有取得单独授权，只按你的请求转交原件。',
 boundary: '本页是申请入口，不是二进制下载，也不承诺交付。本站独立 Studio 游戏人物风格转换工作流与 NVIDIA 游戏运行时是两回事。',
 login: '请先登录再提交申请。提交表单需要启用 JavaScript。', loginLink: '登录',
 fields: ['用途', '目标游戏或开发场景', '机器配置'],
 submit: '记录申请', busy: '记录中…', success: '已记录，等待回信。尚未确认邮件通知或文件交付。', error: '未能记录申请，请重试。',
 links: ['DLSS 显卡兼容性检测', '实测与边界', '下载路径与 Studio', 'DLSS 5 游戏上线追踪'],
 repository: '产品文档与兼容性记录仓库',
 },
};
export const dllPath = (locale: DllLocale) => (locale === 'zh' ? '/zh' : '') + '/dlss-5-dll';
export const DLL_ALTERNATES = [{hrefLang:'en',href:SITE_URL+'/dlss-5-dll'},{hrefLang:'zh-CN',href:SITE_URL+'/zh/dlss-5-dll'},{hrefLang:'x-default',href:SITE_URL+'/dlss-5-dll'}];
export const dllSchema = (locale: DllLocale) => ({'@context':'https://schema.org','@type':'WebPage',name:DLL_COPY[locale].title,url:SITE_URL+dllPath(locale),inLanguage:locale==='zh'?'zh-CN':'en-US',dateModified:'2026-10-26',citation:DLL_SOURCE});
