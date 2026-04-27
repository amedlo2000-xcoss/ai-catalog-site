// ============================================================
// CatGame.jsx — 猫の色戻しパズルゲーム
// ============================================================
// お手本の猫と同じ「色×模様」の組み合わせを当てるパズルゲームです。
// 対象部位：背中・足・尻尾 の3か所
// 色：white / black / orange / brown / gray / pink
// 模様：plain / spots / stripes / tabby
// ============================================================

import { useState } from 'react'
import './CatGame.css'

// ============================================================
// 定数：ゲームで使う色・模様・部位の定義
// ============================================================

// 6種類の色（id = 内部識別子、label = 表示名、hex = 実際の色コード）
const COLORS = [
  { id: 'white',  label: 'しろ',     hex: '#f0ece4' },
  { id: 'black',  label: 'くろ',     hex: '#555566' },
  { id: 'orange', label: 'オレンジ', hex: '#ffb347' },
  { id: 'brown',  label: 'ちゃいろ', hex: '#c4956a' },
  { id: 'gray',   label: 'グレー',   hex: '#b0b8c1' },
  { id: 'pink',   label: 'ピンク',   hex: '#ffb6c1' },
]

// 4種類の模様
const PATTERNS = [
  { id: 'plain',   label: 'べたぬり' },
  { id: 'spots',   label: 'ぶち' },
  { id: 'stripes', label: 'しまし' },
  { id: 'tabby',   label: 'トラ柄' },
]

// 3つの対象部位（id = 内部識別子、label = 表示名）
const PARTS = [
  { id: 'back', label: '背中' },
  { id: 'feet', label: '足' },
  { id: 'tail', label: '尻尾' },
]

// ============================================================
// ユーティリティ関数
// ============================================================

// 配列からランダムな要素を1つ取得する
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ランダムな正解の組み合わせを生成する
// 各部位に「色」と「模様」をランダムに割り当てる
function generateAnswer() {
  return {
    back: { color: randItem(COLORS).id, pattern: randItem(PATTERNS).id },
    feet: { color: randItem(COLORS).id, pattern: randItem(PATTERNS).id },
    tail: { color: randItem(COLORS).id, pattern: randItem(PATTERNS).id },
  }
}

// プレイヤーの猫の初期状態（全部グレー・べたぬり）
function defaultCatState() {
  return {
    back: { color: 'gray', pattern: 'plain' },
    feet: { color: 'gray', pattern: 'plain' },
    tail: { color: 'gray', pattern: 'plain' },
  }
}

// 色のIDから16進数カラーコードを取得する
function colorHex(colorId) {
  return COLORS.find(c => c.id === colorId)?.hex ?? '#cccccc'
}

// SVGの塗りつぶし値を返す（模様なら url(#パターンID)、べたぬりなら色コード）
function getFill(partId, colorId, patternId) {
  if (patternId === 'plain') return colorHex(colorId)
  return `url(#p-${partId})`
}

// ============================================================
// SVGパターン定義を生成する関数
// <defs> の中で使う <pattern> 要素を返す
// partId  : 'back' | 'feet' | 'tail'（一意のIDを作るため）
// baseColor: ベースカラー（16進数）
// patternId: 'spots' | 'stripes' | 'tabby'（'plain' のときは null を返す）
// ============================================================
function renderSvgPattern(partId, baseColor, patternId) {
  const id = `p-${partId}` // 例：p-back、p-feet、p-tail

  // ぶち模様：大きな丸と四隅の小さな丸
  if (patternId === 'spots') {
    return (
      <pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill={baseColor} />
        <circle cx="12" cy="12" r="6"  fill="rgba(0,0,0,0.22)" />
        <circle cx="0"  cy="0"  r="3.5" fill="rgba(0,0,0,0.18)" />
        <circle cx="24" cy="0"  r="3.5" fill="rgba(0,0,0,0.18)" />
        <circle cx="0"  cy="24" r="3.5" fill="rgba(0,0,0,0.18)" />
        <circle cx="24" cy="24" r="3.5" fill="rgba(0,0,0,0.18)" />
      </pattern>
    )
  }

  // しまし模様：縦縞
  if (patternId === 'stripes') {
    return (
      <pattern id={id} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill={baseColor} />
        <rect x="0" y="0" width="6" height="12" fill="rgba(0,0,0,0.18)" />
      </pattern>
    )
  }

  // トラ柄模様：横縞（幅の違う2本）
  if (patternId === 'tabby') {
    return (
      <pattern id={id} x="0" y="0" width="20" height="12" patternUnits="userSpaceOnUse">
        <rect width="20" height="12" fill={baseColor} />
        <rect x="0" y="1" width="20" height="3.5" fill="rgba(0,0,0,0.22)" />
        <rect x="0" y="8" width="20" height="2"   fill="rgba(0,0,0,0.14)" />
      </pattern>
    )
  }

  // べたぬりの場合はパターン不要なので null を返す
  return null
}

