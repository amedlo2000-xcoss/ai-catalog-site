import { useState, useEffect, useRef } from "react"
import "./App.css"
import DemoSection from "./components/DemoSection"


const DIAG_ITEMS = [
  { ic: "🌅", lb: "朝を整える" },
  { ic: "💼", lb: "仕事を効率化" },
  { ic: "✨", lb: "美容・ケア" },
  { ic: "📱", lb: "SNS発信" },
  { ic: "🎬", lb: "動画・創作" },
  { ic: "💡", lb: "副業・収益" },
]

const DIAG_RESULTS = {
  "朝を整える": [
    { ic: "🧘", name: "Notion AI", desc: "朝のルーティン・タスク整理に最適", url: "https://notion.so" },
    { ic: "⏰", name: "Reclaim AI", desc: "スケジュールを自動最適化", url: "https://reclaim.ai" },
    { ic: "📝", name: "ChatGPT", desc: "日記・振り返り・目標設定", url: "https://chat.openai.com" },
  ],
  "仕事を効率化": [
    { ic: "🤖", name: "ChatGPT", desc: "文書作成・メール・提案書を瞬時に生成", url: "https://chat.openai.com" },
    { ic: "📊", name: "Gamma", desc: "AIが資料・スライドを自動作成", url: "https://gamma.app" },
    { ic: "⚡", name: "Zapier AI", desc: "業務フローを自動化・連携", url: "https://zapier.com" },
  ],
  "美容・ケア": [
    { ic: "✨", name: "Perfect Corp", desc: "AIが似合うメイク・カラーを診断", url: "https://www.perfectcorp.com" },
    { ic: "🌿", name: "Yuka", desc: "化粧品・食品の成分をAI解析", url: "https://yuka.io" },
    { ic: "💆", name: "Calm AI", desc: "メンタルケア・睡眠改善をサポート", url: "https://www.calm.com" },
  ],
  "SNS発信": [
    { ic: "📱", name: "Buffer AI", desc: "投稿文・最適時間をAIが提案", url: "https://buffer.com" },
    { ic: "🎨", name: "Canva AI", desc: "SNS画像をAIで瞬時にデザイン", url: "https://canva.com" },
    { ic: "📈", name: "Lately AI", desc: "バズるコンテンツをAIが分析・生成", url: "https://www.lately.ai" },
  ],
  "動画・創作": [
    { ic: "🎬", name: "Sora", desc: "テキストから高品質動画を生成", url: "https://openai.com/sora" },
    { ic: "🎨", name: "Midjourney", desc: "プロ品質の画像をAIで生成", url: "https://midjourney.com" },
    { ic: "🎵", name: "Suno AI", desc: "AIが作詞・作曲・歌声まで生成", url: "https://suno.ai" },
  ],
  "副業・収益": [
    { ic: "💰", name: "ChatGPT", desc: "副業アイデア・コンテンツ量産", url: "https://chat.openai.com" },
    { ic: "🛒", name: "Shopify Magic", desc: "EC・商品説明をAIが自動生成", url: "https://shopify.com" },
    { ic: "📧", name: "Copy.ai", desc: "セールス文・広告コピーを量産", url: "https://copy.ai" },
  ],
}

const CATEGORIES = [
  { ic: "✨", name: "Beauty AI",     sub: "美容・セルフケア・健康", count: 14, color: "ci-1", key: "美容・ケア" },
  { ic: "💼", name: "Business AI",   sub: "仕事・提案・生産性",     count: 41, color: "ci-2", key: "仕事を効率化" },
  { ic: "📱", name: "SNS AI",        sub: "発信・運用・分析",       count: 18, color: "ci-3", key: "SNS発信" },
  { ic: "🎬", name: "Creator AI",    sub: "動画・画像・デザイン",   count: 32, color: "ci-4", key: "動画・創作" },
  { ic: "⚡", name: "Automation AI", sub: "自動化・効率化",         count: 27, color: "ci-5", key: "仕事を効率化" },
  { ic: "🌐", name: "Future AI",     sub: "次世代・先端",           count: 22, color: "ci-6", key: "副業・収益" },
]

