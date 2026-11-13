import { useEffect, useState } from 'react';
import { Film, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_MEDIA, ProductItem, SiteConfig } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface LookbookVideoSectionProps {
  products: ProductItem[];
  siteConfig: SiteConfig;
  onExploreCollections: () => void;
}

interface FilmScene {
  id: string;
  chapter: string;
  title: string;
  caption: string;
  image: string;
}

const CRAFT_METRICS = [
  { label: 'Hand-Drawn Khaka & Pattern Drafting', pct: 100, note: 'Karachi Studio' },
  { label: 'Adda Zardozi, Dabka & Resham Embroidery', pct: 96, note: 'Master Karigars' },
  { label: 'Pure Silk, Crinkle Chiffon & Velvet Finishing', pct: 100, note: '100% Pure Base' },
  { label: 'Custom Sizing & Quality Inspection', pct: 98, note: 'Pre-Dispatch Check' },
];

export function LookbookVideoSection({
  products,
  siteConfig,
  onExploreCollections,
}: LookbookVideoSectionProps) {
  const scenes: FilmScene[] = [
    {
      id: 'scene-hero',
      chapter: '01 · Campaign Film',
      title: 'The Karachi Heritage Edit',
      caption: 'Hand-embroidered kalidar peshwas and heirloom organza dupattas crafted in DHA Phase 5, Karachi.',
      image: siteConfig.heroImage,
    },
    {
      id: 'scene-bridal',
      chapter: '02 · Bridal Atelier',
      title: 'Ruh-e-Riwaj Dabka & Velvet',
      caption: 'Over 420 artisan hours per bridal lehenga on traditional wooden adda frames.',
      image: products[3]?.image || HERO_MEDIA.image,
    },
    {
      id: 'scene-pret',
      chapter: '03 · Luxury Pret',
      title: 'Pastel Echo Raw Silk Ghararas',
      caption: 'Lightweight sage-mint and ivory ensembles tailored for Eid and intimate receptions.',
      image: products[0]?.image || HERO_MEDIA.image,
    },
    {
      id: 'scene-craft',
      chapter: '04 · Karigar Hands',
      title: 'Inside Our Zamzama Workshop',
      caption: 'Every metallic thread, pearl, and gota motif placed individually by hand.',
      image: HERO_MEDIA.atelierImage,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const SCENE_DURATION_MS = 5000;

  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = 100;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + (stepMs / SCENE_DURATION_MS) * 100;
        if (next >= 100) {
          setCurrentIndex((idx) => (idx + 1) % scenes.length);
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, scenes.length]);

  const activeScene = scenes[currentIndex] || scenes[0];

  const handleSelectScene = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const totalSeconds = scenes.length * 5;
  const elapsedSeconds = Math.min(
    totalSeconds,
    Math.floor(currentIndex * 5 + (progress / 100) * 5)
  );

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: Cinematic Atelier Film Player */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-3"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#2B0E18] border border-[#4A1828]/20 rounded shadow-lg">
            <ResilientImage
              key={activeScene.id}
              src={activeScene.image}
              alt={activeScene.title}
              fallbackTitle={activeScene.title}
              className={`w-full h-full object-cover ${
                isPlaying ? 'animate-ken-burns' : ''
              }`}
            />

            {/* Measured contrast scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#210911]/90 via-[#210911]/25 to-black/20"
            />

            {/* Moving top gold accent line */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-[2px] bg-[#E5C697]/20 overflow-hidden"
            >
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#E5C697] to-transparent animate-gold-sweep" />
            </div>

            {/* Film chapter info overlay */}
            <div className="absolute inset-x-0 bottom-14 p-5 sm:p-6 text-[#FCF9F4]">
              <p className="text-[11px] font-medium tracking-widest uppercase text-[#E5C697]">
                {activeScene.chapter}
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">
                {activeScene.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#FCF9F4]/85 mt-1 max-w-lg">
                {activeScene.caption}
              </p>
            </div>

            {/* Interactive Video Control Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-[#210911]/90 backdrop-blur-sm px-4 py-2.5 flex items-center gap-3 text-[#FCF9F4] border-t border-[#FCF9F4]/10">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause showcase film' : 'Play showcase film'}
                className="p-1.5 rounded hover:bg-[#FCF9F4]/10 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-[#E5C697]" />
                ) : (
                  <Play className="w-4 h-4 text-[#E5C697]" />
                )}
              </button>

              <button
                type="button"
                aria-label="Previous chapter"
                onClick={() =>
                  handleSelectScene((currentIndex - 1 + scenes.length) % scenes.length)
                }
                className="p-1 rounded hover:bg-[#FCF9F4]/10 transition-colors"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                aria-label="Next chapter"
                onClick={() =>
                  handleSelectScene((currentIndex + 1) % scenes.length)
                }
                className="p-1 rounded hover:bg-[#FCF9F4]/10 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Progress Track */}
              <div className="flex-1 h-1.5 bg-[#FCF9F4]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E5C697] transition-[width] duration-100 ease-linear"
                  style={{
                    width: `${((currentIndex + progress / 100) / scenes.length) * 100}%`,
                  }}
                />
              </div>

              <span className="text-[11px] tabular-nums text-[#FCF9F4]/80 whitespace-nowrap">
                {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
              </span>
            </div>
          </div>

          {/* Chapter selector strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`text-left p-2.5 rounded border text-xs transition-colors ${
                  idx === currentIndex
                    ? 'bg-[#4A1828] text-[#FCF9F4] border-[#4A1828]'
                    : 'bg-[#F4ECE4] text-[#6A5A5E] border-[#4A1828]/12 hover:text-[#4A1828]'
                }`}
              >
                <span className="block truncate font-medium">{scene.chapter}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right: Animated Atelier Craftsmanship Progress & Story */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#A67C46]">
              <Film className="w-3.5 h-3.5" />
              <span>Atelier Campaign Film · Karachi</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#21171A] leading-tight text-balance">
              Motion, Silk &amp; Hand-Stitched Pakistani Artistry
            </h2>
            <p className="text-sm text-[#3B2E32] leading-relaxed">
              Watch our seasonal campaign reel showcasing {siteConfig.brandName}’s signature silhouettes—from Zamzama handloom silks to intricate bridal dabka craftsmanship.
            </p>
          </div>

          {/* Animated Craftsmanship Progress Bars */}
          <div className="space-y-4 pt-2 border-t border-[#4A1828]/12">
            {CRAFT_METRICS.map((metric, idx) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#21171A]">{metric.label}</span>
                  <span className="text-[#A67C46] font-semibold tabular-nums">
                    {metric.note} · {metric.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#F4ECE4] rounded-full overflow-hidden border border-[#4A1828]/10">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: metric.pct / 100 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full bg-gradient-to-r from-[#4A1828] to-[#A67C46]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreCollections}
              className="px-6 py-3 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium rounded hover:bg-[#38111E] transition-colors"
            >
              Shop Featured Film Pieces
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
