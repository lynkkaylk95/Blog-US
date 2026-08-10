import { adConfig } from "./config";

export function AdSlot({ compact = false }: { compact?: boolean }) {
  if (!adConfig.enabled || !adConfig.renderSlots) return null;

  return (
    <aside
      className={`ad-slot ${compact ? "ad-slot--compact" : ""}`}
      aria-label="Advertisement"
      data-ad-provider={adConfig.provider}
    >
      <span>ADVERTISEMENT</span>
      <div>Ad space · responsive</div>
    </aside>
  );
}
