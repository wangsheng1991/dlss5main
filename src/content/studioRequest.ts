/**
 * `/download` 上新增的文案（邮件索取门、素材未就位时的说明、诚实区块）。
 *
 * 与 `studioPage.ts` 分开是有意的：那个文件是从 `landing/index.html` 抽取出来的**生成物**，
 * 这里的是本次新写的、落地页里不存在的键。两边都只服务同一件事：`/download` 上的文案。
 * 键名与 `studioPage.ts` 保持同一套点号命名，取值时合并成一个对象（见 `src/pages/Download.tsx`）。
 */
export const STUDIO_REQUEST_COPY = {
  'en-US': {
    'request.meta': 'Handed out by email — the request address appears on this page once you register',
    'request.ctaHero': 'Request the download',
    'request.anchor': 'Download request',

    'request.locked.eyebrow': 'Registered visitors only',
    'request.locked.title': 'The request address appears after you register',
    'request.locked.body':
      'DLSS5 Studio is handed out by email rather than posted as a public file: every build is answered by a person, so feedback goes back to the people who actually run it. Register or sign in — the address and a one-click request button appear right here.',
    'request.locked.ctaRegister': 'Create a free account',
    'request.locked.ctaLogin': 'Sign in',
    'request.locked.note': 'No credit card, no subscription: an account is only how the request is tied to a person.',

    'request.open.eyebrow': 'You are registered',
    'request.open.title': 'Send the request from your account',
    'request.open.body':
      'Write from this page and the request arrives with your account attached, so the reply can hand you the right build for your machine. One click opens your mail app with everything filled in.',
    'request.open.copy': 'Copy address',
    'request.open.copied': 'Copied',
    'request.open.as': 'Sending as {account}.',
    'request.open.ctaSend': 'Send the request email',
    'request.open.reply': 'Replies usually arrive within 12 hours',
    'request.open.include1': 'The draft already carries your account address and user ID.',
    'request.open.include2': 'Add one line about what you want to process — images, video, or both.',
    'request.open.include3': 'If you already own a Visual Enhancer build, say which version; that saves a round trip.',
    'request.open.note': 'Nothing else is needed — no payment details, no machine IDs, no upload of your material.',

    'request.mailSubject': 'DLSS5 Studio download request ({account})',
    'request.mailBody': `Hello,

I would like to request the DLSS5 Studio build.

Account: {account}
User ID (first 8 characters): {uid}
Machine: Windows 10/11 x64 with an NVIDIA RTX GPU

What I want to process:

(One line is enough — images, video, or both.)
`,

    'showcase.title': 'Before and after, from a real session',
    'showcase.pending':
      'The wipe comparison and the 8-second video clip are being recorded on the test machine. Previews on this page are real captures — never renders — so the slots stay empty until the footage exists.',

    'honest.title': 'What it does not do',
    'honest.1': 'It does not claim to be NVIDIA DLSS. Official DLSS has no standalone installer; it ships inside games as nvngx_dlss.dll. This is an independent tool, not affiliated with or endorsed by NVIDIA.',
    'honest.2': 'It does not upload your material. There is no server-side rendering here, and no online version of the pipeline — everything runs on your own GPU.',
    'honest.3': 'It does not capture your screen. Live takes files, direct streams and YouTube or Twitch pages, and nothing else.',
    'honest.4': 'It does not run forever offline. Activation needs the network once; after that it keeps working offline for a bounded period.',
  },
  'zh-CN': {
    'request.meta': '通过邮件发放 —— 注册后本页才会显示索取邮箱',
    'request.ctaHero': '索取下载',
    'request.anchor': '索取下载',

    'request.locked.eyebrow': '仅注册用户可见',
    'request.locked.title': '注册后才会显示索取邮箱',
    'request.locked.body':
      'DLSS5 Studio 不公开挂文件，而是逐个用邮件发放：每一份都由人来回复，所以反馈能回到真正在用它的人手上。注册或登录之后，邮箱地址和"一键发信"按钮就出现在这里。',
    'request.locked.ctaRegister': '免费注册',
    'request.locked.ctaLogin': '登录',
    'request.locked.note': '不需要信用卡、不需要订阅：账号只是把这次索取对应到一个人。',

    'request.open.eyebrow': '已登录',
    'request.open.title': '用你的账号发这封索取邮件',
    'request.open.body':
      '在这一页发信，邮件会带着你的账号一起到，回复时就能按你的机器给出合适的版本。点一下会打开你的邮件客户端，内容已经填好。',
    'request.open.copy': '复制邮箱',
    'request.open.copied': '已复制',
    'request.open.as': '以 {account} 的身份发送。',
    'request.open.ctaSend': '一键发送索取邮件',
    'request.open.reply': '通常在 12 小时内回复',
    'request.open.include1': '草稿里已经带上你的账号邮箱和用户 ID。',
    'request.open.include2': '补一句你打算处理什么 —— 图片、视频，或两者都要。',
    'request.open.include3': '如果你已经有 Visual Enhancer 的某个版本，写一下版本号，可以少一轮来回。',
    'request.open.note': '不需要别的材料：不用付款信息、不用机器码、也不用上传你的素材。',

    'request.mailSubject': '申请 DLSS5 Studio 下载（{account}）',
    'request.mailBody': `你好，

我想申请 DLSS5 Studio 的下载包。

账号：{account}
用户 ID 前 8 位：{uid}
机器：Windows 10/11 x64，NVIDIA RTX 显卡

打算处理什么：

（一句话就够 —— 图片、视频，或都要。）
`,

    'showcase.title': '真实会话的前后对比',
    'showcase.pending':
      '擦除对比与 8 秒视频正在测试机上录制。这一页只放真实录制的素材、不放渲染示意图，所以素材没就位之前这些位置先空着。',

    'honest.title': '它不做什么',
    'honest.1': '不冒充 NVIDIA 官方 DLSS。官方 DLSS 没有独立安装包，它随游戏以 nvngx_dlss.dll 分发。这是一个独立工具，与 NVIDIA 无隶属、也无授权关系。',
    'honest.2': '不上传你的素材。这里没有服务端渲染，也没有"在线版"的这条管线 —— 全部跑在你自己的显卡上。',
    'honest.3': '不做屏幕采集。Live 只吃文件、直链和 YouTube / Twitch 页面，仅此而已。',
    'honest.4': '不是永久离线可用。激活需要联网一次，之后在有限时间内可以离线继续跑。',
  },
} as const;
