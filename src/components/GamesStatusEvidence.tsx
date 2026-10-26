import React from 'react';
import { GAME_EVIDENCE, GAME_SOURCES, GAMES_CHECKED, RELEASE_TIMELINE } from '../content/gamesStatusEvidence';

type Props = { kind: string; locale: 'en' | 'zh' };
export default function GamesStatusEvidence({ kind, locale }: Props) {
  if (kind !== 'games' && kind !== 'status') return null;
  const zh = locale === 'zh';
  const labels = zh ? { launched: '已上线', announced: '已宣布，未确认上线', unconfirmed: '不确认' } : { launched: 'Launched', announced: 'Announced; release unconfirmed', unconfirmed: 'Unconfirmed' };
  const sourceLink = (key: keyof typeof GAME_SOURCES) => <a key={key} className="text-primary underline" href={GAME_SOURCES[key]} rel="noreferrer">{zh ? 'NVIDIA 官方来源' : 'NVIDIA source'} ({key})</a>;
  return <section data-games-status-evidence={kind} className="mt-12" aria-labelledby="games-status-evidence-heading">
    <h2 id="games-status-evidence-heading" className="text-2xl font-bold text-white">{kind === 'games' ? (zh ? 'DLSS 5 支持游戏名单与状态追踪' : 'DLSS 5 games list: supported games tracker') : (zh ? '按日期记录的状态变更' : 'DLSS 5 release date timeline: dated status changes')}</h2>
    <p className="mt-4 text-zinc-300">{zh ? '核对日：' : 'Last checked: '}<time dateTime={GAMES_CHECKED}>{GAMES_CHECKED}</time>{zh ? '。只按官方正文判断；新闻摘要、预览演示或计划日期已过，都不自动变成上线确认。' : '. Status follows the official article body. A news excerpt, preview demonstration or elapsed planned date does not establish a release.'}</p>
    <div className="mt-5 overflow-x-auto">
      {kind === 'games' ? <table className="w-full min-w-[760px] text-left" data-games-tracker>
        <thead><tr>{(zh ? ['游戏', '状态', '来源日期', '条件与证据边界', '来源', '核对日'] : ['Game', 'Status', 'Evidence date', 'Conditions and evidence limits', 'Sources', 'Checked']).map(h => <th key={h} className="p-3 text-primary">{h}</th>)}</tr></thead>
        <tbody>{GAME_EVIDENCE.map(row => <tr key={row.game} className="border-t border-outline-variant/20" data-game-state={row.state}>
          <th scope="row" className="p-3 text-white">{row.path ? <a className="text-primary underline" href={`${zh ? '/zh' : ''}${row.path}`}>{row.game}</a> : row.game}</th>
          <td className="p-3">{labels[row.state]}</td><td className="p-3">{row.evidenceDate}</td><td className="p-3">{row.detail[locale]}</td>
          <td className="p-3">{row.sources.map(key => <div key={key}>{sourceLink(key)}</div>)}</td><td className="p-3">{GAMES_CHECKED}</td>
        </tr>)}</tbody>
      </table> : <table className="w-full min-w-[640px] text-left" data-release-timeline>
        <thead><tr>{(zh ? ['日期', '已发生的事件', '来源', '核对日'] : ['Date', 'Event that happened', 'Source', 'Checked']).map(h => <th key={h} className="p-3 text-primary">{h}</th>)}</tr></thead>
        <tbody>{RELEASE_TIMELINE.map(row => <tr key={row.date} className="border-t border-outline-variant/20"><th scope="row" className="p-3">{row.date}</th><td className="p-3">{row.event[locale]}</td><td className="p-3">{sourceLink(row.source)}</td><td className="p-3">{GAMES_CHECKED}</td></tr>)}</tbody>
      </table>}
    </div>
    <p className="mt-5 text-zinc-300">{zh ? '官方标题原话：' : 'Official headline wording: '}<q>2X Faster Model</q>{zh ? '。这是 NVIDIA 对十月神经渲染模型的说法，涉及管线优化与模型调整，并指定 NBA 2K27 的计划更新与硬件范围；不是所有游戏帧率翻倍，更不是本站性能结论。文中另述的帧生成测试模式也不等于 DLSS 5 神经渲染支持。' : '. This is NVIDIA’s claim about its October neural-rendering model, involving pipeline/model changes and a planned NBA 2K27 rollout with named hardware. It is not a claim that every game doubles its frame rate, or a performance result from this site. The separate Frame Generation beta does not establish DLSS 5 neural-rendering support.'} {sourceLink('october')}</p>
    <p className="mt-4 text-zinc-300">{zh ? '本表追踪厂商游戏功能；本站的游戏人物风格转换是独立图像工作流，不安装或模拟 NVIDIA 游戏运行时。' : 'This tracks vendor game features. Our game-character style conversion is an independent image workflow, not an installation or emulation of NVIDIA’s game runtime.'}</p>
    <p className="mt-4"><a className="text-primary underline" href={`${zh ? '/zh' : ''}${kind === 'games' ? '/status' : '/games'}`}>{kind === 'games' ? (zh ? '查看按日期的 DLSS 5 状态记录' : 'Read the dated DLSS 5 status timeline') : (zh ? '查看 DLSS 5 支持游戏追踪表' : 'Check the DLSS 5 supported games tracker')}</a></p>
  </section>;
}
