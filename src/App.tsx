import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Suspense, lazy, useState } from "react"
import { AuthProvider, useAuth } from "./lib/AuthContext"
import { Toaster } from "sonner"
import { useTranslation } from "react-i18next"
import { AiAssistant } from "./components/AiAssistant"
import { NotificationManager } from "./components/NotificationManager"
import { Button } from "./components/ui/button"

const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })))
const Products = lazy(() => import("./pages/Products").then(m => ({ default: m.Products })))
const AddProduct = lazy(() => import("./pages/AddProduct").then(m => ({ default: m.AddProduct })))
const EditProduct = lazy(() => import("./pages/EditProduct").then(m => ({ default: m.EditProduct })))
const Orders = lazy(() => import("./pages/Orders").then(m => ({ default: m.Orders })))
const SellerList = lazy(() => import("./pages/sellers/SellerList").then(m => ({ default: m.SellerList })))
const SellerApproval = lazy(() => import("./pages/sellers/SellerApproval").then(m => ({ default: m.SellerApproval })))
const SellerRegistrationPage = lazy(() => import("./pages/sellers/SellerRegistrationPage").then(m => ({ default: m.SellerRegistrationPage })))
const Customers = lazy(() => import("./pages/Customers").then(m => ({ default: m.Customers })))
const CustomerService = lazy(() => import("./pages/CustomerService").then(m => ({ default: m.CustomerService })))
const Marketing = lazy(() => import("./pages/Marketing").then(m => ({ default: m.Marketing })))
const Affiliate = lazy(() => import("./pages/Affiliate").then(m => ({ default: m.Affiliate })))
const Purchasing = lazy(() => import("./pages/Purchasing").then(m => ({ default: m.Purchasing })))
const Accounting = lazy(() => import("./pages/finance/Accounting").then(m => ({ default: m.Accounting })))
const Reconciliation = lazy(() => import("./pages/finance/Reconciliation").then(m => ({ default: m.Reconciliation })))
const PnL = lazy(() => import("./pages/finance/PnL").then(m => ({ default: m.PnL })))
const PaymentWallet = lazy(() => import("./pages/PaymentWallet"))
const Employees = lazy(() => import("./pages/hr/Employees").then(m => ({ default: m.Employees })))
const TimeAttendance = lazy(() => import("./pages/hr/TimeAttendance").then(m => ({ default: m.TimeAttendance })))
const Payroll = lazy(() => import("./pages/hr/Payroll").then(m => ({ default: m.Payroll })))
const Performance = lazy(() => import("./pages/hr/Performance").then(m => ({ default: m.Performance })))
const SocialInsurance = lazy(() => import("./pages/hr/SocialInsurance").then(m => ({ default: m.SocialInsurance })))
const Recruitment = lazy(() => import("./pages/hr/Recruitment").then(m => ({ default: m.Recruitment })))
const PIT = lazy(() => import("./pages/hr/PIT").then(m => ({ default: m.PIT })))
const Goals = lazy(() => import("./pages/hr/Goals").then(m => ({ default: m.Goals })))
const HRInfo = lazy(() => import("./pages/hr/HRInfo").then(m => ({ default: m.HRInfo })))
const LeaveManagement = lazy(() => import("./pages/hr/LeaveManagement").then(m => ({ default: m.LeaveManagement })))
const AssetsPage = lazy(() => import("./pages/admin-workspace/AssetsPage").then(m => ({ default: m.AssetsPage })))
const StationeryPage = lazy(() => import("./pages/admin-workspace/StationeryPage").then(m => ({ default: m.StationeryPage })))
const BookingPage = lazy(() => import("./pages/admin-workspace/BookingPage").then(m => ({ default: m.BookingPage })))
const RequestsPage = lazy(() => import("./pages/admin-workspace/RequestsPage").then(m => ({ default: m.RequestsPage })))
const DocumentsPage = lazy(() => import("./pages/admin-workspace/DocumentsPage").then(m => ({ default: m.DocumentsPage })))
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })))
const Sales = lazy(() => import("./pages/Sales").then(m => ({ default: m.Sales })))
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })))
const LiveHub = lazy(() => import("./pages/LiveHub").then(m => ({ default: m.LiveHub })))
const Advertising = lazy(() => import("./pages/Advertising").then(m => ({ default: m.Advertising })))
const LegalAIAgentPage = lazy(() => import("./pages/legal/LegalAIAgentPage").then(m => ({ default: m.LegalAIAgentPage })))
const LegalBrandPortalPage = lazy(() => import("./pages/legal/LegalBrandPortalPage").then(m => ({ default: m.LegalBrandPortalPage })))
const LegalDisputePage = lazy(() => import("./pages/legal/LegalDisputePage").then(m => ({ default: m.LegalDisputePage })))
const LegalCompliancePage = lazy(() => import("./pages/legal/LegalCompliancePage").then(m => ({ default: m.LegalCompliancePage })))
const LegalContractsPage = lazy(() => import("./pages/legal/LegalContractsPage").then(m => ({ default: m.LegalContractsPage })))
const SellerFinance = lazy(() => import("./pages/SellerFinance").then(m => ({ default: m.SellerFinance })))
const SocialCommerce = lazy(() => import("./pages/SocialCommerce").then(m => ({ default: m.SocialCommerce })))
const BusinessPlanning = lazy(() => import("./pages/planning/BusinessPlanning").then(m => ({ default: m.BusinessPlanning })))
const KolManagement = lazy(() => import("./pages/KolManagement"))
const WorkspaceDashboard = lazy(() => import("./pages/workspace/Dashboard").then(m => ({ default: m.Dashboard })))
const WorkspaceTasks = lazy(() => import("./pages/workspace/Tasks").then(m => ({ default: m.Tasks })))
const WorkspaceChat = lazy(() => import("./pages/workspace/Chat").then(m => ({ default: m.Chat })))
const WorkspaceEmail = lazy(() => import("./pages/workspace/Email").then(m => ({ default: m.Email })))
const WorkspaceCalendar = lazy(() => import("./pages/workspace/Calendar").then(m => ({ default: m.Calendar })))
const ExecutiveCenter = lazy(() => import("./pages/executive/ExecutiveCenter"))
const Automation = lazy(() => import("./pages/Automation"))
const MarketIntelligence = lazy(() => import("./pages/MarketIntelligence"))
const ContentStudio = lazy(() => import("./pages/ContentStudio"))
const Loyalty = lazy(() => import("./pages/Loyalty"))
const Logistics = lazy(() => import("./pages/Logistics"))
const EContract = lazy(() => import("./pages/EContract").then(m => ({ default: m.default })))
const InvoiceManagement = lazy(() => import("./pages/finance/InvoiceManagement").then(m => ({ default: m.default })))
const FinancialReport = lazy(() => import("./pages/finance/FinancialReport").then(m => ({ default: m.FinancialReport })))
const FinanceDashboard = lazy(() => import("./pages/finance/FinanceDashboard").then(m => ({ default: m.FinanceDashboard })))
const HRDashboard = lazy(() => import("./pages/hr/HRDashboard").then(m => ({ default: m.HRDashboard })))
const EmployeePortal = lazy(() => import("./pages/hr/EmployeePortal").then(m => ({ default: m.EmployeePortal })))
const WorkflowManagement = lazy(() => import("./pages/admin-workspace/WorkflowManagement").then(m => ({ default: m.WorkflowManagement })))
const AdminDashboard = lazy(() => import("./pages/admin-workspace/AdminDashboard").then(m => ({ default: m.AdminDashboard })))
const NotificationsPage = lazy(() => import("./pages/admin-workspace/NotificationsPage").then(m => ({ default: m.default })))
const GroupBuying = lazy(() => import("./pages/marketing/GroupBuying").then(m => ({ default: m.GroupBuying })))
const PointWallet = lazy(() => import("./pages/loyalty/PointWallet").then(m => ({ default: m.PointWallet })))
const POS = lazy(() => import("./pages/pos/POS").then(m => ({ default: m.POS })))
const POSStoreManagement = lazy(() => import("./pages/pos/POSStoreManagement").then(m => ({ default: m.POSStoreManagement })))
const POSBranchManagement = lazy(() => import("./pages/pos/POSBranchManagement").then(m => ({ default: m.POSBranchManagement })))
const POSStoreRegistration = lazy(() => import("./pages/pos/POSStoreRegistration").then(m => ({ default: m.POSStoreRegistration })))
const POSRegistrationList = lazy(() => import("./pages/pos/POSRegistrationList").then(m => ({ default: m.POSRegistrationList })))
const POSCustomerMenu = lazy(() => import("./pages/pos/POSCustomerMenu").then(m => ({ default: m.POSCustomerMenu })))
const Storefront = lazy(() => import("./pages/Storefront").then(m => ({ default: m.Storefront })))

