"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categorySlug, storyCategories } from "../categories";

export function Header() {
  const menuCategories = storyCategories.filter((value) => value !== "Life Stories");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function closeMenu(event: MouseEvent) { if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false); }
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setMenuOpen(false); }
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeMenu); document.removeEventListener("keydown", closeOnEscape); };
  }, []);
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
          <div className={`category-menu${menuOpen ? " category-menu--open" : ""}`} ref={menuRef}>
            <button type="button" aria-expanded={menuOpen} aria-controls="category-menu-panel" onClick={() => setMenuOpen((open) => !open)}><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span><span>Categories</span></button>
            <div className="category-menu__panel" id="category-menu-panel" hidden={!menuOpen}>
              <strong>Explore categories</strong>
              <div>{menuCategories.map((value) => <Link key={value} href={`/category/${categorySlug(value)}`} onClick={() => setMenuOpen(false)}>{value}</Link>)}</div>
            </div>
          </div>
        </nav>
        <div className="header-actions">
          <Link href="/search" className="search-button" aria-label="Search stories"><span aria-hidden="true">⌕</span><b>Search</b></Link>
          <Link href="/#newsletter" className="header-button">Join free <span>→</span></Link>
        </div>
      </header>
    </>
  );
}
