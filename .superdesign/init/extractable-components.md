# Extractable Components — CAIRO.SYS Portfolio

## Nav
- Source: `src/components/Nav.tsx`
- Category: layout
- Description: Sticky terminal topbar — brand with pulse dot, anchor nav, availability tag, GitHub button
- Extractable props: links (array of {href,label}), available (boolean → OPEN TO WORK tag)
- Hardcoded: brand text `IBRAHIM.SYS القاهرة`, panel/btn classes, GITHUB_URL

## SectionHead
- Source: `src/components/SectionHead.tsx`
- Category: basic
- Description: Section heading — `// index` kicker, display title, optional note + Arabic word, hairline rule
- Extractable props: index, title, note, arabic (all content strings)
- Hardcoded: typography classes, gold `//` separator

## Terminal
- Source: `src/components/Terminal.tsx`
- Category: basic
- Description: Interactive shell panel — chrome bar, command output, prompt input with history
- Extractable props: inputRef (ref forwarding), commands table (currently internal)
- Hardcoded: prompt string `ibrahim@cairo:~$`, chrome title, command set

## ProjectCard
- Source: `src/components/Projects.tsx` (inline component)
- Category: basic
- Description: Featured project card — index/year, status tag (LIVE/WIP/PRIV), title link, Arabic subtitle, tagline, metrics trio, tech footer
- Extractable props: project (Project object), delay (reveal stagger ms)
- Hardcoded: status→color map, panel classes

## Khayamiya
- Source: `src/components/SectionHead.tsx`
- Category: basic
- Description: SVG row of gold triangles — traditional tentmaker divider used as section seam
- Extractable props: className (tint/opacity)
- Hardcoded: viewBox, triangle count/geometry

## MatrixRain / BootSequence / Stats tiles / Footer
- Full-bleed ambient pieces tied to this identity; extractable as-is if the theme travels. See `components.md` / `layouts.md`.