const PaymentRequest = lazy(() => import("./pages/PaymentRequest"))

function FallbackRoute() {
  const { t } = useTranslation()
  return <div className="p-6 text-center text-muted-foreground">{t("common.moduleUnderConstruction")}</div>
}

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

function ProtectedLayout() {
  const { user, loading, login } = useAuth()
  const { t } = useTranslation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    const { success, error: loginError } = await login(username, password)
    if (!success) {
      setError(loginError || "Login failed. Please try again.")
    } else {
      setError("")
    }
  }

  if (loading) {
    return <LoadingFallback />
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">Dealtot ERP</h1>
            <p className="mt-2 text-muted-foreground">{t("auth.loginToContinue")}</p>
          </div>
          <div className="space-y-4">
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background"
            />
            <Button onClick={handleLogin} className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              Truy cập hệ thống
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <Layout />
}

// App component
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <AiAssistant />
        <NotificationManager />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/pos/register" element={<POSStoreRegistration />} />
            <Route path="/menu/:storeId/:branchId?" element={<POSCustomerMenu />} />
            <Route path="/storefront" element={<Storefront />} />
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products">
                <Route index element={<Navigate to="all" replace />} />
                <Route path="all" element={<Products />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:id" element={<EditProduct />} />
                <Route path="ai-tools" element={<FallbackRoute />} />
              </Route>
              <Route path="workspace">
                <Route index element={<WorkspaceDashboard />} />
                <Route path="tasks" element={<WorkspaceTasks />} />
                <Route path="chat" element={<WorkspaceChat />} />
                <Route path="email" element={<WorkspaceEmail />} />
                <Route path="calendar" element={<WorkspaceCalendar />} />
              </Route>
              <Route path="orders" element={<Orders />} />
              <Route path="sellers">
                <Route index element={<Navigate to="list" replace />} />
                <Route path="list" element={<SellerList />} />
                <Route path="approval" element={<SellerApproval />} />
                <Route path="registration" element={<SellerRegistrationPage />} />
              </Route>
              <Route path="customers" element={<Customers />} />
              <Route path="pos">
                <Route index element={<POSStoreManagement />} />
                <Route path="registrations" element={<POSRegistrationList />} />
                <Route path=":storeId/branches" element={<POSBranchManagement />} />
                <Route path=":storeId/:branchId?" element={<POS />} />
              </Route>
              <Route path="kol-koc" element={<KolManagement />} />
              <Route path="customer-service" element={<CustomerService />} />
              <Route path="marketing">
                <Route index element={<Marketing />} />
                <Route path="group-buying" element={<GroupBuying />} />
              </Route>
              <Route path="loyalty">
                <Route index element={<Loyalty />} />
                <Route path="point-wallet" element={<PointWallet />} />
              </Route>
              <Route path="planning" element={<BusinessPlanning />} />
              <Route path="social" element={<SocialCommerce />} />
              <Route path="advertising" element={<Advertising />} />
              <Route path="affiliate" element={<Affiliate />} />
              <Route path="purchasing" element={<Purchasing />} />
              <Route path="legal">
                <Route index element={<Navigate to="ai-agent" replace />} />
                <Route path="ai-agent" element={<LegalAIAgentPage />} />
                <Route path="brand-portal" element={<LegalBrandPortalPage />} />
                <Route path="dispute" element={<LegalDisputePage />} />
                <Route path="compliance" element={<LegalCompliancePage />} />
                <Route path="contracts" element={<LegalContractsPage />} />
              </Route>
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
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="reports" element={<FinancialReport />} />
              </Route>
              <Route path="hr">
                <Route index element={<HRDashboard />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="social-insurance" element={<SocialInsurance />} />
                <Route path="recruitment" element={<Recruitment />} />
                <Route path="employees" element={<Employees />} />
                <Route path="portal" element={<EmployeePortal />} />
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
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="workflow" element={<WorkflowManagement />} />
                <Route path="payment-request" element={<PaymentRequest />} />
              </Route>
              <Route path="analytics" element={<Analytics />} />
              <Route path="sales" element={<Sales />} />
              <Route path="live" element={<LiveHub />} />
              <Route path="automation" element={<Automation />} />
              <Route path="market-intelligence" element={<MarketIntelligence />} />
              <Route path="content-studio" element={<ContentStudio />} />
              <Route path="logistics" element={<Logistics />} />
              <Route path="e-contract" element={<EContract />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<FallbackRoute />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}



