import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, LogOut } from "lucide-react";
import { adminAuth } from "@/lib/adminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoanDetailsPanel, { type LoanDetails } from "@/components/LoanDetailsPanel";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook/admin-ui-test";

const getLoanDetailsWebhookUrl = (loanId: string) =>
  `https://annettepartida.app.n8n.cloud/webhook/97284c1f-4486-43a3-854a-19e0251e705a/get_details/${encodeURIComponent(loanId)}`;

type AppStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Documents Requested";

interface Application {
  id: string;
  fullName: string;
  dateSubmitted: string;
  email: string;
  loanAmount: number;
  status: AppStatus;
}

const statusColors: Record<AppStatus, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  "Documents Requested": "bg-violet-100 text-violet-700",
};

const normalizeDetailsResponse = (raw: unknown): LoanDetails => {
  let payload: unknown = raw;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (inner !== undefined && inner !== null) payload = inner;
  }
  if (!payload || typeof payload !== "object") {
    return { reasonForLoan: "", address: "", dateOfBirth: "", documents: [] };
  }
  const o = payload as Record<string, unknown>;

  const rawDocs = Array.isArray(o.documents) ? o.documents : [];
  const documents = rawDocs.map((d: any) => ({
    document: typeof d?.document === "string" ? d.document : "Untitled",
    download_urls: Array.isArray(d?.download_urls)
      ? d.download_urls.filter((u: unknown) => typeof u === "string")
      : [],
  }));

  return {
    reasonForLoan:
      typeof o.reasonForLoan === "string" ? o.reasonForLoan
      : typeof o["Reason for Loan"] === "string" ? o["Reason for Loan"]
      : "",
    address:
      typeof o.address === "string" ? o.address
      : typeof o.Address === "string" ? o.Address
      : "",
    dateOfBirth:
      typeof o.dateOfBirth === "string" ? o.dateOfBirth
      : typeof o.date_of_birth === "string" ? o.date_of_birth
      : "",
    documents,
  };
};

const parseApplications = (response: unknown): Application[] => {
  const rawList = (response as any)?.data ?? [];
  if (!Array.isArray(rawList)) return [];

  return rawList.map((item: any, idx: number) => ({
    id: item.id ?? item["Application ID"] ?? item.loanId ?? String(idx + 1),
    fullName: item["Full Name"] ?? "",
    dateSubmitted: item.createdTime ?? new Date().toISOString(),
    email: item.Email ?? "",
    loanAmount: Number(item["Loan Amount Requested"] ?? 0),
    status: (item.Status ?? "Submitted") as AppStatus,
  }));
};

const fireWebhook = async (payload: Record<string, unknown>) => {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res;
  } catch {
    return null;
  }
};

const fetchLoanDetails = async (loanId: string): Promise<LoanDetails> => {
  const res = await fetch(getLoanDetailsWebhookUrl(loanId), { method: "GET" });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error("Invalid response from server");
  }
  return normalizeDetailsResponse(json);
};

const Admin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [detailsLoading, setDetailsLoading] = useState<Record<string, boolean>>({});
  const [detailsError, setDetailsError] = useState<Record<string, string | null>>({});
  const [detailsByLoanId, setDetailsByLoanId] = useState<Record<string, LoanDetails>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.logout();
    navigate("/admin-login", { replace: true });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fireWebhook({
        event: "admin_page_load",
        timestamp: new Date().toISOString(),
      });
      if (res && res.ok) {
        const data = await res.json();
        const parsed = parseApplications(data);
        setApplications(parsed);
      } else {
        console.error("Webhook response error:", res?.status, res?.statusText);
        toast({
          title: "Failed to load applications",
          description: `Server responded with ${res?.status ?? "no response"}. Check console for details.`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Webhook fetch error:", err);
      toast({
        title: "Connection Error",
        description: "Could not reach the webhook. Please check CORS settings and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadDetails = async (loanId: string) => {
    setDetailsLoading((prev) => ({ ...prev, [loanId]: true }));
    setDetailsError((prev) => ({ ...prev, [loanId]: null }));
    try {
      const details = await fetchLoanDetails(loanId);
      setDetailsByLoanId((prev) => ({ ...prev, [loanId]: details }));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not load details";
      setDetailsError((prev) => ({ ...prev, [loanId]: message }));
    } finally {
      setDetailsLoading((prev) => ({ ...prev, [loanId]: false }));
    }
  };

  const handleToggleDetails = (loanId: string) => {
    setExpandedRows((prev) => {
      const opening = !prev[loanId];
      if (opening) {
        void loadDetails(loanId);
      }
      return { ...prev, [loanId]: opening };
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
          <span className="text-lg font-serif font-bold text-primary">Fox Finance Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Loan Applications</h1>

        <Card className="shadow-soft border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-serif">All Applications</CardTitle>
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
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading applications...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No applications found. Data will appear here when the webhook returns records from Airtable.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => {
                    const loanId = app.id;
                    const details = detailsByLoanId[loanId];
                    const detailLoading = detailsLoading[loanId];
                    const detailErr = detailsError[loanId];

                    return (
                      <Fragment key={loanId}>
                        <TableRow className="hover:bg-muted/30 transition-colors align-top">
                          <TableCell className="font-medium">{app.fullName}</TableCell>
                          <TableCell>{new Date(app.dateSubmitted).toLocaleDateString()}</TableCell>
                          <TableCell className="text-muted-foreground">{app.email}</TableCell>
                          <TableCell>${app.loanAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div
                              aria-label={`Status: ${app.status}`}
                              className={`inline-flex min-w-[130px] h-8 items-center justify-center rounded-md px-3 text-xs font-semibold opacity-80 cursor-not-allowed ${statusColors[app.status] ?? "bg-muted text-muted-foreground"}`}
                            >
                              {app.status}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleDetails(loanId)}
                              className="text-xs h-8"
                            >
                              {expandedRows[loanId] ? "Hide details" : "Show details"}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedRows[loanId] ? (
                          <TableRow className="bg-muted/20">
                            <TableCell colSpan={6} className="border-t-0 p-3">
                              <LoanDetailsPanel
                                loading={!!detailLoading}
                                error={detailErr ?? null}
                                details={details ?? null}
                                loanId={loanId}
                              />
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
