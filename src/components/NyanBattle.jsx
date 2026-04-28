import { useState, useEffect, useRef } from 'react'
import './NyanBattle.css'

// ── Data ──────────────────────────────────────────────────────
const ATTRS = [
  { id: 'fire',    label: '🔥 火',    body: '#ff8c42', accent: '#c92a2a', eye: '#f59f00', bg: '#fff5f5' },
  { id: 'water',   label: '💧 水',    body: '#74c7ec', accent: '#1864ab', eye: '#20c997', bg: '#e7f5ff' },
  { id: 'wind',    label: '🌿 風',    body: '#8fd14f', accent: '#2b8a3e', eye: '#51cf66', bg: '#ebfbee' },
  { id: 'thunder', label: '⚡ 雷',    body: '#ffd43b', accent: '#6741d9', eye: '#ae3ec9', bg: '#fff9db' },
  { id: 'earth',   label: '🌱 土',    body: '#d4956a', accent: '#7d4f2a', eye: '#e67700', bg: '#fdf6ec' },
]

const STAGES = [
  { id: 'nora',    name: '野良猫',         life: 3, interval: 2500, intro: 'へへっ、ここは通さないニャ！',   body: '#b8cad8', accent: '#4a6278', eye: '#6db33f' },
  { id: 'junior',  name: 'ジュニア',       life: 4, interval: 1500, intro: '親父の縄張りを荒らすなニャ！', body: '#f0c4f8', accent: '#9b59b6', eye: '#f783ac' },
  { id: 'antonio', name: 'アントニオ',     life: 6, interval: 2000, intro: 'ここは俺の縄張りだニャ。',       body: '#f5b880', accent: '#c0392b', eye: '#ff6b35' },
  { id: 'kotetsu', name: '小鉄【裏ボス】', life: 8, interval: 1300, intro: '……来たか。',                   body: '#5e6278', accent: '#1a1a3e', eye: '#c92a2a' },
]

