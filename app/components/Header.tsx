import Link from "next/link";

export function Header() {
  return (
    <>
      <div className="top-note">Stories worth slowing down for — new every evening</div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Porchlight Stories home">
          <span className="brand-mark">P</span>
          <span><strong>Porchlight</strong><small>STORIES</small></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#latest">Latest</Link>
          <Link href="/#family">Family</Link>
          <Link href="/#second-chances">Second Chances</Link>
          <Link href="/#popular">Most Read</Link>
        </nav>
        <button className="header-button" aria-label="Open reading settings">Aa <span>Reading</span></button>
      </header>
    </>
  );
}
