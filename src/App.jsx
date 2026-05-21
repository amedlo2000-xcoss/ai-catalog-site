import { useState, useEffect, useRef } from "react"
import "./App.css"

// ── Static data ──────────────────────────────────────────────────────

const WORLD_ITEMS = [
  { label: "想い", angle: -25, dist: 1.0, color: "rgba(196,181,253,.9)" },
  { label: "価値観", angle: 15, dist: 0.85, color: "rgba(249,168,212,.9)" },
  { label: "スキル", angle: 55, dist: 1.0, color: "rgba(125,211,252,.9)" },
  { label: "商品", angle: -60, dist: 0.9, color: "rgba(134,239,172,.9)" },
  { label: "活動", angle: 90, dist: 0.85, color: "rgba(251,191,36,.9)" },
  { label: "人との繋がり", angle: -90, dist: 0.75, color: "rgba(196,181,253,.9)" },
  { label: "ストーリー", angle: 130, dist: 0.9, color: "rgba(249,168,212,.9)" },
]

const NEWS_CAT_COLORS = {
  "生成AI": ["rgba(196,181,253,.8)", "rgba(196,181,253,.12)", "rgba(196,181,253,.25)"],
  "動画AI": ["rgba(249,168,212,.8)", "rgba(249,168,212,.1)", "rgba(249,168,212,.25)"],
  "SNS AI": ["rgba(125,211,252,.8)", "rgba(125,211,252,.1)", "rgba(125,211,252,.25)"],
  "画像生成AI": ["rgba(167,139,250,.8)", "rgba(167,139,250,.1)", "rgba(167,139,250,.25)"],
  "店舗DX": ["rgba(134,239,172,.8)", "rgba(134,239,172,.1)", "rgba(134,239,172,.25)"],
  "海外AI": ["rgba(251,191,36,.8)", "rgba(251,191,36,.1)", "rgba(251,191,36,.25)"],
  "AI副業": ["rgba(52,211,153,.8)", "rgba(52,211,153,.1)", "rgba(52,211,153,.25)"],
  "AIマーケティング": ["rgba(249,115,22,.7)", "rgba(249,115,22,.1)", "rgba(249,115,22,.25)"],
}

const NEWS_ITEMS = [
  { cat: "生成AI", title: "Claude 4の推論精度が大幅向上。複雑なタスクも一発解決", time: "2時間前", src: "Anthropic Blog" },
  { cat: "動画AI", title: "Soraが商用利用解禁。プロレベルの動画制作がAIで実現", time: "5時間前", src: "OpenAI News" },
  { cat: "SNS AI", title: "InstagramにAI投稿最適化機能が追加。エンゲージメント率2倍", time: "8時間前", src: "Meta公式" },
  { cat: "画像生成AI", title: "Midjourney v7公開。より自然な人物・商品画像が生成可能に", time: "1日前", src: "MJ公式" },
  { cat: "店舗DX", title: "AIレジ・接客ロボット導入店舗が全国で急増。人件費30%削減", time: "1日前", src: "日経AI" },
  { cat: "海外AI", title: "中国発AIアシスタントが世界シェアを急拡大。日本市場参入へ", time: "2日前", src: "Tech Watch" },
  { cat: "AI副業", title: "AI×副業で月収100万円達成者が続出。在宅での新常識", time: "2日前", src: "副業メディア" },
  { cat: "AIマーケティング", title: "AIマーケで広告費50%削減・CTR3倍の事例が国内企業から", time: "3日前", src: "MA Journal" },
]

