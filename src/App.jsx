import { useState, useRef } from 'react'
import './App.css'
import CatGame from './components/CatGame'

const SYSTEMS = [
  { id: 'diagnosis', icon: '🔍', title: 'AI診断ツール', desc: '顧客の悩みを自動分析し最適解を提示', tag: '集客' },
  { id: 'course', icon: '📚', title: '講座販売システム', desc: '教材販売・配信・受講者管理を自動化', tag: '収益化' },
  { id: 'community', icon: '👥', title: 'コミュニティサイト', desc: '会員制コミュニティの構築・運営', tag: 'エンゲージメント' },
  { id: 'sns', icon: '📱', title: 'SNS自動化', desc: '複数SNSへの投稿を一括スケジュール管理', tag: '集客' },
  { id: 'lp', icon: '🎯', title: 'LP生成', desc: 'AIがターゲットに合わせたLPを自動生成', tag: '集客' },
  { id: 'line', icon: '💬', title: 'LINEマーケ', desc: 'LINE配信・チャットボット・セグメント管理', tag: '集客' },
  { id: 'crm', icon: '📊', title: '顧客管理', desc: '顧客情報・履歴・AI分析を一元管理', tag: '業務効率' },
  { id: 'booking', icon: '📅', title: '予約システム', desc: 'オンライン予約・自動リマインダー管理', tag: '業務効率' },
  { id: 'subscription', icon: '💎', title: 'サブスク管理', desc: '定期課金・プラン管理の完全自動化', tag: '収益化' },
]

// ── Demo: AI診断ツール ──────────────────────────────────────────────────────

function DiagnosisDemo() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const questions = [
    { id: 'type', q: 'ビジネスの種類は？', opts: ['コーチング・コンサル', 'ECサイト', 'サービス業', 'IT・Web'] },
    { id: 'challenge', q: '現在の最大の課題は？', opts: ['集客が少ない', '成約率が低い', '業務が煩雑', 'リピートが少ない'] },
    { id: 'target', q: '月の売上目標は？', opts: ['〜50万円', '50〜100万円', '100〜300万円', '300万円以上'] },
  ]

  const resultMap = {
    '集客が少ない': { label: 'AI集客パッケージ', match: 92, systems: ['SNS自動化', 'LP生成', 'AI診断ツール'] },
    '成約率が低い': { label: 'AI商談支援パッケージ', match: 88, systems: ['LINEマーケ', '顧客管理', 'AI診断ツール'] },
    '業務が煩雑': { label: 'AI業務効率化パッケージ', match: 95, systems: ['顧客管理', '予約システム', 'サブスク管理'] },
    'リピートが少ない': { label: 'AI顧客育成パッケージ', match: 90, systems: ['コミュニティ', 'LINEマーケ', 'サブスク管理'] },
  }

  const answer = (opt) => {
    const q = questions[step]
    const next = { ...answers, [q.id]: opt }
    setAnswers(next)
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      setResult(resultMap[next.challenge] || resultMap['集客が少ない'])
    }
  }

  if (result) return (
    <div className="demo-inner diagnosis-result">
      <div className="score-ring"><span>{result.match}</span><small>点</small></div>
      <h4>{result.label}が最適です</h4>
      <div className="tag-row">{result.systems.map(s => <span key={s} className="rtag">{s}</span>)}</div>
      <p className="result-note">AIが分析した結果、あなたのビジネスには上記システムの組み合わせが最も効果的です。</p>
      <button className="btn-outline" onClick={() => { setStep(0); setAnswers({}); setResult(null) }}>もう一度試す</button>
    </div>
  )

  const q = questions[step]
  return (
    <div className="demo-inner">
      <div className="diag-progress"><div className="diag-bar" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
      <p className="diag-step">STEP {step + 1} / {questions.length}</p>
      <h4 className="diag-q">{q.q}</h4>
      <div className="diag-opts">
        {q.opts.map(opt => <button key={opt} className="diag-opt" onClick={() => answer(opt)}>{opt}</button>)}
      </div>
    </div>
  )
}

