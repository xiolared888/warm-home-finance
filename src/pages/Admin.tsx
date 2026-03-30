import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, LogOut } from "lucide-react";
import { adminAuth } from "@/lib/adminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook/admin-ui-test";

type AppStatus = "Submitted" | "In Review" | "Accepted" | "Denied";

const STATUS_OPTIONS: AppStatus[] = ["Submitted", "In Review", "Accepted", "Denied"];

interface Application {
  id: string;
  fullName: string;
  dateSubmitted: string;
  email: string;
  loanAmount: number;
  status: AppStatus;
  images: { name: string; url: string }[];
  reasonForLoan: string;
  address: string;
  uploadedDocuments: { name: string; url: string }[];
}

const statusColors: Record<AppStatus, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "In Review": "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Denied: "bg-red-100 text-red-700",
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

const parseApplications = (response: unknown): Application[] => {
  const rawList = (response as any)?.data ?? [];
  if (!Array.isArray(rawList)) return [];

  return rawList.map((item: any, idx: number) => ({
    id: item.id ?? item["Application ID"] ?? String(idx + 1),
    fullName: item["Full Name"] ?? "",
    dateSubmitted: item.createdTime ?? new Date().toISOString(),
    email: item.Email ?? "",
    loanAmount: Number(item["Loan Amount Requested"] ?? 0),
    status: (item.Status ?? "Submitted") as AppStatus,
    images: parseFiles(item.Images ?? item["Client Images"]),
    reasonForLoan: item["Reason for Loan"] ?? "",
    address: item.Address ?? "",
    uploadedDocuments: parseFiles(item["Uploaded Documents"] ?? item.Documents),
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

const Admin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
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

  const handleFieldChange = (id: string, field: keyof Application, value: string | number) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [field]: value } : app))
    );
  };

  const toggleDetails = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdate = async (app: Application) => {
    setUpdating(app.id);
    await fireWebhook({
      event: "application_update",
      id: app.id,
      fullName: app.fullName,
      dateSubmitted: app.dateSubmitted,
      email: app.email,
      loanAmount: app.loanAmount,
      status: app.status,
    });
    toast({
      title: "Update Sent",
      description: `${app.fullName || "Application"} update sent to webhook`,
    });
    setUpdating(null);
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
                  applications.map((app) => (
                    <Fragment key={app.id}>
                      <TableRow className="hover:bg-muted/30 transition-colors align-top">
                        <TableCell className="font-medium">{app.fullName}</TableCell>
                        <TableCell>{new Date(app.dateSubmitted).toLocaleDateString()}</TableCell>
                        <TableCell className="text-muted-foreground">{app.email}</TableCell>
                        <TableCell>${app.loanAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(val) => handleFieldChange(app.id, "status", val)}
                          >
                            <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold border-0 ${statusColors[app.status]}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleDetails(app.id)}
                              className="text-xs h-8"
                            >
                              {expandedRows[app.id] ? "Hide details" : "Show details"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(app)}
                              disabled={updating === app.id}
                              className="text-xs h-8"
                            >
                              {updating === app.id ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : null}
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows[app.id] ? (
                        <TableRow className="bg-muted/20">
                          <TableCell colSpan={6} className="border-t-0">
                            <div className="rounded-md border border-border bg-background p-4 space-y-4">
                              <div>
                                <p className="text-sm font-semibold text-foreground mb-2">Images</p>
                                {app.images.length > 0 ? (
                                  <div className="flex flex-wrap gap-3">
                                    {app.images.map((image, index) => (
                                      <a key={`${app.id}-image-${index}`} href={image.url} target="_blank" rel="noreferrer" className="block">
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
                                <p className="text-sm text-muted-foreground mt-1">{app.reasonForLoan || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">Address</p>
                                <p className="text-sm text-muted-foreground mt-1">{app.address || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground mb-2">Uploaded Documents</p>
                                {app.uploadedDocuments.length > 0 ? (
                                  <ul className="space-y-1">
                                    {app.uploadedDocuments.map((doc, index) => (
                                      <li key={`${app.id}-doc-${index}`}>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  ))
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