const EXPERIENCE_CATALOG = [
  { id: 1, ic: "📱", title: "SNS診断", desc: "投稿作成・導線設計・集客戦略をAIが提案するSNS支援体験。Instagram・X・TikTok対応。", tags: ["SNS", "自動化", "集客"], url: "https://sns-diagnosis-one.vercel.app", ready: true },
  { id: 2, ic: "👗", title: "バーチャル着せかえ", desc: "服装提案・着せ替え・クローゼット連携によるコーデ提案体験。あなたに似合うスタイルをAIが提案。", tags: ["ファッション", "コーデ", "スタイル"], url: null, ready: false },
  { id: 3, ic: "🪞", title: "第一印象診断", desc: "第一印象・魅力・改善点をカルテ形式で分析する美容診断体験。SNS・ビジネスに活かせる。", tags: ["美容", "顔分析", "カルテ"], url: null, ready: false },
  { id: 4, ic: "🏪", title: "店舗診断", desc: "店舗の集客・導線・SNS戦略をAIが診断し具体的な改善策を提案する実践的体験。", tags: ["店舗DX", "集客", "診断"], url: null, ready: false },
  { id: 5, ic: "✂️", title: "3D型紙生成", desc: "頭の中のデザインを3D化し、型紙設計へつなげる未来型制作体験。ファッション×AIの最前線。", tags: ["型紙", "3D", "デザイン"], url: null, ready: false },
  { id: 6, ic: "🎬", title: "シネマWEB体験", desc: "近未来型LP・世界観デザイン・動きのあるWEB表現を生成する制作体験。映像×WEBの融合。", tags: ["WEB", "LP", "映像"], url: null, ready: false },
]

const WORRIES = [
  { ic: "😔", text: "強みが伝えられない", sub: "自分の価値が相手に伝わらない…" },
  { ic: "📉", text: "集客が安定しない", sub: "月によって収入が大きくブレる…" },
  { ic: "😓", text: "SNSで成果が出ない", sub: "投稿しても反応がない…" },
  { ic: "💸", text: "収益化が分からない", sub: "どう売ればいいか見えない…" },
  { ic: "🤖", text: "AIに遅れを感じている", sub: "周りが使いこなしていて焦る…" },
]

const FIVE_STEPS = [
  { step: 1, title: "世界観の可視化", desc: "あなたの想い・価値観・強みをAIが言語化。独自の世界観として形にします。", ic: "🌟", color: "rgba(196,181,253,.9)" },
  { step: 2, title: "価値の整理", desc: "スキル・実績・商品を整理し、誰に何を届けるかを明確にします。", ic: "💎", color: "rgba(125,211,252,.9)" },
  { step: 3, title: "導線構築", desc: "SNS・LP・LINE・WEBをつなぐ集客・販売の導線を設計します。", ic: "🗺️", color: "rgba(134,239,172,.9)" },
  { step: 4, title: "想いを届ける", desc: "AIを使って発信・集客・顧客関係構築を自動化・効率化します。", ic: "📡", color: "rgba(249,168,212,.9)" },
  { step: 5, title: "継続収益化", desc: "仕組みを整え、月次収益として安定させる継続収益モデルを構築します。", ic: "🔄", color: "rgba(251,191,36,.9)" },
]

const AI_SERVICES = [
  { ic: "🤖", name: "ChatGPT", desc: "テキスト生成・対話・分析の定番AI", color: "svc-1", url: "https://chat.openai.com" },
  { ic: "🧠", name: "Claude", desc: "高精度な推論・長文処理に強いAI", color: "svc-2", url: "https://claude.ai" },
  { ic: "💫", name: "Gemini", desc: "Googleのマルチモーダル次世代AI", color: "svc-3", url: "https://gemini.google.com" },
  { ic: "🎨", name: "Midjourney", desc: "プロ品質の画像生成AI", color: "svc-4", url: "https://midjourney.com" },
  { ic: "🎬", name: "Sora", desc: "テキストから高品質動画を生成", color: "svc-5", url: "https://openai.com/sora" },
  { ic: "🎵", name: "Suno AI", desc: "AIが作詞・作曲・歌声まで生成", color: "svc-6", url: "https://suno.ai" },
  { ic: "🎞️", name: "Runway", desc: "動画編集・生成のクリエイターAI", color: "svc-1", url: "https://runwayml.com" },
  { ic: "🔍", name: "Perplexity", desc: "AIが情報収集・リサーチを自動化", color: "svc-2", url: "https://perplexity.ai" },
  { ic: "🎭", name: "Canva AI", desc: "デザインをAIで瞬時に生成・編集", color: "svc-3", url: "https://canva.com" },
  { ic: "📝", name: "Notion AI", desc: "ノート・DB・タスクをAIで管理", color: "svc-4", url: "https://notion.so" },
]