// ============================================================
// 猫のSVGコンポーネント
// ============================================================
// catState   : { back: {color, pattern}, feet: {color, pattern}, tail: {color, pattern} }
// expression : 'normal'（普通）| 'happy'（笑い）| 'angry'（怒り）
// size       : 描画幅（高さはviewBoxの縦横比に合わせて自動計算）
// ============================================================
function CatSVG({ catState, expression = 'normal', size = 160 }) {
  const { back, feet, tail } = catState

  // 各部位の「塗りつぶし値」を取得（べたぬりなら色コード、模様ならurlリファレンス）
  const backFill = getFill('back', back.color, back.pattern)
  const feetFill = getFill('feet', feet.color, feet.pattern)
  const tailFill = getFill('tail', tail.color, tail.pattern)

  // パターン定義用のベースカラー（16進数）
  const backHex = colorHex(back.color)
  const feetHex = colorHex(feet.color)
  const tailHex = colorHex(tail.color)

  // ── 表情：目の描画 ─────────────────────────────────
  const renderEyes = () => {
    if (expression === 'happy') {
      // 笑い目（アーチ型 ˆˆ）
      return (
        <g>
          <path d="M74,78 Q82,66 90,78" stroke="#333" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M110,78 Q118,66 126,78" stroke="#333" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </g>
      )
    }
    if (expression === 'angry') {
      // 怒り目（まつ毛眉+丸目）
      return (
        <g>
          <circle cx="82" cy="77" r="6.5" fill="#333" />
          <circle cx="118" cy="77" r="6.5" fill="#333" />
          <circle cx="84"  cy="75" r="2.2" fill="white" />
          <circle cx="120" cy="75" r="2.2" fill="white" />
          {/* 怒り眉 */}
          <line x1="70" y1="66" x2="90" y2="72" stroke="#333" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="130" y1="66" x2="110" y2="72" stroke="#333" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      )
    }
    // 通常の目（まんまる）
    return (
      <g>
        <circle cx="82"  cy="76" r="7.5" fill="#333" />
        <circle cx="118" cy="76" r="7.5" fill="#333" />
        <circle cx="84.5"  cy="73.5" r="2.8" fill="white" />
        <circle cx="120.5" cy="73.5" r="2.8" fill="white" />
      </g>
    )
  }

  // ── 表情：口の描画 ─────────────────────────────────
  const renderMouth = () => {
    if (expression === 'happy') {
      // 大きな笑顔
      return <path d="M86,95 Q100,110 114,95" stroke="#c97b8a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    }
    if (expression === 'angry') {
      // への字（不満そうな口）
      return <path d="M86,103 Q100,93 114,103" stroke="#c97b8a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    }
    // 通常のやや微笑み
    return <path d="M92,95 Q100,102 108,95" stroke="#c97b8a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
  }

  return (
    <svg
      viewBox="0 0 200 210"
      style={{ width: size, height: 'auto', display: 'block' }}
    >
      {/* ── SVGパターン定義（模様の繰り返しタイル） ── */}
      <defs>
        {renderSvgPattern('back', backHex, back.pattern)}
        {renderSvgPattern('feet', feetHex, feet.pattern)}
        {renderSvgPattern('tail', tailHex, tail.pattern)}
      </defs>

      {/* ── 尻尾（体より後ろに描くので最初に描く） ── */}
      {/* フック型のパス：体右側 → 右外へ → 先端 → 内側へ戻る → 閉じる */}
      <path
        d="M 144,150 C 176,133 190,100 172,78 C 164,64 148,68 150,85 C 152,102 140,122 126,142 Z"
        fill={tailFill}
        stroke="#666"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ── 体（背中） ── */}
      <ellipse cx="100" cy="153" rx="54" ry="42" fill={backFill} stroke="#666" strokeWidth="1.5" />

      {/* ── 足（前足2本） ── */}
      <ellipse cx="72"  cy="189" rx="20" ry="12" fill={feetFill} stroke="#666" strokeWidth="1.5" />
      <ellipse cx="128" cy="189" rx="20" ry="12" fill={feetFill} stroke="#666" strokeWidth="1.5" />
      {/* 足の指の線（3本ずつ） */}
      <line x1="65"  y1="195" x2="65"  y2="184" stroke="#666" strokeWidth="1" opacity="0.45" />
      <line x1="72"  y1="197" x2="72"  y2="186" stroke="#666" strokeWidth="1" opacity="0.45" />
      <line x1="79"  y1="195" x2="79"  y2="184" stroke="#666" strokeWidth="1" opacity="0.45" />
      <line x1="121" y1="195" x2="121" y2="184" stroke="#666" strokeWidth="1" opacity="0.45" />
      <line x1="128" y1="197" x2="128" y2="186" stroke="#666" strokeWidth="1" opacity="0.45" />
      <line x1="135" y1="195" x2="135" y2="184" stroke="#666" strokeWidth="1" opacity="0.45" />

      {/* ── 頭（背中と同じ色・模様） ── */}
      <circle cx="100" cy="78" r="42" fill={backFill} stroke="#666" strokeWidth="1.5" />

      {/* ── 耳（外側） ── */}
      <polygon points="62,46 76,70 52,70" fill={backHex} stroke="#666" strokeWidth="1.5" />
      <polygon points="138,46 124,70 148,70" fill={backHex} stroke="#666" strokeWidth="1.5" />
      {/* 耳の内側（ピンク） */}
      <polygon points="63,51 75,68 57,68" fill="#ffccd5" />
      <polygon points="137,51 125,68 143,68" fill="#ffccd5" />

      {/* ── 目 ── */}
      {renderEyes()}

      {/* ── 鼻 ── */}
      <ellipse cx="100" cy="89" rx="4" ry="3" fill="#ffaab5" />

      {/* ── 口 ── */}
      {renderMouth()}

      {/* ── ひげ（左右2本ずつ） ── */}
      <line x1="50"  y1="87" x2="83"  y2="91" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="50"  y1="93" x2="83"  y2="92" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="117" y1="91" x2="150" y2="87" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="117" y1="92" x2="150" y2="93" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ============================================================
// タイトル画面
// ============================================================
// onStart: スタートボタンを押したときに呼ぶ関数
function TitleScreen({ onStart }) {
  return (
    <div className="catgame-title">
      <h3 className="catgame-title-heading">🐱 猫の色戻しパズル</h3>
      <p className="catgame-title-desc">
        お手本の猫に合わせて<br />
        「背中・足・尻尾」の色と模様を当てよう！
      </p>

      {/* デコレーション用のサンプル猫 */}
      <div className="catgame-title-cat">
        <CatSVG
          catState={{
            back: { color: 'orange', pattern: 'tabby' },
            feet: { color: 'white',  pattern: 'plain' },
            tail: { color: 'orange', pattern: 'stripes' },
          }}
          expression="happy"
          size={150}
        />
      </div>

      <button className="catgame-start-btn" onClick={onStart}>
        🎮 ゲームスタート！
      </button>
      <p className="catgame-hint-text">✨ 背中・足・尻尾の全部を正解するとクリア！</p>
    </div>
  )
}

// ============================================================
// クリア画面
// ============================================================
// answer   : 正解の組み合わせ（CatStateオブジェクト）
// onRestart: もう一度ボタンを押したときに呼ぶ関数
function ClearScreen({ answer, onRestart }) {
  return (
    <div className="catgame-clear">
      <div className="catgame-clear-fireworks">🎉🎊🎉</div>
      <div className="catgame-clear-title">クリア！</div>
      <p className="catgame-clear-msg">全部正解！すごいね！🐱</p>

      {/* クリア時の猫（笑顔） */}
      <CatSVG catState={answer} expression="happy" size={160} />

      {/* 正解の組み合わせを表示 */}
      <div className="catgame-clear-answer">
        <h4>🏆 正解の組み合わせ</h4>
        {PARTS.map(part => {
          const { color, pattern } = answer[part.id]
          const colorInfo   = COLORS.find(c => c.id === color)
          const patternInfo = PATTERNS.find(p => p.id === pattern)
          return (
            <div key={part.id} className="catgame-answer-row">
              <span className="catgame-answer-part">{part.label}</span>
              {/* 色スウォッチ付きラベル */}
              <span
                className="catgame-answer-color"
                style={{ background: colorInfo.hex, border: '1px solid rgba(0,0,0,0.1)' }}
              >
                {colorInfo.label}
              </span>
              <span className="catgame-answer-pattern">{patternInfo.label}</span>
            </div>
          )
        })}
      </div>

      <button className="catgame-restart-btn" onClick={onRestart}>
        🔄 もう一度あそぶ
      </button>
    </div>
  )
}

// ============================================================
// ゲーム画面
// ============================================================
// answer : 正解の組み合わせ（プレイヤーには見せない）
// onClear: 全問正解したときに呼ぶ関数
function GameScreen({ answer, onClear }) {
  // プレイヤーが現在選んでいる色・模様の状態（初期は全部グレー）
  const [player, setPlayer] = useState(defaultCatState())

  // 今どの部位を編集しているか（'back' | 'feet' | 'tail'）
  const [activePart, setActivePart] = useState('back')

  // 答え合わせの結果（null = まだチェックしていない）
  // { back: true/false, feet: true/false, tail: true/false }
  const [result, setResult] = useState(null)

  // 猫の表情（'normal' | 'happy' | 'angry'）
  const [expression, setExpression] = useState('normal')

  // ── 色または模様が選択されたときの更新処理 ──────────────
  // field: 'color' または 'pattern'
  // value: 選ばれた色IDまたは模様ID
  const updatePart = (field, value) => {
    setPlayer(prev => ({
      ...prev,
      [activePart]: { ...prev[activePart], [field]: value },
    }))
    // 選択が変わったので答え合わせ結果をリセット
    setResult(null)
    setExpression('normal')
  }

  // ── 答え合わせボタンを押したときの処理 ──────────────────
  const checkAnswers = () => {
    const newResult = {}
    let allCorrect = true

    // 各部位を正解と比較する
    PARTS.forEach(part => {
      const isCorrect =
        player[part.id].color   === answer[part.id].color &&
        player[part.id].pattern === answer[part.id].pattern
      newResult[part.id] = isCorrect
      if (!isCorrect) allCorrect = false
    })

    setResult(newResult)

    if (allCorrect) {
      // ✅ 全問正解！笑顔にしてからクリア画面へ
      setExpression('happy')
      setTimeout(() => onClear(), 1600)
    } else {
      // ❌ 不正解あり：怒り顔 → 少し待ってから元に戻す
      setExpression('angry')
      setTimeout(() => setExpression('normal'), 1400)
    }
  }

  return (
    <div className="catgame-game">

      {/* ── 上部：お手本猫 vs プレイヤーの猫 ── */}
      <div className="catgame-cats-row">

        {/* お手本の猫（正解を表示） */}
        <div className="catgame-cat-box">
          <div className="catgame-cat-label catgame-cat-label--ref">📖 お手本</div>
          <CatSVG catState={answer} expression="normal" size={148} />
        </div>

        {/* VS 区切り */}
        <div className="catgame-vs">VS</div>

        {/* プレイヤーの猫（選択に応じてリアルタイムで変わる） */}
        <div className="catgame-cat-box">
          <div className="catgame-cat-label catgame-cat-label--player">🖌 あなたの猫</div>
          <CatSVG catState={player} expression={expression} size={148} />
          {/* 答え合わせ後のメッセージ */}
          {expression === 'happy' && (
            <div className="catgame-expression-msg catgame-expression-msg--happy">全部正解！🎉</div>
          )}
          {expression === 'angry' && (
            <div className="catgame-expression-msg catgame-expression-msg--angry">まだちがうよ！😿</div>
          )}
        </div>
      </div>

      {/* ── 中部：部位選択タブ ── */}
      <div className="catgame-part-tabs">
        {PARTS.map(part => (
          <button
            key={part.id}
            className={`catgame-part-tab${activePart === part.id ? ' catgame-part-tab--active' : ''}`}
            onClick={() => setActivePart(part.id)}
          >
            {part.label}
            {/* 答え合わせ後に正誤バッジを表示 */}
            {result !== null && (
              <span className={`catgame-result-badge ${result[part.id] ? 'catgame-result-badge--ok' : 'catgame-result-badge--ng'}`}>
                {result[part.id] ? '✓' : '✗'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── 下部：色・模様の選択エリア ── */}
      <div className="catgame-picker">

        {/* 色ボタン */}
        <div className="catgame-picker-section">
          <div className="catgame-picker-label">🎨 色を選んでね（{activePart === 'back' ? '背中' : activePart === 'feet' ? '足' : '尻尾'}）</div>
          <div className="catgame-color-grid">
            {COLORS.map(color => (
              <button
                key={color.id}
                className={`catgame-color-btn${player[activePart].color === color.id ? ' catgame-color-btn--active' : ''}`}
                onClick={() => updatePart('color', color.id)}
                title={color.label}
              >
                {/* 色のサンプル四角 */}
                <span className="catgame-color-swatch" style={{ background: color.hex }} />
                <span className="catgame-color-name">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 模様ボタン */}
        <div className="catgame-picker-section">
          <div className="catgame-picker-label">🐾 模様を選んでね</div>
          <div className="catgame-pattern-grid">
            {PATTERNS.map(pattern => (
              <button
                key={pattern.id}
                className={`catgame-pattern-btn${player[activePart].pattern === pattern.id ? ' catgame-pattern-btn--active' : ''}`}
                onClick={() => updatePart('pattern', pattern.id)}
              >
                {pattern.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 答え合わせボタン ── */}
      <button className="catgame-check-btn" onClick={checkAnswers}>
        🔍 答え合わせ！
      </button>
    </div>
  )
}

// ============================================================
// メインコンポーネント（CatGame）
// ============================================================
// ゲーム全体の状態を管理し、画面を切り替える
// App.jsx から import してページに追加するコンポーネント
// ============================================================
export default function CatGame() {
  // 現在の画面（'title' | 'game' | 'clear'）
  const [screen, setScreen] = useState('title')

  // 正解の組み合わせ（ゲーム開始時に生成する）
  const [answer, setAnswer] = useState(null)

  // ゲームスタート：正解を生成してゲーム画面へ
  const handleStart = () => {
    setAnswer(generateAnswer())
    setScreen('game')
  }

  // 全問正解：クリア画面へ
  const handleClear = () => {
    setScreen('clear')
  }

  // もう一度あそぶ：タイトルに戻る
  const handleRestart = () => {
    setAnswer(null)
    setScreen('title')
  }

  return (
    <section className="catgame-section">
      <div className="catgame-section-inner">

        {/* セクション見出し */}
        <div className="catgame-section-header">
          <h2 className="catgame-section-title">
            🐱 おまけ体験デモ：猫の色戻しパズルゲーム
          </h2>
          <p className="catgame-section-desc">
            お手本と同じ「色 × 模様」の組み合わせを当てよう！
          </p>
        </div>

        {/* ゲームカード */}
        <div className="catgame-card">
          {/* 画面の切り替え */}
          {screen === 'title' && (
            <TitleScreen onStart={handleStart} />
          )}
          {screen === 'game' && answer && (
            <GameScreen answer={answer} onClear={handleClear} />
          )}
          {screen === 'clear' && answer && (
            <ClearScreen answer={answer} onRestart={handleRestart} />
          )}
        </div>

      </div>
    </section>
  )
}
