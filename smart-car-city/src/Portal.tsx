import { Smartphone, Monitor } from 'lucide-react'

export default function Portal() {
  const openInNewWindow = (path: string) => {
    window.open(`${window.location.origin}${window.location.pathname}#${path}`, '_blank')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 50%, #1A1A2E 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', -apple-system, sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, background: 'var(--brand)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 20,
          boxShadow: '0 8px 32px rgba(232,53,46,0.3)',
        }}>车</div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>唯车帮 · 智慧车城</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>请选择要进入的平台</p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px' }}>
        {/* 小程序端 */}
        <div
          onClick={() => openInNewWindow('/home')}
          style={{
            width: 260, padding: '40px 32px', borderRadius: 20, cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #34C759, #30D158)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(52,199,89,0.3)',
          }}>
            <Smartphone size={28} color="#fff" />
          </div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>车商端小程序</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.5 }}>
            采购录入 · 库存查看 · 资金管理
          </div>
        </div>

        {/* PC管理后台 */}
        <div
          onClick={() => openInNewWindow('/pc')}
          style={{
            width: 260, padding: '40px 32px', borderRadius: 20, cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #007AFF, #5856D6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
          }}>
            <Monitor size={28} color="#fff" />
          </div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>PC 管理后台</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.5 }}>
            审批管理 · 清分结算 · 配置中心
          </div>
        </div>
      </div>

      <div style={{ marginTop: 48, color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
        点击卡片将在新窗口中打开对应平台
      </div>
    </div>
  )
}
