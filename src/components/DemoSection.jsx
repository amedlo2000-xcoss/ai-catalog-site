import { useState } from "react"

const DEMOS = [
  { id: "diagnosis",  ic: "🧠", label: "AI診断",   color: "ci-1" },
  { id: "sns",        ic: "📱", label: "SNS診断",  color: "ci-2" },
  { id: "community",  ic: "👥", label: "コミュニティ", color: "ci-3" },
  { id: "lp",         ic: "🖥️", label: "LP生成",   color: "ci-4" },
  { id: "booking",    ic: "📅", label: "予約",     color: "ci-5" },
  { id: "crm",        ic: "👤", label: "顧客管理", color: "ci-6" },
  { id: "sns_auto",  ic: "📱", label: "SNS自動化",   color: "ci-1" },
  { id: "love",      ic: "💕", label: "恋愛相談",     color: "ci-2" },
  { id: "face",      ic: "🪞", label: "顔分析",       color: "ci-3" },
  { id: "beauty",    ic: "🧴", label: "美容成分",     color: "ci-4" },
  { id: "palm",      ic: "🖐", label: "手相診断",     color: "ci-5" },
  { id: "fashion",   ic: "👗", label: "ファッション", color: "ci-6" },
  { id: "pattern",   ic: "✂",  label: "AI型紙",       color: "ci-1" },
  { id: "defi",      ic: "📈", label: "DeFi運用",     color: "ci-2" },
  { id: "crypto",    ic: "🪙", label: "暗号資産",     color: "ci-3" },
  { id: "xcoss",     ic: "💰", label: "Revenue OS",   color: "ci-4" },
  { id: "event",     ic: "🗓", label: "イベント管理", color: "ci-5" },
  { id: "cinematic", ic: "🎬", label: "シネマWEB",    color: "ci-6" },
]

function DiagnosisDemo() {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
      <div className="demo-q">AIがあなたに最適なシステムを診断します</div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", marginBottom: "24px", letterSpacing: ".04em" }}>
        約2分で完了・無料
      </div>
      <a href="https://ai-diagnosis-omega.vercel.app/" target="_blank" rel="noopener noreferrer" className="demo-ext-btn">
        AI診断を始める →
      </a>
    </div>
  )
}

function SnsDemo() {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📱</div>
      <div className="demo-q">あなたのSNS運用を診断します</div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", marginBottom: "8px", letterSpacing: ".04em" }}>
        Instagram・X・TikTok・YouTube対応
      </div>
      <div style={{ fontSize: "12px", color: "rgba(134,239,172,.5)", marginBottom: "24px", letterSpacing: ".04em" }}>
        診断後に改善提案をお届け
      </div>
      <a href="https://sns-diagnosis-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="demo-ext-btn">
        SNS診断を始める →
      </a>
    </div>
  )
}

