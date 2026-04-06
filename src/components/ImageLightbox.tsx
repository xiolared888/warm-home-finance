import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageLightboxProps {
  images: { name: string; url: string }[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (index: number) => void;
}

const ImageLightbox = ({ images, currentIndex, open, onOpenChange, onNavigate }: ImageLightboxProps) => {
  const current = images[currentIndex];
  if (!current) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-black/95 border-none overflow-hidden [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Image Preview</DialogTitle>
        </VisuallyHidden>
        <div className="relative flex items-center justify-center min-h-[60vh]">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-10 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {hasPrev && (
            <button
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-3 z-10 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={current.url}
            alt={current.name}
            className="max-h-[80vh] max-w-full object-contain"
          />

          {hasNext && (
            <button
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-3 z-10 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="text-center text-white/70 text-sm pb-3">
          {current.name} — {currentIndex + 1} of {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
