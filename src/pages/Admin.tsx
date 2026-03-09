import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook-test/admin-ui-test";

type AppStatus = "Submitted" | "In Review" | "Accepted" | "Denied";

const STATUS_OPTIONS: AppStatus[] = ["Submitted", "In Review", "Accepted", "Denied"];

interface Application {
  id: string;
  fullName: string;
  dateSubmitted: string;
  email: string;
  loanAmount: number;
  status: AppStatus;
  notes: string;
}

const statusColors: Record<AppStatus, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "In Review": "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Denied: "bg-red-100 text-red-700",
};

const parseApplications = (data: unknown): Application[] => {
  const rawList = Array.isArray(data) ? data : (data as any)?.records ?? (data as any)?.data ?? [];

  return rawList.map((item: any, idx: number) => {
    const fields = item.fields ?? item;
    return {
      id: item.id ?? String(idx + 1),
      fullName: fields.fullName ?? fields["Full Name"] ?? fields.name ?? "",
      dateSubmitted: fields.dateSubmitted ?? fields["Date Submitted"] ?? fields.date ?? new Date().toISOString(),
      email: fields.email ?? fields.Email ?? "",
      loanAmount: Number(fields.loanAmount ?? fields["Loan Amount"] ?? fields.amount ?? 0),
      status: (fields.status ?? fields.Status ?? "Submitted") as AppStatus,
      notes: fields.notes ?? fields.Notes ?? "",
    };
  });
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
  const { toast } = useToast();

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
        if (parsed.length > 0) {
          setApplications(parsed);
        }
      }
    } catch {
      // silent
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
      notes: app.notes,
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
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading applications...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No applications found. Data will appear here when the webhook returns records from Airtable.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/30 transition-colors align-top">
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
                      <TableCell>
                        <Textarea
                          value={app.notes}
                          onChange={(e) => handleFieldChange(app.id, "notes", e.target.value)}
                          placeholder="Add notes..."
                          className="min-h-[60px] text-sm resize-y w-[200px]"
                          maxLength={1000}
                        />
                      </TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                    </TableRow>
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