function CommunityDemo() {
  const [joined, setJoined] = useState(false)
  const [posts, setPosts] = useState([
    { id: 1, user: "田中さん", text: "ChatGPTで業務が50%削減できました！", likes: 24, time: "3分前" },
    { id: 2, user: "鈴木さん", text: "AI画像生成でSNS運用が楽になりました", likes: 18, time: "12分前" },
    { id: 3, user: "佐藤さん", text: "LINE自動化で月100件の問い合わせ対応中", likes: 31, time: "28分前" },
    { id: 4, user: "山田さん", text: "顧客管理AIを導入して売上が1.8倍になりました", likes: 42, time: "1時間前" },
  ])
  const [input, setInput] = useState("")

  function addPost() {
    if (!input.trim()) return
    setPosts([{ id: Date.now(), user: "あなた", text: input, likes: 0, time: "今" }, ...posts])
    setInput("")
  }

  return (
    <div className="demo-community">
      {!joined ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
          <div className="demo-q">AIコミュニティに参加しますか？</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,.35)", marginBottom: "6px" }}>3,200名が活動中</div>
          <div style={{ fontSize: "12px", color: "rgba(134,239,172,.5)", marginBottom: "20px" }}>無料で参加できます</div>
          <button className="demo-opt" onClick={() => setJoined(true)}>参加する</button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
            <input className="form-input" style={{ flex: 1, padding: "10px 14px", fontSize: "13px" }}
              placeholder="投稿する..." value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addPost()} />
            <button className="demo-opt" style={{ padding: "10px 16px", whiteSpace: "nowrap" }} onClick={addPost}>投稿</button>
          </div>
          <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {posts.map(p => (
              <div key={p.id} className="community-post">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div className="post-user">{p.user}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,.2)" }}>{p.time}</div>
                </div>
                <div className="post-text">{p.text}</div>
                <button className="post-like" onClick={() => setPosts(posts.map(x => x.id === p.id ? { ...x, likes: x.likes + 1 } : x))}>
                  ❤️ {p.likes}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LpDemo() {
  const [type, setType] = useState(null)
  const [name, setName] = useState("")
  const [gen, setGen] = useState(false)

  const templates = {
    "商品販売LP": { hero: "売上を3倍にする革命的な商品", sub: "今すぐ手に入れて、あなたの人生を変えましょう", cta: "今すぐ購入する", color: "rgba(251,191,36,.7)" },
    "セミナー集客LP": { hero: "AIで収益を10倍にするセミナー", sub: "限定30名・残りわずか。今すぐ申し込みを", cta: "無料で参加する", color: "rgba(134,239,172,.7)" },
    "無料相談LP": { hero: "AIシステム導入で売上アップ", sub: "専門家があなたのビジネスを分析します", cta: "無料相談を予約する", color: "rgba(196,181,253,.7)" },
  }

  if (gen && type) {
    const t = templates[type]
    return (
      <div className="lp-preview-full">
        <div className="lp-badge">✨ AIが生成したLP</div>
        <div className="lp-hero-text">{name ? `${name}の` : ""}{t.hero}</div>
        <div className="lp-sub-text">{t.sub}</div>
        <div className="lp-cta-btn" style={{ borderColor: t.color, color: t.color }}>{t.cta}</div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", margin: "12px 0", fontSize: "12px", color: "rgba(255,255,255,.3)" }}>
          <span>✓ SEO最適化済み</span><span>✓ スマホ対応</span><span>✓ 高速表示</span>
        </div>
        <button className="demo-reset" onClick={() => { setGen(false); setType(null); setName("") }}>作り直す</button>
      </div>
    )
  }

  return (
    <div>
      {!type ? (
        <>
          <div className="demo-q">どんなLPを作りますか？</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {Object.keys(templates).map(t => (
              <button key={t} className="demo-opt" onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="demo-q">「{type}」を生成します</div>
          <input className="form-input" style={{ marginBottom: "12px" }}
            placeholder="サービス名・商品名（任意）" value={name} onChange={e => setName(e.target.value)} />
          <button className="demo-opt" style={{ width: "100%" }} onClick={() => setGen(true)}>
            🚀 AIでLP生成
          </button>
          <button className="demo-reset" style={{ width: "100%", marginTop: "8px" }} onClick={() => setType(null)}>戻る</button>
        </>
      )}
    </div>
  )
}

function BookingDemo() {
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState({ date: null, time: null, place: null, purpose: null })

  const dates = ["5/19(月)", "5/20(火)", "5/21(水)", "5/22(木)", "5/23(金)", "5/24(土)"]
  const times = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  const places = ["オンライン（Zoom）", "オンライン（Meet）", "東京・新宿オフィス", "東京・渋谷オフィス", "お客様先"]
  const purposes = ["AIシステム導入相談", "デモ・体験希望", "料金・プラン確認", "既存システム改善", "その他"]

  const steps = [
    { label: "日付を選択", key: "date", items: dates, grid: 3 },
    { label: "時間を選択", key: "time", items: times, grid: 4 },
    { label: "場所を選択", key: "place", items: places, grid: 1 },
    { label: "目的を選択", key: "purpose", items: purposes, grid: 1 },
  ]

  function select(key, val) {
    setSel({ ...sel, [key]: val })
    setTimeout(() => setStep(step + 1), 200)
  }

  if (step >= steps.length) return (
    <div className="demo-result">
      <div className="result-ic">📅</div>
      <div className="result-title">予約完了！</div>
      <div style={{ background: "rgba(255,255,255,.04)", border: "0.5px solid rgba(255,255,255,.09)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px", textAlign: "left" }}>
        <div className="booking-confirm-row"><span>📆 日付</span><span>{sel.date}</span></div>
        <div className="booking-confirm-row"><span>🕐 時間</span><span>{sel.time}</span></div>
        <div className="booking-confirm-row"><span>📍 場所</span><span>{sel.place}</span></div>
        <div className="booking-confirm-row"><span>💬 目的</span><span>{sel.purpose}</span></div>
      </div>
      <div style={{ fontSize: "12px", color: "rgba(134,239,172,.6)", marginBottom: "16px" }}>確認メールを送信しました</div>
      <button className="demo-reset" onClick={() => { setStep(0); setSel({ date: null, time: null, place: null, purpose: null }) }}>最初から</button>
    </div>
  )

  const cur = steps[step]
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, height: "3px", borderRadius: "99px", background: i <= step ? "rgba(196,181,253,.7)" : "rgba(255,255,255,.1)", transition: "background .3s" }} />
        ))}
      </div>
      <div className="demo-step">STEP {step + 1} / {steps.length}</div>
      <div className="demo-q">{cur.label}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cur.grid}, 1fr)`, gap: "8px" }}>
        {cur.items.map(item => (
          <button key={item} className={`demo-opt ${sel[cur.key] === item ? "selected" : ""}`}
            style={sel[cur.key] === item ? { background: "rgba(196,181,253,.2)", borderColor: "rgba(196,181,253,.5)" } : {}}
            onClick={() => select(cur.key, item)}>{item}</button>
        ))}
      </div>
    </div>
  )
}

function CrmDemo() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "田中 太郎", referrer: "山本さん紹介", area: "東京都新宿区", tel: "090-1234-5678", job: "会社員", family: "既婚・子2人" },
    { id: 2, name: "鈴木 花子", referrer: "直接問い合わせ", area: "神奈川県横浜市", tel: "080-9876-5432", job: "自営業", family: "独身" },
  ])
  const [form, setForm] = useState({ name: "", referrer: "", area: "", tel: "", job: "", family: "" })
  const [adding, setAdding] = useState(false)
  const [detail, setDetail] = useState(null)

  function save() {
    if (!form.name.trim()) return
    setCustomers([...customers, { id: Date.now(), ...form }])
    setForm({ name: "", referrer: "", area: "", tel: "", job: "", family: "" })
    setAdding(false)
  }

  function del(id) { setCustomers(customers.filter(c => c.id !== id)); setDetail(null) }

  if (detail) {
    const c = customers.find(x => x.id === detail)
    if (!c) { setDetail(null); return null }
    return (
      <div>
        <button className="demo-reset" style={{ marginBottom: "14px" }} onClick={() => setDetail(null)}>← 一覧に戻る</button>
        <div style={{ background: "rgba(255,255,255,.04)", border: "0.5px solid rgba(255,255,255,.09)", borderRadius: "16px", padding: "16px" }}>
          <div style={{ fontSize: "18px", fontWeight: "300", color: "rgba(255,255,255,.9)", marginBottom: "14px", letterSpacing: ".04em" }}>{c.name}</div>
          {[["👤 紹介者", c.referrer], ["📍 住まい", c.area], ["📞 連絡先", c.tel], ["💼 職業", c.job], ["👨‍👩‍👧 家族構成", c.family]].map(([k, v]) => (
            <div key={k} className="booking-confirm-row"><span style={{ color: "rgba(255,255,255,.4)" }}>{k}</span><span>{v || "未入力"}</span></div>
          ))}
        </div>
        <button onClick={() => del(detail)} style={{ width: "100%", marginTop: "12px", background: "rgba(239,68,68,.12)", border: "0.5px solid rgba(239,68,68,.3)", borderRadius: "12px", padding: "10px", color: "rgba(239,68,68,.7)", fontSize: "13px", cursor: "pointer", fontFamily: '"Noto Sans JP",sans-serif' }}>
          🗑️ この顧客を削除
        </button>
      </div>
    )
  }

  if (adding) return (
    <div>
      <button className="demo-reset" style={{ marginBottom: "14px" }} onClick={() => setAdding(false)}>← 戻る</button>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[["name","お名前 *"],["referrer","紹介者"],["area","住まい"],["tel","連絡先"],["job","職業"],["family","家族構成"]].map(([k, ph]) => (
          <input key={k} className="form-input" style={{ padding: "10px 14px", fontSize: "13px" }}
            placeholder={ph} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="demo-opt" style={{ marginTop: "4px" }} onClick={save}>保存する</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,.35)", letterSpacing: ".04em" }}>{customers.length}件の顧客</div>
        <button className="demo-opt" style={{ padding: "7px 14px", fontSize: "12px" }} onClick={() => setAdding(true)}>+ 新規追加</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
        {customers.map(c => (
          <div key={c.id} className="crm-row" style={{ cursor: "pointer" }} onClick={() => setDetail(c.id)}>
            <div className="crm-avatar">{c.name[0]}</div>
            <div className="crm-info">
              <div className="crm-name">{c.name}</div>
              <div className="crm-date">{c.area || "住所未入力"} · {c.job || "職業未入力"}</div>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,.25)" }}>›</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SnsAutoDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>📱</div>
      <div className="demo-q">投稿作成・導線設計・集客戦略をAIが提案するSNS支援体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(134,239,172,.5)", marginBottom:"24px" }}>SNS自動化 · 集客 · 投稿生成</div>
      <a href="https://sns-diagnosis-one.vercel.app" target="_blank" rel="noopener noreferrer" className="demo-ext-btn">体験を始める →</a>
    </div>
  )
}
function LoveDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>💕</div>
      <div className="demo-q">感情分析・相手心理・未来予測をもとに相談できる恋愛分析体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(249,168,212,.5)", marginBottom:"24px" }}>恋愛 · 感情分析 · 相談</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function FaceDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🪞</div>
      <div className="demo-q">第一印象・魅力・改善点をカルテ形式で分析する美容診断体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(196,181,253,.5)", marginBottom:"24px" }}>美容 · 顔分析 · カルテ</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function BeautyIngDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🧴</div>
      <div className="demo-q">化粧品成分や使用傾向を分析し、未来の肌リスクを可視化する体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(134,239,172,.5)", marginBottom:"24px" }}>美容 · 成分診断 · スキンケア</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function PalmDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🖐</div>
      <div className="demo-q">手の特徴から性格傾向・強み・未来傾向を分析する診断体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(251,191,36,.5)", marginBottom:"24px" }}>手相 · 性格分析 · 占い</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function FashionDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>👗</div>
      <div className="demo-q">服装提案・着せ替え・クローゼット連携によるコーデ提案体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(249,168,212,.5)", marginBottom:"24px" }}>ファッション · コーデ · スタイル</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function PatternDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>✂</div>
      <div className="demo-q">頭の中のデザインを3D化し、型紙設計へつなげる未来型制作体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(125,211,252,.5)", marginBottom:"24px" }}>型紙 · 3D · デザイン</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function DefiDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>📈</div>
      <div className="demo-q">暗号資産のレンジ調整や手数料運用をシミュレーションできる金融AI体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(134,239,172,.5)", marginBottom:"24px" }}>DeFi · 暗号資産 · 運用</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function CryptoDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🪙</div>
      <div className="demo-q">市場情報・銘柄分析・AI予測をもとに判断材料を得られる分析体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(251,191,36,.5)", marginBottom:"24px" }}>暗号資産 · 分析 · 予測</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function XcossDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>💰</div>
      <div className="demo-q">イベント・マルシェの集客、紹介、収益循環を可視化する体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(196,181,253,.5)", marginBottom:"24px" }}>収益 · イベント · マルシェ</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function EventDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🗓</div>
      <div className="demo-q">予約・出店申込・顧客管理・運営フローを体験できる管理システム。</div>
      <div style={{ fontSize:"12px", color:"rgba(125,211,252,.5)", marginBottom:"24px" }}>イベント · 予約 · 管理</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}
function CinematicDemo() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🎬</div>
      <div className="demo-q">近未来型LP・世界観デザイン・動きのあるWEB表現を生成する制作体験。</div>
      <div style={{ fontSize:"12px", color:"rgba(249,168,212,.5)", marginBottom:"24px" }}>WEB · LP · デザイン</div>
      <div className="consult-sent"><div className="sent-ic">🚧</div><div className="sent-title">準備中</div><div className="sent-sub">この体験システムは現在準備中です</div></div>
    </div>
  )
}

const DEMO_MAP = {
  diagnosis: DiagnosisDemo,
  sns: SnsDemo,
  community: CommunityDemo,
  lp: LpDemo,
  booking: BookingDemo,
  crm: CrmDemo,
  sns_auto: SnsAutoDemo,
  love: LoveDemo,
  face: FaceDemo,
  beauty: BeautyIngDemo,
  palm: PalmDemo,
  fashion: FashionDemo,
  pattern: PatternDemo,
  defi: DefiDemo,
  crypto: CryptoDemo,
  xcoss: XcossDemo,
  event: EventDemo,
  cinematic: CinematicDemo,
}

export default function DemoSection() {
  const [active, setActive] = useState("diagnosis")
  const ActiveDemo = DEMO_MAP[active]
  return (
    <section className="section" id="demos">
      <div className="sec-label">Live Demo</div>
      <h2 className="sec-title">AIシステムを体験する</h2>
      <p className="sec-desc">実際に触って、AIの可能性を体感してください。</p>
      <div className="demo-tabs">
        {DEMOS.map(({ id, ic, label, color }) => (
          <button key={id} className={`demo-tab ${active === id ? "on" : ""}`} onClick={() => setActive(id)}>
            <span className={`demo-tab-ic ${color}`}>{ic}</span>
            <span className="demo-tab-lb">{label}</span>
          </button>
        ))}
      </div>
      <div className="demo-panel">
        <ActiveDemo />
      </div>
    </section>
  )
}
