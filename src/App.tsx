import { useEffect, useState, useRef } from 'react'

const BOOT_LINES = [
  '> initializing siqing.site...',
  '> loading personality modules... [OK]',
  '> mounting curiosity engine... [OK]',
  '> connecting to the world... [OK]',
]

const LINKS: { label: string; href: string; desc: string }[] = [
  { label: 'github',   href: 'https://github.com/sorryfornow', desc: '// code & projects' },
  { label: 'email',    href: 'mailto:hi@siqing.site',          desc: '// say hello' },
  // add more as needed
]

function Cursor() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.6em',
        height: '1.1em',
        background: 'var(--green)',
        verticalAlign: 'text-bottom',
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
      }}
    />
  )
}

function BootSequence({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<string[]>([])
  const idx = useRef(0)

  useEffect(() => {
    const next = () => {
      if (idx.current >= BOOT_LINES.length) {
        setTimeout(onDone, 400)
        return
      }
      setShown(prev => [...prev, BOOT_LINES[idx.current]])
      idx.current++
      setTimeout(next, 340)
    }
    const t = setTimeout(next, 200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '1.5rem' }}>
      {shown.map((line, i) => (
        <div key={i} style={{ opacity: i === shown.length - 1 ? 1 : 0.5 }}>{line}</div>
      ))}
    </div>
  )
}

function TypedLine({ text, delay = 0, speed = 38, onDone }: {
  text: string
  delay?: number
  speed?: number
  onDone?: () => void
}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    let t: ReturnType<typeof setTimeout>

    const start = setTimeout(() => {
      const tick = () => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i < text.length) {
          t = setTimeout(tick, speed)
        } else {
          setDone(true)
          onDone?.()
        }
      }
      tick()
    }, delay)

    return () => { clearTimeout(start); clearTimeout(t) }
  }, [text, delay, speed, onDone])

  return <span>{displayed}{!done && <Cursor />}</span>
}

function Terminal() {
  const [phase, setPhase] = useState<'boot' | 'main' | 'links' | 'done'>('boot')
  const [showLinks, setShowLinks] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '640px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,255,65,0.06)',
        animation: 'flicker 8s infinite',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          background: '#0a0a0a',
        }}
      >
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
        <span style={{ marginLeft: '8px', color: 'var(--text-muted)', fontSize: '11px' }}>
          siqing@site — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div style={{ padding: '1.4rem 1.6rem', minHeight: '320px' }}>
        {/* Boot */}
        {phase === 'boot' && (
          <BootSequence onDone={() => setPhase('main')} />
        )}

        {/* Main content */}
        {phase !== 'boot' && (
          <div style={{ animation: 'fadeInUp 0.4s ease both' }}>
            {/* Boot log faded */}
            <div style={{ color: 'var(--green-faint)', fontSize: '11px', marginBottom: '1.2rem' }}>
              {BOOT_LINES.map((l, i) => <div key={i}>{l}</div>)}
            </div>

            {/* whoami */}
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>~ $ </span>
              <span>whoami</span>
            </div>

            <div style={{ marginBottom: '1.6rem', paddingLeft: '1rem', borderLeft: '2px solid var(--green-faint)', lineHeight: '1.8' }}>
              <TypedLine
                text="siqing zhang"
                speed={60}
                onDone={() => setTimeout(() => setPhase('links'), 300)}
              />
              <br />
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                builder · thinker · perpetually curious
              </span>
            </div>

            {/* ls links */}
            {(phase === 'links' || phase === 'done') && (
              <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
                <div style={{ marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>~ $ </span>
                  <span>ls -la links/</span>
                </div>

                <LinkList onDone={() => setPhase('done')} />
              </div>
            )}

            {/* Final prompt */}
            {phase === 'done' && (
              <div style={{ marginTop: '1.4rem', animation: 'fadeInUp 0.3s ease both' }}>
                <span style={{ color: 'var(--text-muted)' }}>~ $ </span>
                <Cursor />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function LinkList({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= LINKS.length) { onDone(); return }
    const t = setTimeout(() => setVisible(v => v + 1), 200)
    return () => clearTimeout(t)
  }, [visible, onDone])

  return (
    <div style={{ paddingLeft: '1rem', fontFamily: 'inherit' }}>
      {LINKS.slice(0, visible).map(({ label, href, desc }) => (
        <div
          key={label}
          style={{ display: 'flex', gap: '1rem', marginBottom: '4px', animation: 'fadeInUp 0.25s ease both' }}
        >
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ minWidth: '90px' }}>
            {label}/
          </a>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{desc}</span>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <>
      {/* Scanline overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />
      <main style={{ width: '100%', maxWidth: '640px' }}>
        <Terminal />
        <footer style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--green-faint)',
          fontSize: '11px',
          letterSpacing: '0.08em',
        }}>
          siqing.site · {new Date().getFullYear()}
        </footer>
      </main>
    </>
  )
}