const AI_CATEGORIES = [
  { ic: "✨", name: "Beauty AI", sub: "美容・セルフケア・健康", count: 14, color: "ci-1" },
  { ic: "💼", name: "Business AI", sub: "仕事・提案・生産性", count: 41, color: "ci-2" },
  { ic: "📱", name: "SNS AI", sub: "発信・運用・分析", count: 18, color: "ci-3" },
  { ic: "🎬", name: "Creator AI", sub: "動画・画像・デザイン", count: 32, color: "ci-4" },
  { ic: "⚡", name: "Automation AI", sub: "自動化・効率化", count: 27, color: "ci-5" },
  { ic: "🌐", name: "Future AI", sub: "次世代・先端技術", count: 22, color: "ci-6" },
]

const TAG_COLORS = [
  "rgba(196,181,253,.85)",
  "rgba(125,211,252,.85)",
  "rgba(134,239,172,.85)",
  "rgba(249,168,212,.85)",
  "rgba(251,191,36,.85)",
]

// ── Utility ──────────────────────────────────────────────────────────

function cn(...classes) { return classes.filter(Boolean).join(" ") }

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ── Aurora background ─────────────────────────────────────────────────

function AuroraBg() {
  return (
    <div className="aurora-root" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="orb orb-d" />
      {[
        { w:3, h:3, c:"rgba(196,181,253,.5)", t:"18%", l:"12%", d:7, dl:0 },
        { w:2, h:2, c:"rgba(125,211,252,.4)", t:"32%", r:"15%", d:9, dl:1 },
        { w:3, h:3, c:"rgba(134,239,172,.4)", t:"62%", l:"8%", d:8, dl:2.5 },
        { w:2, h:2, c:"rgba(249,168,212,.35)", t:"70%", r:"20%", d:11, dl:.5 },
        { w:2, h:2, c:"rgba(251,191,36,.3)", t:"48%", l:"38%", d:6, dl:3 },
      ].map((p,i) => (
        <div key={i} className="pdot" style={{
          width: p.w, height: p.h, background: p.c,
          top: p.t, left: p.l, right: p.r,
          animationDuration: `${p.d}s`, animationDelay: `${p.dl}s`,
        }} />
      ))}
    </div>
  )
}

// ── World-view floating elements ──────────────────────────────────────

