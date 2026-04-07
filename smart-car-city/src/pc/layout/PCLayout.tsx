import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Package, DollarSign, Warehouse, TrendingUp,
  FileText, Settings, Users, Monitor, ChevronLeft, ChevronRight,
  Bell, Search, LayoutGrid, ClipboardCheck,
} from 'lucide-react'
import '../pc.css'

const menuGroups = [
  {
    label: '业务管理',
    items: [
      { key: '/pc/purchase', icon: ShoppingCart, label: '采购管理' },
      { key: '/pc/sales', icon: TrendingUp, label: '销售管理' },
      { key: '/pc/inventory', icon: Warehouse, label: '库存管理' },
      { key: '/pc/registration', icon: ClipboardCheck, label: '签注管理' },
      { key: '/pc/wholesale', icon: Package, label: '批售管理' },
    ],
  },
  {
    label: '财务中心',
    items: [
      { key: '/pc/fund', icon: DollarSign, label: '资金管理' },
      { key: '/pc/settlement', icon: FileText, label: '清分结算' },
      { key: '/pc/contract', icon: FileText, label: '合同管理' },
    ],
  },
  {
    label: '系统设置',
    items: [
      { key: '/pc/approval', icon: LayoutGrid, label: '审批中心' },
      { key: '/pc/tenant', icon: Users, label: '租户管理' },
      { key: '/pc/device', icon: Monitor, label: '设备管理' },
      { key: '/pc/config', icon: Settings, label: '配置中心' },
    ],
  },
]

export default function PCLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname
  const activeItem = menuGroups.flatMap((g) => g.items).find((item) => currentPath.startsWith(item.key))

  return (
    <div className="pc-layout">
      {/* Sider */}
      <aside className={`pc-sider ${collapsed ? 'collapsed' : ''}`}>
        <div className="pc-sider-logo">
          <div className="logo-icon">车</div>
          {!collapsed && <span className="logo-text">智慧车城</span>}
        </div>
        <nav className="pc-sider-menu">
          {menuGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <div className="pc-menu-group-label">{group.label}</div>}
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className={`pc-menu-item ${currentPath.startsWith(item.key) ? 'active' : ''}`}
                  onClick={() => navigate(item.key)}
                >
                  <span className="menu-icon"><item.icon size={18} /></span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="pc-menu-item" onClick={() => setCollapsed(!collapsed)} style={{ justifyContent: collapsed ? 'center' : undefined }}>
            <span className="menu-icon">{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</span>
            {!collapsed && <span>收起菜单</span>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="pc-main" style={{ marginLeft: collapsed ? 64 : 220 }}>
        <header className="pc-header">
          <div className="pc-header-left">
            <div className="breadcrumb">
              <span>智慧车城</span>
              <span>/</span>
              <span className="current">{activeItem?.label || '首页'}</span>
            </div>
          </div>
          <div className="pc-header-right">
            <button className="header-action"><Search size={18} /></button>
            <button className="header-action" style={{ position: 'relative' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#E8352E' }} />
            </button>
            <div className="avatar">陈</div>
          </div>
        </header>
        <div className="pc-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