// ── Demo: 講座販売システム ────────────────────────────────────────────────────

function CourseDemo() {
  const [cart, setCart] = useState(null)
  const [purchased, setPurchased] = useState(false)

  const courses = [
    { id: 1, title: 'AIビジネス基礎講座', price: 29800, lessons: 12, tag: '人気No.1', students: 1842 },
    { id: 2, title: 'ChatGPT活用マスター講座', price: 49800, lessons: 20, tag: '最新', students: 987 },
    { id: 3, title: 'AIマーケティング実践講座', price: 39800, lessons: 16, tag: 'おすすめ', students: 1234 },
  ]

  if (purchased) return (
    <div className="demo-inner purchase-success">
      <div className="success-icon">✅</div>
      <h4>購入完了！</h4>
      <p className="cart-title">{cart?.title}</p>
      <p className="price-confirm">¥{cart?.price.toLocaleString()}</p>
      <p className="success-note">マイページからすぐに受講を開始できます。</p>
      <button className="btn-outline" onClick={() => { setCart(null); setPurchased(false) }}>戻る</button>
    </div>
  )

  if (cart) return (
    <div className="demo-inner cart-view">
      <h4>購入確認</h4>
      <div className="cart-item">
        <span>{cart.title}</span>
        <strong>¥{cart.price.toLocaleString()}</strong>
      </div>
      <button className="btn-primary" onClick={() => setPurchased(true)}>購入する</button>
      <button className="btn-ghost" onClick={() => setCart(null)}>キャンセル</button>
    </div>
  )

  return (
    <div className="demo-inner">
      <div className="course-list">
        {courses.map(c => (
          <div key={c.id} className="course-card">
            <span className="course-tag">{c.tag}</span>
            <h5>{c.title}</h5>
            <div className="course-meta">
              <span>📹 {c.lessons}レッスン</span>
              <span>👤 {c.students.toLocaleString()}名受講</span>
            </div>
            <div className="course-footer">
              <strong className="course-price">¥{c.price.toLocaleString()}</strong>
              <button className="btn-small" onClick={() => setCart(c)}>購入する</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Demo: コミュニティサイト ──────────────────────────────────────────────────

function CommunityDemo() {
  const [posts, setPosts] = useState([
    { id: 1, user: '田中 美咲', avatar: '👩', text: 'AIツールを導入して売上が3倍になりました！メンバーの皆さんありがとう', likes: 24, time: '2時間前', liked: false },
    { id: 2, user: '鈴木 健太', avatar: '👨', text: '予約システムのおかげで業務時間が半分以下に。本当に助かってます🙏', likes: 18, time: '4時間前', liked: false },
    { id: 3, user: '山田 花子', avatar: '🧑', text: '来月からLINEマーケを始めます！アドバイスお願いします', likes: 7, time: '6時間前', liked: false },
  ])
  const [newPost, setNewPost] = useState('')

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  }

  const addPost = () => {
    if (!newPost.trim()) return
    setPosts([{ id: Date.now(), user: 'あなた', avatar: '🙋', text: newPost, likes: 0, time: 'たった今', liked: false }, ...posts])
    setNewPost('')
  }

  return (
    <div className="demo-inner community-demo">
      <div className="post-input">
        <input value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="投稿してみよう..." onKeyDown={e => e.key === 'Enter' && addPost()} />
        <button onClick={addPost} className="btn-small">投稿</button>
      </div>
      <div className="post-feed">
        {posts.map(p => (
          <div key={p.id} className="post-item">
            <span className="post-avatar">{p.avatar}</span>
            <div className="post-body">
              <div className="post-header"><strong>{p.user}</strong><span>{p.time}</span></div>
              <p>{p.text}</p>
              <button className={`like-btn${p.liked ? ' liked' : ''}`} onClick={() => toggleLike(p.id)}>❤️ {p.likes}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Demo: SNS自動化 ───────────────────────────────────────────────────────────

const SNS_FEATURES = [
  { icon: '🔍', label: 'リサーチ', desc: 'トレンド抽出' },
  { icon: '✍️', label: '投稿自動生成', desc: '月60回' },
  { icon: '🤖', label: '自動投稿', desc: 'Claude Computer Use' },
  { icon: '⏰', label: '予約投稿', desc: '時間指定' },
  { icon: '📸', label: '対応媒体', desc: 'Instagram ＋ X' },
  { icon: '📊', label: '投稿数', desc: '月100本' },
  { icon: '🏷️', label: 'ステータス管理', desc: 'ready / posted' },
]

const INITIAL_POSTS = [
  { id: 1, content: 'AIで業務効率化！最新トレンドを解説します📱', platform: 'Instagram', date: '2026-05-01 09:00', status: 'posted' },
  { id: 2, content: 'ChatGPT活用術10選｜今日から使えるプロンプト集🔥', platform: 'X', date: '2026-05-01 12:00', status: 'posted' },
  { id: 3, content: '中小企業のDX推進を支援するAIツール3選✨', platform: 'Instagram', date: '2026-05-02 10:00', status: 'ready' },
  { id: 4, content: 'SNS自動化で月100本投稿を実現する方法📅', platform: 'X', date: '2026-05-02 18:00', status: 'ready' },
  { id: 5, content: 'AIマーケティングの最前線｜2026年のトレンド予測🚀', platform: 'Instagram', date: '2026-05-03 09:00', status: 'ready' },
]

function SnsDemo() {
  const [tab, setTab] = useState('schedule')
  const [content, setContent] = useState('')
  const [platforms, setPlatforms] = useState({ twitter: true, instagram: false })
  const [scheduled, setScheduled] = useState(false)
  const [date, setDate] = useState('2026-05-01')
  const [time, setTime] = useState('09:00')
  const [posts, setPosts] = useState(INITIAL_POSTS)

  const toggle = p => setPlatforms(prev => ({ ...prev, [p]: !prev[p] }))
  const selectedCount = Object.values(platforms).filter(Boolean).length

  const toggleStatus = (id) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'ready' ? 'posted' : 'ready' } : p
    ))
  }

  return (
    <div className="sns-demo-wrap">

      {/* ── お試し期間バナー ── */}
      <div className="sns-trial-banner">
        <span className="trial-badge">お試し期間あり</span>
        <span className="trial-text">
          初期費用<strong>無料</strong>・月額
          <span className="trial-price-orig">15,000円</span>
          <span className="trial-arrow">→</span>
          <span className="trial-price-sale">7,500円</span>
        </span>
        <span className="trial-limit">先着30名のみ</span>
      </div>

      {/* ── タブ ── */}
      <div className="sns-tabs">
        <button className={`sns-tab${tab === 'schedule' ? ' active' : ''}`} onClick={() => setTab('schedule')}>
          ⏰ 予約投稿
        </button>
        <button className={`sns-tab${tab === 'features' ? ' active' : ''}`} onClick={() => setTab('features')}>
          ⚡ 機能一覧
        </button>
        <button className={`sns-tab${tab === 'status' ? ' active' : ''}`} onClick={() => setTab('status')}>
          🏷️ ステータス管理
        </button>
      </div>

      {/* ── 予約投稿タブ ── */}
      {tab === 'schedule' && (
        <div className="sns-tab-content">
          {scheduled ? (
            <div className="sns-success">
              <div className="success-icon">📅</div>
              <h4>スケジュール登録完了！</h4>
              <p>{date} {time} に {selectedCount}媒体へ自動投稿します</p>
              <div className="post-preview">「{content}」</div>
              <button className="btn-outline" onClick={() => { setScheduled(false); setContent('') }}>新しい投稿</button>
            </div>
          ) : (
            <div className="sns-demo">
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="投稿内容を入力（AIが自動生成することも可能）..." rows={3} className="sns-textarea" />
              <div className="platform-row">
                {[['twitter', '𝕏 X'], ['instagram', '📷 Instagram']].map(([k, label]) => (
                  <label key={k} className={`platform-check${platforms[k] ? ' active' : ''}`}>
                    <input type="checkbox" checked={platforms[k]} onChange={() => toggle(k)} />
                    {label}
                  </label>
                ))}
              </div>
              <div className="schedule-row">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={() => content && selectedCount && setScheduled(true)} disabled={!content || !selectedCount}>
                スケジュール登録
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 機能一覧タブ ── */}
      {tab === 'features' && (
        <div className="sns-tab-content">
          <div className="sns-features-grid">
            {SNS_FEATURES.map(f => (
              <div key={f.label} className="sns-feature-card">
                <span className="sf-icon">{f.icon}</span>
                <div>
                  <div className="sf-label">{f.label}</div>
                  <div className="sf-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ステータス管理タブ ── */}
      {tab === 'status' && (
        <div className="sns-tab-content">
          <p className="status-hint">バッジをクリックするとステータスを切り替えられます</p>
          <div className="sns-status-table-wrap">
            <table className="sns-status-table">
              <thead>
                <tr>
                  <th>投稿内容</th>
                  <th>媒体</th>
                  <th>予定日時</th>
                  <th>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td className="post-cell">{p.content}</td>
                    <td>
                      <span className={`platform-badge ${p.platform === 'Instagram' ? 'pb-ig' : 'pb-x'}`}>
                        {p.platform === 'Instagram' ? '📷' : '𝕏'} {p.platform}
                      </span>
                    </td>
                    <td className="date-cell">{p.date}</td>
                    <td>
                      <button
                        className={`status-pill ${p.status === 'posted' ? 'sp-posted' : 'sp-ready'}`}
                        onClick={() => toggleStatus(p.id)}
                        title="クリックで切り替え"
                      >
                        {p.status === 'posted' ? '✅ posted' : '🕐 ready'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="status-legend">
            <span className="sp-ready">🕐 ready</span>＝投稿待ち
            <span className="sp-posted">✅ posted</span>＝投稿済み
          </div>
        </div>
      )}

    </div>
  )
}

// ── Demo: LP生成 ──────────────────────────────────────────────────────────────

function LpDemo() {
  const [industry, setIndustry] = useState('')
  const [target, setTarget] = useState('')
  const [usp, setUsp] = useState('')
  const [generated, setGenerated] = useState(false)

  if (generated) return (
    <div className="demo-inner lp-preview">
      <div className="lp-mock">
        <div className="lp-hero-mock">
          <div className="lp-badge">🎯 {industry}</div>
          <h3>{usp || `${industry}のプロが教える`}<br />あなたの悩みを解決します</h3>
          <p className="lp-target">対象：{target}</p>
          <button className="lp-cta-btn">今すぐ無料相談</button>
        </div>
        <div className="lp-features-row">
          {['実績200社以上', '平均ROI 340%', '導入後サポート付き'].map(f => (
            <div key={f} className="lp-feature-item">✅ {f}</div>
          ))}
        </div>
      </div>
      <button className="btn-outline" onClick={() => setGenerated(false)}>再生成</button>
    </div>
  )

  return (
    <div className="demo-inner lp-form">
      <div className="form-group">
        <label>業種・ビジネス種類</label>
        <select value={industry} onChange={e => setIndustry(e.target.value)}>
          <option value="">選択してください</option>
          {['コーチング', 'コンサルティング', 'EC・物販', 'サービス業', 'IT・SaaS', '教育・スクール'].map(i => <option key={i}>{i}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>ターゲット顧客</label>
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder="例：30〜40代の副業を始めたい会社員" />
      </div>
      <div className="form-group">
        <label>強み・USP（任意）</label>
        <input value={usp} onChange={e => setUsp(e.target.value)} placeholder="例：元大手コンサル出身" />
      </div>
      <button className="btn-primary" onClick={() => setGenerated(true)} disabled={!industry || !target}>
        AIでLPを生成
      </button>
    </div>
  )
}

// ── Demo: LINEマーケ ──────────────────────────────────────────────────────────

function LineDemo() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'こんにちは！何かお手伝いできますか？「料金」「予約」「サービス」などご質問ください😊' },
  ])
  const [input, setInput] = useState('')

  const botReplies = {
    '料金': 'プランは初期費用12万円〜、月額2万円〜となっております。詳しくは料金ページをご覧ください💰',
    '予約': '予約のご希望ですね！こちらのリンクからお選びください👉 [予約ページへ]',
    'サービス': '9種類のAIシステムをご用意しています。診断・講座販売・コミュニティ・SNS自動化など豊富なラインナップです✨',
  }

  const send = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    const key = Object.keys(botReplies).find(k => input.includes(k))
    const reply = { from: 'bot', text: key ? botReplies[key] : 'ありがとうございます！担当者より折り返しご連絡いたします。平均応答時間は2時間以内です😊' }
    setMessages(prev => [...prev, userMsg, reply])
    setInput('')
  }

  return (
    <div className="demo-inner line-demo">
      <div className="line-header">
        <span>💬</span>
        <span>LINE公式アカウント</span>
        <span className="line-online">● オンライン</span>
      </div>
      <div className="line-chat">
        {messages.map((m, i) => (
          <div key={i} className={`line-msg ${m.from}`}>
            {m.from === 'bot' && <span className="bot-icon">🤖</span>}
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="line-input">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="メッセージを送る..." />
        <button onClick={send} className="btn-primary line-send">送信</button>
      </div>
    </div>
  )
}

// ── Demo: 顧客管理 ────────────────────────────────────────────────────────────

function CrmDemo() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const customers = [
    { id: 1, name: '田中 美咲', company: '株式会社ABC', plan: 'プロ', value: 480000, status: 'アクティブ', last: '2026-04-25' },
    { id: 2, name: '鈴木 健太', company: '合同会社DEF', plan: 'スタンダード', value: 240000, status: 'アクティブ', last: '2026-04-22' },
    { id: 3, name: '山田 花子', company: '個人事業主', plan: 'スタンダード', value: 120000, status: '要フォロー', last: '2026-03-15' },
    { id: 4, name: '佐藤 大輔', company: '株式会社GHI', plan: 'エンタープライズ', value: 1200000, status: 'アクティブ', last: '2026-04-26' },
    { id: 5, name: '伊藤 さくら', company: '合同会社JKL', plan: 'プロ', value: 360000, status: '休眠', last: '2026-02-10' },
  ]

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.company.includes(search) || c.plan.includes(search) || c.status.includes(search)
  )

  return (
    <div className="demo-inner crm-demo">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 顧客名・会社名・プランで検索..." className="crm-input" />
      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead><tr><th>顧客名</th><th>プラン</th><th>累計金額</th><th>ステータス</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} className={selected?.id === c.id ? 'row-selected' : ''}>
                <td><strong>{c.name}</strong><br /><small>{c.company}</small></td>
                <td><span className="plan-badge">{c.plan}</span></td>
                <td>¥{c.value.toLocaleString()}</td>
                <td><span className={`status-badge ${c.status === 'アクティブ' ? 'st-active' : c.status === '要フォロー' ? 'st-warn' : 'st-inactive'}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="crm-detail">
          <span><strong>{selected.name}</strong> — 最終接触: {selected.last} | 累計: ¥{selected.value.toLocaleString()}</span>
          <button className="btn-small" onClick={() => setSelected(null)}>✕</button>
        </div>
      )}
    </div>
  )
}

// ── Demo: 予約システム ────────────────────────────────────────────────────────

function BookingDemo() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  const daysInMonth = 30
  const firstDay = 3 // April 2026 starts on Wednesday
  const available = [28, 29, 30, 1, 2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25]
  const pastDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
  const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

  if (confirmed) return (
    <div className="demo-inner booking-success">
      <div className="success-icon">🗓️</div>
      <h4>予約が完了しました！</h4>
      <p className="booking-info">2026年4月{selectedDate}日 {selectedTime}</p>
      <p className="booking-note">確認メールをお送りしました。前日にリマインダーが自動送信されます。</p>
      <button className="btn-outline" onClick={() => { setConfirmed(false); setSelectedDate(null); setSelectedTime(null) }}>別の日程を予約</button>
    </div>
  )

  return (
    <div className="demo-inner booking-demo">
      <p className="cal-header">2026年 4月</p>
      <div className="calendar">
        {['日', '月', '火', '水', '木', '金', '土'].map(d => <div key={d} className="cal-dayname">{d}</div>)}
        {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} className="cal-empty" />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const d = i + 1
          const isAvail = available.includes(d) && !pastDays.includes(d)
          const isPast = pastDays.includes(d)
          const isSelected = selectedDate === d
          return (
            <button
              key={d}
              className={`cal-day${isAvail ? ' available' : ''}${isPast ? ' past' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => isAvail && setSelectedDate(d)}
              disabled={!isAvail}
            >{d}</button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="time-slots">
          <p>4月{selectedDate}日の時間帯を選択</p>
          <div className="time-grid">
            {times.map(t => (
              <button key={t} className={`time-slot${selectedTime === t ? ' selected' : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
            ))}
          </div>
        </div>
      )}
      {selectedDate && selectedTime && (
        <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => setConfirmed(true)}>予約を確定する</button>
      )}
    </div>
  )
}

// ── Demo: サブスク管理 ────────────────────────────────────────────────────────

function SubscriptionDemo() {
  const [currentPlan, setCurrentPlan] = useState('standard')
  const [upgraded, setUpgraded] = useState(null)

  const plans = [
    { id: 'starter', name: 'スターター', price: '20,000', features: ['基本機能', '1システム', 'メールサポート'], color: '#6b7280' },
    { id: 'standard', name: 'スタンダード', price: '50,000', features: ['全機能', '3システム', 'チャットサポート', '月次レポート'], color: '#2563eb', popular: true },
    { id: 'pro', name: 'プロ', price: '100,000', features: ['無制限', '全9システム', '専任担当者', '24hサポート'], color: '#f59e0b' },
  ]

  if (upgraded) {
    const plan = plans.find(p => p.id === upgraded)
    return (
      <div className="demo-inner upgrade-success">
        <div className="success-icon">💎</div>
        <h4>{plan?.name}プランに変更しました！</h4>
        <p>月額 ¥{plan?.price}円 — すぐにご利用いただけます。</p>
        <button className="btn-outline" onClick={() => { setCurrentPlan(upgraded); setUpgraded(null) }}>マイページへ</button>
      </div>
    )
  }

  return (
    <div className="demo-inner sub-demo">
      <div className="plan-grid">
        {plans.map(p => {
          const isCurrent = p.id === currentPlan
          const planOrder = { starter: 0, standard: 1, pro: 2 }
          const isUpgrade = planOrder[p.id] > planOrder[currentPlan]
          return (
            <div key={p.id} className={`plan-card${isCurrent ? ' current' : ''}${p.popular ? ' popular' : ''}`}>
              {p.popular && <div className="popular-badge">人気No.1</div>}
              {isCurrent && <div className="current-badge">現在</div>}
              <h5>{p.name}</h5>
              <div className="plan-price">¥{p.price}<span>/月</span></div>
              <ul className="plan-features">
                {p.features.map(f => <li key={f}>✓ {f}</li>)}
              </ul>
              {!isCurrent && (
                <button className="btn-plan" style={{ background: p.color }} onClick={() => setUpgraded(p.id)}>
                  {isUpgrade ? 'アップグレード' : 'ダウングレード'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Contact Modal ─────────────────────────────────────────────────────────────

function ContactModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('【無料相談】お問い合わせ')
    const body = encodeURIComponent(
      `名前：${name}\nメールアドレス：${email}\n\nお問い合わせ内容：\n${message}`
    )
    window.location.href = `mailto:cnda.mt@gmail.com?subject=${subject}&body=${body}`
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">💬</div>
            <h2>無料相談を申し込む</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>
        <p className="modal-lead">30分の無料コンサルティング。お気軽にご相談ください。</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="modal-name">お名前<span className="modal-required"> *</span></label>
            <input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="modal-email">メールアドレス<span className="modal-required"> *</span></label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="modal-message">お問い合わせ内容<span className="modal-required"> *</span></label>
            <textarea
              id="modal-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="AIシステムの導入についてご相談したいことをご記入ください..."
              rows={5}
              required
            />
          </div>
          <button type="submit" className="modal-submit-btn">
            メールアプリで送信する →
          </button>
          <p className="modal-note">送信ボタンを押すとメールアプリが開き、内容が自動入力されます</p>
        </form>
      </div>
    </div>
  )
}

// ── Demo Map ──────────────────────────────────────────────────────────────────

const DEMOS = {
  diagnosis: DiagnosisDemo,
  course: CourseDemo,
  community: CommunityDemo,
  sns: SnsDemo,
  lp: LpDemo,
  line: LineDemo,
  crm: CrmDemo,
  booking: BookingDemo,
  subscription: SubscriptionDemo,
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState('diagnosis')
  const demoRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const select = (id) => {
    setActive(id)
    setTimeout(() => demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const ActiveDemo = DEMOS[active]
  const info = SYSTEMS.find(s => s.id === active)

  return (
    <div className="app">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-logo">
            <span>⚡</span>
            <span>AI<strong>カタログ</strong></span>
          </div>
          <div className="nav-links">
            <a href="#systems">システム一覧</a>
            <a href="#demo">デモ体験</a>
            <a href="#pricing">料金</a>
          </div>
          <a href="#contact" className="nav-cta" onClick={(e) => { e.preventDefault(); openModal() }}>無料相談</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className="hero-badge">🚀 AIシステム体験カタログ 2026</div>
          <h1 className="hero-title">
            あなたのビジネスを<br />
            <span className="highlight">AIで自動化</span>しよう
          </h1>
          <p className="hero-sub">9種類のAIシステムを実際に体験。集客・販売・業務効率化をワンストップで実現。</p>

          <div className="pricing-showcase">
            <div className="price-block">
              <span className="price-label">初期費用</span>
              <span className="price-num">120,000<small>円〜</small></span>
            </div>
            <div className="price-sep" />
            <div className="price-block">
              <span className="price-label">月額費用</span>
              <span className="price-num">20,000<small>円〜</small></span>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#demo" className="btn-hero-primary">デモを体験する</a>
            <a href="#contact" className="btn-hero-secondary" onClick={(e) => { e.preventDefault(); openModal() }}>無料相談はこちら</a>
          </div>

          <div className="hero-stats">
            <div className="stat"><strong>200+</strong><span>導入実績</span></div>
            <div className="stat"><strong>340%</strong><span>平均ROI</span></div>
            <div className="stat"><strong>9種</strong><span>AIシステム</span></div>
            <div className="stat"><strong>24h</strong><span>サポート</span></div>
          </div>
        </div>
      </section>

      {/* ── Systems Grid ── */}
      <section className="systems-section" id="systems">
        <div className="section-inner">
          <div className="section-header">
            <h2>9つのAIシステム</h2>
            <p>ビジネスの課題に合わせて最適なシステムを選択・カスタマイズ</p>
          </div>
          <div className="systems-grid">
            {SYSTEMS.map(s => (
              <button key={s.id} className={`system-card${active === s.id ? ' active' : ''}`} onClick={() => select(s.id)}>
                <span className="sys-icon">{s.icon}</span>
                <span className="sys-tag-label">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="sys-try">体験する →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Area ── */}
      <section className="demo-section" id="demo" ref={demoRef}>
        <div className="section-inner">
          <div className="demo-wrapper">
            <div className="demo-header-bar">
              <span className="demo-hicon">{info?.icon}</span>
              <div>
                <h2>{info?.title} デモ</h2>
                <p>{info?.desc}</p>
              </div>
            </div>
            <div className="demo-content">
              <ActiveDemo key={active} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="pricing-section" id="pricing">
        <div className="section-inner">
          <div className="section-header">
            <h2>料金プラン</h2>
            <p>ビジネス規模に合わせた柔軟なプランをご用意</p>
          </div>
          <div className="pricing-grid">
            {[
              {
                name: 'ライト', init: '120,000', monthly: '20,000',
                desc: 'まずは手軽にAIシステムを導入したい方へ',
                features: ['テンプレート導入', '基本デザイン調整', '簡易サポート'],
                cta: '今すぐ始める', highlight: false,
              },
              {
                name: 'スタンダード', init: '300,000', monthly: '30,000',
                desc: 'より本格的に活用したいビジネス向け',
                features: ['一部カスタム対応', 'デザイン調整', '機能追加相談', '月1回 改善提案'],
                cta: '最も人気', highlight: true,
              },
              {
                name: 'プレミアム', init: '500,000', monthly: '40,000',
                desc: '本格導入・成長を加速させたい方へ',
                features: ['複数機能の組み合わせ', 'オリジナル設計', '導線設計', '継続改善サポート'],
                cta: '相談する', highlight: false,
                suffix: true,
              },
            ].map(p => (
              <div key={p.name} className={`pricing-card${p.highlight ? ' highlight' : ''}`}>
                {p.highlight && <div className="pricing-pop-badge">人気No.1</div>}
                <h3>{p.name}</h3>
                <p className="pricing-desc">{p.desc}</p>
                <div className="pricing-price-box">
                  <div className="pp-init">初期費用 <strong>¥{p.init}</strong>円{p.suffix ? '〜' : ''}</div>
                  <div className="pp-monthly">月額 <strong>¥{p.monthly}</strong>円{p.suffix ? '〜' : ''}</div>
                </div>
                <ul className="pricing-features">
                  {p.features.map(f => <li key={f}>✓ {f}</li>)}
                </ul>
                <a href="#contact" className={`pricing-cta-btn${p.highlight ? ' pc-primary' : ' pc-outline'}`} onClick={(e) => { e.preventDefault(); openModal() }}>{p.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <h2>まずは無料相談から</h2>
          <p>あなたのビジネスに最適なAIシステムをご提案します。<br />30分の無料コンサルティングをご活用ください。</p>
          <div className="cta-actions">
            <a href="#contact" className="btn-cta-primary" onClick={(e) => { e.preventDefault(); openModal() }}>無料相談を申し込む</a>

          </div>
          <p className="cta-note">※ 営業時間：平日 10:00〜18:00 ｜ 返答率99% ｜ 平均応答2時間以内</p>
        </div>
      </section>

      {/* ── Cat Puzzle Game（おまけ体験デモ） ── */}
      <CatGame />

      {/* ── Contact Modal ── */}
      <ContactModal isOpen={modalOpen} onClose={closeModal} />

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo"><span>⚡</span><span>AI<strong>カタログ</strong></span></div>
          <p>© 2026 AIカタログ. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
