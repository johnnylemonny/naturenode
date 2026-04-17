import { Leaf, Info, ShieldCheck, Heart, MapPin, Share2, Globe2, Trees, ExternalLink, Edit2, Check } from "lucide-react";
import type { BiodiversityInfo } from "@/lib/gemini";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AnalysisResultProps {
  data: BiodiversityInfo;
  onLocationUpdate?: (id: string, placeName: string) => void;
}

const statusColors: Record<BiodiversityInfo["conservationStatus"], string> = {
  "Least Concern": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]",
  "Near Threatened": "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)]",
  "Vulnerable": "bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.1)]",
  "Endangered": "bg-red-500/10 text-red-600 border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.1)]",
  "Critically Endangered": "bg-red-600/20 text-red-700 border-red-600/30 animate-pulse",
  "Extinct": "bg-slate-800 text-slate-100 border-slate-900",
  "Unknown": "bg-slate-200 text-slate-600 border-slate-300",
};

export function AnalysisResult({ data, onLocationUpdate }: AnalysisResultProps) {
  const [placeName, setPlaceName] = useState(data.locationTag?.placeName || "");
  const [isEditing, setIsEditing] = useState(!data.locationTag?.placeName);



  const openInGoogleMaps = () => {
    if (!placeName) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`, '_blank');
  };

  const handleUpdate = (val: string) => {
    setPlaceName(val);
    onLocationUpdate?.(data.id as string, val);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-1000">
      {/* Primary Identification Card */}
      <div className="specimen-card rounded-4xl p-6 md:p-10 relative overflow-hidden bg-linear-to-br from-card to-secondary/20">
        {/* Specimen Stamp */}
        <div className="absolute top-6 right-6 px-3 py-1 border-2 border-primary/20 text-primary/20 font-mono text-[10px] rounded uppercase tracking-[0.3em] rotate-12 pointer-events-none select-none hidden sm:block">
          Verified Specimen
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Positive Identification • ID: {data.id}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">{data.commonName}</h2>
              <p className="text-xl italic text-muted-foreground font-serif opacity-90">
                {data.genus} {data.species} • {data.family}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <Badge 
                variant="outline" 
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${statusColors[data.conservationStatus as keyof typeof statusColors] || "bg-slate-200"} shadow-sm`}
              >
                {data.conservationStatus.toUpperCase()}
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full text-xs font-bold gap-2 text-muted-foreground hover:text-primary transition-colors h-8"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Specimen: ${data.commonName}`,
                      text: `Identified ${data.commonName} (${data.scientificName}) using NatureNode.`,
                      url: window.location.href
                    });
                  }
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>
            </div>
          </div>

          {/* Ecological Role & Quick Map */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                Ecological Role
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground italic font-medium">
                "{data.ecologicalRole}"
              </p>
            </div>

            {/* Quick Location Badge/Button */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-2xl h-12 gap-2 border-primary/20 hover:bg-primary/5 font-bold text-xs"
                onClick={openInGoogleMaps}
              >
                <Globe2 className="w-4 h-4 text-primary" />
                Open Maps
                <ExternalLink className="w-3 h-3 opacity-50" />
              </Button>
            </div>
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
              <dt className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Genus</dt>
              <dd className="font-serif font-medium italic">{data.genus}</dd>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <dt className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Species</dt>
              <dd className="font-serif font-medium italic">{data.species}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</dt>
              <dd className="font-medium">{data.conservationStatus}</dd>
            </div>
          </dl>
        </div>

        <div className="specimen-card rounded-4xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Trees className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Habitat & Range</h3>
          </div>
          <dl className="space-y-4">
            <div className="flex flex-col gap-1 border-b border-border pb-3">
              <dt className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Primary Habitat</dt>
              <dd className="text-sm italic">{data.habitat}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Native Range</dt>
              <dd className="text-sm italic">{data.nativeRange}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Map and Protection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="specimen-card rounded-4xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Observation Point</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Check className="w-4 h-4 text-emerald-500" /> : <Edit2 className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="flex-1 rounded-3xl bg-muted/30 border border-border p-6 flex flex-col justify-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.03]" />
            
            {isEditing ? (
              <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Miejscowość / Lokalizacja</label>
                  <Input 
                    placeholder="np. Warszawa, Puszcza Białowieska"
                    value={placeName} 
                    onChange={(e) => handleUpdate(e.target.value)}
                    className="h-12 rounded-xl border-primary/10 focus-visible:ring-primary/20 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Wpisz nazwę miejscowości lub obszaru, gdzie dokonano obserwacji.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center relative z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ring-4 ring-primary/5">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1 px-4">
                  <h4 className="text-sm font-bold">Lokalizacja znaleziska</h4>
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
                    {placeName || "Nie określono"}
                  </p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  disabled={!placeName}
                  className="mt-4 text-primary text-xs font-bold gap-1 p-0 h-auto"
                  onClick={openInGoogleMaps}
                >
                  <ExternalLink className="w-3 h-3" />
                  Zobacz w Google Maps
                </Button>
              </div>
            )}
            
            {/* Visual aesthetic for map background */}
            {!isEditing && (
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            )}
          </div>
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
