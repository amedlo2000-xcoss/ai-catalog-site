import { useState, useEffect, useRef } from 'react'
import './NyanBattle.css'

const ATTRS = [
  { id: 'fire',    label: '🔥 火',    color: '#ffc9c9', accent: '#c92a2a', bg: '#fff5f5' },
  { id: 'water',   label: '💧 水',    color: '#a5d8ff', accent: '#1864ab', bg: '#e7f5ff' },
  { id: 'wind',    label: '🌿 風',    color: '#b2f2bb', accent: '#2b8a3e', bg: '#ebfbee' },
  { id: 'thunder', label: '⚡ 雷',    color: '#ffec99', accent: '#e67700', bg: '#fff9db' },
  { id: 'earth',   label: '🌱 土',    color: '#e8c9a0', accent: '#7d4f2a', bg: '#fdf6ec' },
]

const STAGES = [
  { id: 'nora',    name: '野良猫',         life: 3, interval: 2500, intro: 'へへっ、ここは通さないニャ！',   color: '#c8d6e5', accent: '#495057' },
  { id: 'junior',  name: 'ジュニア',       life: 4, interval: 1500, intro: '親父の縄張りを荒らすなニャ！', color: '#d0b4f7', accent: '#6741d9' },
  { id: 'antonio', name: 'アントニオ',     life: 6, interval: 2000, intro: 'ここは俺の縄張りだニャ。',       color: '#ffc9a0', accent: '#d4481a' },
  { id: 'kotetsu', name: '小鉄【裏ボス】', life: 8, interval: 1300, intro: '……来たか。',                   color: '#adb5bd', accent: '#212529' },
]

const PHRASES = ['ソコだ！', '貰った！', '食らえ！', 'トドメ！', 'うかつ！']

