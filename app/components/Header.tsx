import Link from "next/link";
import { categorySlug, storyCategories } from "../categories";

export function Header() {
  const menuCategories = storyCategories.filter((value) => value !== "Life Stories");
  return (
    <>
      <div className="top-note">Stories worth slowing down for — new every evening</div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Porchlight Stories home">
          <span className="brand-mark">P</span>
          <span><strong>Porchlight</strong><small>STORIES</small></span>
        </Link>
        <nav className="category-nav" aria-label="Main navigation">
          <div className="featured-nav">
            <Link href="/category/series">Series</Link>
            <Link href="/#popular">Most Read</Link>
            <Link href="/#latest">Latest</Link>
            <Link href="/category/life-stories">Life Stories</Link>
          </div>
          <details className="category-menu">
            <summary><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span><span>Categories</span></summary>
            <div className="category-menu__panel">
              <strong>Explore categories</strong>
              <div>{menuCategories.map((value) => <Link key={value} href={`/category/${categorySlug(value)}`}>{value}</Link>)}</div>
            </div>
          </details>
          <a className="mobile-category-trigger" href="#mobile-categories"><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span><span>Categories</span></a>
        </nav>
        <div className="header-actions">
          <Link href="/search" className="search-button" aria-label="Search stories"><span aria-hidden="true">⌕</span><b>Search</b></Link>
          <Link href="/#newsletter" className="header-button">Join free <span>→</span></Link>
        </div>
      </header>
      <aside className="mobile-categories" id="mobile-categories" aria-label="Categories menu">
        <a className="mobile-categories__backdrop" href="#" aria-label="Close categories menu" />
        <div className="mobile-categories__sheet">
          <div className="mobile-categories__head"><strong>Explore categories</strong><a href="#" aria-label="Close categories menu">×</a></div>
          <div>{menuCategories.map((value) => <Link key={value} href={`/category/${categorySlug(value)}`}>{value}</Link>)}</div>
        </div>
      </aside>
    </>
  );
}
