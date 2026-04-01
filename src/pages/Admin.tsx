import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, LogOut } from "lucide-react";
import { adminAuth } from "@/lib/adminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook/admin-ui-test";

const GET_DETAILS_BASE =
  "https://annettepartida.app.n8n.cloud/webhook/97284c1f-4486-43a3-854a-19e0251e705a/get_details";

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

interface LoanDetails {
  images: { name: string; url: string }[];
  reasonForLoan: string;
  address: string;
  uploadedDocuments: { name: string; url: string }[];
}

const statusColors: Record<AppStatus, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  "Documents Requested": "bg-violet-100 text-violet-700",
};

const parseFiles = (value: unknown): { name: string; url: string }[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((file, idx) => {
      if (typeof file === "string") {
        return { name: `File ${idx + 1}`, url: file };
      }
      if (file && typeof file === "object") {
        const record = file as Record<string, unknown>;
        const url = typeof record.url === "string" ? record.url : "";
        const name =
          typeof record.filename === "string"
            ? record.filename
            : typeof record.name === "string"
              ? record.name
              : `File ${idx + 1}`;
        return url ? { name, url } : null;
      }
      return null;
    })
    .filter((file): file is { name: string; url: string } => Boolean(file));
};

const parseImages = (value: unknown): { name: string; url: string }[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, idx) => {
      if (typeof item === "string") {
        return { name: `Image ${idx + 1}`, url: item };
      }
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const url =
          typeof record.url === "string"
            ? record.url
            : typeof record.src === "string"
              ? record.src
              : "";
        const name =
          typeof record.name === "string"
            ? record.name
            : typeof record.filename === "string"
              ? record.filename
              : `Image ${idx + 1}`;
        return url ? { name, url } : null;
      }
      return null;
    })
    .filter((img): img is { name: string; url: string } => Boolean(img));
};

/** Normalize n8n Respond to Webhook body: flat root or nested under `data`. */
const normalizeDetailsResponse = (raw: unknown): LoanDetails => {
  let payload: unknown = raw;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (inner !== undefined && inner !== null) payload = inner;
  }
  if (!payload || typeof payload !== "object") {
    return { images: [], reasonForLoan: "", address: "", uploadedDocuments: [] };
  }
  const o = payload as Record<string, unknown>;
  return {
    images: parseImages(o.images),
    reasonForLoan:
      typeof o.reasonForLoan === "string"
        ? o.reasonForLoan
        : typeof o["Reason for Loan"] === "string"
          ? o["Reason for Loan"]
          : "",
    address:
      typeof o.address === "string"
        ? o.address
        : typeof o.Address === "string"
          ? o.Address
          : "",
    uploadedDocuments: parseFiles(o.uploadedDocuments ?? o["Uploaded Documents"]),
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
  const url = `${GET_DETAILS_BASE}/${encodeURIComponent(loanId)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  const json: unknown = await res.json();
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
                            <TableCell colSpan={6} className="border-t-0">
                              <div className="rounded-md border border-border bg-background p-4 space-y-4">
                                {detailLoading ? (
                                  <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading details...</span>
                                  </div>
                                ) : detailErr ? (
                                  <p className="text-sm text-destructive py-2">{detailErr}</p>
                                ) : details ? (
                                  <>
                                    <div>
                                      <p className="text-sm font-semibold text-foreground mb-2">Images</p>
                                      {details.images.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                          {details.images.map((image, index) => (
                                            <a
                                              key={`${loanId}-image-${index}`}
                                              href={image.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="block"
                                            >
                                              <img
                                                src={image.url}
                                                alt={image.name}
                                                className="h-24 w-24 rounded-md object-cover border border-border"
                                              />
                                            </a>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">No images uploaded</p>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">Reason for Loan</p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {details.reasonForLoan.trim() ? details.reasonForLoan : "Not provided"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">Address</p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {details.address.trim() ? details.address : "Not provided"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-foreground mb-2">Uploaded Documents</p>
                                      {details.uploadedDocuments.length > 0 ? (
                                        <ul className="space-y-1">
                                          {details.uploadedDocuments.map((doc, index) => (
                                            <li key={`${loanId}-doc-${index}`}>
                                              <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-primary underline-offset-2 hover:underline"
                                              >
                                                {doc.name}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">No documents uploaded</p>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-sm text-muted-foreground py-2">No details available.</p>
                                )}
                              </div>
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