const RANKINGS = [
  { rank: "01", gold: true,  ic: "🤖", name: "ChatGPT",    desc: "テキスト生成・対話・文書作成の定番",  tags: ["テキスト","無料プランあり"], badge: "急上昇", bc: "green",  url: "https://chat.openai.com" },
  { rank: "02", gold: false, ic: "🎨", name: "Midjourney", desc: "高品質な画像生成AI",                  tags: ["画像","SNS向け"],            badge: "注目",   bc: "blue",   url: "https://midjourney.com" },
  { rank: "03", gold: false, ic: "🎬", name: "Sora",       desc: "テキストから動画を生成する次世代AI",  tags: ["動画","2026注目"],           badge: "新着",   bc: "pink",   url: "https://openai.com/sora" },
  { rank: "04", gold: false, ic: "🎵", name: "Suno AI",    desc: "AIが音楽を作曲・生成",                tags: ["音楽","Creator向け"],        badge: "話題",   bc: "purple", url: "https://suno.ai" },
]

function cn(...classes) { return classes.filter(Boolean).join(" ") }

function Particles() {
  const DOTS = [
    { w:3, h:3, c:"rgba(196,181,253,.5)",  t:"20%", l:"15%", d:7,  delay:0   },
    { w:2, h:2, c:"rgba(125,211,252,.45)", t:"35%", r:"18%", d:9,  delay:1   },
    { w:3, h:3, c:"rgba(134,239,172,.4)",  t:"65%", l:"10%", d:8,  delay:2.5 },
    { w:2, h:2, c:"rgba(196,181,253,.35)", t:"72%", r:"22%", d:11, delay:.5  },
    { w:2, h:2, c:"rgba(249,168,212,.35)", t:"50%", l:"40%", d:6,  delay:3   },
  ]
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      {DOTS.map((d, i) => (
        <div key={i} className="p-dot" style={{
          width: d.w, height: d.h, background: d.c,
          top: d.t, left: d.l, right: d.r,
          animationDuration: `${d.d}s`, animationDelay: `${d.delay}s`,
        }} />
      ))}
    </div>
  )
}

function SceneCard({ gradient, label, tag, children }) {
  return (
    <div className="scene-card">
      <div className={cn("scene-img", gradient)}>{children}</div>
      <div className="scene-overlay" />
      <div className="scene-label">{label}</div>
      <div className="scene-tag">{tag}</div>
    </div>
  )
}

function StoryCard({ className, gradient, uiStat, uiVal, scene, title, sub, children }) {
  return (
    <div className={cn("story-card", className, gradient)}>
      <div className="light-bloom lb-warm" />
      <div className="light-bloom lb-cool" />
      {children}
      <div className="story-overlay" />
      {uiStat && (
        <div className="story-ui">
          <div className="ui-stat">{uiStat}</div>
          <div className="ui-val">{uiVal}</div>
        </div>
      )}
      <div className="story-content">
        <div className="story-scene">{scene}</div>
        <div className="story-title">{title}</div>
        {sub && <div className="story-sub">{sub}</div>}
      </div>
    </div>
  )
}

function DiagModal({ sel, onClose }) {
  const results = DIAG_RESULTS[sel] || []
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-label">AI診断結果</div>
            <div className="modal-title">「{sel}」におすすめのAI</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-list">
          {results.map(({ ic, name, desc, url }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="modal-card">
              <div className="modal-ic">{ic}</div>
              <div className="modal-info">
                <div className="modal-name">{name}</div>
                <div className="modal-desc">{desc}</div>
              </div>
              <div className="modal-arrow">→</div>
            </a>
          ))}
        </div>
        <div className="modal-footer">
          <button className="modal-consult" onClick={() => { onClose(); document.getElementById("consult").scrollIntoView({ behavior: "smooth" }) }}>
            無料相談する
          </button>
        </div>
      </div>
    </div>
  )
}

function ConsultForm() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch("https://formspree.io/f/xyzknqvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) setSent(true)
  }

  if (sent) return (
    <div className="consult-sent">
      <div className="sent-ic">✉️</div>
      <div className="sent-title">送信完了しました</div>
      <div className="sent-sub">2営業日以内にご連絡いたします。</div>
    </div>
  )

  return (
    <form className="consult-form" onSubmit={handleSubmit}>
      <input className="form-input" type="text" placeholder="お名前" required
        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="form-input" type="email" placeholder="メールアドレス" required
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <textarea className="form-textarea" placeholder="ご相談内容" rows={4} required
        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      <button className="form-submit" type="submit">無料相談を申し込む →</button>
    </form>
  )
}

