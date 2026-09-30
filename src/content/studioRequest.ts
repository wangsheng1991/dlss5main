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
      'DLSS5 Studio is handed out by email rather than posted as a public file: every build is answered by a person, so feedback goes back to the people who actually run it. Register or sign in — the address appears right here, next to a short form that files the request.',
    'request.locked.ctaRegister': 'Create a free account',
    'request.locked.ctaLogin': 'Sign in',
    'request.locked.note': 'No credit card, no subscription: an account is only how the request is tied to a person.',

    'request.open.eyebrow': 'You are registered',
    'request.open.title': 'Send the request from your account',
    'request.open.body':
      'Write it here and it arrives with your account attached, addressed to the mailbox below — nothing to set up, no mail client to configure. The reply then hands you the build that fits your machine.',
    'request.open.copy': 'Copy address',
    'request.open.copied': 'Copied',
    'request.open.as': 'Sending as {account}.',
    'request.open.byMail': 'Or send it from your own mail app',
    'request.open.reply': 'Replies usually arrive within 12 hours',
    'request.open.noteLabel': 'What do you want to process?',
    'request.open.notePlaceholder': 'One line is enough — images, video, or both.',
    'request.open.machineLabel': 'Your machine',
    'request.open.machinePlaceholder': 'e.g. Windows 10/11 x64, RTX 4070',
    'request.open.submit': 'Send the request',
    'request.open.submitting': 'Sending…',
    'request.open.sendFailed': 'The request did not go through. Try again, or send it from your own mail app.',
    'request.open.timeout': 'The request timed out. Your session may need a refresh — try again, or send it from your own mail app.',
    'request.open.tooSoon': 'You just sent one — wait a minute before sending another.',
    'request.open.sentTitle': 'Request received',
    'request.open.sentBody':
      'The reply goes to {account}. Nothing else is needed — answer that mail to add anything.',
    'request.open.sentBodyPending':
      'The request is recorded for {account}, but the notification mailbox did not confirm delivery. Please use “send from your own mail app” above so the request is not missed.',
    'request.open.sentBodyPendingUnrecorded':
      'The site could not save the request or confirm mailbox delivery for {account}. Please use “send from your own mail app” above so the request is not missed.',
    'request.open.sentBodyUnrecorded':
      'The notification was accepted for {account}, but the site could not save its request record. Please keep this confirmation and reply to the notification if you need to add anything.',
    'request.open.include1': 'The form already carries your account address and user ID.',
    'request.open.include2': 'A GPU and an OS in the machine field are enough — that decides which build you get.',
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
      'DLSS5 Studio 不公开挂文件，而是逐个用邮件发放：每一份都由人来回复，所以反馈能回到真正在用它的人手上。注册或登录之后，邮箱地址就出现在这里，旁边还有一张索取表单，填一行就能直接提交。',
    'request.locked.ctaRegister': '免费注册',
    'request.locked.ctaLogin': '登录',
    'request.locked.note': '不需要信用卡、不需要订阅：账号只是把这次索取对应到一个人。',

    'request.open.eyebrow': '已登录',
    'request.open.title': '用你的账号发这封索取邮件',
    'request.open.body':
      '在这一页写完就能发出去，请求会带着你的账号一起到上方的邮箱，不用配置任何东西、也不用打开邮件客户端。回复时就能按你的机器给出合适的版本。',
    'request.open.copy': '复制邮箱',
    'request.open.copied': '已复制',
    'request.open.as': '以 {account} 的身份发送。',
    'request.open.byMail': '或用自己的邮件客户端发送',
    'request.open.reply': '通常在 12 小时内回复',
    'request.open.noteLabel': '打算处理什么？',
    'request.open.notePlaceholder': '一句话就够 —— 图片、视频，或都要。',
    'request.open.machineLabel': '你的机器',
    'request.open.machinePlaceholder': '例如 Windows 10/11 x64、RTX 4070',
    'request.open.submit': '发送索取请求',
    'request.open.submitting': '发送中…',
    'request.open.sendFailed': '没能发出去。请再试一次，或者用自己的邮件客户端发送。',
    'request.open.timeout': '请求超时了。你的登录会话可能需要刷新；请再试一次，或者用自己的邮件客户端发送。',
    'request.open.tooSoon': '刚刚已经发过一次了，请等一分钟再发。',
    'request.open.sentTitle': '已收到',
    'request.open.sentBody': '回复会发到 {account}。不需要别的材料；想补充的话直接回那封邮件就行。',
    'request.open.sentBodyPending': '请求已经记录在 {account} 名下，但通知邮箱没有确认送达。请使用上方“用自己的邮件客户端发送”，避免漏掉申请。',
    'request.open.sentBodyPendingUnrecorded': '网站暂时没能保存申请，也没有确认通知邮箱送达给 {account}。请使用上方“用自己的邮件客户端发送”，避免漏掉申请。',
    'request.open.sentBodyUnrecorded': '通知邮箱已经接受了 {account} 的申请，但网站暂时没能保存申请记录。请保留这条确认；需要补充时直接回复通知邮件即可。',
    'request.open.include1': '表单会自动带上你的账号邮箱和用户 ID。',
    'request.open.include2': '机器那栏写清显卡和系统就够 —— 它决定发你哪个版本。',
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

    'honest.title': '它不做什么',
    'honest.1': '不冒充 NVIDIA 官方 DLSS。官方 DLSS 没有独立安装包，它随游戏以 nvngx_dlss.dll 分发。这是一个独立工具，与 NVIDIA 无隶属、也无授权关系。',
    'honest.2': '不上传你的素材。这里没有服务端渲染，也没有"在线版"的这条管线 —— 全部跑在你自己的显卡上。',
    'honest.3': '不做屏幕采集。Live 只吃文件、直链和 YouTube / Twitch 页面，仅此而已。',
    'honest.4': '不是永久离线可用。激活需要联网一次，之后在有限时间内可以离线继续跑。',
  },
} as const;