function WorldView() {
  return (
    <div className="worldview-wrap" aria-hidden="true">
      <div className="worldview-center">
        <div className="wv-core">
          <span className="wv-core-label">あなたの<br />世界観</span>
        </div>
        {WORLD_ITEMS.map((item, i) => {
          const rad = (item.angle * Math.PI) / 180
          const r = 130 * item.dist
          const x = Math.cos(rad) * r
          const y = Math.sin(rad) * r
          return (
            <div
              key={i}
              className="wv-chip"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                color: item.color,
                borderColor: item.color.replace(".9)", ".35)"),
                background: item.color.replace(".9)", ".08)"),
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {item.label}
            </div>
          )
        })}
        <svg className="wv-lines" viewBox="-200 -200 400 400" aria-hidden="true">
          {WORLD_ITEMS.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180
            const r = 130 * item.dist
            const x = Math.cos(rad) * r
            const y = Math.sin(rad) * r
            return (
              <line
                key={i}
                x1="0" y1="0"
                x2={x} y2={y}
                stroke={item.color.replace(".9)", ".2)")}
                strokeWidth="0.5"
                strokeDasharray="4,6"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// ── ConsultForm ───────────────────────────────────────────────────────

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
      <textarea className="form-textarea" placeholder="ご相談内容（AIの活用・収益化・世界観づくり等、お気軽にどうぞ）" rows={4} required
        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      <button className="form-submit" type="submit">無料相談を申し込む →</button>
    </form>
  )
}

// ── Main App ──────────────────────────────────────────────────────────

export default function App() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [expModal, setExpModal] = useState(null)
  const [newsFilter, setNewsFilter] = useState("すべて")
  const [newsVisible, setNewsVisible] = useState(6)

  const [newsRef, newsInView] = useInView()
  const [expRef, expInView] = useInView()
  const [worriesRef, worriesInView] = useInView()
  const [stepsRef, stepsInView] = useInView()
  const [svcRef, svcInView] = useInView()
  const [catRef, catInView] = useInView()

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  const filteredNews = newsFilter === "すべて"
    ? NEWS_ITEMS
    : NEWS_ITEMS.filter(n => n.cat === newsFilter)

  const newsCategories = ["すべて", ...Object.keys(NEWS_CAT_COLORS)]

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="app-root">
      {/* ① HERO */}
      <section className={cn("hero", heroVisible && "hero--visible")} id="hero">
        <AuroraBg />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              あなたの世界観を、AIで資産に
            </div>
            <h1 className="hero-h1">
              あなたの世界観を<br />
              可視化して、<br />
              <em>AIで資金生成</em><br />
              しませんか？
            </h1>
            <p className="hero-sub">
              想い・価値観・スキル・商品——<br />
              あなたが持つすべてをAIがつなぎ、<br />
              継続的な収益へと変えていきます。
            </p>
            <div className="hero-ctas">
              <button className="btn-main" onClick={() => scrollTo("experience")}>AI体験を見る</button>
              <button className="btn-sub" onClick={() => scrollTo("steps")}>5STEPを見る</button>
            </div>
            <div className="hero-stats">
              {[["10+", "AI体験コンテンツ"], ["5", "収益化STEP"], ["無料", "初回相談"]].map(([v, l]) => (
                <div key={l} className="hstat">
                  <div className="hstat-val">{v}</div>
                  <div className="hstat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <WorldView />
          </div>
        </div>
        <div className="hero-scroll-hint" onClick={() => scrollTo("news")}>
          <span>scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ② AIニュース */}
      <section className="section" id="news" ref={newsRef}>
        <div className={cn("sec-inner", newsInView && "fade-in")}>
          <div className="sec-eyebrow">AI News</div>
          <h2 className="sec-title">
            <span className="title-hand">最新AIニュース</span>
          </h2>
          <p className="sec-desc">AIの最前線を毎日更新。いち早くキャッチして、先手を打とう。</p>

          <div className="news-filter-wrap">
            {newsCategories.map(cat => {
              const colors = NEWS_CAT_COLORS[cat]
              const isOn = newsFilter === cat
              return (
                <button
                  key={cat}
                  className={cn("news-filter-chip", isOn && "on")}
                  style={isOn && colors ? {
                    color: colors[0],
                    background: colors[1],
                    borderColor: colors[2],
                  } : {}}
                  onClick={() => { setNewsFilter(cat); setNewsVisible(6) }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="news-grid">
            {filteredNews.slice(0, newsVisible).map((n, i) => {
              const colors = NEWS_CAT_COLORS[n.cat] || [
                "rgba(255,255,255,.5)",
                "rgba(255,255,255,.06)",
                "rgba(255,255,255,.15)",
              ]
              return (
                <div key={i} className="news-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="news-card-top">
                    <span
                      className="news-cat-badge"
                      style={{ color: colors[0], background: colors[1], borderColor: colors[2] }}
                    >
                      {n.cat}
                    </span>
                    <span className="news-time">{n.time}</span>
                  </div>
                  <p className="news-title">{n.title}</p>
                  <div className="news-src">{n.src}</div>
                </div>
              )
            })}
          </div>

          {newsVisible < filteredNews.length && (
            <div className="more-wrap">
              <button className="more-btn" onClick={() => setNewsVisible(v => v + 4)}>
                もっと見る
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* ③ AI体験カタログ */}
      <section className="section" id="experience" ref={expRef}>
        <div className={cn("sec-inner", expInView && "fade-in")}>
          <div className="sec-eyebrow">Experience Catalog</div>
          <h2 className="sec-title">
            <span className="title-hand">AI体験カタログ</span>
          </h2>
          <p className="sec-desc">説明だけじゃない。実際に触って、AIの可能性を体感してください。</p>

          <div className="exp-grid">
            {EXPERIENCE_CATALOG.map((item, i) => (
              <div
                key={item.id}
                className="exp-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => setExpModal(item)}
              >
                <div className="exp-card-header">
                  <span className="exp-num">#{String(item.id).padStart(2, "0")}</span>
                  <span className={cn("exp-badge", item.ready ? "badge-live" : "badge-soon")}>
                    {item.ready ? "● LIVE" : "準備中"}
                  </span>
                </div>
                <div className="exp-ic">{item.ic}</div>
                <div className="exp-title">{item.title}</div>
                <p className="exp-desc">{item.desc}</p>
                <div className="exp-tags">
                  {item.tags.map((t, j) => (
                    <span key={t} className="exp-tag" style={{ color: TAG_COLORS[j % TAG_COLORS.length] }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={cn("exp-cta", item.ready ? "exp-cta--live" : "exp-cta--soon")}>
                  {item.ready ? "体験する →" : "近日公開"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {expModal && (
        <div className="modal-overlay" onClick={() => setExpModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-eyebrow">Experience Catalog</div>
                <div className="modal-title">{expModal.title}</div>
              </div>
              <button className="modal-close" onClick={() => setExpModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-ic-lg">{expModal.ic}</div>
              <p className="modal-desc">{expModal.desc}</p>
              <div className="modal-tags">
                {expModal.tags.map((t, i) => (
                  <span key={t} className="exp-tag" style={{ color: TAG_COLORS[i % TAG_COLORS.length] }}>{t}</span>
                ))}
              </div>
              {expModal.ready && expModal.url ? (
                <a href={expModal.url} target="_blank" rel="noopener noreferrer" className="modal-start-btn">
                  体験を始める →
                </a>
              ) : (
                <div className="modal-soon">
                  <span>🚧</span> この体験は現在準備中です
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="divider" />

      {/* ④ 悩みセクション + AIで出来ること */}
      <section className="section" id="worries" ref={worriesRef}>
        <div className={cn("sec-inner", worriesInView && "fade-in")}>
          <div className="sec-eyebrow">Your Worries</div>
          <h2 className="sec-title">
            <span className="title-hand">こんなお悩みありませんか？</span>
          </h2>
          <div className="worries-grid">
            {WORRIES.map((w, i) => (
              <div key={i} className="worry-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="worry-ic">{w.ic}</div>
                <div className="worry-text">{w.text}</div>
                <div className="worry-sub">{w.sub}</div>
              </div>
            ))}
          </div>

          <div className="worry-resolve">
            <div className="resolve-arrow">↓</div>
            <div className="resolve-text">AIを活用することで、これらの悩みが解決できます</div>
          </div>

          <div className="sec-eyebrow" style={{ marginTop: "52px" }}>What AI Can Do</div>
          <h2 className="sec-title">
            <span className="title-hand">AIで出来ること</span>
          </h2>
          <p className="sec-desc">あなたのビジネス・発信・収益化をAIが強力にサポートします。</p>
          <div className="whatai-grid">
            {[
              { ic: "✍️", title: "コンテンツ自動生成", desc: "ブログ・SNS・動画台本をAIが瞬時に作成" },
              { ic: "🎨", title: "デザイン・画像生成", desc: "プロ品質のビジュアルをAIで制作" },
              { ic: "📊", title: "データ分析・予測", desc: "売上・行動データをAIが分析・可視化" },
              { ic: "🤝", title: "顧客対応の自動化", desc: "24時間対応のAIチャット・LINE自動化" },
              { ic: "🌐", title: "多言語コンテンツ展開", desc: "AIが即座に翻訳・ローカライズ対応" },
              { ic: "💰", title: "収益化戦略の最適化", desc: "AIが最適な商品・価格・導線を提案" },
            ].map((item, i) => (
              <div key={i} className="whatai-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="whatai-ic">{item.ic}</div>
                <div className="whatai-title">{item.title}</div>
                <div className="whatai-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ⑤ AI収益化5STEP */}
      <section className="section steps-section" id="steps" ref={stepsRef}>
        <div className={cn("sec-inner", stepsInView && "fade-in")}>
          <div className="sec-eyebrow">AI Revenue</div>
          <h2 className="sec-title">
            <span className="title-hand">AI収益化5STEP</span>
          </h2>
          <p className="sec-desc">世界観の可視化から継続収益まで、5つのステップで仕組みを構築します。</p>

          <div className="steps-timeline">
            {FIVE_STEPS.map((s, i) => (
              <div key={s.step} className="step-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-left">
                  <div className="step-num" style={{ color: s.color, borderColor: s.color.replace(".9)", ".3)") }}>
                    STEP<br />{s.step}
                  </div>
                  {i < FIVE_STEPS.length - 1 && (
                    <div className="step-line" style={{ background: `linear-gradient(${s.color.replace(".9)", ".4)")}, transparent)` }} />
                  )}
                </div>
                <div className="step-card" style={{ borderColor: s.color.replace(".9)", ".18)") }}>
                  <div className="step-ic-wrap">
                    <span className="step-ic">{s.ic}</span>
                  </div>
                  <div className="step-content">
                    <div className="step-title" style={{ color: s.color }}>{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="steps-cta">
            <button className="btn-main" onClick={() => scrollTo("consult")}>
              まずは無料相談する →
            </button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ⑥ AIサービス紹介 */}
      <section className="section" id="services" ref={svcRef}>
        <div className={cn("sec-inner", svcInView && "fade-in")}>
          <div className="sec-eyebrow">AI Services</div>
          <h2 className="sec-title">
            <span className="title-hand">AIサービス紹介</span>
          </h2>
          <p className="sec-desc">世界の最前線AIツールを厳選。目的に合わせて使い分けよう。</p>

          <div className="svc-grid">
            {AI_SERVICES.map((svc, i) => (
              <a
                key={svc.name}
                href={svc.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("svc-card", svc.color)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="svc-ic">{svc.ic}</div>
                <div className="svc-name">{svc.name}</div>
                <div className="svc-desc">{svc.desc}</div>
                <div className="svc-arrow">→</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ⑦ AIカテゴリ */}
      <section className="section" id="categories" ref={catRef}>
        <div className={cn("sec-inner", catInView && "fade-in")}>
          <div className="sec-eyebrow">Categories</div>
          <h2 className="sec-title">
            <span className="title-hand">AIカテゴリ</span>
          </h2>
          <p className="sec-desc">ジャンルではなく、あなたの目的から探す。</p>

          <div className="cat-grid">
            {AI_CATEGORIES.map((c, i) => (
              <div key={c.name} className="cat-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={cn("cat-icon", c.color)}>{c.ic}</div>
                <div className="cat-info">
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-sub">{c.sub}</div>
                </div>
                <div className="cat-count">{c.count}<span>ツール</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ⑧ 無料相談 */}
      <section className="section" id="consult">
        <div className="sec-inner">
          <div className="sec-eyebrow">Free Consultation</div>
          <h2 className="sec-title">
            <span className="title-hand">無料相談</span>
          </h2>
          <p className="sec-desc">
            AIの活用・世界観づくり・収益化についてお気軽にご相談ください。<br />
            2営業日以内にご返信します。
          </p>
          <div className="consult-wrap">
            <ConsultForm />
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ⑨ CTA */}
      <section className="cta-section" id="cta">
        <AuroraBg />
        <div className="cta-inner">
          <div className="cta-badge">✨ AI × 世界観 × 収益化</div>
          <h2 className="cta-h">
            あなたの世界観が、<br />
            <em>収益になる時代</em>が来ました。
          </h2>
          <p className="cta-p">まずは無料相談から。一緒に、あなただけの収益化の仕組みを作りましょう。</p>
          <div className="cta-btns">
            <button className="btn-main" onClick={() => scrollTo("consult")}>今すぐ相談する →</button>
            <button className="btn-sub" onClick={() => scrollTo("experience")}>体験を見てみる</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="ft-brand">AI World — 世界観×体験×収益化</div>
        <nav className="ft-links">
          {[["ニュース", "news"], ["体験カタログ", "experience"], ["5STEP", "steps"], ["サービス", "services"], ["無料相談", "consult"]].map(([l, id]) => (
            <span key={id} className="ft-link" onClick={() => scrollTo(id)}>{l}</span>
          ))}
        </nav>
        <div className="ft-copy">© 2026 AI World</div>
      </footer>
    </div>
  )
}
