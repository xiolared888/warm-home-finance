import { useState } from "react";
import { Loader2, FileText, ImageIcon, Download, FileType } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

const getFileType = (url: string): "image" | "pdf" | "docx" | "other" => {
  const lower = url.toLowerCase().split("?")[0];
  if (/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/.test(lower)) return "image";
  if (/\.pdf$/.test(lower)) return "pdf";
  if (/\.(docx?|doc)$/.test(lower)) return "docx";
  return "other";
};

const getFileExt = (url: string): string => {
  const match = url.toLowerCase().split("?")[0].match(/\.(\w+)$/);
  return match ? match[1].toUpperCase() : "FILE";
};

interface DocumentItem {
  document: string;
  download_urls: string[];
}

export interface LoanDetails {
  reasonForLoan: string;
  address: string;
  dateOfBirth: string;
  denialReason?: string;
  documents: DocumentItem[];
}

interface LoanDetailsPanelProps {
  loading: boolean;
  error: string | null;
  details: LoanDetails | null;
  loanId: string;
}

const LoanDetailsPanel = ({ loading, error, details, loanId }: LoanDetailsPanelProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ name: string; url: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: { name: string; url: string }[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="rounded-md border border-border bg-background p-4">
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading details…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="rounded-md border border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">No details available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-border bg-background p-5 space-y-5">
        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reason for Loan</p>
            <p className="text-sm text-foreground">
              {details.reasonForLoan?.trim() || "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
            <p className="text-sm text-foreground">
              {details.address?.trim() || "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date of Birth</p>
            <p className="text-sm text-foreground">
              {details.dateOfBirth
                ? new Date(details.dateOfBirth + "T00:00:00").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not provided"}
            </p>
          </div>
        </div>

        {/* Denial Reason */}
        {details.denialReason?.trim() && (
          <>
            <div className="border-t border-border" />
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 space-y-1">
              <p className="text-xs font-medium text-destructive uppercase tracking-wide">Denial Reason</p>
              <p className="text-sm text-destructive">{details.denialReason}</p>
            </div>
          </>
        )}

        {/* Separator */}
        <div className="border-t border-border" />

        {/* Documents */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </p>

          {!details.documents || details.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents available</p>
          ) : (
            <div className="space-y-4">
              {details.documents.map((doc, docIdx) => {
                const allImages = doc.download_urls
                  ?.filter((url) => typeof url === "string" && url.trim())
                  .map((url, i) => ({ name: `${doc.document} — ${i + 1}`, url })) ?? [];

                return (
                  <div key={`${loanId}-doc-${docIdx}`} className="rounded-md border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      {doc.document}
                    </p>

                    {allImages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {allImages.map((img, imgIdx) => (
                          <button
                            key={`${loanId}-doc-${docIdx}-img-${imgIdx}`}
                            onClick={() => openLightbox(allImages, imgIdx)}
                            className="group relative h-20 w-20 rounded-md overflow-hidden border border-border hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).parentElement!.classList.add("bg-muted");
                                const fallback = document.createElement("span");
                                fallback.textContent = "?";
                                fallback.className = "absolute inset-0 flex items-center justify-center text-muted-foreground text-lg";
                                (e.target as HTMLImageElement).parentElement!.appendChild(fallback);
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No preview available</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};

export default LoanDetailsPanel;
