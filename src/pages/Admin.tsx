import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook-test/loan-application";

type AppStatus = "Pending" | "Approved" | "Rejected";

interface Application {
  id: string;
  fullName: string;
  dateSubmitted: string;
  email: string;
  loanAmount: number;
  status: AppStatus;
  notes: string;
}

const sampleApplications: Application[] = [
  {
    id: "1",
    fullName: "Maria Gonzalez",
    dateSubmitted: new Date().toISOString(),
    email: "maria.gonzalez@email.com",
    loanAmount: 3500,
    status: "Pending",
    notes: "Need funds for home renovation. Can repay within 12 months.",
  },
  {
    id: "2",
    fullName: "Daniel Carter",
    dateSubmitted: new Date().toISOString(),
    email: "daniel.carter@email.com",
    loanAmount: 9200,
    status: "Approved",
    notes: "Business expansion loan. Quarterly repayment plan preferred.",
  },
  {
    id: "3",
    fullName: "Jasmine Lee",
    dateSubmitted: new Date().toISOString(),
    email: "jasmine.lee@email.com",
    loanAmount: 1250,
    status: "Rejected",
    notes: "Emergency medical expenses.",
  },
];

const statusColors: Record<AppStatus, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

const fireWebhook = async (payload: Record<string, unknown>) => {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // silently fail for now
  }
};

const Admin = () => {
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const { toast } = useToast();

  // Fire webhook on page load
  useEffect(() => {
    const payload = {
      event: "admin_page_load",
      fullName: "",
      dateSubmitted: new Date().toISOString(),
      email: "",
      loanAmount: 0,
      status: "",
      notes: "",
    };
    fireWebhook(payload);
  }, []);

  const handleStatusChange = (id: string, newStatus: AppStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updated = { ...app, status: newStatus };
          // Fire webhook on status change
          fireWebhook({
            event: "status_change",
            fullName: updated.fullName,
            dateSubmitted: updated.dateSubmitted,
            email: updated.email,
            loanAmount: updated.loanAmount,
            status: updated.status,
            notes: updated.notes,
          });
          toast({
            title: "Status Updated",
            description: `${updated.fullName} set to ${newStatus}`,
          });
          return updated;
        }
        return app;
      })
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
          <span className="text-lg font-serif font-bold text-primary">Fox Finance Admin</span>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{app.fullName}</TableCell>
                    <TableCell>{new Date(app.dateSubmitted).toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground">{app.email}</TableCell>
                    <TableCell>${app.loanAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(val) => handleStatusChange(app.id, val as AppStatus)}
                      >
                        <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold border-0 ${statusColors[app.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            View Notes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-serif">{app.fullName} — Notes</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {app.notes || "No notes provided."}
                          </p>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
