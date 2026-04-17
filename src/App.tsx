import { useState } from "react";
import { KeyModal } from "./components/KeyModal";
import { ImageUploader } from "./components/ImageUploader";
import { AnalysisResult } from "./components/AnalysisResult";
import { SpecimenJournal } from "./components/SpecimenJournal";
import { analyzeImage } from "./lib/gemini";
import type { BiodiversityInfo } from "./lib/gemini";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Settings, Globe, Leaf, Key, ChevronRight } from "lucide-react";

function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("gemini_api_key") || "");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BiodiversityInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState("");
  const [history, setHistory] = useState<BiodiversityInfo[]>(() => {
    const saved = localStorage.getItem("naturenode_history");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
    setIsKeyModalOpen(false);
    setError(null);
  };

  const handleImageSelected = async (file: File) => {
    if (!apiKey) {
      setError("Please set your API key first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeImage(file, apiKey);
      
      data.id = Math.random().toString(36).substring(2, 8).toUpperCase();
      setResult(data);
      
      const newHistory = [data, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("naturenode_history", JSON.stringify(newHistory));

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      let errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("limit")) {
        errorMessage = "API Quota exceeded or limit reached (429). Please wait a moment.";
      } else if (errorMessage.includes("404")) {
        errorMessage = "Model not found (404). Regional restrictions might apply.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationUpdate = (id: string, placeName: string) => {
    const newHistory = history.map(item => 
      item.id === id ? { ...item, locationTag: { lat: 0, lng: 0, placeName } } : item
    );
    setHistory(newHistory);
    localStorage.setItem("naturenode_history", JSON.stringify(newHistory));
    
    if (result?.id === id) {
      setResult({ ...result, locationTag: { lat: 0, lng: 0, placeName } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-primary/20">
      <nav className="w-full border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl h-16 flex items-center justify-center px-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight">NatureNode</span>
          </div>
          {apiKey && (
            <div className="absolute right-6 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-primary transition-colors gap-2"
                onClick={() => setIsKeyModalOpen(true)}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-4xl mx-auto py-16 px-6 relative flex flex-col items-center overflow-hidden">

        {!apiKey ? (
          <section className="w-full max-w-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-bold mb-8 border border-primary/10 shadow-sm">
              <Globe className="w-4 h-4" />
              Biodiversity Research Tool
            </div>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[0.95] text-balance tracking-tighter">
              Identify the <span className="text-primary italic font-serif">living world</span> around you.
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium opacity-80 text-center">
              NatureNode uses advanced AI to identify species and help you understand our planet's biodiversity. To begin, connect your Google Gemini API key.
            </p>
            
            <div className="relative w-full max-w-md p-8 rounded-3xl bg-card border border-border botanical-shadow overflow-hidden">
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex flex-col items-center mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Key className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="(Paste your Gemini API key)"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="h-12 px-4 rounded-xl border-border bg-background focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all text-center"
                  />
                  <div className="flex justify-center items-center">
                    <p className="text-[11px] text-muted-foreground">
                      Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">AI Studio</a>
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 rounded-xl text-lg font-bold group bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 relative"
                  disabled={!tempKey}
                  onClick={() => handleSaveKey(tempKey)}
                >
                  Unlock Discovery
                  <ChevronRight className="w-5 h-5 absolute right-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <div className="w-full flex flex-col items-center">
            <header className="text-center mb-16 animate-in fade-in duration-700 flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Start your discovery</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a photo of any plant, animal, or insect to get an instant botanical identification and ecological insights.
              </p>
            </header>

            <section className="w-full max-w-2xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />
              
              {error && (
                <div className="mt-8 p-4 rounded-2xl bg-destructive/5 text-destructive text-center border border-destructive/10 font-medium">
                  {error}
                </div>
              )}
            </section>

            {result && (
              <section id="results" className="w-full scroll-mt-24 animate-in fade-in duration-1000">
                <AnalysisResult 
                  key={result.id} 
                  data={result} 
                  onLocationUpdate={handleLocationUpdate} 
                />
                <div className="mt-16 text-center">
                  <Button 
                    variant="outline" 
                    className="rounded-full px-10 h-14 text-lg font-medium border-primary/20 hover:border-primary hover:bg-primary/5 transition-all"
                    onClick={() => {
                      setResult(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Scan another object
                  </Button>
                </div>
              </section>
            )}

            <SpecimenJournal 
              history={history} 
              onSelect={(specimen) => {
                setResult(specimen);
                setTimeout(() => {
                  document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }} 
            />
          </div>
        )}
      </main>

      <footer className="w-full border-t py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">NatureNode</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
                Advanced botanical identification platform for researchers and nature enthusiasts. 
                Utilizing state-of-the-art AI to map and protect global biodiversity.
              </p>
              <div className="pt-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
                  © JOHNNYLEMONNY • Earth Day Edition
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-medium">Gemini AI Studio</a></li>
                <li><a href="https://www.gbif.org/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-medium">Global Biodiversity Info</a></li>
                <li><a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-medium">API Documentation</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Community</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium">Science Blog</button></li>
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium">Sustainability</button></li>
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium">Privacy & Safety</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <KeyModal
        key={apiKey}
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSave={handleSaveKey}
        currentKey={apiKey}
      />
    </div>
  );
}

export default App;