export default function App() {
  const [diagSel, setDiagSel] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  function handleDiag(lb) {
    setDiagSel(lb)
    setModalOpen(true)
  }

  function scrollToConsult() {
    document.getElementById("consult").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="app-root">
      {modalOpen && diagSel && <DiagModal sel={diagSel} onClose={() => setModalOpen(false)} />}

      <section className={cn("hero", heroVisible && "hero--visible")} ref={heroRef}>
        <Particles />
        <div className="hero-eyebrow"><span className="eyebrow-dot" />AIのある、あたらしい日常へ</div>
        <h1 className="hero-h1">AIと共に生きる<br /><em>未来の暮らしを、今日から。</em></h1>
        <p className="hero-sub">あなたの毎日に、最適なAIを。<br />仕事も、美容も、暮らしも——静かに、豊かに。</p>

        <div className="hero-scene">
          <SceneCard gradient="sp-hero" label="朝の暮らし" tag="HERO">
            <svg viewBox="0 0 160 120" className="scene-svg" aria-hidden="true">
              <ellipse cx="80" cy="140" rx="100" ry="60" fill="rgba(147,139,250,.12)" />
              <ellipse cx="120" cy="100" rx="60" ry="40" fill="rgba(251,191,36,.06)" />
              <rect x="0"   y="70" width="20" height="50" rx="1" fill="rgba(255,255,255,.05)" />
              <rect x="22"  y="55" width="14" height="65" rx="1" fill="rgba(255,255,255,.06)" />
              <rect x="38"  y="65" width="18" height="55" rx="1" fill="rgba(255,255,255,.04)" />
              <rect x="110" y="60" width="16" height="60" rx="1" fill="rgba(255,255,255,.05)" />
              <rect x="128" y="50" width="20" height="70" rx="1" fill="rgba(255,255,255,.06)" />
              <ellipse cx="80" cy="55" rx="9" ry="11" fill="rgba(255,255,255,.09)" />
              <path d="M68 70 Q80 110 92 70" fill="rgba(255,255,255,.07)" />
              <rect x="96" y="28" width="50" height="22" rx="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.18)" strokeWidth=".5" />
              <text x="121" y="38" textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="8" fontFamily="Inter">AI Concierge</text>
              <text x="121" y="46" textAnchor="middle" fill="rgba(134,239,172,.7)" fontSize="7" fontFamily="Inter">✦ オンライン</text>
            </svg>
          </SceneCard>
          <SceneCard gradient="sp-work" label="仕事・ビジネス" tag="Business AI">
            <svg viewBox="0 0 160 120" className="scene-svg" aria-hidden="true">
              <ellipse cx="60" cy="80" rx="80" ry="50" fill="rgba(134,239,172,.07)" />
              <rect x="30" y="50" width="70" height="45" rx="4" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" strokeWidth=".5" />
              <rect x="35" y="55" width="60" height="32" rx="2" fill="rgba(99,102,241,.12)" />
              <rect x="39" y="60" width="30" height="2" rx="1" fill="rgba(255,255,255,.25)" />
              <rect x="39" y="65" width="44" height="2" rx="1" fill="rgba(255,255,255,.15)" />
              <rect x="98" y="38" width="48" height="32" rx="6" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.18)" strokeWidth=".5" />
              <text x="122" y="52" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="7" fontFamily="Inter">生産性</text>
              <text x="122" y="63" textAnchor="middle" fill="rgba(134,239,172,.85)" fontSize="12" fontFamily="Inter" fontWeight="300">+42%</text>
            </svg>
          </SceneCard>
          <SceneCard gradient="sp-beauty" label="美容・セルフケア" tag="Beauty AI">
            <svg viewBox="0 0 160 120" className="scene-svg" aria-hidden="true">
              <ellipse cx="80" cy="60" rx="70" ry="60" fill="rgba(249,168,212,.08)" />
              <ellipse cx="80" cy="65" rx="35" ry="42" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" strokeWidth=".5" />
              <ellipse cx="80" cy="55" rx="16" ry="20" fill="rgba(255,255,255,.06)" />
              <line x1="50" y1="55" x2="115" y2="55" stroke="rgba(196,181,253,.25)" strokeWidth=".5" strokeDasharray="3,4" />
              <rect x="96" y="36" width="46" height="20" rx="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.18)" strokeWidth=".5" />
              <text x="119" y="44" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="7" fontFamily="Inter">Beauty AI</text>
              <text x="119" y="52" textAnchor="middle" fill="rgba(249,168,212,.8)" fontSize="8" fontFamily="Inter">似合う色</text>
            </svg>
          </SceneCard>
        </div>

        <div className="cta-wrap">
          <button className="btn-main" onClick={() => document.getElementById("diag").scrollIntoView({ behavior: "smooth" })}>AI診断を始める</button>
          <button className="btn-sub" onClick={() => document.getElementById("ranking").scrollIntoView({ behavior: "smooth" })}>AIを探す</button>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="sec-label">Life with AI</div>
        <h2 className="sec-title">AIのある、日常の風景</h2>
        <p className="sec-desc">働く・学ぶ・整える・繋がる。<br />あなたの毎日に、静かに寄り添うAIたち。</p>
        <div className="story-grid">
          <StoryCard className="large" gradient="sc-work" uiStat="AI処理中" uiVal="+42%" scene="Business AI" title="仕事が、もっと自分のものになる" sub="AIが整理・提案・実行まで、静かにサポート">
            <svg viewBox="0 0 680 200" className="story-svg" aria-hidden="true">
              <ellipse cx="200" cy="100" rx="200" ry="120" fill="rgba(134,239,172,.06)" />
              <ellipse cx="500" cy="80"  rx="160" ry="100" fill="rgba(147,139,250,.06)" />
              <rect x="80" y="80" width="300" height="90" rx="6" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.08)" strokeWidth=".5" />
              <rect x="90" y="90" width="280" height="72" rx="3" fill="rgba(99,102,241,.1)" />
              <rect x="100" y="100" width="120" height="3" rx="1" fill="rgba(255,255,255,.2)" />
              <rect x="100" y="108" width="180" height="2" rx="1" fill="rgba(255,255,255,.12)" />
              <rect x="420" y="60" width="160" height="90" rx="12" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.14)" strokeWidth=".5" />
              <text x="440" y="82"  fill="rgba(255,255,255,.35)" fontSize="10" fontFamily="Inter">今日のタスク</text>
              <text x="440" y="100" fill="rgba(255,255,255,.7)"  fontSize="13" fontFamily="Inter" fontWeight="300">AIが整理中...</text>
              <circle cx="444" cy="116" r="3" fill="rgba(134,239,172,.7)" />
              <text x="452" y="119" fill="rgba(134,239,172,.6)"  fontSize="9" fontFamily="Inter">3件 完了</text>
              <circle cx="444" cy="130" r="3" fill="rgba(196,181,253,.5)" />
              <text x="452" y="133" fill="rgba(196,181,253,.5)"  fontSize="9" fontFamily="Inter">2件 進行中</text>
            </svg>
          </StoryCard>
          <div className="story-two">
            <StoryCard className="small" gradient="sc-beauty" scene="Beauty AI" title="美容を、AIと一緒に">
              <svg viewBox="0 0 300 150" className="story-svg" aria-hidden="true">
                <ellipse cx="150" cy="75" rx="150" ry="90" fill="rgba(249,168,212,.06)" />
                <ellipse cx="150" cy="75" rx="55" ry="65" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)" strokeWidth=".5" />
                <rect x="180" y="38" width="90" height="38" rx="8" fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.16)" strokeWidth=".5" />
                <text x="225" y="54" textAnchor="middle" fill="rgba(255,255,255,.4)"  fontSize="9"  fontFamily="Inter">似合う色味</text>
                <text x="225" y="68" textAnchor="middle" fill="rgba(249,168,212,.85)" fontSize="13" fontFamily="Inter" fontWeight="300">Spring</text>
              </svg>
            </StoryCard>
            <StoryCard className="small" gradient="sc-sns" scene="SNS AI" title="発信が、もっと自由に">
              <svg viewBox="0 0 300 150" className="story-svg" aria-hidden="true">
                <ellipse cx="150" cy="75" rx="150" ry="90" fill="rgba(147,139,250,.06)" />
                <rect x="110" y="20" width="80" height="110" rx="10" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" strokeWidth=".5" />
                <rect x="116" y="28" width="68" height="80" rx="4" fill="rgba(99,102,241,.12)" />
                <rect x="195" y="45" width="70" height="35" rx="7" fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.16)" strokeWidth=".5" />
                <text x="230" y="59" textAnchor="middle" fill="rgba(255,255,255,.4)"  fontSize="8"  fontFamily="Inter">いいね数</text>
                <text x="230" y="72" textAnchor="middle" fill="rgba(147,197,253,.85)" fontSize="12" fontFamily="Inter" fontWeight="300">3.2万</text>
              </svg>
            </StoryCard>
          </div>
          <StoryCard className="medium" gradient="sc-evening" scene="Community AI" title="AIを通じて、人と繋がる" sub="学ぶ・シェアする・成長する——AIコミュニティへ">
            <svg viewBox="0 0 680 160" className="story-svg" aria-hidden="true">
              <ellipse cx="340" cy="80" rx="300" ry="100" fill="rgba(147,139,250,.06)" />
              {[240,290,340,390,440].map((cx, i) => (
                <circle key={i} cx={cx} cy="80" r={cx===340?22:20}
                  fill={cx===340?"rgba(196,181,253,.1)":"rgba(255,255,255,.05)"}
                  stroke={cx===340?"rgba(196,181,253,.25)":"rgba(255,255,255,.09)"}
                  strokeWidth=".5" />
              ))}
              <text x="340" y="77" textAnchor="middle" fill="rgba(196,181,253,.7)" fontSize="9" fontFamily="Inter">AI</text>
              <text x="340" y="87" textAnchor="middle" fill="rgba(196,181,253,.5)" fontSize="7" fontFamily="Inter">Hub</text>
            </svg>
          </StoryCard>
        </div>
      </section>

      <div className="divider" />

      <DemoSection />

      <div className="divider" />

      <section className="section" id="diag">
        <div className="sec-label">AI Concierge</div>
        <h2 className="sec-title">あなたに合うAIを診断</h2>
        <p className="sec-desc">気になる暮らしのシーンを選ぶだけ。</p>
        <div className="diag-card">
          <p className="diag-q">今、どんな毎日をつくりたいですか？</p>
          <div className="diag-grid">
            {DIAG_ITEMS.map(({ ic, lb }) => (
              <button key={lb} className={cn("diag-chip", diagSel === lb && "on")} onClick={() => handleDiag(lb)}>
                <div className="ic">{ic}</div>
                <div className="lb">{lb}</div>
              </button>
            ))}
          </div>
          <p className="diag-hint">タップすると最適なAIをご提案します</p>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="sec-label">Categories</div>
        <h2 className="sec-title">暮らしのシーンで選ぶ</h2>
        <p className="sec-desc">ジャンルではなく、あなたの毎日から探す。</p>
        <div className="cat-list">
          {CATEGORIES.map(({ ic, name, sub, count, color, key }) => (
            <button key={name} className="cat-row" onClick={() => handleDiag(key)}>
              <div className={cn("cat-icon", color)}>{ic}</div>
              <div className="cat-text">
                <div className="cat-name">{name}</div>
                <div className="cat-sub">{sub} / {count}ツール</div>
              </div>
              <span className="cat-arr">›</span>
            </button>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="ranking">
        <div className="rank-header">
          <div className="sec-label" style={{ marginBottom: 0 }}>Ranking</div>
          <span className="rank-live-badge">今急上昇</span>
        </div>
        <h2 className="sec-title">2026 注目のAI</h2>
        <p className="sec-desc">日本で今もっとも使われているAIツール</p>
        <div className="rank-list">
          {RANKINGS.map(({ rank, gold, ic, name, desc, tags, badge, bc, url }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="rank-row">
              <div className={cn("rank-num", gold && "gold")}>{rank}</div>
              <div className={cn("rank-logo", `ci-${bc==="green"?3:bc==="blue"?2:bc==="pink"?1:4}`)}>
                {ic}
              </div>
              <div className="rank-info">
                <div className="rank-name">{name}</div>
                <div className="rank-desc">{desc}</div>
                <div className="rank-tags">
                  {tags.map(t => <span key={t} className="rtag">{t}</span>)}
                </div>
              </div>
              <div className={cn("rank-badge-up", `bc-${bc}`)}>↑ {badge}</div>
            </a>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="consult">
        <div className="sec-label">Free Consultation</div>
        <h2 className="sec-title">無料相談</h2>
        <p className="sec-desc">AIの導入・活用についてお気軽にご相談ください。</p>
        <ConsultForm />
      </section>

      <div className="divider" />

      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-border" />
        <h2 className="cta-h">AIと、もっと自由に。<br />あなたらしい未来へ。</h2>
        <p className="cta-p">まずは無料診断から。あなたの毎日に合うAIを見つけましょう。</p>
        <button className="cta-btn" onClick={scrollToConsult}>今すぐ始める →</button>
      </section>

      <footer className="footer">
        <div className="ft-brand">AIのある未来生活</div>
        <nav className="ft-links">
          <span className="ft-link" onClick={() => document.getElementById("ranking").scrollIntoView({ behavior: "smooth" })}>AIを探す</span>
          <span className="ft-link" onClick={scrollToConsult}>無料相談</span>
          <span className="ft-link" onClick={() => document.getElementById("diag").scrollIntoView({ behavior: "smooth" })}>AI診断</span>
        </nav>
      </footer>
    </div>
  )
}


