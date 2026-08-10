import Link from "next/link";
import { categorySlugs } from "../content";
export function CategoryTags({ categories }: { categories: string[] }) {
  return <div className="category-tags">{categories.map((category) => <Link key={category} href={`/category/${categorySlugs[category]}`}>#{categorySlugs[category]}</Link>)}</div>;
}
