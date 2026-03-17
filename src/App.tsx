import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Products } from "./pages/Products"
import { AddProduct } from "./pages/AddProduct"
import { Orders } from "./pages/Orders"
import { SellerList } from "./pages/sellers/SellerList"
import { SellerApproval } from "./pages/sellers/SellerApproval"
import { SellerRegistrationPage } from "./pages/sellers/SellerRegistrationPage"
import { Customers } from "./pages/Customers"
import { CustomerService } from "./pages/CustomerService"
import { Marketing } from "./pages/Marketing"
import { Affiliate } from "./pages/Affiliate"
import { Purchasing } from "./pages/Purchasing"
import { Accounting } from "./pages/finance/Accounting"
import { Reconciliation } from "./pages/finance/Reconciliation"
import { PnL } from "./pages/finance/PnL"
import PaymentWallet from "./pages/PaymentWallet"
import { Employees } from "./pages/hr/Employees"
import { TimeAttendance } from "./pages/hr/TimeAttendance"
import { Payroll } from "./pages/hr/Payroll"
import { Performance } from "./pages/hr/Performance"
import { SocialInsurance } from "./pages/hr/SocialInsurance"
import { Recruitment } from "./pages/hr/Recruitment"
import { PIT } from "./pages/hr/PIT"
import { Goals } from "./pages/hr/Goals"
import { HRInfo } from "./pages/hr/HRInfo"
import { LeaveManagement } from "./pages/hr/LeaveManagement"
import { AssetsPage } from "./pages/admin-workspace/AssetsPage"
import { StationeryPage } from "./pages/admin-workspace/StationeryPage"
import { BookingPage } from "./pages/admin-workspace/BookingPage"
import { RequestsPage } from "./pages/admin-workspace/RequestsPage"
import { DocumentsPage } from "./pages/admin-workspace/DocumentsPage"
import { Analytics } from "./pages/Analytics"
import { Sales } from "./pages/Sales"
import { Settings } from "./pages/Settings"
import { LiveHub } from "./pages/LiveHub"
import { Advertising } from "./pages/Advertising"
import { Legal } from "./pages/Legal"
import { SellerFinance } from "./pages/SellerFinance"
import { SocialCommerce } from "./pages/SocialCommerce"
import { BusinessPlanning } from "./pages/planning/BusinessPlanning"
import KolManagement from "./pages/KolManagement"
import Workspace from "./pages/workspace"
import ExecutiveCenter from "./pages/executive/ExecutiveCenter"
import Automation from "./pages/Automation"
import MarketIntelligence from "./pages/MarketIntelligence"
import ContentStudio from "./pages/ContentStudio"
import Loyalty from "./pages/Loyalty"
import Logistics from "./pages/Logistics"
import EContract from "./pages/EContract"
import { Toaster } from "sonner"
import { useTranslation } from "react-i18next"
import { FinanceDashboard } from "./pages/finance/FinanceDashboard"
import { HRDashboard } from "./pages/hr/HRDashboard"
import { AdminDashboard } from "./pages/admin-workspace/AdminDashboard"
import { AiAssistant } from "./components/AiAssistant"

function FallbackRoute() {
  const { t } = useTranslation()
  return <div className="p-6 text-center text-muted-foreground">{t("common.moduleUnderConstruction")}</div>
}

// App component
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AiAssistant />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products">
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<Products />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="ai-tools" element={<FallbackRoute />} />
          </Route>
          <Route path="workspace">
            <Route index element={<Workspace />} />
            <Route path="tasks" element={<Workspace />} />
            <Route path="chat" element={<Workspace />} />
            <Route path="email" element={<Workspace />} />
            <Route path="calendar" element={<Workspace />} />
          </Route>
          <Route path="orders" element={<Orders />} />
          <Route path="sellers">
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<SellerList />} />
            <Route path="approval" element={<SellerApproval />} />
            <Route path="registration" element={<SellerRegistrationPage />} />
          </Route>
          <Route path="customers" element={<Customers />} />
          <Route path="kol-koc" element={<KolManagement />} />
          <Route path="customer-service" element={<CustomerService />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="planning" element={<BusinessPlanning />} />
          <Route path="social" element={<SocialCommerce />} />
          <Route path="advertising" element={<Advertising />} />
          <Route path="affiliate" element={<Affiliate />} />
          <Route path="purchasing" element={<Purchasing />} />
          <Route path="legal" element={<Legal />} />
          <Route path="executive">
            <Route index element={<ExecutiveCenter />} />
            <Route path="direction" element={<ExecutiveCenter />} />
            <Route path="strategy" element={<ExecutiveCenter />} />
          </Route>
          <Route path="finance">
            <Route index element={<FinanceDashboard />} />
            <Route path="accounting" element={<Accounting />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="pnl" element={<PnL />} />
            <Route path="payment-wallet" element={<PaymentWallet />} />
            <Route path="seller-finance" element={<SellerFinance />} />
          </Route>
          <Route path="hr">
            <Route index element={<HRDashboard />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="social-insurance" element={<SocialInsurance />} />
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="employees" element={<Employees />} />
            <Route path="time-attendance" element={<TimeAttendance />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="performance" element={<Performance />} />
            <Route path="pit" element={<PIT />} />
            <Route path="goals" element={<Goals />} />
            <Route path="info" element={<HRInfo />} />
          </Route>
          <Route path="admin-workspace">
            <Route index element={<AdminDashboard />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="stationery" element={<StationeryPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>
          <Route path="analytics" element={<Analytics />} />
          <Route path="sales" element={<Sales />} />
          <Route path="live" element={<LiveHub />} />
          <Route path="automation" element={<Automation />} />
          <Route path="market-intelligence" element={<MarketIntelligence />} />
          <Route path="content-studio" element={<ContentStudio />} />
          <Route path="loyalty" element={<Loyalty />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="e-contract" element={<EContract />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<FallbackRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