const PHRASES = ['ソコだ！', '貰った！', '食らえ！', 'トドメ！', 'うかつ！']
const GAME_W   = 320
const MOVE_SPD = 3
const HIT_DIST = 72
const ATK_CD   = 800
const P_X0     = 40
const E_X0     = 240

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ═══════════════════════════════════════════════════════════════
// SVG Cat Component
// ═══════════════════════════════════════════════════════════════
// expression: 'normal' | 'atk' | 'hit' | 'win' | 'lose'
// variant:    null | 'nora' | 'junior' | 'antonio' | 'kotetsu'
// ═══════════════════════════════════════════════════════════════
function SvgCat({ body = '#ffc9c9', accent = '#c92a2a', eye = '#7950f2',
                  facing = 1, expression = 'normal', size = 60, variant = null }) {

  const VW = 80, VH = 108
  const h  = Math.round(size * VH / VW)
  const flip = facing === -1 ? `translate(${VW},0) scale(-1,1)` : undefined
  const innerEar = '#ffb7c5'
  const mouthClr = '#c97b8a'

  // ── Eyes ──────────────────────────────────────────────────
  const eyes = () => {
    if (expression === 'atk') return (
      <>
        {/* Squinted left eye */}
        <ellipse cx="31" cy="31" rx="8"   ry="4.5" fill="white"  stroke={accent} strokeWidth="0.8"/>
        <ellipse cx="31" cy="31" rx="5.8" ry="2.6" fill={eye}/>
        <ellipse cx="31" cy="31" rx="2.6" ry="1.4" fill="#111"/>
        {/* Squinted right eye */}
        <ellipse cx="49" cy="31" rx="8"   ry="4.5" fill="white"  stroke={accent} strokeWidth="0.8"/>
        <ellipse cx="49" cy="31" rx="5.8" ry="2.6" fill={eye}/>
        <ellipse cx="49" cy="31" rx="2.6" ry="1.4" fill="#111"/>
        {/* Furrowed brows */}
        <path d="M23,24 L37,27" stroke={accent} strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M57,24 L43,27" stroke={accent} strokeWidth="2.2" strokeLinecap="round"/>
      </>
    )

    if (expression === 'hit') return (
      <>
        {/* × left eye */}
        <line x1="24" y1="24" x2="38" y2="38" stroke="#666" strokeWidth="2.8" strokeLinecap="round"/>
        <line x1="38" y1="24" x2="24" y2="38" stroke="#666" strokeWidth="2.8" strokeLinecap="round"/>
        {/* × right eye */}
        <line x1="42" y1="24" x2="56" y2="38" stroke="#666" strokeWidth="2.8" strokeLinecap="round"/>
        <line x1="56" y1="24" x2="42" y2="38" stroke="#666" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Sweat drop */}
        <path d="M63,14 C63,9 58,12 60,17 C61,20 64,20 65,17 C67,12 63,9 63,14 Z"
              fill="#74c7ec" opacity="0.88"/>
      </>
    )

    if (expression === 'win') return (
      <>
        {/* Left shining eye */}
        <circle cx="31" cy="30" r="9.5" fill="white" stroke={accent} strokeWidth="0.8"/>
        <circle cx="31" cy="30" r="7.5" fill="#ffd700"/>
        <circle cx="31" cy="30" r="3.8" fill="#ff9500"/>
        <circle cx="33.5" cy="26.5" r="2.8" fill="white" opacity="0.95"/>
        <circle cx="35.5" cy="33"   r="1.2" fill="white" opacity="0.65"/>
        {/* Left shine rays */}
        <line x1="21" y1="22" x2="18" y2="17" stroke="#ffd700" strokeWidth="1.6" strokeLinecap="round" opacity="0.85"/>
        <line x1="19" y1="30" x2="14" y2="29" stroke="#ffd700" strokeWidth="1.6" strokeLinecap="round" opacity="0.85"/>
        <line x1="22" y1="19" x2="20" y2="14" stroke="#ffd700" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
        {/* Right shining eye */}
        <circle cx="49" cy="30" r="9.5" fill="white" stroke={accent} strokeWidth="0.8"/>
        <circle cx="49" cy="30" r="7.5" fill="#ffd700"/>
        <circle cx="49" cy="30" r="3.8" fill="#ff9500"/>
        <circle cx="51.5" cy="26.5" r="2.8" fill="white" opacity="0.95"/>
        <circle cx="53.5" cy="33"   r="1.2" fill="white" opacity="0.65"/>
        {/* Right shine rays */}
        <line x1="59" y1="22" x2="62" y2="17" stroke="#ffd700" strokeWidth="1.6" strokeLinecap="round" opacity="0.85"/>
        <line x1="61" y1="30" x2="66" y2="29" stroke="#ffd700" strokeWidth="1.6" strokeLinecap="round" opacity="0.85"/>
        <line x1="58" y1="19" x2="60" y2="14" stroke="#ffd700" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
      </>
    )

    if (expression === 'lose') return (
      <>
        {/* Left sad watery eye */}
        <ellipse cx="31" cy="30" rx="8"   ry="9"   fill="white" stroke={accent} strokeWidth="0.8"/>
        <ellipse cx="31" cy="31" rx="5.8" ry="6.8" fill={eye}   opacity="0.85"/>
        <ellipse cx="31" cy="32" rx="3"   ry="4.2" fill="#111"/>
        <circle  cx="33.5" cy="27.5" r="2.2" fill="white"/>
        {/* Left teardrop */}
        <path d="M27,42 C27,47 25,48 26,51 C27,53 29.5,52 29.5,49 C29.5,47 28.5,45 27,42 Z"
              fill="#74c7ec" opacity="0.78"/>
        {/* Right sad watery eye */}
        <ellipse cx="49" cy="30" rx="8"   ry="9"   fill="white" stroke={accent} strokeWidth="0.8"/>
        <ellipse cx="49" cy="31" rx="5.8" ry="6.8" fill={eye}   opacity="0.85"/>
        <ellipse cx="49" cy="32" rx="3"   ry="4.2" fill="#111"/>
        <circle  cx="51.5" cy="27.5" r="2.2" fill="white"/>
        {/* Right teardrop */}
        <path d="M45,42 C45,47 43,48 44,51 C45,53 47.5,52 47.5,49 C47.5,47 46.5,45 45,42 Z"
              fill="#74c7ec" opacity="0.78"/>
        {/* Sad brows */}
        <path d="M22,23 C26,19 36,21 38,25" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M58,23 C54,19 44,21 42,25" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7"/>
      </>
    )

    // normal
    return (
      <>
        {/* Left eye */}
        <ellipse cx="31" cy="30" rx="8"   ry="9.2" fill="white" stroke={accent} strokeWidth="0.8"/>
        <ellipse cx="31" cy="30" rx="5.8" ry="7"   fill={eye}/>
        <ellipse cx="31" cy="31" rx="3"   ry="4.2" fill="#111"/>
        <circle  cx="33.5" cy="27" r="2.4" fill="white"/>
        <circle  cx="35"   cy="33" r="1.1" fill="white" opacity="0.55"/>
        {/* Right eye */}
        <ellipse cx="49" cy="30" rx="8"   ry="9.2" fill="white" stroke={accent} strokeWidth="0.8"/>
        <ellipse cx="49" cy="30" rx="5.8" ry="7"   fill={eye}/>
        <ellipse cx="49" cy="31" rx="3"   ry="4.2" fill="#111"/>
        <circle  cx="51.5" cy="27" r="2.4" fill="white"/>
        <circle  cx="53"   cy="33" r="1.1" fill="white" opacity="0.55"/>
      </>
    )
  }

  // ── Mouth ──────────────────────────────────────────────────
  const mouth = () => {
    if (expression === 'win')
      return <path d="M31,47 Q35,53 40,47 Q45,53 49,47" stroke={mouthClr} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    if (expression === 'lose')
      return <path d="M32,51 Q40,45 48,51" stroke={mouthClr} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    if (expression === 'hit')
      return <ellipse cx="40" cy="49" rx="3.5" ry="2.5" fill={mouthClr} opacity="0.65"/>
    // normal / atk
    return <path d="M32,46 Q36,50 40,46 Q44,50 48,46" stroke={mouthClr} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
  }

  // ── Variant extras ─────────────────────────────────────────
  const variantDecor = () => {
    if (variant === 'nora') return (
      <g opacity="0.85">
        {/* Battle scar across left cheek */}
        <line x1="23" y1="34" x2="31" y2="44" stroke="#7f96aa" strokeWidth="2"   strokeLinecap="round"/>
        <line x1="25" y1="33" x2="30" y2="40" stroke="#7f96aa" strokeWidth="1.3" strokeLinecap="round"/>
        {/* Torn right ear - rough edge */}
        <polygon points="53,32 62,14 71,32" fill={body} stroke={accent} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M62,14 L66,18 L64,22 L68,24 L71,32" fill={body} stroke={accent} strokeWidth="1.3" strokeLinejoin="round"/>
        {/* Small forehead mark */}
        <path d="M38,12 C39,9 41,9 42,12" stroke={accent} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
      </g>
    )
    if (variant === 'junior') return (
      <g>
        {/* Ribbon bow on top of head between ears */}
        <path d="M29,9  C25,5  19,6  21,11 C23,16 28,14 34,10 C38,8  42,11 38,15 C34,19 29,14 29,9  Z"
              fill="#ff6b9d" stroke="#d63384" strokeWidth="1.1"/>
        <circle cx="31" cy="11" r="3.2" fill="#ff6b9d" stroke="#d63384" strokeWidth="0.9"/>
        <circle cx="31" cy="11" r="1.5" fill="#fff" opacity="0.5"/>
        {/* Subtle glint on eye indicating elegance - small extra highlight */}
        <circle cx="38" cy="24" r="1" fill="white" opacity="0.7"/>
      </g>
    )
    if (variant === 'antonio') return (
      <g>
        {/* Thick commanding brows */}
        <path d="M21,22 L37,26" stroke="#6b3010" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M59,22 L43,26" stroke="#6b3010" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Cheek battle scar */}
        <line x1="54" y1="33" x2="61" y2="46" stroke="#8b4513" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
        <line x1="56" y1="33" x2="62" y2="43" stroke="#8b4513" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
        {/* Extra chin shadow for imposing look */}
        <path d="M28,53 Q40,58 52,53" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35"/>
      </g>
    )
    if (variant === 'kotetsu') return (
      <g>
        {/* Dark aura outer ring */}
        <ellipse cx="40" cy="60" rx="36" ry="30" fill="none" stroke="#7048e8" strokeWidth="1.8"
                 strokeDasharray="5,3" opacity="0.42"/>
        {/* Inner aura */}
        <ellipse cx="40" cy="56" rx="42" ry="34" fill="none" stroke="#4a1d96" strokeWidth="1.1"
                 strokeDasharray="2,5" opacity="0.24"/>
        {/* Sharp commanding brows */}
        <path d="M21,22 L36,26" stroke="#0d0d1a" strokeWidth="3"   strokeLinecap="round"/>
        <path d="M59,22 L44,26" stroke="#0d0d1a" strokeWidth="3"   strokeLinecap="round"/>
        {/* Battle scar (3 lines) */}
        <line x1="25" y1="25" x2="33" y2="36" stroke="#4a1d96" strokeWidth="2"   strokeLinecap="round" opacity="0.7"/>
        <line x1="27" y1="24" x2="34" y2="33" stroke="#4a1d96" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
        {/* Forehead marking - like a kanji/symbol */}
        <path d="M37,12 L43,12 M40,10 L40,15" stroke="#1a0030" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </g>
    )
    return null
  }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width={size} height={h}
         style={{ display: 'block', overflow: 'visible' }}>
      <g transform={flip}>

        {/* ── TAIL (behind body) ─────────────────────────────── */}
        <path
          d="M22,76 C6,67 0,46 10,32 C14,24 23,27 20,37 C17,47 23,64 34,74 C30,77 26,77 22,76 Z"
          fill={body} stroke={accent} strokeWidth="1.5" strokeLinejoin="round"
        />
        {/* Tail tip highlight */}
        <path
          d="M12,34 C14,26 21,28 19,37 C17,46 22,62 32,72"
          fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.28"
        />

        {/* ── BODY ───────────────────────────────────────────── */}
        <ellipse cx="40" cy="74" rx="21" ry="19" fill={body} stroke={accent} strokeWidth="1.5"/>
        {/* Body belly highlight */}
        <ellipse cx="40" cy="72" rx="11" ry="10" fill="white" opacity="0.18"/>

        {/* ── BACK LEGS ──────────────────────────────────────── */}
        <ellipse cx="54" cy="92" rx="11" ry="7" fill={body} stroke={accent} strokeWidth="1.4"/>
        <ellipse cx="26" cy="92" rx="11" ry="7" fill={body} stroke={accent} strokeWidth="1.4"/>
        {/* Paw toe lines back */}
        <line x1="48" y1="96" x2="48" y2="99" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="54" y1="97" x2="54" y2="100" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="60" y1="96" x2="60" y2="99" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="20" y1="96" x2="20" y2="99" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="26" y1="97" x2="26" y2="100" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="32" y1="96" x2="32" y2="99" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>

        {/* ── HEAD ───────────────────────────────────────────── */}
        <circle cx="40" cy="32" r="23" fill={body} stroke={accent} strokeWidth="1.5"/>
        {/* Head highlight */}
        <circle cx="35" cy="24" r="10" fill="white" opacity="0.14"/>

        {/* ── EARS (outer triangles) ─────────────────────────── */}
        <polygon points="14,14 27,32  6,32"  fill={body}     stroke={accent}   strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="66,14 53,32 74,32"  fill={body}     stroke={accent}   strokeWidth="1.5" strokeLinejoin="round"/>
        {/* EARS (inner pink) */}
        <polygon points="15,19 24,31  9,31"  fill={innerEar}/>
        <polygon points="65,19 56,31 71,31"  fill={innerEar}/>

        {/* ── VARIANT DECORATIONS ────────────────────────────── */}
        {variantDecor()}

        {/* ── EYES ───────────────────────────────────────────── */}
        {eyes()}

        {/* ── NOSE (small heart shape) ───────────────────────── */}
        <path d="M40,43 C39,41 37.2,40.2 37.2,41.8 C37.2,43.2 38.4,44.2 40,46 C41.6,44.2 42.8,43.2 42.8,41.8 C42.8,40.2 41,41 40,43 Z"
              fill="#ff8fab"/>

        {/* ── MOUTH ──────────────────────────────────────────── */}
        {mouth()}

        {/* ── WHISKERS (left 3 lines) ────────────────────────── */}
        <line x1="36" y1="42" x2="10" y2="36" stroke={accent} strokeWidth="1"   strokeLinecap="round" opacity="0.52"/>
        <line x1="36" y1="44" x2="10" y2="44" stroke={accent} strokeWidth="1"   strokeLinecap="round" opacity="0.52"/>
        <line x1="36" y1="46" x2="10" y2="52" stroke={accent} strokeWidth="1"   strokeLinecap="round" opacity="0.52"/>
        {/* WHISKERS (right 3 lines) */}
        <line x1="44" y1="42" x2="70" y2="36" stroke={accent} strokeWidth="1"   strokeLinecap="round" opacity="0.52"/>
        <line x1="44" y1="44" x2="70" y2="44" stroke={accent} strokeWidth="1"   strokeLinecap="round" opacity="0.52"/>
        <line x1="44" y1="46" x2="70" y2="52" stroke={accent} strokeWidth="1"   strokeLinecap="round" opacity="0.52"/>

        {/* ── FRONT LEGS (over body) ─────────────────────────── */}
        <ellipse cx="32" cy="93" rx="11" ry="7" fill={body} stroke={accent} strokeWidth="1.4"/>
        <ellipse cx="49" cy="94" rx="11" ry="7" fill={body} stroke={accent} strokeWidth="1.4"/>
        {/* Paw toe lines front */}
        <line x1="26" y1="97" x2="26" y2="100" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="32" y1="98" x2="32" y2="101" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="38" y1="97" x2="38" y2="100" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="43" y1="97" x2="43" y2="100" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="49" y1="98" x2="49" y2="101" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        <line x1="55" y1="97" x2="55" y2="100" stroke={accent} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>

      </g>
    </svg>
  )
}