const GAME_W   = 320
const MOVE_SPD = 3
const HIT_DIST = 72
const ATK_CD   = 800
const P_X0     = 40
const E_X0     = 240

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ── CSS Cat ────────────────────────────────────────────────
function CssCat({ color, accent, facing = 1, expression = 'normal', isAttacking = false }) {
  return (
    <div className="nyb-cat" style={{ '--cc': color, '--ca': accent, transform: facing === -1 ? 'scaleX(-1)' : 'none' }}>
      <div className="nyb-cat-ear nyb-cat-ear--l" />
      <div className="nyb-cat-ear nyb-cat-ear--r" />
      <div className="nyb-cat-head">
        <div className={`nyb-eyes nyb-eyes--${expression === 'atk' || isAttacking ? 'atk' : expression}`} />
        <div className="nyb-cat-nose" />
        <div className={`nyb-cat-mouth${expression === 'happy' ? ' nyb-cat-mouth--happy' : expression === 'sad' ? ' nyb-cat-mouth--sad' : ''}`} />
      </div>
      <div className="nyb-cat-body" />
      <div className="nyb-cat-tail" style={{ transform: isAttacking ? 'rotate(-35deg)' : 'rotate(18deg)' }} />
      <div className="nyb-cat-legs">
        <div className="nyb-cat-leg" />
        <div className="nyb-cat-leg" />
      </div>
    </div>
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
        <CssCat color="#ffc9c9" accent="#c92a2a" facing={1}  expression="atk" />
        <span className="nyb-vs">VS</span>
        <CssCat color="#adb5bd" accent="#212529" facing={-1} expression="atk" />
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
            <CssCat color={a.color} accent={a.accent} facing={1} expression="normal" />
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

    return () => {
      clearTimeout(t)
      gsRef.current = null
    }
  }, []) // component is remounted via key; runs once

  // Keyboard
  useEffect(() => {
    const dn = (e) => {
      if ([' ', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        keysRef.current[e.key] = true
      }
    }
    const up = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', dn)
    window.addEventListener('keyup',   up)
    return () => {
      window.removeEventListener('keydown', dn)
      window.removeEventListener('keyup',   up)
    }
  }, [])

  // Game loop
  useEffect(() => {
    const s = stageRef.current
    const loop = setInterval(() => {
      const g = gsRef.current
      if (!g || g.phase !== 'fight') return

      const now = Date.now()
      let dirty = false

      // Player move
      if (keysRef.current['ArrowLeft'])  { g.px = Math.max(10, g.px - MOVE_SPD); g.pFace = -1; dirty = true }
      if (keysRef.current['ArrowRight']) { g.px = Math.min(GAME_W - 58, g.px + MOVE_SPD); g.pFace = 1; dirty = true }

      // Player attack
      if (keysRef.current[' '] && now - g.pLastAtk >= ATK_CD) {
        g.pLastAtk = now
        g.pAtk     = true
        dirty      = true
        if (Math.abs(g.px - g.ex) < HIT_DIST) {
          g.eLife   = Math.max(0, g.eLife - 1)
          g.eHit    = true
          g.pPhrase = rand(PHRASES)
          setTimeout(() => {
            if (gsRef.current) { gsRef.current.eHit = false; gsRef.current.pPhrase = null; setView({ ...gsRef.current }) }
          }, 500)
        }
        setTimeout(() => {
          if (gsRef.current) { gsRef.current.pAtk = false; setView({ ...gsRef.current }) }
        }, 300)
      }

      // Enemy AI
      const diff = g.px - g.ex
      if (Math.abs(diff) > HIT_DIST - 12) {
        g.ex += diff > 0 ? 1.3 : -1.3
        g.ex  = Math.max(10, Math.min(GAME_W - 58, g.ex))
        dirty = true
      }
      g.eFace = g.ex > g.px ? -1 : 1

      // Enemy attack
      if (now - g.eLastAtk >= s.interval) {
        g.eLastAtk = now
        g.eAtk     = true
        dirty      = true
        if (Math.abs(g.px - g.ex) < HIT_DIST) {
          g.pLife   = Math.max(0, g.pLife - 1)
          g.pHit    = true
          g.ePhrase = rand(PHRASES)
          setTimeout(() => {
            if (gsRef.current) { gsRef.current.pHit = false; gsRef.current.ePhrase = null; setView({ ...gsRef.current }) }
          }, 500)
        }
        setTimeout(() => {
          if (gsRef.current) { gsRef.current.eAtk = false; setView({ ...gsRef.current }) }
        }, 300)
      }

      // Win / Lose
      if (g.eLife <= 0 && g.phase === 'fight') {
        g.phase = 'won'; dirty = true
        setTimeout(() => onWinRef.current(), 1200)
      }
      if (g.pLife <= 0 && g.phase === 'fight') {
        g.phase = 'lost'; dirty = true
        setTimeout(() => onLoseRef.current(), 1200)
      }

      if (dirty) setView({ ...g })
    }, 33)

    return () => clearInterval(loop)
  }, [])

  if (!view) return null

  const pExpr = view.phase === 'won' ? 'happy' : view.phase === 'lost' ? 'sad' : view.pAtk ? 'atk' : 'normal'
  const eExpr = view.eLife <= 0 ? 'sad' : view.eAtk ? 'atk' : 'normal'
  const s     = stageRef.current

  return (
    <div className="nyb-battle">

      {/* Intro overlay */}
      {showIntro && (
        <div className="nyb-intro">
          <div className="nyb-intro-name">{s.name}</div>
          <div className="nyb-intro-speech">「{s.intro}」</div>
        </div>
      )}

      {/* HP rows */}
      <div className="nyb-hprow">
        <div className="nyb-hpblock">
          <span className="nyb-hplabel" style={{ color: playerAttr.accent }}>{playerAttr.label} あなた</span>
          <HpBar hp={view.pLife} maxHp={view.pMaxLife} color={playerAttr.accent} />
        </div>
        <span className="nyb-stage-num">STAGE {stageIdx + 1}</span>
        <div className="nyb-hpblock nyb-hpblock--r">
          <span className="nyb-hplabel" style={{ color: s.accent }}>{s.name}</span>
          <HpBar hp={view.eLife} maxHp={view.eMaxLife} color={s.accent} />
        </div>
      </div>

      {/* Arena */}
      <div className="nyb-arena">
        <div className="nyb-ground" />

        {/* Player */}
        <div
          className={`nyb-fighter${view.pHit ? ' nyb-shake' : ''}${view.phase === 'won' ? ' nyb-win-pulse' : ''}${view.phase === 'lost' ? ' nyb-slump' : ''}`}
          style={{ left: view.px, bottom: 20 }}
        >
          {view.pPhrase && <div className="nyb-bubble nyb-bubble--p">{view.pPhrase}</div>}
          <CssCat color={playerAttr.color} accent={playerAttr.accent} facing={view.pFace} expression={pExpr} isAttacking={view.pAtk} />
        </div>

        {/* Enemy */}
        <div
          className={`nyb-fighter${view.eHit ? ' nyb-shake' : ''}${view.eLife <= 0 ? ' nyb-slump' : ''}`}
          style={{ left: view.ex, bottom: 20 }}
        >
          {view.ePhrase && <div className="nyb-bubble nyb-bubble--e">{view.ePhrase}</div>}
          <CssCat color={s.color} accent={s.accent} facing={view.eFace} expression={eExpr} isAttacking={view.eAtk} />
        </div>

        {view.phase === 'won'  && <div className="nyb-overlay nyb-overlay--win">✨ 勝利！ ✨</div>}
        {view.phase === 'lost' && <div className="nyb-overlay nyb-overlay--lose">😿 やられた…</div>}
      </div>

      {/* Mobile controls */}
      <div className="nyb-controls">
        <button className="nyb-ctrl nyb-ctrl-lr"
          onPointerDown={() => { keysRef.current['ArrowLeft'] = true  }}
          onPointerUp={()   => { keysRef.current['ArrowLeft'] = false }}
          onPointerLeave={() => { keysRef.current['ArrowLeft'] = false }}
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
          <h3 className="nyb-result-h nyb-result-h--win">
            {allClear ? '全ステージクリア！！' : 'ステージクリア！'}
          </h3>
          <div className="nyb-result-cat">
            <CssCat color={playerAttr.color} accent={playerAttr.accent} facing={1} expression="happy" />
          </div>
          <p className="nyb-result-msg">
            {allClear ? 'おめでとう！全ての縄張りを制したニャ！' : '次の縄張りへ進むニャ！'}
          </p>
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
            <CssCat color={playerAttr.color} accent={playerAttr.accent} facing={1} expression="sad" />
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

  const goTitle = () => { setScreen('title'); setStageIdx(0); setBattleKey(k => k + 1) }

  const handleWin = () => {
    setLastResult(stageIdx >= STAGES.length - 1 ? 'allclear' : 'win')
    setScreen('result')
  }
  const handleLose = () => { setLastResult('lose'); setScreen('result') }

  const handleNext = () => {
    setStageIdx(i => i + 1)
    setBattleKey(k => k + 1)
    setScreen('battle')
  }
  const handleRetry = () => {
    setBattleKey(k => k + 1)
    setScreen('battle')
  }

  return (
    <section className="nyb-section">
      <div className="nyb-inner">
        <div className="nyb-header">
          <h2 className="nyb-section-title">🐾 ニャンコ属性バトル</h2>
          <p className="nyb-section-desc">属性の力で敵の縄張りを突破せよ！</p>
        </div>

        <div className="nyb-card">
          {screen === 'title' && (
            <TitleScreen onStart={() => setScreen('charselect')} />
          )}
          {screen === 'charselect' && (
            <CharSelect onSelect={(a) => {
              setPlayerAttr(a); setStageIdx(0); setBattleKey(k => k + 1); setScreen('battle')
            }} />
          )}
          {screen === 'battle' && playerAttr && (
            <BattleScreen
              key={battleKey}
              playerAttr={playerAttr}
              stageIdx={stageIdx}
              onWin={handleWin}
              onLose={handleLose}
            />
          )}
          {screen === 'result' && playerAttr && (
            <ResultScreen
              won={lastResult !== 'lose'}
              allClear={lastResult === 'allclear'}
              playerAttr={playerAttr}
              onNext={handleNext}
              onRetry={handleRetry}
              onTitle={goTitle}
            />
          )}
        </div>
      </div>
    </section>
  )
}
