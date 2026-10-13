import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RELATED_ADDITIONS } from '../content/relatedAdditions';

export default function RelatedAdditions() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const links = RELATED_ADDITIONS[pathname];
  if (!links) return null;
  const isZh = pathname.startsWith('/zh/') || i18n.language.startsWith('zh');
  return <aside className="mx-auto max-w-[1000px] px-6 pb-20" aria-label={isZh ? '相关页面' : 'Related pages'}>
    <div className="border-t border-outline-variant/20 pt-7">
      <h2 className="text-xl font-bold text-white">{isZh ? '相关' : 'Related'}</h2>
      <p className="mt-2 text-sm text-zinc-400">{isZh ? '继续核对案例、支持状态与使用条件。' : 'Continue with examples, support status and practical requirements.'}</p>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {links.map(link => <li key={link.path}><Link className="text-primary hover:underline" to={link.path}>{isZh ? link.zh : link.en} →</Link></li>)}
      </ul>
    </div>
  </aside>;
}
