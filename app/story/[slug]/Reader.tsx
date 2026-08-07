"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "../../data";
import { AdSlot } from "../../components/AdSlot";

export function Reader({ chapters }: { chapters: Chapter[] }) {
  const [fontSize, setFontSize] = useState(22);
  const [theme, setTheme] = useState<"paper" | "cream" | "night">("paper");
  const [settings, setSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reaction, setReaction] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <div className={`reader-toolbar ${settings ? "open" : ""}`}>
        <button onClick={() => setSettings(!settings)} aria-expanded={settings}>Aa <span>Reading settings</span></button>
        {settings && <div className="settings-panel">
          <div><b>Text size</b><button onClick={() => setFontSize(Math.max(18, fontSize - 2))}>A−</button><span>{fontSize}</span><button onClick={() => setFontSize(Math.min(32, fontSize + 2))}>A+</button></div>
          <div><b>Page color</b><button className="swatch white" onClick={() => setTheme("paper")} aria-label="White page" /><button className="swatch cream" onClick={() => setTheme("cream")} aria-label="Cream page" /><button className="swatch dark" onClick={() => setTheme("night")} aria-label="Dark page" /></div>
        </div>}
      </div>
      <article className={`reader reader--${theme}`} style={{ "--reader-size": `${fontSize}px` } as React.CSSProperties}>
        <nav className="chapter-nav" aria-label="Story chapters">
          <span>In this story</span>
          {chapters.map((chapter, i) => <a href={`#chapter-${i + 1}`} key={chapter.title}><b>{i + 1}</b>{chapter.title}</a>)}
        </nav>
        <div className="story-body">
          {chapters.map((chapter, i) => <section id={`chapter-${i + 1}`} className="chapter" key={chapter.title}>
            <div className="chapter-kicker">CHAPTER {i + 1} OF {chapters.length}</div>
            <h2>{chapter.title}</h2>
            {chapter.paragraphs.map((p, index) => <p key={index}>{p}</p>)}
            {i === 0 && <AdSlot compact />}
            {i === 2 && <AdSlot compact />}
          </section>)}
          <div className="story-end">THE END</div>
          <section className="reaction-box">
            <span className="eyebrow">Your turn</span>
            <h2>How did this story make you feel?</h2>
            <div>{["♥ Heartwarming", "★ Satisfying", "! Surprising"].map(item => <button className={reaction === item ? "selected" : ""} onClick={() => setReaction(item)} key={item}>{item}</button>)}</div>
            {reaction && <p>Thank you for sharing.</p>}
          </section>
        </div>
      </article>
    </>
  );
}
