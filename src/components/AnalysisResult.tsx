import { Leaf, Info, ShieldCheck, Heart } from "lucide-react";
import type { BiodiversityInfo } from "@/lib/gemini";
import { Badge } from "@/components/ui/badge";

interface AnalysisResultProps {
  data: BiodiversityInfo;
}

const statusColors: Record<BiodiversityInfo["conservationStatus"], string> = {
  "Least Concern": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "Near Threatened": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "Vulnerable": "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Endangered": "bg-red-500/10 text-red-700 border-red-500/20",
  "Critically Endangered": "bg-red-600/20 text-red-800 border-red-600/30",
  "Extinct": "bg-slate-500/10 text-slate-700 border-slate-500/20",
  "Unknown": "bg-slate-200 text-slate-600 border-slate-300",
};

export function AnalysisResult({ data }: AnalysisResultProps) {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-1000">
      {/* Primary Identification Card */}
      <div className="specimen-card rounded-4xl p-8 md:p-12 relative overflow-hidden">
        {/* Specimen Stamp */}
        <div className="absolute top-6 right-6 px-3 py-1 border-2 border-primary/20 text-primary/20 font-mono text-[10px] rounded uppercase tracking-[0.3em] rotate-12 pointer-events-none select-none">
          Verified Specimen
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Positive Identification
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                ID: {data.id}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{data.name}</h2>
              <p className="text-xl italic text-muted-foreground font-serif opacity-80">
                {data.scientificName} • {data.family}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge 
                variant="outline" 
                className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${statusColors[data.conservationStatus]} shadow-sm`}
              >
                {data.conservationStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="md:w-1/3 p-6 rounded-3xl bg-primary/3 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              Ecological Role
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground italic font-medium">
              "{data.ecologicalRole}"
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="specimen-card rounded-4xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Scientific Context</h3>
          </div>
          <dl className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <dt className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Family</dt>
              <dd className="font-serif font-medium">{data.family}</dd>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <dt className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Genus/Species</dt>
              <dd className="font-serif font-medium italic">{data.scientificName.split(' ')[0]}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</dt>
              <dd className="font-medium">{data.conservationStatus}</dd>
            </div>
          </dl>
        </div>

        <div className="specimen-card rounded-4xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-600">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">How to Protect</h3>
          </div>
          <ul className="space-y-4">
            {data.protectionTips.map((tip, index) => (
              <li key={index} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conservation Footnote */}
      <div className="text-center p-8 border border-border border-dashed rounded-4xl bg-muted/20">
        <Leaf className="w-8 h-8 text-primary/30 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground max-w-lg mx-auto italic">
          Knowing our biodiversity is the first step toward protecting it. 
          Use this identification as a starting point for deeper research into your local ecosystem.
        </p>
      </div>
    </div>
  );
}
