import { useState } from "react"

const CATALOG = [
  { id:1,  ic:"📱", title:"SNS自動化AI体験",       desc:"投稿作成・導線設計・集客戦略をAIが提案するSNS支援体験。",             tags:["SNS","自動化","集客"],          url:"https://sns-diagnosis-one.vercel.app", ready:true  },
  { id:2,  ic:"💕", title:"恋愛相談AI体験",         desc:"感情分析・相手心理・未来予測をもとに相談できる恋愛分析体験。",         tags:["恋愛","感情分析","相談"],        url:null, ready:false },
  { id:3,  ic:"🪞", title:"顔分析カルテAI体験",     desc:"第一印象・魅力・改善点をカルテ形式で分析する美容診断体験。",           tags:["美容","顔分析","カルテ"],        url:null, ready:false },
  { id:4,  ic:"🧴", title:"美容成分診断AI体験",     desc:"化粧品成分や使用傾向を分析し、未来の肌リスクを可視化する体験。",       tags:["美容","成分診断","スキンケア"],  url:null, ready:false },
  { id:5,  ic:"🖐", title:"手相診断AI体験",         desc:"手の特徴から性格傾向・強み・未来傾向を分析する診断体験。",             tags:["手相","性格分析","占い"],        url:null, ready:false },
  { id:6,  ic:"👗", title:"AIファッション体験",      desc:"服装提案・着せ替え・クローゼット連携によるコーデ提案体験。",           tags:["ファッション","コーデ","スタイル"],url:null, ready:false },
  { id:7,  ic:"✂", title:"AI型紙エンジン体験",      desc:"頭の中のデザインを3D化し、型紙設計へつなげる未来型制作体験。",         tags:["型紙","3D","デザイン"],          url:null, ready:false },
  { id:8,  ic:"📈", title:"DeFi自動運用AI体験",     desc:"暗号資産のレンジ調整や手数料運用をシミュレーションできる金融AI体験。", tags:["DeFi","暗号資産","運用"],        url:null, ready:false },
  { id:9,  ic:"🪙", title:"暗号資産分析AI体験",     desc:"市場情報・銘柄分析・AI予測をもとに判断材料を得られる分析体験。",       tags:["暗号資産","分析","予測"],        url:null, ready:false },
  { id:10, ic:"💰", title:"XCOSS Revenue OS体験",  desc:"イベント・マルシェの集客、紹介、収益循環を可視化する体験。",           tags:["収益","イベント","マルシェ"],    url:null, ready:false },
  { id:11, ic:"🗓", title:"イベント管理アプリ体験", desc:"予約・出店申込・顧客管理・運営フローを体験できる管理システム。",         tags:["イベント","予約","管理"],        url:null, ready:false },
  { id:12, ic:"🎬", title:"シネマティックWEB体験",  desc:"近未来型LP・世界観デザイン・動きのあるWEB表現を生成する制作体験。",   tags:["WEB","LP","デザイン"],          url:null, ready:false },
]

const TAG_COLORS = ["rgba(196,181,253,.8)","rgba(125,211,252,.8)","rgba(134,239,172,.8)","rgba(249,168,212,.8)","rgba(251,191,36,.8)"]

export default function ExperienceCatalog() {
  const [hover, setHover] = useState(null)
  const [modal, setModal] = useState(null)

  function closeModal() { setModal(null) }

  return (
    <section className="experience-section">
      <div className="experience-aurora" aria-hidden="true">
        <div className="experience-orb experience-orb-a" />
        <div className="experience-orb experience-orb-b" />
      </div>

      <div className="experience-header">
        <div className="experience-eyebrow">Experience Catalog</div>
        <h2 className="experience-title">AIカタログ｜12種類の体験システム</h2>
        <p className="experience-lead">AIカタログでは、さまざまなAIサービスやWEBシステムを、説明だけでなく実際に触って体験できるコンテンツとして展開します。ユーザーは自分に合うAI体験を選び、診断・分析・提案・シミュレーションを通じて、AIで何ができるのかを直感的に理解できます。</p>
      </div>

      <div className="experience-grid">
        {CATALOG.map((item) => (
          <div
            key={item.id}
            className={"experience-card" + (hover === item.id ? " experience-card--hover" : "")}
            onMouseEnter={() => setHover(item.id)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="experience-badge">
              <span className="experience-badge-num">{"#" + String(item.id).padStart(2,"0")}</span>
              {item.ready && <span className="experience-badge-live">● LIVE</span>}
            </div>
            <div className="experience-icon">{item.ic}</div>
            <div className="experience-card-title">{item.title}</div>
            <p className="experience-desc">{item.desc}</p>
            <div className="experience-tags">
              {item.tags.map((t, i) => (
                <span key={t} className="experience-tag" style={{ color: TAG_COLORS[i % TAG_COLORS.length], borderColor: TAG_COLORS[i % TAG_COLORS.length] }}>{t}</span>
              ))}
            </div>
            <button
              className={"experience-button " + (item.ready ? "experience-button--live" : "experience-button--soon")}
              onClick={() => setModal(item)}
            >
              {item.ready ? "体験を見る →" : "体験準備中"}
            </button>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-label">Experience Catalog</div>
                <div className="modal-title">{modal.title}</div>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>{modal.ic}</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,.6)", lineHeight: "1.8", letterSpacing: ".04em", marginBottom: "16px" }}>{modal.desc}</p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
                {modal.tags.map((t, i) => (
                  <span key={t} className="experience-tag" style={{ color: TAG_COLORS[i % TAG_COLORS.length], borderColor: TAG_COLORS[i % TAG_COLORS.length] }}>{t}</span>
                ))}
              </div>
              {modal.ready && modal.url ? (
                <a href={modal.url} target="_blank" rel="noopener noreferrer" className="modal-consult">
                  体験を始める →
                </a>
              ) : (
                <div style={{ background: "rgba(255,255,255,.04)", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "rgba(255,255,255,.35)", letterSpacing: ".06em" }}>
                  この体験システムは現在準備中です
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
