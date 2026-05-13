import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Download, RefreshCw, AlertCircle, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageSlider from '../components/ImageSlider';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const API_KEY = import.meta.env.VITE_API_KEY as string;
const OSS_BASE = "/api/oss";
const GPU_API = "/api/gpu";
const CDN_BASE = "https://mtdsosscdn.oppein.com";

const SAMPLES_RAW = [
  { key: 'example1', url: "https://www.dlss5nvidia.com/examples/sample1.jpg", prompt: "hyper-realistic 4k, highly detailed, cinematic lighting, masterpiece, RTX on, DLSS 5 style" },
  { key: 'example2', url: "https://www.dlss5nvidia.com/examples/sample2.jpg", prompt: "hyper-realistic 4k, highly detailed, cinematic lighting, masterpiece, RTX on, DLSS 5 style" },
  { key: 'fantasyLandscape', url: "https://picsum.photos/seed/fantasy/800/600", prompt: "epic fantasy landscape, majestic mountains, glowing magic, unreal engine 5 render" },
  { key: 'vintageCar', url: "https://picsum.photos/seed/vintagecar/800/500", prompt: "classic vintage car, photorealistic, studio lighting, 8k, highly detailed" }
];

export default function Dashboard() {
  const { t } = useTranslation();
  const SAMPLES = SAMPLES_RAW.map(s => ({ ...s, name: t(`dashboard.${s.key}`) }));
  const { user, profile, deductCredit, dailyCheckIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInDone, setCheckInDone] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const [mode, setMode] = useState<'meme' | 'upscale'>('meme');
  const [prompt, setPrompt] = useState("make it more realistic, high resolution, highly detailed");
  const [steps, setSteps] = useState(4);
  const [scale, setScale] = useState(4);

  const [guestUsage, setGuestUsage] = useState({ date: new Date().toISOString().split('T')[0], count: 0 });
  const [pollingStatus, setPollingStatus] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  // Derive checkInDone synchronously from profile to avoid flicker
  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedIn = profile?.lastCheckIn === todayStr;

  const handleCheckIn = async () => {
    setError(null);
    setIsCheckingIn(true);
    try {
      const result = await dailyCheckIn();
      if (result.success) {
        setCheckInDone(true);
        setSuccessMsg(`+5 ${t('dashboard.creditsEarned')}`);
      } else {
        setError(t('dashboard.alreadyCheckedIn'));
      }
    } finally {
      setIsCheckingIn(false);
    }
  };

  const checkLimits = async () => {
    if (!user) {
      if (guestUsage.count >= 3) {
        throw new Error(t('dashboard.guestLimitReached'));
      }
      return true;
    }

    if (profile?.tier === 'pro') return true;

    if ((profile?.credits ?? 0) <= 0) {
      throw new Error(t('dashboard.insufficientCredits'));
    }
    return true;
  };

  const updateUsage = async (): Promise<number> => {
    if (!user) {
      const newUsage = { ...guestUsage, count: guestUsage.count + 1 };
      setGuestUsage(newUsage);
      localStorage.setItem('dlss_guest_usage', JSON.stringify(newUsage));
      window.dispatchEvent(new Event('guestUsageUpdated'));
      return 0;
    }

    if (profile?.tier === 'pro') return -1;

    return await deductCredit(1);
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
      setError(t('dashboard.errorUpload', { error: 'Invalid file type' }));
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError(t('dashboard.errorUpload', { error: 'File too large' }));
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
      setSuccessMsg('');
      setIsDone(false);
      setPollingStatus('');

      await checkLimits();

      let imageUrl = "";
      let currentOriginal = "";
      let ossKey = "";

      if (selectedSampleUrl) {
        imageUrl = selectedSampleUrl;
        currentOriginal = selectedSampleUrl;
      } else if (selectedFile) {
        const ext = selectedFile.name.split('.').pop() || 'jpg';
        ossKey = `dlss/input/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
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
          throw new Error(t('dashboard.errorInvalidResponse'));
        }
        
        if (!uploadData.success) throw new Error(t('dashboard.errorUpload', { error: uploadData.error || 'Unknown' }));
        imageUrl = `oss://${ossKey}`;
        currentOriginal = URL.createObjectURL(selectedFile);
      } else {
        throw new Error(t('dashboard.errorNoImage'));
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
          throw new Error(t('dashboard.errorApi', { status: fluxRes.status, error: errText }));
        }

        const fluxText = await fluxRes.text();
        let fluxData;
        try {
          fluxData = JSON.parse(fluxText);
        } catch (e) {
          throw new Error(t('dashboard.errorInvalidResponse'));
        }

        if (!fluxData.success) throw new Error(t('dashboard.errorEnhancementFailed', { error: fluxData.error || 'Unknown' }));

        const enhancedOss = fluxData.enhanced;
        cdnUrl = `${CDN_BASE}/${enhancedOss.replace('oss://', '')}`;

      } else {
        // SeedVR2 超分 — 异步 Job 轮询
        setPollingStatus(t('dashboard.submitting'));
        const submitRes = await fetch(`${GPU_API}/v1/seedvr2/upscale`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify(ossKey ? { oss_key: ossKey } : { image_url: imageUrl })
        });

        if (!submitRes.ok) {
          const errText = await submitRes.text();
          throw new Error(t('dashboard.errorApi', { status: submitRes.status, error: errText }));
        }

        const submitData = await submitRes.json();
        console.log('[SeedVR2 submit]', submitData);
        const job_id = submitData.job_id;
        if (!job_id) throw new Error(t('dashboard.errorNoJobId'));
        setPollingStatus(t('dashboard.jobQueued'));

        while (true) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const s = await fetch(`${GPU_API}/v1/seedvr2/status/${job_id}`, {
            headers: { 'X-API-Key': API_KEY }
          });

          if (!s.ok) {
            const errText = await s.text();
            throw new Error(t('dashboard.errorPollFailed', { status: s.status, error: errText }));
          }

          const job = await s.json();
          console.log('[SeedVR2 poll]', job);

          if (job.status === 'done') {
            cdnUrl = job.output_url; // 直接是 CDN URL
            break;
          }
          if (job.status === 'failed') {
            throw new Error(t('dashboard.errorUpscaleFailed', { error: job.error || 'Unknown' }));
          }
          setPollingStatus(t('dashboard.processing', { status: job.status ?? 'unknown' }));
        }
      }

      const remaining = await updateUsage();
      if (remaining > 0) {
        setSuccessMsg(t('dashboard.creditDeducted', { count: remaining }));
      }

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
            {mode === 'meme' ? t('dashboard.title') : t('dashboard.titleUpscale')}
          </h1>
          <p className="text-zinc-400 text-sm">
            {mode === 'meme' ? `${t('dashboard.subtitle')} ${t('dashboard.notOfficialDlss')}` : t('dashboard.subtitleUpscale')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-surface-low rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-nvidia-green rounded-full animate-pulse"></div>
            <span className="text-xs font-label uppercase tracking-widest text-zinc-400">{t('dashboard.apiConnected')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {user && profile?.tier !== 'pro' && (
            <div className={`p-5 rounded-xl border ${isCheckedIn ? 'bg-surface-low border-outline-variant/20' : 'bg-gradient-to-br from-nvidia-green/10 to-primary/5 border-nvidia-green/30'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-nvidia-green/20">
                  <Gift className={`w-5 h-5 ${isCheckedIn ? 'text-zinc-500' : 'text-nvidia-green'}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t('dashboard.dailyCheckIn')}</h3>
                  <p className="text-xs text-zinc-400">{isCheckedIn ? t('dashboard.checkedIn') : t('dashboard.checkInReward')}</p>
                </div>
              </div>
              {!isCheckedIn && (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="w-full py-2.5 rounded-lg bg-nvidia-green text-black font-bold text-sm hover:bg-nvidia-green/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCheckingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('dashboard.checkingIn')}
                    </>
                  ) : t('dashboard.claimCredits')}
                </button>
              )}
              {isCheckedIn && (
                <div className="w-full py-2.5 rounded-lg bg-surface-highest text-zinc-500 font-bold text-sm text-center cursor-default">
                  {t('dashboard.checkedIn')}
                </div>
              )}
            </div>
          )}

          <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/20">
            <h3 className="text-xs font-label uppercase tracking-widest text-zinc-500 mb-4">{t('dashboard.generationSettings')}</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white mb-2">{t('dashboard.processingMode')}</label>
                <div className="flex bg-surface-highest rounded-lg p-1 border border-outline-variant/20">
                  <button
                    onClick={() => handleModeChange('meme')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors ${mode === 'meme' ? 'bg-primary text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {t('dashboard.dlssMeme')}
                  </button>
                  <button
                    onClick={() => handleModeChange('upscale')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors ${mode === 'upscale' ? 'bg-primary text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {t('dashboard.superResolution')}
                  </button>
                </div>
              </div>

              {mode === 'meme' && (
                <div>
                  <label className="block text-sm text-white mb-2">{t('dashboard.memePrompt')}</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-surface-lowest border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary h-24 resize-none"
                    placeholder={t('dashboard.promptPlaceholder')}
                  />
                </div>
              )}

              {mode === 'meme' && (
                <div>
                  <label className="block text-sm text-white mb-2">{t('dashboard.inferenceSteps')} ({steps})</label>
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
                  <p className="text-[10px] text-zinc-500 mt-2">{t('dashboard.inferenceHint')}</p>
                </div>
              )}

              {mode === 'upscale' && (
                <div>
                  <label className="block text-sm text-white mb-2">{t('dashboard.upscaleScale')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 4].map(val => (
                      <button
                        key={val}
                        onClick={() => setScale(val)}
                        className={`py-2 rounded border text-sm transition-colors ${scale === val ? 'bg-primary/20 text-primary border-primary font-bold' : 'bg-surface-highest text-white border-outline-variant/20 hover:border-primary'}`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface-low rounded-xl border border-outline-variant/20 p-4 flex flex-col min-h-[400px] lg:min-h-[500px]">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-nvidia-green/10 border border-nvidia-green/20 rounded-lg text-nvidia-green text-sm">
              {successMsg}
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
                <div className="flex flex-col items-center gap-6 w-full h-auto">
                  <div className="w-full flex items-center justify-center p-3">
                    <img src={previewUrl} alt="Preview" className="w-full h-full max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                  </div>
                  <div className="flex gap-4 w-full max-w-md mt-auto">
                    <button 
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="flex-1 py-3 rounded-lg border border-outline-variant/20 text-white hover:bg-surface-highest transition-colors"
                    >
                      {t('dashboard.clear')}
                    </button>
                    <button
                      onClick={() => handleUpload()}
                      className="flex-1 py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary-container transition-colors"
                    >
                      {mode === 'meme' ? t('dashboard.generate') : t('dashboard.upscale')}
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
                    <h2 className="text-xl font-headline font-semibold text-white mb-2">{t('dashboard.uploadAreaTitle')}</h2>
                    <p className="text-zinc-500 text-sm">{t('dashboard.uploadAreaHint')}</p>
                  </div>

                  <div className="w-full max-w-3xl">
                    <h3 className="text-sm font-label uppercase tracking-widest text-zinc-500 mb-4 text-center">{t('dashboard.orTryExamples')}</h3>
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
                {mode === 'meme' ? t('dashboard.generatingDlss') : t('dashboard.upscaling')}
              </h2>
              <p className="text-zinc-500 text-sm">
                {pollingStatus || (mode === 'meme' ? t('dashboard.dlssProcessing') : t('dashboard.dlssProcessing'))}
              </p>
            </div>
          )}

          {isDone && resultUrl && originalUrl && (
            <div className="flex flex-col flex-1 w-full h-full">
              <div className="w-full flex-1 flex items-center justify-center p-3">
                <ImageSlider highRes={resultUrl} lowRes={originalUrl} />
              </div>
              <div className="p-4 flex justify-between items-center border-t border-outline-variant/20 mt-4">
                <div className="text-sm text-zinc-400">
                  {mode === 'meme' ? t('dashboard.memeComplete') : t('dashboard.upscaleComplete')} • {t('dashboard.dlssLabel')}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setIsDone(false); setSelectedFile(null); setPreviewUrl(null); }} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                    {t('dashboard.newImage')}
                  </button>
                  <a 
                    href={resultUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-primary text-black text-sm font-bold rounded hover:bg-primary-container transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> {t('dashboard.download')}
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
