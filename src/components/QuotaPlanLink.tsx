import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackEvent, trackEventOnce } from '../lib/analytics';

/** A quota hint, not an assertion that a payment solves a provider/network error. */
export default function QuotaPlanLink({ reason, tool }: { reason: 'insufficient_credits' | 'daily_limit'; tool: string }) {
  const { i18n } = useTranslation();
  useEffect(() => {
    trackEventOnce(`quota-notice:${tool}:${reason}`, 'quota_notice_view', { tool, error_reason: reason });
  }, [reason, tool]);
  return <Link to="/pricing" className="block mt-2 underline font-semibold text-primary" onClick={() => trackEvent('quota_plan_click', { tool, error_reason: reason })}>
    {i18n.language.startsWith('zh') ? '查看方案与额度 →' : 'View plans and limits →'}
  </Link>;
}
