import { Leaf, History, ArrowUpRight } from "lucide-react";
import type { BiodiversityInfo } from "@/lib/gemini";

interface SpecimenJournalProps {
  history: BiodiversityInfo[];
  onSelect: (specimen: BiodiversityInfo) => void;
}

export function SpecimenJournal({ history, onSelect }: SpecimenJournalProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <History className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold">Specimen Journal</h2>
        <span className="text-xs font-mono text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-full">
          {history.length} Entries
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((specimen) => (
          <button
            key={specimen.id}
            onClick={() => onSelect(specimen)}
            className="group relative flex flex-col items-start p-6 rounded-3xl bg-card border border-border botanical-shadow transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 text-left"
          >
            <div className="absolute top-6 right-6 p-1.5 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
              ID: {specimen.id}
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{specimen.commonName}</h3>
            <p className="text-xs italic text-muted-foreground font-serif mb-4 line-clamp-1 opacity-80">
              {specimen.scientificName}
            </p>
            
            <div className="flex flex-wrap gap-3 items-center mt-auto">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary/70">
                <Leaf className="w-3 h-3" />
                {specimen.family}
              </div>
              {specimen.locationTag?.placeName && (
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                  {specimen.locationTag.placeName}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
