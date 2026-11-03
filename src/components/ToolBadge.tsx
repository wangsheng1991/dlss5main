import { toolBadge } from '../config/tools';

/**
 * A one-word flag beside a tool name — "HOT" for the newest thing we shipped.
 *
 * It repeats the same wording in every language on purpose: a translated badge stops reading as a
 * flag and starts reading as a sentence, and the copy around it already explains the tool. The text
 * comes from `TOOL_BADGES`, so removing a badge is a config edit, not a hunt through components.
 */
export default function ToolBadge({ tool, className = '' }: { tool: string; className?: string }) {
  const badge = toolBadge(tool);
  if (!badge) return null;
  return (
    <span className={`inline-flex items-center align-middle rounded bg-primary px-1.5 py-[2px] text-[10px] font-bold uppercase leading-none tracking-widest text-black ${className}`}>
      {badge === 'hot' ? 'HOT' : 'NEW'}
    </span>
  );
}
