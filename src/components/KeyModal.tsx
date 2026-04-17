import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield } from "lucide-react";

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export function KeyModal({ isOpen, onClose, onSave, currentKey }: KeyModalProps) {
  const [key, setKey] = useState(currentKey);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-4xl border-border p-8">
        <DialogHeader className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Key className="w-7 h-7" />
          </div>
          <DialogTitle className="text-3xl font-serif font-bold">API Configuration</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            Your Google Gemini API key is stored locally and used only for biodiversity identification.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Active API Key</label>
            <Input
              placeholder="Paste your API key here..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              type="password"
              className="h-12 px-4 rounded-xl border-border bg-muted/50 focus:bg-background transition-colors"
            />
          </div>
          
          <div className="p-4 rounded-2xl bg-primary/3 border border-primary/10 flex gap-4 items-start">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              No key yet? Generate one for free at the{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-bold"
              >
                Google AI Studio
              </a>.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-xl h-12 px-6 font-semibold"
          >
            Keep Current
          </Button>
          <Button 
            onClick={() => onSave(key)}
            className="rounded-xl h-12 px-8 font-bold"
          >
            Update Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
