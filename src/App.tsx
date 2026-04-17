import { useState } from "react";
import { KeyModal } from "./components/KeyModal";
import { ImageUploader } from "./components/ImageUploader";
import { AnalysisResult } from "./components/AnalysisResult";
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
      // Generate a stable ID for the specimen
      data.id = Math.random().toString(36).substring(2, 8).toUpperCase();
      setResult(data);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        errorMessage.includes("API key not valid")
          ? "Invalid API key. Please check your settings."
          : "An error occurred during image analysis. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-primary/20">
      <nav className="w-full border-b bg-background sticky top-0 z-50">
        <div className="container max-w-6xl h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight">NatureNode</span>
          </div>
          {apiKey && (
            <div className="flex items-center gap-2">
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

      <main className="flex-1 w-full max-w-4xl py-16 px-6 relative flex flex-col items-center overflow-hidden">
        {/* Large background decorative element */}
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl pointer-events-none -z-10" />
        <Leaf className="absolute top-20 -left-20 w-80 h-80 text-primary/3 -rotate-12 pointer-events-none -z-10" />

        {!apiKey ? (
          <section className="w-full max-w-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-bold mb-8 border border-primary/10 shadow-sm">
              <Globe className="w-4 h-4" />
              Biodiversity Research Tool
            </div>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[0.95] text-balance tracking-tighter">
              Identify the <span className="text-primary italic font-serif">living world</span> around you.
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium opacity-80">
              NatureNode uses advanced AI to identify species and help you understand our planet's biodiversity. To begin, connect your Google Gemini API key.
            </p>
            
            <div className="relative w-full max-w-md p-8 rounded-3xl bg-card border border-border botanical-shadow overflow-hidden">
              {/* Decorative background element */}
              <Leaf className="absolute -bottom-8 -right-8 w-32 h-32 text-primary/5 -rotate-12 pointer-events-none" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <label htmlFor="api-key" className="text-sm font-bold flex items-center gap-2 text-primary">
                      <Key className="w-4 h-4" />
                      Gemini API Access
                    </label>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                      Ref. NN-2026-ALPHA
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="AIzaSy..."
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="h-12 px-4 rounded-xl border-border bg-background focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-muted-foreground">
                      Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">AI Studio</a>
                    </p>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/10" />
                    </div>
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
            <header className="text-center mb-16 animate-in fade-in duration-700">
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
                <AnalysisResult data={result} />
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
          </div>
        )}
      </main>

      <footer className="w-full border-t py-12 bg-background">
        <div className="container max-w-6xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2 opacity-80">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-lg font-serif font-bold tracking-tight">NatureNode</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed text-center md:text-left">
                Advanced botanical identification platform for researchers and nature enthusiasts. 
                Powered by Google Gemini.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-8 text-sm font-semibold">
                <a href="https://dev.to" className="text-muted-foreground hover:text-primary transition-colors">Project</a>
                <a href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a>
                {apiKey && (
                  <button 
                    onClick={() => setIsKeyModalOpen(true)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    API Settings
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-50">
                © 2026 NatureNode Research • Earth Day Edition
              </p>
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
