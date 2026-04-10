import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Download, RefreshCw, AlertCircle } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

const API_KEY = import.meta.env.VITE_API_KEY as string;
const OSS_BASE = "/api/oss";
const GPU_API = "/api/gpu";
const CDN_BASE = "https://mtdsosscdn.oppein.com";

const SAMPLES = [
  {
    name: "Low-res Game Asset",
    url: "https://gpu-admin.alphanetplus.com/test-images/test_sr.png",
    prompt: "hyper-realistic 4k, highly detailed, cinematic lighting, masterpiece, RTX on, DLSS 5 style"
  },
  {
    name: "Cyberpunk City",
    url: "https://picsum.photos/seed/cyberpunk/800/600",
    prompt: "neon lit cyberpunk city street, 8k resolution, ray tracing, ultra detailed"
  },
  {
    name: "Fantasy Landscape",
    url: "https://picsum.photos/seed/fantasy/800/600",
    prompt: "epic fantasy landscape, majestic mountains, glowing magic, unreal engine 5 render"
  },
  {
    name: "Vintage Car",
    url: "https://picsum.photos/seed/vintagecar/800/500",
    prompt: "classic vintage car, photorealistic, studio lighting, 8k, highly detailed"
  }
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const [mode, setMode] = useState<'meme' | 'upscale'>('meme');
  const [prompt, setPrompt] = useState("make it more realistic, high resolution, highly detailed");
  const [steps, setSteps] = useState(4);

  const [guestUsage, setGuestUsage] = useState({ date: new Date().toISOString().split('T')[0], count: 0 });
  const [pollingStatus, setPollingStatus] = useState('');

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('dlss_guest_usage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === new Date().toISOString().split('T')[0]) {
          setGuestUsage(parsed);
        } else {
          setGuestUsage({ date: new Date().toISOString().split('T')[0], count: 0 });
        }
      }
    }
  }, [user]);

  const checkLimits = async () => {
    if (!user) {
      if (guestUsage.count >= 3) {
        throw new Error("Guest limit reached (3/3). Please login to continue.");
      }
      return true;
    }

    if (profile?.tier === 'pro') return true;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if ((userData.credits || 0) <= 0) {
        throw new Error("Insufficient credits. Please upgrade to Pro or purchase more credits.");
      }
    }
    return true;
  };

  const updateUsage = async () => {
    if (!user) {
      const newUsage = { ...guestUsage, count: guestUsage.count + 1 };
      setGuestUsage(newUsage);
      localStorage.setItem('dlss_guest_usage', JSON.stringify(newUsage));
      window.dispatchEvent(new Event('guestUsageUpdated'));
      return;
    }

    if (profile?.tier === 'pro') return;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      credits: increment(-1)
    });
  };

  // Update prompt when mode changes
  const handleModeChange = (newMode: 'meme' | 'upscale') => {
    setMode(newMode);
    if (newMode === 'meme') {
      setPrompt("make it more realistic, high resolution, highly detailed");
    } else {
      setPrompt("hyper-realistic 4k, highly detailed, cinematic lighting, masterpiece, RTX on, DLSS 5 style");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File is too large. Maximum size is 5MB.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!validateFile(file)) return;
      setSelectedFile(file);
      setSelectedSampleUrl(null);
      setPreviewUrl(URL.createObjectURL(file));
      setIsDone(false);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!validateFile(file)) return;
      setSelectedFile(file);
      setSelectedSampleUrl(null);
      setPreviewUrl(URL.createObjectURL(file));
      setIsDone(false);
      setError(null);
    }
  };

  const handleUpload = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setIsDone(false);
      setPollingStatus('');

      await checkLimits();

      let imageUrl = "";
      let currentOriginal = "";

      if (selectedSampleUrl) {
        imageUrl = selectedSampleUrl;
        currentOriginal = selectedSampleUrl;
      } else if (selectedFile) {
        const ext = selectedFile.name.split('.').pop() || 'jpg';
        const ossKey = `dlss/input/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch(`${OSS_BASE}/upload?env=prod&key=${ossKey}`, {
          method: 'POST',
          headers: { 'X-API-Key': API_KEY },
          body: formData
        });
        
        const uploadText = await uploadRes.text();
        let uploadData;
        try {
          uploadData = JSON.parse(uploadText);
        } catch (e) {
          throw new Error(`Upload API returned invalid response: ${uploadText.substring(0, 100)}`);
        }
        
        if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');
        imageUrl = `oss://${ossKey}`;
        currentOriginal = URL.createObjectURL(selectedFile);
      } else {
        throw new Error("Please select an image first.");
      }

      let cdnUrl = '';

      if (mode === 'meme') {
        // DLSS 5 — 同步接口
        const fluxRes = await fetch(`${GPU_API}/v1/flux2/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({
            image: imageUrl,
            prompt: prompt,
            seed: Number(import.meta.env.VITE_DEFAULT_SEED) || 42,
            num_inference_steps: steps,
            output_format: "oss"
          })
        });

        if (!fluxRes.ok) {
          const errText = await fluxRes.text();
          throw new Error(`API Error: ${fluxRes.status} ${errText}`);
        }

        const fluxText = await fluxRes.text();
        let fluxData;
        try {
          fluxData = JSON.parse(fluxText);
        } catch (e) {
          throw new Error(`GPU API returned invalid response: ${fluxText.substring(0, 100)}`);
        }

        if (!fluxData.success) throw new Error(fluxData.error || 'Enhancement failed');

        const enhancedOss = fluxData.enhanced;
        cdnUrl = `${CDN_BASE}/${enhancedOss.replace('oss://', '')}`;

      } else {
        // SeedVR2 超分 — 异步 Job 轮询
        setPollingStatus('Submitting job...');
        const submitRes = await fetch(`${GPU_API}/v1/seedvr2/upscale`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({ image_url: imageUrl })
        });

        if (!submitRes.ok) {
          const errText = await submitRes.text();
          throw new Error(`API Error: ${submitRes.status} ${errText}`);
        }

        const { job_id } = await submitRes.json();
        setPollingStatus('Job queued, polling status...');

        while (true) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const s = await fetch(`${GPU_API}/v1/task/${job_id}`, {
            headers: { 'X-API-Key': API_KEY }
          });
          const job = await s.json();

          if (job.status === 'done') {
            cdnUrl = job.output_url; // 直接是 CDN URL
            break;
          }
          if (job.status === 'failed') {
            throw new Error(job.error || 'Upscaling failed');
          }
          setPollingStatus(`Processing... status: ${job.status}`);
        }
      }

      await updateUsage();

      setResultUrl(cdnUrl);
      setOriginalUrl(currentOriginal);
      setIsDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="pt-24 pb-24 px-6 max-w-[1440px] mx-auto min-h-[80vh]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white">
            {mode === 'meme' ? 'DLSS 5 Meme Generator' : 'AI Super Resolution'}
          </h1>
          <p className="text-zinc-400 text-sm">
            {mode === 'meme' ? 'Turn any image into a hyper-realistic DLSS 5 meme' : 'Upscale and enhance your images with AI'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-surface-low rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-nvidia-green rounded-full animate-pulse"></div>
            <span className="text-xs font-label uppercase tracking-widest text-zinc-400">API Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/20">
            <h3 className="text-xs font-label uppercase tracking-widest text-zinc-500 mb-4">Generation Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white mb-2">Processing Mode</label>
                <div className="flex bg-surface-highest rounded-lg p-1 border border-outline-variant/20">
                  <button
                    onClick={() => handleModeChange('meme')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors ${mode === 'meme' ? 'bg-primary text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    DLSS 5 Meme
                  </button>
                  <button
                    onClick={() => handleModeChange('upscale')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors ${mode === 'upscale' ? 'bg-primary text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Super Resolution
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  {mode === 'meme' ? 'Meme Prompt (RTX On)' : 'Enhancement Prompt'}
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-surface-lowest border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary h-24 resize-none"
                  placeholder={mode === 'meme' ? "e.g. hyper-realistic 4k, highly detailed..." : "e.g. make it more realistic"}
                />
              </div>
              
              <div>
                <label className="block text-sm text-white mb-2">Inference Steps ({steps})</label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 8, 16].map(val => (
                    <button 
                      key={val}
                      onClick={() => setSteps(val)}
                      className={`py-2 rounded border text-sm transition-colors ${steps === val ? 'bg-primary/20 text-primary border-primary font-bold' : 'bg-surface-highest text-white border-outline-variant/20 hover:border-primary'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">Higher steps = better quality but slower.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface-low rounded-xl border border-outline-variant/20 p-4 flex flex-col min-h-[600px] lg:min-h-[750px]">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {!isProcessing && !isDone && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
              
              {previewUrl ? (
                <div className="flex flex-col items-center gap-6 w-full h-full flex-1">
                  <div className="w-full flex-1 min-h-[500px] lg:min-h-[650px] rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-highest flex items-center justify-center p-4">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-[600px] lg:max-h-[750px] object-contain rounded-lg shadow-2xl" />
                  </div>
                  <div className="flex gap-4 w-full max-w-md mt-auto">
                    <button 
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="flex-1 py-3 rounded-lg border border-outline-variant/20 text-white hover:bg-surface-highest transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => handleUpload(false)}
                      className="flex-1 py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary-container transition-colors"
                    >
                      {mode === 'meme' ? 'Generate DLSS 5 Meme' : 'Upscale Image'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-8">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="w-full max-w-3xl min-h-[300px] lg:min-h-[400px] border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <UploadCloud className="w-12 h-12 text-zinc-500 mb-4" />
                    <h2 className="text-xl font-headline font-semibold text-white mb-2">Drag & Drop or Click to Upload</h2>
                    <p className="text-zinc-500 text-sm">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>

                  <div className="w-full max-w-3xl">
                    <h3 className="text-sm font-label uppercase tracking-widest text-zinc-500 mb-4 text-center">Or try these examples</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {SAMPLES.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedSampleUrl(sample.url);
                            setPreviewUrl(sample.url);
                            setPrompt(sample.prompt);
                          }}
                          className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant/20 hover:border-primary transition-all group"
                        >
                          <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                            <span className="text-xs font-bold text-white">{sample.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-64 h-2 bg-surface-highest rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" style={{ animationDuration: '1s' }}></div>
              </div>
              <h2 className="text-xl font-headline font-semibold text-white mb-2 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                {mode === 'meme' ? 'Generating DLSS 5 Meme...' : 'Upscaling Image...'}
              </h2>
              <p className="text-zinc-500 text-sm">
                {pollingStatus || (mode === 'meme' ? 'This may take 15-30 seconds depending on steps.' : 'SeedVR2 processing, please wait...')}
              </p>
            </div>
          )}

          {isDone && resultUrl && originalUrl && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 bg-surface-highest rounded-xl overflow-hidden relative group min-h-[500px] lg:min-h-[650px] shadow-2xl">
                <ImageSlider highRes={resultUrl} lowRes={originalUrl} />
              </div>
              <div className="p-4 flex justify-between items-center border-t border-outline-variant/20 mt-4">
                <div className="text-sm text-zinc-400">
                  {mode === 'meme' ? 'Meme Generation Complete' : 'Upscaling Complete'} • DLSS 5
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setIsDone(false); setSelectedFile(null); setPreviewUrl(null); }} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                    New Image
                  </button>
                  <a 
                    href={resultUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-primary text-black text-sm font-bold rounded hover:bg-primary-container transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
