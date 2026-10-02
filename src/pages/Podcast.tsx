import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock3, Headphones, PlayCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { PODCAST_EPISODES, PODCAST_INDEX_DESCRIPTION, type PodcastEpisode } from '../content/podcast';
import { SITE_URL } from '../config/site';

const podcastSeries = {
  '@type': 'PodcastSeries',
  name: 'DLSS 5 AI Workflow Podcast',
  url: `${SITE_URL}/podcast`,
  description: PODCAST_INDEX_DESCRIPTION,
  author: { '@type': 'Organization', name: 'DLSS5 Independent Research Desk', url: SITE_URL },
};

const episodePath = (slug: string) => `/podcast/${slug}`;

function episodeSchema(episode: PodcastEpisode) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title,
    description: episode.description,
    datePublished: episode.published,
    timeRequired: episode.duration,
    url: `${SITE_URL}${episodePath(episode.slug)}`,
    image: `${SITE_URL}${episode.cover}`,
    partOfSeries: podcastSeries,
    associatedMedia: episode.audioSrc
      ? { '@type': 'AudioObject', contentUrl: `${SITE_URL}${episode.audioSrc}`, encodingFormat: 'audio/mpeg' }
      : undefined,
  };
}

function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <article className="bg-surface-low rounded-2xl border border-outline-variant/20 overflow-hidden hover:border-primary/50 transition-colors">
      <Link to={episodePath(episode.slug)} className="block">
        <div className="aspect-[16/8] overflow-hidden bg-surface-high">
          <img src={episode.cover} alt={episode.coverAlt} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-primary uppercase tracking-widest font-label">
            <span>Episode</span>
            <span className="text-zinc-600">·</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" aria-hidden="true" /> {episode.duration.replace('PT', '').toLowerCase()}</span>
          </div>
          <h2 className="mt-3 text-xl font-headline font-bold text-white group-hover:text-primary">{episode.title}</h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{episode.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-primary text-sm font-semibold">Read the transcript <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}

export default function Podcast() {
  const { slug } = useParams<{ slug?: string }>();
  const episode = slug ? PODCAST_EPISODES.find(item => item.slug === slug) : undefined;

  if (slug && !episode) return <Navigate to="/podcast" replace />;

  if (!episode) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'DLSS 5 AI Workflow Podcast',
      description: PODCAST_INDEX_DESCRIPTION,
      url: `${SITE_URL}/podcast`,
      mainEntity: { '@type': 'ItemList', itemListElement: PODCAST_EPISODES.map((item, index) => ({ '@type': 'ListItem', position: index + 1, url: `${SITE_URL}${episodePath(item.slug)}`, name: item.title })) },
    };
    return (
      <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
        <SEO
          title="DLSS 5 AI Workflow Podcast — GPT-6, Claude and Visual Conversion"
          description={PODCAST_INDEX_DESCRIPTION}
          keywords={['dlss 5 podcast', 'gpt-6 dlss 5', 'claude dlss 5', 'ai image workflow podcast', 'dlss 5 image converter']}
          canonical="/podcast"
          image="/blog/gpt6-dlss5-workflow.png"
          structuredData={structuredData}
        />
        <header className="max-w-3xl mb-14">
          <p className="text-primary text-xs font-label uppercase tracking-[0.2em] mb-4">DLSS 5 AI workflow podcast</p>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white leading-tight">GPT-6, Claude and visual conversion — explained with real checks</h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{PODCAST_INDEX_DESCRIPTION} Every episode has a crawlable transcript, chapters, sources and a practical conversion path. The audio edition is being produced from these reviewed scripts.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/dashboard?tool=game-character-style&sample=characterStyle" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-black hover:bg-white transition-colors">Try a free conversion <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
            <Link to="/blog" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-5 py-3 font-semibold text-zinc-200 hover:border-primary hover:text-primary transition-colors">Read the research desk</Link>
          </div>
        </header>
        <section aria-labelledby="episodes-heading">
          <div className="flex items-end justify-between gap-6 mb-7">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">Season 1 · editorial scripts</p>
              <h2 id="episodes-heading" className="mt-2 text-3xl font-headline font-bold text-white">Episodes</h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-500"><Headphones className="w-4 h-4" aria-hidden="true" /> Transcript-first</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PODCAST_EPISODES.map(item => <div key={item.slug}><EpisodeCard episode={item} /></div>)}
          </div>
        </section>
        <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-7 max-w-3xl">
          <h2 className="text-2xl font-headline font-bold text-white">How to use these episodes</h2>
          <p className="mt-3 text-zinc-300 leading-relaxed">Use the transcript as the source of truth: model names and capabilities are dated, vendor claims stay separate from our visual checks, and every conversion can be inspected before download. We never present this independent workflow as the official NVIDIA DLSS runtime.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 max-w-[980px] mx-auto">
      <SEO
        title={`${episode.title} — DLSS 5 AI Workflow Podcast`}
        description={episode.description}
        keywords={episode.keywords}
        canonical={episodePath(episode.slug)}
        image={episode.cover}
        type="article"
        structuredData={episodeSchema(episode)}
      />
      <nav className="mb-8 text-sm"><Link to="/podcast" className="text-zinc-400 hover:text-primary">← Back to the podcast</Link></nav>
      <article>
        <header className="mb-10">
          <p className="text-primary text-xs font-label uppercase tracking-[0.2em] mb-4">Episode · {episode.published}</p>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white leading-tight">{episode.title}</h1>
          <p className="mt-5 text-lg text-zinc-300 leading-relaxed">{episode.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-500"><span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4" aria-hidden="true" /> {episode.duration.replace('PT', '').toLowerCase()}</span><span>Script verified {episode.published}</span></div>
        </header>
        <figure className="rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-low mb-10">
          <img src={episode.cover} alt={episode.coverAlt} width="1600" height="700" fetchPriority="high" className="w-full object-cover" />
          <figcaption className="px-5 py-3 text-xs text-zinc-400">Independent visual reference · not an official NVIDIA capture</figcaption>
        </figure>
        <section className="rounded-xl border border-outline-variant/20 bg-surface-low p-5 mb-10" aria-labelledby="listen-heading">
          <div className="flex items-start gap-3"><PlayCircle className="mt-0.5 w-5 h-5 text-primary shrink-0" aria-hidden="true" /><div><h2 id="listen-heading" className="text-lg font-semibold text-white">Listen or read</h2>{episode.audioSrc ? <audio className="mt-4 w-full" controls preload="none" src={episode.audioSrc}>Your browser does not support audio playback.</audio> : <p className="mt-2 text-sm leading-relaxed text-zinc-400">The reviewed audio edition is being produced from this script. Read the full transcript now; the episode URL will stay the same when the MP3 is attached.</p>}</div></div>
        </section>
        <section className="mb-10" aria-labelledby="chapters-heading">
          <h2 id="chapters-heading" className="text-2xl font-headline font-bold text-white mb-4">Chapters</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {episode.chapters.map(chapter => <li key={chapter.start} className="rounded-lg border border-outline-variant/20 bg-surface-low px-4 py-3 text-sm"><span className="font-mono text-primary mr-3">{chapter.start}</span><span className="text-zinc-300">{chapter.title}</span></li>)}
          </ol>
        </section>
        <section aria-labelledby="transcript-heading" className="prose prose-invert max-w-none">
          <h2 id="transcript-heading" className="text-2xl font-headline font-bold text-white mb-5">Transcript</h2>
          {episode.transcript.map((paragraph, index) => <p key={index} className="text-zinc-300 leading-relaxed my-5">{paragraph}</p>)}
        </section>
        <section className="mt-12 rounded-xl border border-outline-variant/20 bg-surface-low p-6" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-xl font-headline font-bold text-white">Sources and related workflows</h2>
          <ul className="mt-4 space-y-3">{episode.sources.map(source => <li key={source.url}><a className="text-primary hover:text-white" href={source.url.startsWith('/') ? source.url : source.url} rel={source.url.startsWith('http') ? 'noreferrer' : undefined}>{source.label}</a></li>)}</ul>
        </section>
        <section className="mt-10 rounded-xl border border-primary/25 bg-primary/5 p-6 text-center">
          <h2 className="text-xl font-headline font-bold text-white">Continue with a reviewable conversion</h2>
          <p className="mt-3 text-sm text-zinc-300">Try the free cached example first, compare the original and converted reference, then decide whether to upload your own image.</p>
          <Link to={episode.ctaPath} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-black hover:bg-white transition-colors">{episode.ctaLabel} <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </section>
      </article>
    </main>
  );
}
