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
        <nav className="category-nav" aria-label="Main navigation">
          <Link href="/#latest">Latest</Link>
          <Link href="/category/family-legacy">Family</Link>
          <Link href="/category/second-chances">Second Chances</Link>
          <Link href="/category/life-stories">Life Stories</Link>
          <Link href="/category/justice-truth">Justice &amp; Truth</Link>
          <Link href="/category/love-after-50">Love After 50</Link>
          <Link href="/category/grandparents">Grandparents</Link>
          <Link href="/category/series">Series</Link>
          <Link href="/category/mystery">Mystery</Link>
          <Link href="/category/secrets">Secrets</Link>
          <Link href="/category/confessions">Confessions</Link>
          <Link href="/category/plot-twists">Plot Twists</Link>
          <Link href="/#popular">Most Read</Link>
        </nav>
        <div className="header-actions">
          <Link href="/search" className="search-button" aria-label="Search stories"><span aria-hidden="true">⌕</span><b>Search</b></Link>
          <Link href="/#newsletter" className="header-button">Join free <span>→</span></Link>
        </div>
      </header>
    </>
  );
}
