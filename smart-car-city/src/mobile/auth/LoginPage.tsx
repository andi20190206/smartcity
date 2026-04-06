import { useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 36px', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', top: -100, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,53,46,0.04) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,26,46,0.03) 0%, transparent 70%)' }} />

      <div className="anim" style={{ marginTop: 110 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: 'linear-gradient(135deg, #1A1A2E, #2D2D44)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(26,26,46,0.25)',
        }}>
          <Car size={38} color="var(--brand-soft)" strokeWidth={1.5} />
        </div>
      </div>
      <div className="anim d1" style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginTop: 18, letterSpacing: 2 }}>唯车帮</div>
      <div className="anim d2" style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, letterSpacing: 1 }}>二手车线上经销平台</div>

      <div className="anim d3" style={{ width: '100%', marginTop: 56, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn-primary" onClick={() => navigate('/home')}>微信账号快捷登录</button>
        <button className="btn-secondary" style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }} onClick={() => navigate('/home')}>用户名密码登录</button>
      </div>

      <div style={{ position: 'fixed', bottom: 36, left: 0, right: 0, textAlign: 'center' }}>
        <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <input type="checkbox" style={{ accentColor: 'var(--brand)' }} />
          已阅读并同意 <span style={{ color: 'var(--brand)', fontWeight: 500 }}>《用户服务协议》</span>
        </label>
      </div>
    </div>
  )
}
