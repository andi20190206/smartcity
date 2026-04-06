import { Routes, Route, Navigate } from 'react-router-dom'
import TabBarLayout from './mobile/common/TabBarLayout'
import HomePage from './mobile/home/HomePage'
import VehicleSourcePage from './mobile/vehicle-source/VehicleSourcePage'
import DealerPage from './mobile/dealer/DealerPage'
import ProfilePage from './mobile/profile/ProfilePage'
import LoginPage from './mobile/auth/LoginPage'
import PurchaseList from './mobile/purchase/PurchaseList'
import PurchaseCreate from './mobile/purchase/PurchaseCreate'
import PurchaseDetail from './mobile/purchase/PurchaseDetail'
import BatchImport from './mobile/purchase/BatchImport'
import PhotoSupplement from './mobile/purchase/PhotoSupplement'
import PhotoUpload from './mobile/purchase/PhotoUpload'
import ApprovalList from './mobile/approval/ApprovalList'
import ApprovalDetail from './mobile/approval/ApprovalDetail'

// PC 端
import PCLayout from './pc/layout/PCLayout'
import PurchaseListPC from './pc/purchase/PurchaseListPC'
import PurchaseDetailPC from './pc/purchase/PurchaseDetailPC'
import ApprovalListPC from './pc/approval/ApprovalListPC'
import ApprovalDetailPC from './pc/approval/ApprovalDetailPC'
import ApprovalConfigPC from './pc/approval/ApprovalConfigPC'
import FundListPC from './pc/fund/FundListPC'
import AdvanceDetailPC from './pc/fund/AdvanceDetailPC'

// 移动端 - 资金管理
import FundHome from './mobile/fund/FundHome'
import AdvanceDetail from './mobile/fund/AdvanceDetail'
import AdvanceCreate from './mobile/fund/AdvanceCreate'
import InTransitList from './mobile/fund/InTransitList'
import PurchaseCreatePC from './pc/purchase/PurchaseCreatePC'

// 移动端 - 销售管理
import SalesList from './mobile/sales/SalesList'
import SalesCreate from './mobile/sales/SalesCreate'
import SalesDetail from './mobile/sales/SalesDetail'

// PC 端 - 销售管理
import SalesListPC from './pc/sales/SalesListPC'
import SalesCreatePC from './pc/sales/SalesCreatePC'
import SalesDetailPC from './pc/sales/SalesDetailPC'

// 移动端 - 库存监管
import InventoryHome from './mobile/inventory/InventoryHome'
import InventoryDetail from './mobile/inventory/InventoryDetail'

// PC 端 - 库存监管
import InventoryListPC from './pc/inventory/InventoryListPC'
import InventoryDetailPC from './pc/inventory/InventoryDetailPC'

// PC 端 - 清分结算
import SettlementListPC from './pc/settlement/SettlementListPC'
import SettlementDetailPC from './pc/settlement/SettlementDetailPC'

// 移动端 - 合同管理
import ContractList from './mobile/contract/ContractList'
import ContractDetail from './mobile/contract/ContractDetail'

// PC 端 - 合同管理
import ContractListPC from './pc/contract/ContractListPC'
import ContractDetailPC from './pc/contract/ContractDetailPC'

export default function App() {
  return (
    <Routes>
      {/* ===== PC 端 ===== */}
      <Route path="/pc" element={<PCLayout />}>
        <Route index element={<Navigate to="/pc/purchase" replace />} />
        <Route path="purchase" element={<PurchaseListPC />} />
        <Route path="purchase/create" element={<PurchaseCreatePC />} />
        <Route path="purchase/:id" element={<PurchaseDetailPC />} />
        <Route path="fund" element={<FundListPC />} />
        <Route path="fund/advance/:id" element={<AdvanceDetailPC />} />
        <Route path="sales" element={<SalesListPC />} />
        <Route path="sales/create" element={<SalesCreatePC />} />
        <Route path="sales/:id" element={<SalesDetailPC />} />
        <Route path="approval" element={<ApprovalListPC />} />
        <Route path="approval/config" element={<ApprovalConfigPC />} />
        <Route path="approval/:id" element={<ApprovalDetailPC />} />
        <Route path="inventory" element={<InventoryListPC />} />
        <Route path="inventory/:id" element={<InventoryDetailPC />} />
        <Route path="settlement" element={<SettlementListPC />} />
        <Route path="settlement/:id" element={<SettlementDetailPC />} />
        <Route path="contract" element={<ContractListPC />} />
        <Route path="contract/:id" element={<ContractDetailPC />} />
      </Route>

      {/* ===== 移动端 ===== */}
      <Route element={<TabBarLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/vehicle-source" element={<VehicleSourcePage />} />
        <Route path="/dealer" element={<DealerPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/purchase" element={<PurchaseList />} />
      <Route path="/purchase/create" element={<PurchaseCreate />} />
      <Route path="/purchase/detail/:id" element={<PurchaseDetail />} />
      <Route path="/purchase/batch-import" element={<BatchImport />} />
      <Route path="/purchase/photo-supplement" element={<PhotoSupplement />} />
      <Route path="/purchase/photo-upload/:id" element={<PhotoUpload />} />

      {/* ===== 移动端 - 资金管理 ===== */}
      <Route path="/fund" element={<FundHome />} />
      <Route path="/fund/advance/create" element={<AdvanceCreate />} />
      <Route path="/fund/advance/:id" element={<AdvanceDetail />} />
      <Route path="/fund/in-transit" element={<InTransitList />} />

      {/* ===== 移动端 - 审批中心 ===== */}
      <Route path="/approval" element={<ApprovalList />} />
      <Route path="/approval/detail/:id" element={<ApprovalDetail />} />

      {/* ===== 移动端 - 销售管理 ===== */}
      <Route path="/sales" element={<SalesList />} />
      <Route path="/sales/create" element={<SalesCreate />} />
      <Route path="/sales/detail/:id" element={<SalesDetail />} />

      {/* ===== 移动端 - 库存监管 ===== */}
      <Route path="/inventory" element={<InventoryHome />} />
      <Route path="/inventory/detail/:id" element={<InventoryDetail />} />

      {/* ===== 移动端 - 合同管理 ===== */}
      <Route path="/contract" element={<ContractList />} />
      <Route path="/contract/detail/:id" element={<ContractDetail />} />

      {/* 默认跳转 */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
