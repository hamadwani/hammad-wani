import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BrainCircuit, Download, Mail, MapPin, Menu, Printer, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { aboutCopy, education, experience, profile, projects, researchProject, skillGroups, type Project } from '../data/site'

const fade = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }} transition={{ duration: .62, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
function ProximityHeading({ lines, className = '' }: { lines: string[]; className?: string }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const root = heading.current
    if (!root) return
    const glyphs = Array.from(root.querySelectorAll<HTMLElement>('[data-proximity-glyph]'))
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const updateReveal = () => {
      const section = root.closest<HTMLElement>('.about-section')
      const sectionTop = section?.getBoundingClientRect().top ?? root.getBoundingClientRect().top
      const headerOffset = document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0
      const travel = Math.max(1, innerHeight - headerOffset)
      const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, (innerHeight - sectionTop) / travel))
      glyphs.forEach((glyph, index) => {
        const reveal = Math.max(0, Math.min(1, progress * glyphs.length - index))
        glyph.style.opacity = String(.38 + .62 * reveal)
      })
    }
    let revealRaf = 0
    const onRevealScroll = () => { cancelAnimationFrame(revealRaf); revealRaf = requestAnimationFrame(updateReveal) }
    updateReveal()
    addEventListener('scroll', onRevealScroll, { passive: true })
    addEventListener('resize', onRevealScroll)
    if (reducedMotion || matchMedia('(hover: none)').matches) {
      return () => { cancelAnimationFrame(revealRaf); removeEventListener('scroll', onRevealScroll); removeEventListener('resize', onRevealScroll) }
    }
    const weights = glyphs.map(() => 500)
    const targets = glyphs.map(() => 500)
    let raf = 0
    let active = false
    const move = (event: PointerEvent) => {
      glyphs.forEach((glyph, index) => {
        const rect = glyph.getBoundingClientRect()
        const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2))
        targets[index] = 500 + 400 * (1 - Math.min(1, distance / 170))
      })
      if (!active) { active = true; raf = requestAnimationFrame(tick) }
    }
    const tick = () => {
      let moving = false
      glyphs.forEach((glyph, index) => {
        const delta = targets[index] - weights[index]
        if (Math.abs(delta) > .7) { weights[index] += delta * .2; moving = true } else weights[index] = targets[index]
        glyph.style.setProperty('--glyph-weight', weights[index].toFixed(1))
      })
      if (moving) raf = requestAnimationFrame(tick)
      else active = false
    }
    const leave = () => { targets.fill(500); if (!active) { active = true; raf = requestAnimationFrame(tick) } }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(revealRaf); removeEventListener('scroll', onRevealScroll); removeEventListener('resize', onRevealScroll); root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave) }
  }, [])
  return <h2 ref={heading} className={`proximity-heading ${className}`} aria-label={lines.join(' ')}>{lines.map((line, lineIndex) => <span className="proximity-line" key={line}>{Array.from(line).map((char, index) => <span aria-hidden="true" data-proximity-glyph key={`${lineIndex}-${index}`} className="proximity-glyph">{char === ' ' ? '\u00a0' : char}</span>)}{lineIndex < lines.length - 1 && <br/>}</span>)}</h2>
}
function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const paragraph = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const element = paragraph.current
    if (!element) return
    const words = Array.from(element.querySelectorAll<HTMLElement>('[data-scroll-word]'))
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { words.forEach(word => word.style.setProperty('--word-reveal', '1')); return }
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const section = element.closest<HTMLElement>('.about-section')
        const sectionTop = section?.getBoundingClientRect().top ?? element.getBoundingClientRect().top
        const headerOffset = document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0
        const travel = Math.max(1, innerHeight - headerOffset)
        // Begin as the About section enters from the bottom; finish once its top
        // reaches the sticky navigation so all paragraphs are fully revealed.
        const progress = Math.max(0, Math.min(1, (innerHeight - sectionTop) / travel))
        words.forEach((word, index) => {
          const reveal = Math.max(0, Math.min(1, progress * words.length - index))
          word.style.setProperty('--word-reveal', String(reveal))
          word.style.opacity = String(.38 + .62 * reveal)
        })
      })
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [text])
  return <p ref={paragraph} className={`scroll-words ${className}`} aria-label={text}><span className="sr-only">{text}</span><span className="scroll-words-visual" aria-hidden="true">{text.split(/(\s+)/).map((part, index) => /\s+/.test(part) ? part : <span data-scroll-word key={index}>{part}</span>)}</span></p>
}
function IntroLoader() {
  const [visible, setVisible] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { if (!visible) return; const timer = window.setTimeout(() => setVisible(false), 1050); return () => window.clearTimeout(timer) }, [visible])
  return visible ? <div className="intro-loader" aria-label="Loading portfolio"><span>{profile.name.split(' ')[0].toUpperCase()}<span className="loader-period">.</span></span><p><i>PORTFOLIO INTERFACE</i><i>READY TO EXPLORE</i></p><div><b/></div></div> : null
}
function ProgressLine() {
  const [value, setValue] = useState(0)
  useEffect(() => { const update = () => { const max = document.documentElement.scrollHeight - innerHeight; setValue(max > 0 ? scrollY / max : 0) }; update(); addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); return () => { removeEventListener('scroll', update); removeEventListener('resize', update) } }, [])
  return <div className="progress-line" style={{ transform: `scaleX(${value})` }} aria-hidden="true"/>
}
function CursorFollower() {
  const point = useRef<HTMLSpanElement>(null)
  useEffect(() => { const el = point.current; if (!el || matchMedia('(hover:none), (prefers-reduced-motion: reduce)').matches) return; const move = (e: PointerEvent) => { el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)` }; addEventListener('pointermove', move, { passive: true }); return () => removeEventListener('pointermove', move) }, [])
  return <span className="cursor-ring" ref={point} aria-hidden="true"/>
}
function Header({ page = 'home' }: { page?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const projectHref = page === 'home' ? '#projects' : '/projects'
  const items = [['01', 'About', '/#about'], ['02', 'Projects', projectHref], ['03', 'Contact', '/#contact']]
  return <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><a className="wordmark" href="/" aria-label={`${profile.name} home`}>{profile.name.toUpperCase()}<span>.</span></a><button className="menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button><nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">{items.map(([num, label, href], index) => <Fragment key={label}>{index === 2 && <a className="header-mark" href={page === 'home' ? '#home' : '/'} aria-label="Home">HW</a>}<a href={href} onClick={() => setMenuOpen(false)} className={(label === 'Projects' && page === 'projects') || (label === 'About' && page === 'home') ? 'nav-selected' : ''}><small>{num}</small> {label}</a></Fragment>)}</nav><a className="header-mark-mobile" href={page === 'home' ? '#home' : '/'} aria-label="Home">HW</a><span className="header-note">{profile.focus}</span></header></>
}
function DitherOrb({ lab = false }: { lab?: boolean }) {
  const field = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = field.current
    if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = matchMedia('(hover: none)').matches
    let visible = true; let raf = 0
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; el.classList.toggle('orb-active', visible && !reduce) })
    observer.observe(el)
    const scroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const alpha = Math.max(.16, 1 - Math.min(.84, scrollY / Math.max(innerHeight, 1))); el.style.setProperty('--orb-alpha', String(alpha)); el.style.setProperty('--orb-rise', `${Math.min(38, scrollY * .045)}px`) }) }
    const pointer = (event: PointerEvent) => { if (reduce || touch || !visible) return; const rect = el.getBoundingClientRect(); el.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width - .5) * 20}px`); el.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height - .5) * 20}px`) }
    if (!reduce) { addEventListener('scroll', scroll, { passive: true }); scroll() }
    el.addEventListener('pointermove', pointer, { passive: true })
    return () => { observer.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', scroll); el.removeEventListener('pointermove', pointer) }
  }, [])
  return <div className={`dither-orb ${lab ? 'dither-lab' : ''}`} ref={field} role="img" aria-label="Abstract halftone field; decorative, not a medical scan"><div className="orb-points"/><div className="orb-shade"/><div className="orb-line orb-line-a"/><div className="orb-line orb-line-b"/><span>+</span></div>
}
function ResearchDiagram({ compact = false }: { compact?: boolean }) {
  return <div className={`research-diagram ${compact ? 'diagram-compact' : ''}`} role="img" aria-label="Conceptual diagram of MRI, PET, and clinical information with progression or stable outcomes"><div className="diagram-head"><span>RESEARCH FRAME</span><span>SCHEMATIC · NOT MODEL OUTPUT</span></div><div className="diagram-body"><div className="diagram-inputs"><label>INFORMATION</label>{researchProject.modalities.map((item, i) => <div className="diagram-node" key={item}><small>0{i + 1}</small>{item}</div>)}</div><div className="diagram-arrow"><i/><ArrowRight size={16}/></div><div className="diagram-core"><div/><span>OUTCOME<br/>CLASSIFICATION</span></div><div className="diagram-outcomes"><label>THREE-YEAR HORIZON</label>{researchProject.outcomes.map((item, i) => <div className={`diagram-node outcome-${i}`} key={item}><small>0{i + 1}</small>{item}</div>)}</div></div><div className="diagram-foot"><span>MCI · MILD COGNITIVE IMPAIRMENT</span><span>ACADEMIC RESEARCH</span></div></div>
}
function PixelImage({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null)
  const pixelCanvas = useRef<HTMLCanvasElement>(null)
  const revealCanvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const root = frame.current
    const base = pixelCanvas.current
    const reveal = revealCanvas.current
    if (!root || !base || !reveal) return
    const ctx = base.getContext('2d')
    const revealCtx = reveal.getContext('2d')
    if (!ctx || !revealCtx) return
    const image = new Image()
    image.src = src
    let active = false
    let raf = 0
    let size = 1
    const render = () => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height || !image.complete || !image.naturalWidth) return
      const dpr = Math.min(devicePixelRatio || 1, 1.5)
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      for (const canvas of [base, reveal]) { canvas.width = width; canvas.height = height }
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const x = (width - drawWidth) / 2
      const y = (height - drawHeight) / 2
      const small = document.createElement('canvas')
      const smallCtx = small.getContext('2d')
      if (!smallCtx) return
      small.width = Math.max(1, Math.round(size * width / height))
      small.height = size
      smallCtx.filter = 'grayscale(1) contrast(1.25)'
      smallCtx.drawImage(image, x * small.width / width, y * small.height / height, drawWidth * small.width / width, drawHeight * small.height / height)
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(small, 0, 0, width, height)
      revealCtx.clearRect(0, 0, width, height)
      revealCtx.drawImage(image, x, y, drawWidth, drawHeight)
    }
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) render() })
    observer.observe(root)
    const resize = new ResizeObserver(render)
    resize.observe(root)
    image.addEventListener('load', render)
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = root.getBoundingClientRect()
      root.style.setProperty('--pixel-x', `${event.clientX - rect.left}px`)
      root.style.setProperty('--pixel-y', `${event.clientY - rect.top}px`)
      root.classList.add('pixel-image-active')
    }
    const resolveImage = () => {
      if (!active) return
      cancelAnimationFrame(raf)
      const levels = [1, 2, 4, 8, 16, 32, 64]
      let step = 0
      const resolve = () => { size = levels[step]; render(); step += 1; if (step < levels.length) raf = requestAnimationFrame(resolve) }
      resolve()
    }
    const leave = () => root.classList.remove('pixel-image-active')
    const touchReveal = () => { root.classList.add('pixel-image-touch'); size = 64; render() }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerenter', resolveImage)
    root.addEventListener('pointerleave', leave)
    root.addEventListener('touchstart', touchReveal, { once: true, passive: true })
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { size = 64; root.classList.add('pixel-image-touch'); render() }
    return () => { observer.disconnect(); resize.disconnect(); image.removeEventListener('load', render); root.removeEventListener('pointermove', move); root.removeEventListener('pointerenter', resolveImage); root.removeEventListener('pointerleave', leave); root.removeEventListener('touchstart', touchReveal); cancelAnimationFrame(raf) }
  }, [src])
  return <div className="pixel-image" ref={frame} role="img" aria-label={alt}><canvas className="pixel-image-base" ref={pixelCanvas} aria-hidden="true"/><canvas className="pixel-image-reveal" ref={revealCanvas} aria-hidden="true"/><span className="sr-only">{alt}</span></div>
}
function updateArtPointer(event: React.PointerEvent<HTMLDivElement>) {
  if (event.pointerType === 'touch') return
  const art = event.currentTarget
  const rect = art.getBoundingClientRect()
  art.style.setProperty('--pixel-x', `${event.clientX - rect.left}px`)
  art.style.setProperty('--pixel-y', `${event.clientY - rect.top}px`)
}
function ProjectArt({ project }: { project: Project }) {
  if (project.visual === 'research') return <div className="project-art project-art-research" onPointerMove={updateArtPointer}><ResearchDiagram compact/></div>
  if (project.image) return <div className="project-art project-art-image" onPointerMove={updateArtPointer}><PixelImage src={project.image} alt={project.imageAlt ?? project.title}/><span>{project.visualLabel}</span></div>
  return <div className={`project-art art-${project.visual}`} onPointerMove={updateArtPointer} aria-hidden="true"><div className="art-dots"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-icon">{project.visual === 'legal' ? '§' : project.visual === 'finance' ? '₹' : project.visual === 'library' ? 'Aa' : project.visual === 'music' ? '♫' : project.visual === 'commerce' ? '▦' : project.visual === 'calendar' ? '31' : project.visual === 'medical' ? <BrainCircuit/> : <span>◈</span>}</div><span className="art-label">{project.visualLabel}</span></div>
}
function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return <Reveal><article className="project-card"><div className="project-card-meta"><span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><span>{project.category}</span></div><ProjectArt project={project}/><div className="project-copy"><div className="project-card-title"><p className="eyebrow">{project.stage}</p><h3>{project.title}</h3></div><div className="project-card-details"><p className="project-description">{project.description}</p><div className="project-tags">{project.technologies.map(tag => <span key={tag}>{tag}</span>)}</div>{project.disclaimer && <p className="project-disclaimer">{project.disclaimer}</p>}{project.repository && <a className="text-link" href={project.repository} target="_blank" rel="noreferrer">VIEW REPOSITORY <ArrowUpRight size={14}/></a>}{!project.repository && <a className="text-link" href="/project/mci-progression">READ CASE STUDY <ArrowUpRight size={14}/></a>}</div></div></article></Reveal>
}
function FeaturedRail({ items }: { items: Project[] }) {
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progressLabel = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const container = pin.current
    const rail = track.current
    if (!container || !rail) return
    const media = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    let distance = 0
    let raf = 0
    const measure = () => {
      const enabled = media.matches
      container.classList.toggle('pinned-projects-active', enabled)
      if (!enabled) {
        container.style.height = ''
        rail.style.transform = ''
        return
      }
        distance = Math.max(0, rail.scrollWidth - rail.clientWidth)
      container.style.height = `${innerHeight + distance}px`
      update()
    }
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!media.matches) return
        const rect = container.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(distance, 1)))
        rail.style.transform = `translate3d(${-distance * progress}px,0,0)`
        if (progressLabel.current) progressLabel.current.textContent = `${String(Math.min(items.length + 1, Math.floor(progress * (items.length + 1)) + 1)).padStart(2, '0')} — ${String(items.length + 1).padStart(2, '0')}`
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    media.addEventListener('change', measure)
    addEventListener('resize', measure)
    addEventListener('scroll', update, { passive: true })
    measure()
    return () => {
      observer.disconnect()
      media.removeEventListener('change', measure)
      removeEventListener('resize', measure)
      removeEventListener('scroll', update)
      cancelAnimationFrame(raf)
      container.classList.remove('pinned-projects-active')
      container.style.height = ''
      rail.style.transform = ''
    }
  }, [])
  return <div className="project-pin" ref={pin}><div className="project-pin-inner"><div className="projects-rail" ref={track}><div className="projects-intro"><div className="section-index">[ 02 / 04 ] · WORK</div><h2>Selected<br/><span>projects</span></h2><p>A selection of AI, computer vision, and software projects — built through research, experimentation, and hands-on development.</p><span className="projects-scroll-cue">SCROLL <ArrowRight size={13}/></span></div>{items.map((project, i) => <ProjectCard key={project.number} project={project} index={i}/>) }<a className="all-projects-panel" href="/projects"><span>PROJECT INDEX · {String(items.length).padStart(2, '0')} PROJECTS</span><div><p>VIEW ALL<br/>PROJECTS</p><ArrowRight aria-hidden="true"/></div></a></div></div></div>
}
function SkillTile({ group }: { group: (typeof skillGroups)[number] }) {
  return <article className="skill-tile"><div className="skill-tile-heading"><h3>{group.title}</h3><span>{group.note}</span></div><div className="skill-tags">{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>
}
function Hero() {
  const headline = ['BUILDING', 'INTELLIGENCE', 'INTO OPERATIONS']
  return <section className="hero hero-reference" id="home"><div className="hero-grid"/><a className="hero-strip" href="#contact"><span><b>HW</b> AVAILABLE FOR COLLABORATIONS — HAMMAD WANI</span><span className="hero-strip-action">WRITE <ArrowUpRight size={12}/></span></a><div className="hero-meta"><span>{profile.name.toUpperCase()} · {profile.nickname.toUpperCase()}</span><span>{profile.location.toUpperCase()}</span><span>{profile.role.toUpperCase()} · AI / ML · COMPUTER VISION</span></div><DitherOrb/><div className="hero-kicker"><i/> SOFTWARE <b>·</b> AI <b>·</b> COMPUTER VISION</div><div className="hero-card"><p>COMPUTER SCIENCE · AI / ML</p><p>I build practical software and explore AI, computer vision, and healthcare technology.</p><div className="hero-actions"><a className="button" href="#projects">SEE PROJECTS <ArrowDown size={13}/></a><a className="button button-light" href="#contact">GET IN TOUCH <ArrowUpRight size={13}/></a></div></div><h1 className="hero-title" aria-label="Building intelligence into operations" tabIndex={0}>{headline.map((line, index) => <span className={`hero-title-line hero-title-line-${index + 1}`} key={line} aria-hidden="true">{Array.from(line).map((char, i) => <span className="hero-glyph" key={`${line}-${i}`} style={{'--glyph-index': i} as React.CSSProperties}>{char === ' ' ? '\u00a0' : char}</span>)}</span>)}</h1><div className="hero-name" aria-label="Hammad Wani"><span>HAMMAD WANI</span></div><div className="hero-bottom"><span>COMPUTER SCIENCE · UNIVERSITY OF KASHMIR</span><span>SRINAGAR, INDIA</span><a href="#about">SCROLL TO EXPLORE ↓</a></div></section>
}
function FocusBand() {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = track.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let previousTime = 0
    let previousScroll = scrollY
    let previousScrollTime = performance.now()
    let scrollVelocity = 0
    let offset = 0
    const onScroll = () => {
      const now = performance.now()
      const elapsed = Math.max(1, now - previousScrollTime)
      scrollVelocity = (scrollY - previousScroll) / elapsed * 1000
      previousScroll = scrollY
      previousScrollTime = now
    }
    const tick = (time: number) => {
      const delta = previousTime ? Math.min(48, time - previousTime) : 16
      previousTime = time
      const loopWidth = element.scrollWidth / 2
      const speed = 13 + scrollVelocity * .055
      offset = loopWidth ? (offset + speed * delta / 1000 + loopWidth) % loopWidth : 0
      element.style.transform = `translate3d(${-offset}px, 0, 0) skewX(${Math.max(-8, Math.min(8, -scrollVelocity * .0008))}deg)`
      scrollVelocity *= Math.pow(.92, delta / 16.67)
      frame = requestAnimationFrame(tick)
    }
    addEventListener('scroll', onScroll, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', onScroll) }
  }, [])
  return <section className="focus-band" aria-label="What I do"><div className="focus-track" ref={track}><div className="focus-track-group"><span>RESEARCH</span><i>✳</i><span>ENGINEER</span><i>✳</i><span>BUILD</span><i>✳</i></div><div className="focus-track-group" aria-hidden="true"><span>RESEARCH</span><i>✳</i><span>ENGINEER</span><i>✳</i><span>BUILD</span><i>✳</i></div></div><p>ARTIFICIAL INTELLIGENCE · COMPUTER VISION · SOFTWARE</p></section>
}
function AboutSection() {
  return <section className="content-section about-section about-reference" id="about"><div className="section-index">[ 01 / 04 ] · ABOUT</div><div className="about-layout"><div className="about-main"><ProximityHeading lines={['FROM CURIOSITY', 'TO CODE.']}/><ScrollWords className="about-lead" text="Computer Science and Engineering student exploring artificial intelligence, machine learning, computer vision, and practical software."/><div className="about-copy">{aboutCopy.map(copy => <ScrollWords key={copy} text={copy}/>)}</div></div><aside className="about-profile"><div className="about-profile-heading"><span>PROFILE</span><span>01 — 04</span></div><dl><div><dt>BASED IN</dt><dd>{profile.location}</dd></div><div><dt>ROLE</dt><dd>{profile.role}</dd></div><div><dt>STUDYING AT</dt><dd>{education.institution}</dd></div><div><dt>FOCUS</dt><dd>AI / ML · COMPUTER VISION · SOFTWARE</dd></div></dl><div className="resume-actions"><a className="button button-light" href="/resume">VIEW RESUME <ArrowRight size={14}/></a><a className="button" href="/resume-hammad-wani.pdf" download>DOWNLOAD RESUME <span>PDF <Download size={13}/></span></a></div></aside></div></section>
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>
}
function ResumePage() {
  const resumeProjects = projects.filter(project => ['01', '02', '03', '08', '09'].includes(project.number))
  return <main className="resume-page"><div className="resume-toolbar"><a className="button" href="/"><ArrowLeft size={14}/> BACK TO WEBSITE</a><div><button className="button" type="button" onClick={() => window.print()}><Printer size={14}/> PRINT</button><a className="button button-light" href="/resume-hammad-wani.pdf" download><Download size={14}/> DOWNLOAD PDF</a></div></div><article className="resume-sheet"><header className="resume-heading"><h1>{profile.name}</h1><p>Computer Science and Engineering Student · AI / ML Developer</p><div className="resume-contact"><a href={`mailto:${profile.email}`}><Mail size={14}/>{profile.email}</a><span><MapPin size={14}/>{profile.location}</span><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div></header><div className="resume-columns"><div><ResumeSection title="Profile"><p>{aboutCopy[0]}</p></ResumeSection><ResumeSection title="Experience"><article className="resume-entry"><div className="resume-entry-top"><h3>{experience.role}</h3><span>{experience.duration}</span></div><p className="resume-place">{experience.organization}</p><p>{experience.description}</p><div className="resume-tags">{experience.technologies.map(item => <span key={item}>{item}</span>)}</div></article></ResumeSection><ResumeSection title="Education"><article className="resume-entry"><div className="resume-entry-top"><h3>{education.program}</h3><span>{education.level}</span></div><p className="resume-place">{education.institution}</p><p>{education.location}</p></article></ResumeSection><ResumeSection title="Selected projects"><div className="resume-projects">{resumeProjects.map(project => <article className="resume-entry" key={project.number}><div className="resume-entry-top"><h3>{project.title}</h3><span>{project.stage}</span></div><p>{project.description}</p><div className="resume-tags">{project.technologies.slice(0, 5).map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div></ResumeSection></div><aside className="resume-sidebar"><ResumeSection title="Skills"><div className="resume-skill-groups">{skillGroups.map(group => <div key={group.title}><h3>{group.title}</h3><div className="resume-tags">{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>)}</div></ResumeSection><ResumeSection title="Interests"><p>Artificial intelligence, machine learning, computer vision, healthcare technology, medical image analysis, and useful data-driven applications.</p></ResumeSection><ResumeSection title="Links"><div className="resume-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13}/></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13}/></a><a href={`mailto:${profile.email}`}>Email <ArrowUpRight size={13}/></a></div></ResumeSection></aside></div></article></main>
}
function SkillsSection() {
  const expertise = ['Artificial Intelligence & AI', 'Machine Learning & Data Analysis', 'Computer Vision', 'Healthcare Technology', 'Web Application Development', 'Medical Image Analysis']
  return <section className="content-section skills-section" id="skills"><div className="skills-heading"><h2>Skills</h2><span>STACK · 34</span></div><div className="skills-matrix">{skillGroups.map(group => <SkillTile key={group.title} group={group}/>)}</div><div className="expertise-band"><span className="eyebrow">AREAS OF EXPERTISE</span><div>{expertise.map((item, index) => <span key={item}>{item}{index < expertise.length - 1 && <i>/</i>}</span>)}</div></div></section>
}
function ProjectsSection() {
  return <section className="project-section" id="projects"><FeaturedRail items={projects}/></section>
}
function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [botcheck, setBotcheck] = useState('')
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (botcheck) return
    if (!accessKey) { setStatus('The contact form is not connected yet. Please email me directly.'); return }
    setSending(true)
    setStatus('Sending your message…')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: accessKey, subject: `Portfolio enquiry from ${name}`, from_name: name, name, email, message, botcheck: false }),
      })
      const result = await response.json() as { success?: boolean; message?: string }
      if (!response.ok || !result.success) throw new Error(result.message || 'Message could not be sent. Please try again.')
      setStatus('Message sent. Thank you — I’ll be in touch!')
      setName(''); setEmail(''); setMessage('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Message could not be sent. Please try again.')
    } finally {
      setSending(false)
    }
  }
  return <section className="contact-section" id="contact"><div className="contact-globe" aria-hidden="true"/><div className="contact-heading"><div className="section-index">[ 03 ] · CONTACT</div><p className="eyebrow">OPEN TO MEANINGFUL CONVERSATIONS</p><h2>LET&apos;S WORK<br/>TOGETHER</h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight aria-hidden="true"/></a></div><div className="contact-body"><div className="contact-info"><h3>Let&apos;s Stay in Touch</h3><p>I’m open to thoughtful collaborations and new opportunities.<br/>Feel free to get in touch.</p><div className="contact-rows"><a href={`mailto:${profile.email}`}><span>EMAIL</span><Mail/><b>{profile.email}</b><ArrowUpRight/></a><div><span>BASE</span><MapPin/><b>{profile.location}</b></div></div><div className="social-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight/></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight/></a></div></div><form className="contact-form" onSubmit={submit}><div className="contact-form-top"><span>&gt; NEW_MESSAGE _</span><span aria-hidden="true">☆</span></div><label className="contact-honeypot" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={botcheck} onChange={event => setBotcheck(event.target.value)}/></label><label><span>01 · NAME</span><input required autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Your name"/></label><label><span>02 · EMAIL</span><input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="your@email.com"/></label><label className="message-field"><span>03 · MESSAGE</span><textarea required maxLength={1000} value={message} onChange={event => setMessage(event.target.value)} placeholder="Your message…"/></label><div className="contact-form-bottom"><span role="status">{status}</span><span>{message.length} / 1000 characters</span></div><button className="button button-light" type="submit" disabled={sending}>{sending ? 'SENDING…' : 'SEND MESSAGE'} <ArrowRight/></button></form></div></section>
}
function Footer() {
  return <footer className="site-footer"><a className="wordmark" href="/">{profile.name.toUpperCase()}<span>.</span></a><span>COMPUTER SCIENCE · AI · COMPUTER VISION</span><a href="#main-content">BACK TO TOP ↑</a></footer>
}
function HomePage() {
  return <div className="page-shell"><Header/><main id="main-content"><Hero/><FocusBand/><AboutSection/><SkillsSection/><ProjectsSection/><ContactSection/></main><Footer/></div>
}
function ProjectsIndex() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Python', 'JavaScript', 'HTML', 'CSS', 'AI / Research']
  const visible = useMemo(() => projects.filter(p => {
    const matchesQuery = `${p.title} ${p.category} ${p.description} ${p.technologies.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || (filter === 'AI / Research' ? /AI|research|medical|computer vision/i.test(`${p.category} ${p.title}`) : p.technologies.some(t => t.toLowerCase() === filter.toLowerCase()))
    return matchesQuery && matchesFilter
  }), [query, filter])
  return <div className="page-shell"><Header page="projects"/><main id="main-content" className="inner-page project-index-page"><div className="index-topline"><a className="back-link" href="/"><ArrowLeft size={14}/> BACK TO HOME</a><span>{projects.length.toString().padStart(2,'0')} PROJECT ENTRIES</span></div><div className="section-index">[ 01 / 01 ] · ALL PROJECTS</div><div className="index-heading"><h1 className="inner-title">Index</h1><div><span>{projects.length.toString().padStart(2,'0')}</span><small>PROJECTS</small></div></div><p className="inner-lede">Research, prototypes, and web projects from my learning journey.</p><div className="index-tools"><label className="project-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, technology, keyword…"/><span>{visible.length.toString().padStart(2,'0')} / {projects.length.toString().padStart(2,'0')}</span></label><div className="index-filters" aria-label="Filter projects by technology"><span>FILTER</span>{filters.map(item => <button type="button" key={item} aria-pressed={filter === item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="project-index-table"><div className="index-table-head"><span>N°</span><span>PROJECT</span><span>TYPE / STATUS</span><span>OPEN</span></div>{visible.map(p => { const href = p.repository || '/project/mci-progression'; const external = Boolean(p.repository); return <a className="project-index-row" key={p.number} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}><span>{p.number}</span><strong>{p.title}</strong><span>{p.category} <i>· {p.stage}</i></span><ArrowUpRight size={16}/></a> })}</div>{visible.length===0&&<p className="empty-search">No projects match your search and filter.</p>}<a className="back-link" href="/"><ArrowLeft size={14}/> BACK HOME</a></main><Footer/></div>
}
function CaseStudyPage() {
  return <div className="page-shell"><Header page="projects"/><main id="main-content" className="case-page"><a className="back-link" href="/projects"><ArrowLeft size={14}/> BACK TO PROJECT INDEX</a><div className="case-label"><span>CASE STUDY · 01 / 01</span><span>FINAL-YEAR ACADEMIC RESEARCH</span></div><p className="eyebrow case-eyebrow">HEALTHCARE AI · MULTIMODAL CLASSIFICATION</p><h1 className="case-title">MCI<br/><span>PROGRESSION</span><i>RESEARCH</i></h1><div className="case-meta"><div><span>PROJECT TYPE</span><b>Final-year research project</b></div><div><span>QUESTION HORIZON</span><b>Three years</b></div><div><span>INFORMATION</span><b>MRI · PET · Clinical</b></div></div><div className="case-visual"><ResearchDiagram/></div><section className="case-section"><div className="case-section-index">01 / RESEARCH QUESTION</div><div><h2>Progression<br/>or stable outcome?</h2><p>{researchProject.question}</p></div></section><section className="case-section"><div className="case-section-index">02 / STUDY FRAME</div><div><h2>Three information<br/>modalities.</h2><p>The project studies MRI, PET, and clinical information in relation to a three-year classification question. The diagram is a conceptual illustration of the research framing, not an output from a trained model.</p><div className="modality-list">{researchProject.modalities.map((item,i)=><div key={item}><span>0{i+1}</span>{item}</div>)}</div></div></section><section className="case-disclaimer"><span>LIMITATION / 01</span><h2>Academic research only.</h2><p>{researchProject.disclaimer} This portfolio does not present clinical validation, model performance, patient data, or diagnostic recommendations.</p></section><a className="next-project" href="/projects"><span>PROJECT INDEX</span><b>Return to project index <ArrowUpRight size={16}/></b></a></main><Footer/></div>
}
export function Site() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  return <>{path !== '/resume' && <><IntroLoader/><ProgressLine/><CursorFollower/></>}{path === '/resume' ? <ResumePage/> : path === '/projects' ? <ProjectsIndex/> : path === '/project/mci-progression' ? <CaseStudyPage/> : <HomePage/>}</>
}
