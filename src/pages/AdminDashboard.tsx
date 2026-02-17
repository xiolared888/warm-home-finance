import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Landmark, BarChart3, Settings,
  Search, ChevronRight, LogOut, Menu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Applications", icon: FileText, href: "#" },
  { label: "Applicants", icon: Users, href: "#" },
  { label: "Loans", icon: Landmark, href: "#" },
  { label: "Reports", icon: BarChart3, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

const kpis = [
  { label: "Applicants", value: "1,248", icon: Users },
  { label: "Revenue", value: "$865,000", icon: Landmark },
  { label: "Loans", value: "142", icon: FileText },
  { label: "Traffic", value: "18,540", icon: BarChart3 },
];

const applications = [
  { name: "Maria Gonzalez", date: "Jan 12, 2026", email: "maria.gonzalez@email.com", amount: "$3,500", status: "Pending" },
  { name: "Daniel Carter", date: "Jan 14, 2026", email: "daniel.carter@email.com", amount: "$9,200", status: "Approved" },
  { name: "Jasmine Lee", date: "Jan 18, 2026", email: "jasmine.lee@email.com", amount: "$1,250", status: "Declined" },
];

const trafficData = [
  { month: "Jan", visits: 2400 },
  { month: "Feb", visits: 3200 },
  { month: "Mar", visits: 2900 },
  { month: "Apr", visits: 4100 },
  { month: "May", visits: 4800 },
  { month: "Jun", visits: 5600 },
];

const chartConfig = {
  visits: { label: "Visits", color: "hsl(210 35% 40%)" },
};

const statusColors: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Declined: "bg-red-100 text-red-700 border-red-200",
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/30 font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-0 overflow-hidden"} transition-all duration-200 bg-card border-r border-border flex flex-col fixed inset-y-0 left-0 z-40 md:relative`}
      >
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/" className="text-lg font-serif font-bold text-primary truncate">
            Fox Finance
          </Link>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64 h-9 text-sm" />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground">Hello, Admin</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Breadcrumb & Title */}
          <div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">Overview</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fox Finance loan activity and traffic overview
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="shadow-soft border-border/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                    <p className="text-xl font-bold text-foreground font-sans">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card className="shadow-soft border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Latest Loan Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Full Name</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.email} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{app.date}</TableCell>
                      <TableCell className="text-muted-foreground">{app.email}</TableCell>
                      <TableCell>{app.amount}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[app.status]}`}
                        >
                          {app.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Placeholder rows */}
                  {[1, 2, 3].map((i) => (
                    <TableRow key={`placeholder-${i}`}>
                      <TableCell colSpan={6}>
                        <div className="h-10 border-2 border-dashed border-border/40 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground/50">Awaiting new applicant…</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Traffic Chart */}
          <Card className="shadow-soft border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Traffic last 6 months</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(210 35% 40%)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(210 35% 40%)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
