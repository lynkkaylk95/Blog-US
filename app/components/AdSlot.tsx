export function AdSlot({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`ad-slot ${compact ? "ad-slot--compact" : ""}`} aria-label="Advertisement">
      <span>ADVERTISEMENT</span>
      <div>Ad space · responsive</div>
    </aside>
  );
}
