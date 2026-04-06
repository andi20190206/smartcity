import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Download, UploadCloud } from 'lucide-react'
import { mockImportResult } from '../../shared/mock/purchaseMock'

export default function BatchImport() {
  const [imported, setImported] = useState(false)
  const navigate = useNavigate()
  const successCount = mockImportResult.filter((r) => r.status === 'success').length
  const errorCount = mockImportResult.filter((r) => r.status === 'error').length

  return (
    <div className="page" style={{ paddingBottom: imported ? 76 : 0 }}>
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">批量导入</div>
        <div className="nav-right" />
      </div>

      <div className="section-hd">第一步：下载模板</div>
      <div style={{ background: '#fff', margin: '0 16px', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginBottom: 12 }}>请先下载标准Excel模板，按模板格式填写车辆信息后上传。批量采购要求所有车辆属于同一卖方。</div>
        <button className="weui-btn weui-btn_default" style={{ borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14 }}>
          <Download size={16} /> 下载导入模板
        </button>
      </div>

      <div className="section-hd">第二步：上传文件</div>
      <div style={{ background: '#fff', margin: '0 16px', borderRadius: 8, padding: 16 }}>
        <div className="upload-area" onClick={() => { setImported(true) }}>
          <UploadCloud size={32} color="var(--weui-FG-2)" />
          <div style={{ fontSize: 14, marginTop: 8 }}>点击上传Excel文件</div>
          <div style={{ fontSize: 12, color: 'var(--weui-FG-1)', marginTop: 4 }}>支持 .xlsx / .xls 格式</div>
        </div>
      </div>

      {imported && (
        <>
          <div className="section-hd" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>导入结果预览</span>
            <span style={{ fontSize: 13 }}>
              <span style={{ color: 'var(--weui-GREEN)' }}>成功 {successCount}</span> | <span style={{ color: 'var(--weui-RED)' }}>失败 {errorCount}</span>
            </span>
          </div>
          <div style={{ background: '#fff', margin: '0 16px', borderRadius: 8, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: 500, color: 'var(--weui-FG-1)' }}>车牌</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: 500, color: 'var(--weui-FG-1)' }}>品牌型号</th>
                  <th style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: 'var(--weui-FG-1)' }}>价格(万)</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontWeight: 500, color: 'var(--weui-FG-1)' }}>状态</th>
                </tr>
              </thead>
              <tbody>
                {mockImportResult.map((row, i) => (
                  <tr key={i} style={{ borderTop: '0.5px solid var(--weui-FG-3)' }}>
                    <td style={{ padding: '10px 8px' }}>{row.plateNo || '-'}</td>
                    <td style={{ padding: '10px 8px' }}>{row.brandModel}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>{row.price}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      {row.status === 'success' ? (
                        <span className="tag tag-success">成功</span>
                      ) : (
                        <div><span className="tag tag-error">失败</span><div style={{ fontSize: 11, color: 'var(--weui-RED)', marginTop: 2 }}>{row.errorMsg}</div></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bottom-bar">
            <button className="weui-btn weui-btn_primary" style={{ flex: 1, background: 'var(--weui-brand)', borderRadius: 8, fontSize: 14 }}
              onClick={() => navigate('/purchase/photo-supplement')}>
              提交 {successCount} 条有效数据，进入图片补充
            </button>
          </div>
        </>
      )}
    </div>
  )
}