// ── HP Bar ──────────────────────────────────────────────────
function HpBar({ hp, maxHp, color }) {
  const pct = Math.max(0, (hp / maxHp) * 100)
  const barColor = pct > 50 ? color : pct > 25 ? '#f59f00' : '#e03131'
  return (
    <div className="nyb-hpbar">
      <div className="nyb-hpbar-fill" style={{ width: `${pct}%`, background: barColor }} />
    </div>
  )
}

// ── Title Screen ────────────────────────────────────────────
function TitleScreen({ onStart }) {
  return (
    <div className="nyb-title">
      <div className="nyb-title-cats">
        <SvgCat body="#ff8c42" accent="#c92a2a" eye="#f59f00" facing={1}  expression="atk" size={66}/>
        <span className="nyb-vs">VS</span>
        <SvgCat body="#5e6278" accent="#1a1a3e" eye="#c92a2a" facing={-1} expression="atk" size={66} variant="kotetsu"/>
      </div>
      <h2 className="nyb-title-h">ニャンコ属性バトル</h2>
      <p className="nyb-title-sub">属性の力で敵の縄張りを突破せよニャ！</p>
      <button className="nyb-btn-primary" onClick={onStart}>🐾 ゲームスタート！</button>
    </div>
  )
}

// ── Char Select ─────────────────────────────────────────────
function CharSelect({ onSelect }) {
  return (
    <div className="nyb-charselect">
      <h3 className="nyb-charselect-h">属性を選んでニャ！</h3>
      <div className="nyb-charselect-grid">
        {ATTRS.map(a => (
          <button
            key={a.id}
            className="nyb-attr-card"
            style={{ background: a.bg, '--aa': a.accent }}
            onClick={() => onSelect(a)}
          >
            <SvgCat body={a.body} accent={a.accent} eye={a.eye} facing={1} expression="normal" size={52}/>
            <span className="nyb-attr-name" style={{ color: a.accent }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Battle Screen ───────────────────────────────────────────
function BattleScreen({ playerAttr, stageIdx, onWin, onLose }) {
  const stageRef  = useRef(STAGES[stageIdx])
  const gsRef     = useRef(null)
  const keysRef   = useRef({})
  const onWinRef  = useRef(onWin)
  const onLoseRef = useRef(onLose)
  useEffect(() => { onWinRef.current  = onWin  }, [onWin])
  useEffect(() => { onLoseRef.current = onLose }, [onLose])

  const [view,      setView]      = useState(null)
  const [showIntro, setShowIntro] = useState(true)

  // Init
  useEffect(() => {
    const s = stageRef.current
    gsRef.current = {
      px: P_X0, pFace: 1, pLife: 5, pMaxLife: 5, pLastAtk: 0,
      pAtk: false, pHit: false, pPhrase: null,
      ex: E_X0, eFace: -1, eLife: s.life, eMaxLife: s.life, eLastAtk: 0,
      eAtk: false, eHit: false, ePhrase: null,
      phase: 'intro',
    }
    setView({ ...gsRef.current })
    setShowIntro(true)
    const t = setTimeout(() => {
      if (!gsRef.current) return
      gsRef.current.phase    = 'fight'
      gsRef.current.eLastAtk = Date.now()
      setShowIntro(false)
      setView({ ...gsRef.current })
    }, 2600)
    return () => { clearTimeout(t); gsRef.current = null }
  }, [])

  // Keyboard
  useEffect(() => {
    const dn = (e) => {
      if ([' ', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); keysRef.current[e.key] = true }
    }
    const up = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', dn)
    window.addEventListener('keyup',   up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up) }
  }, [])

  // Game loop
  useEffect(() => {
    const s = stageRef.current
    const loop = setInterval(() => {
      const g = gsRef.current
      if (!g || g.phase !== 'fight') return
      const now   = Date.now()
      let   dirty = false

      if (keysRef.current['ArrowLeft'])  { g.px = Math.max(10, g.px - MOVE_SPD); g.pFace = -1; dirty = true }
      if (keysRef.current['ArrowRight']) { g.px = Math.min(GAME_W - 66, g.px + MOVE_SPD); g.pFace = 1; dirty = true }

      if (keysRef.current[' '] && now - g.pLastAtk >= ATK_CD) {
        g.pLastAtk = now; g.pAtk = true; dirty = true
        if (Math.abs(g.px - g.ex) < HIT_DIST) {
          g.eLife = Math.max(0, g.eLife - 1); g.eHit = true; g.pPhrase = rand(PHRASES)
          setTimeout(() => { if (gsRef.current) { gsRef.current.eHit = false; gsRef.current.pPhrase = null; setView({ ...gsRef.current }) } }, 520)
        }
        setTimeout(() => { if (gsRef.current) { gsRef.current.pAtk = false; setView({ ...gsRef.current }) } }, 320)
      }

      const diff = g.px - g.ex
      if (Math.abs(diff) > HIT_DIST - 12) { g.ex += diff > 0 ? 1.4 : -1.4; g.ex = Math.max(10, Math.min(GAME_W - 66, g.ex)); dirty = true }
      g.eFace = g.ex > g.px ? -1 : 1

      if (now - g.eLastAtk >= s.interval) {
        g.eLastAtk = now; g.eAtk = true; dirty = true
        if (Math.abs(g.px - g.ex) < HIT_DIST) {
          g.pLife = Math.max(0, g.pLife - 1); g.pHit = true; g.ePhrase = rand(PHRASES)
          setTimeout(() => { if (gsRef.current) { gsRef.current.pHit = false; gsRef.current.ePhrase = null; setView({ ...gsRef.current }) } }, 520)
        }
        setTimeout(() => { if (gsRef.current) { gsRef.current.eAtk = false; setView({ ...gsRef.current }) } }, 320)
      }

      if (g.eLife <= 0 && g.phase === 'fight') { g.phase = 'won';  dirty = true; setTimeout(() => onWinRef.current(),  1400) }
      if (g.pLife <= 0 && g.phase === 'fight') { g.phase = 'lost'; dirty = true; setTimeout(() => onLoseRef.current(), 1400) }
      if (dirty) setView({ ...g })
    }, 33)
    return () => clearInterval(loop)
  }, [])

  if (!view) return null

  const s     = stageRef.current
  const pExpr = view.phase === 'won' ? 'win' : view.phase === 'lost' ? 'lose' : view.pHit ? 'hit' : view.pAtk ? 'atk' : 'normal'
  const eExpr = view.eLife <= 0 ? 'lose' : view.eHit ? 'hit' : view.eAtk ? 'atk' : 'normal'

  return (
    <div className="nyb-battle">

      {showIntro && (
        <div className="nyb-intro">
          <div className="nyb-intro-name">{s.name}</div>
          <div className="nyb-intro-speech">「{s.intro}」</div>
        </div>
      )}

      <div className="nyb-hprow">
        <div className="nyb-hpblock">
          <span className="nyb-hplabel" style={{ color: playerAttr.accent }}>{playerAttr.label} あなた</span>
          <HpBar hp={view.pLife} maxHp={view.pMaxLife} color={playerAttr.accent}/>
        </div>
        <span className="nyb-stage-num">STAGE {stageIdx + 1}</span>
        <div className="nyb-hpblock nyb-hpblock--r">
          <span className="nyb-hplabel" style={{ color: s.accent }}>{s.name}</span>
          <HpBar hp={view.eLife} maxHp={view.eMaxLife} color={s.accent}/>
        </div>
      </div>

      <div className="nyb-arena">
        <div className="nyb-ground"/>

        {/* Player */}
        <div
          className={`nyb-fighter${view.pHit ? ' nyb-shake' : ''}${view.phase === 'won' ? ' nyb-win-pulse' : ''}${view.phase === 'lost' ? ' nyb-slump' : ''}`}
          style={{ left: view.px, bottom: 18 }}
        >
          {view.pPhrase && <div className="nyb-bubble nyb-bubble--p">{view.pPhrase}</div>}
          <SvgCat body={playerAttr.body} accent={playerAttr.accent} eye={playerAttr.eye}
                  facing={view.pFace} expression={pExpr} size={56}/>
        </div>

        {/* Enemy */}
        <div
          className={`nyb-fighter${view.eHit ? ' nyb-shake' : ''}${view.eLife <= 0 ? ' nyb-slump' : ''}`}
          style={{ left: view.ex, bottom: 18 }}
        >
          {view.ePhrase && <div className="nyb-bubble nyb-bubble--e">{view.ePhrase}</div>}
          <SvgCat body={s.body} accent={s.accent} eye={s.eye}
                  facing={view.eFace} expression={eExpr} size={56} variant={s.id}/>
        </div>

        <div className="nyb-ground"/>
        {view.phase === 'won'  && <div className="nyb-overlay nyb-overlay--win">✨ 勝利！ ✨</div>}
        {view.phase === 'lost' && <div className="nyb-overlay nyb-overlay--lose">😿 やられた…</div>}
      </div>

      <div className="nyb-controls">
        <button className="nyb-ctrl nyb-ctrl-lr"
          onPointerDown={() => { keysRef.current['ArrowLeft']  = true  }}
          onPointerUp={()   => { keysRef.current['ArrowLeft']  = false }}
          onPointerLeave={() => { keysRef.current['ArrowLeft']  = false }}
        >◀</button>
        <button className="nyb-ctrl nyb-ctrl-atc"
          onPointerDown={() => { keysRef.current[' '] = true  }}
          onPointerUp={()   => { keysRef.current[' '] = false }}
          onPointerLeave={() => { keysRef.current[' '] = false }}
        >ATC</button>
        <button className="nyb-ctrl nyb-ctrl-lr"
          onPointerDown={() => { keysRef.current['ArrowRight'] = true  }}
          onPointerUp={()   => { keysRef.current['ArrowRight'] = false }}
          onPointerLeave={() => { keysRef.current['ArrowRight'] = false }}
        >▶</button>
      </div>

      <p className="nyb-pc-hint">PC：← → 移動 ／ Space 攻撃</p>
    </div>
  )
}

// ── Result Screen ────────────────────────────────────────────
function ResultScreen({ won, allClear, playerAttr, onNext, onRetry, onTitle }) {
  return (
    <div className="nyb-result">
      {won ? (
        <>
          <div className="nyb-sparkles">✨🎉✨🎊✨🌟✨</div>
          <div className="nyb-result-icon">🏆</div>
          <h3 className="nyb-result-h nyb-result-h--win">{allClear ? '全ステージクリア！！' : 'ステージクリア！'}</h3>
          <div className="nyb-result-cat">
            <SvgCat body={playerAttr.body} accent={playerAttr.accent} eye={playerAttr.eye}
                    facing={1} expression="win" size={80}/>
          </div>
          <p className="nyb-result-msg">{allClear ? 'おめでとう！全ての縄張りを制したニャ！' : '次の縄張りへ進むニャ！'}</p>
          <div className="nyb-result-btns">
            {!allClear && <button className="nyb-btn-primary" onClick={onNext}>次へ →</button>}
            <button className="nyb-btn-outline" onClick={onTitle}>タイトルへ</button>
          </div>
        </>
      ) : (
        <>
          <div className="nyb-result-icon">😿</div>
          <h3 className="nyb-result-h nyb-result-h--lose">やられてしまったニャ…</h3>
          <div className="nyb-result-cat">
            <SvgCat body={playerAttr.body} accent={playerAttr.accent} eye={playerAttr.eye}
                    facing={1} expression="lose" size={80}/>
          </div>
          <p className="nyb-result-msg">もう一度挑戦するニャ！</p>
          <div className="nyb-result-btns">
            <button className="nyb-btn-primary" onClick={onRetry}>もう一度！</button>
            <button className="nyb-btn-outline" onClick={onTitle}>タイトルへ</button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Export ──────────────────────────────────────────────
export default function NyanBattle() {
  const [screen,     setScreen]     = useState('title')
  const [playerAttr, setPlayerAttr] = useState(null)
  const [stageIdx,   setStageIdx]   = useState(0)
  const [battleKey,  setBattleKey]  = useState(0)
  const [lastResult, setLastResult] = useState(null)

  const goTitle  = () => { setScreen('title'); setStageIdx(0); setBattleKey(k => k + 1) }
  const handleWin  = () => { setLastResult(stageIdx >= STAGES.length - 1 ? 'allclear' : 'win'); setScreen('result') }
  const handleLose = () => { setLastResult('lose'); setScreen('result') }
  const handleNext  = () => { setStageIdx(i => i + 1); setBattleKey(k => k + 1); setScreen('battle') }
  const handleRetry = () => { setBattleKey(k => k + 1); setScreen('battle') }

  return (
    <section className="nyb-section">
      <div className="nyb-inner">
        <div className="nyb-header">
          <h2 className="nyb-section-title">🐾 ニャンコ属性バトル</h2>
          <p className="nyb-section-desc">属性の力で敵の縄張りを突破せよ！</p>
        </div>
        <div className="nyb-card">
          {screen === 'title' && <TitleScreen onStart={() => setScreen('charselect')}/>}
          {screen === 'charselect' && (
            <CharSelect onSelect={(a) => { setPlayerAttr(a); setStageIdx(0); setBattleKey(k => k + 1); setScreen('battle') }}/>
          )}
          {screen === 'battle' && playerAttr && (
            <BattleScreen key={battleKey} playerAttr={playerAttr} stageIdx={stageIdx}
                          onWin={handleWin} onLose={handleLose}/>
          )}
          {screen === 'result' && playerAttr && (
            <ResultScreen won={lastResult !== 'lose'} allClear={lastResult === 'allclear'}
                          playerAttr={playerAttr} onNext={handleNext} onRetry={handleRetry} onTitle={goTitle}/>
          )}
        </div>
      </div>
    </section>
  )
}
