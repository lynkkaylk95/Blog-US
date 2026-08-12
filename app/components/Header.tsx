import Link from "next/link";
import { categorySlug, storyCategories } from "../categories";

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
          {storyCategories.map((value) => <Link key={value} href={`/category/${categorySlug(value)}`}>{value}</Link>)}
          <Link href="/category/series">Series</Link>
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
