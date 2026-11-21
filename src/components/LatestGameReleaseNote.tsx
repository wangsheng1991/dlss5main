import { GAME_EVIDENCE, GAME_RELEASES_REVIEWED, GAME_SOURCES } from '../content/gamesStatusEvidence';

/** A dated game-source update, separate from this site's software downloads. */
export default function LatestGameReleaseNote({ chinese = false }: { chinese?: boolean }) {
  const rows = GAME_EVIDENCE.filter(row => ['Hogwarts Legacy', 'War Thunder', 'Where Winds Meet'].includes(row.game));
  return <section data-download-game-update className="rounded-xl border border-outline-variant/20 p-5 sm:p-6" aria-labelledby="latest-game-release-heading">
    <h2 id="latest-game-release-heading" className="text-2xl font-bold text-white">{chinese ? '游戏更新进度：不要只看九月首发' : 'Game availability beyond the September debut'}</h2>
    <p className="mt-3">{chinese ? '下方原有问答记录 NBA 2K27 首发途径；这里补充后续 NVIDIA 发布资料。核对日期：' : 'The existing answers below document the NBA 2K27 debut. These later NVIDIA release notes update that context. Reviewed: '}<time dateTime={GAME_RELEASES_REVIEWED}>{GAME_RELEASES_REVIEWED}</time>.</p>
    <ul className="mt-4 space-y-5">{rows.map(row => <li key={row.game}>
      <h3 className="font-semibold text-white">{row.game} — {row.state === 'launched' ? (chinese ? '已上线' : 'Released') : (chinese ? '已宣布，尚未核实上线' : 'Announced; release not verified')}</h3>
      <p className="mt-2 text-sm leading-relaxed">{row.detail[chinese ? 'zh' : 'en']}</p>
      <a className="mt-2 inline-block text-sm text-primary underline" href={GAME_SOURCES[row.sources[0]]}>NVIDIA · {row.evidenceDate}</a>
    </li>)}</ul>
    <p className="mt-5 text-sm">{chinese ? '游戏更新、驱动与对应硬件必须一起核对；这里的游戏资料不代表本站软件安装器会给游戏增加 DLSS 5。' : 'Check the game update, driver and named hardware together. These game releases do not mean that this site’s software installers add DLSS 5 to a game.'} <a className="text-primary underline" href={chinese ? '/zh/games' : '/games'}>{chinese ? '查看完整来源追踪表' : 'Read the source-linked game tracker'}</a></p>
  </section>;
}
