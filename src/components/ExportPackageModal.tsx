import { useState } from 'react';
import { Check, Copy, Download, FileCode, FolderArchive, Globe, X } from 'lucide-react';
import { ProductItem, SiteConfig } from '../data/products';
import { downloadStandaloneHtml, downloadWebsiteZip } from '../utils/exportHtml';

interface ExportPackageModalProps {
  isOpen: boolean;
  products: ProductItem[];
  siteConfig: SiteConfig;
  onClose: () => void;
}

const SHARED_PUBLIC_URL =
  'https://ais-pre-epe2uxwuifu32z5zpvw42u-778985021304.asia-east1.run.app';

export function ExportPackageModal({
  isOpen,
  products,
  siteConfig,
  onClose,
}: ExportPackageModalProps) {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    setExportStatus(null);
    try {
      await downloadWebsiteZip(products, siteConfig);
      setExportStatus('ZIP package downloaded: maimoona-noor-fashion-website.zip');
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadSingleHtml = async () => {
    setDownloadingHtml(true);
    setExportStatus(null);
    try {
      await downloadStandaloneHtml(products, siteConfig);
      setExportStatus('Standalone HTML downloaded: index.html');
    } finally {
      setDownloadingHtml(false);
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(SHARED_PUBLIC_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Download Website Package and Hosting Guide"
    >
      <div className="bg-[#FCF9F4] text-[#21171A] w-full max-w-3xl max-h-[90vh] flex flex-col border border-[#4A1828]/20 shadow-2xl rounded">
        <div className="px-6 py-4 bg-[#4A1828] text-[#FCF9F4] flex items-center justify-between rounded-t">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Download Website Package &amp; Publish Online
            </h2>
            <p className="text-xs text-[#FCF9F4]/80">
              Export complete HTML, CSS, JavaScript, animations, film reel &amp; images
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close download center"
            className="p-1.5 text-[#FCF9F4]/80 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {exportStatus && (
            <div className="p-3 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-xs font-medium text-[#2D6A4F] rounded flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{exportStatus}</span>
            </div>
          )}

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-[#F4ECE4] border border-[#4A1828]/15 rounded flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#4A1828]">
                  <FolderArchive className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-semibold">
                    Complete ZIP Package
                  </h3>
                </div>
                <p className="text-xs text-[#3B2E32] leading-relaxed">
                  Includes <strong>index.html</strong>, <strong>styles.css</strong>,{' '}
                  <strong>app.js</strong>, all dress &amp; hero images inside{' '}
                  <strong>assets/</strong>, and <strong>HOSTING-GUIDE.txt</strong>. Extract and double-click{' '}
                  <code>index.html</code> to run locally, or upload directly to Netlify / GitHub Pages.
                </p>
              </div>
              <button
                type="button"
                disabled={downloadingZip}
                onClick={handleDownloadZip}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#4A1828] text-[#FCF9F4] text-xs font-semibold rounded hover:bg-[#38111E] transition-colors disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadingZip
                    ? 'Building ZIP Package...'
                    : 'Download Website ZIP (.zip)'}
                </span>
              </button>
            </div>

            <div className="p-5 bg-[#F4ECE4] border border-[#4A1828]/15 rounded flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#4A1828]">
                  <FileCode className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-semibold">
                    Standalone index.html
                  </h3>
                </div>
                <p className="text-xs text-[#3B2E32] leading-relaxed">
                  A single self-contained <strong>index.html</strong> file with CSS, JavaScript, animations, film player, and all dress photos embedded inside. Ideal for sending directly on WhatsApp or opening offline with one click.
                </p>
              </div>
              <button
                type="button"
                disabled={downloadingHtml}
                onClick={handleDownloadSingleHtml}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#FCF9F4] text-[#4A1828] border border-[#4A1828]/30 text-xs font-semibold rounded hover:bg-white transition-colors disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadingHtml
                    ? 'Preparing index.html...'
                    : 'Download Single index.html'}
                </span>
              </button>
            </div>
          </div>

          {/* Live Share URL */}
          <div className="p-4 bg-white border border-[#4A1828]/15 rounded space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4A1828] uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Your Live Shareable Link (Already Online)</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={SHARED_PUBLIC_URL}
                aria-label="Live shareable website URL"
                className="flex-1 px-3 py-2 text-xs bg-[#F4ECE4] border border-[#4A1828]/15 rounded text-[#21171A]"
              />
              <button
                type="button"
                onClick={handleCopyShareUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E] whitespace-nowrap"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hosting Instructions */}
          <div className="space-y-3 text-xs text-[#3B2E32] leading-relaxed border-t border-[#4A1828]/12 pt-5">
            <h3 className="font-serif text-xl font-semibold text-[#21171A]">
              How to Publish on Free Public Hosting (Netlify or GitHub Pages)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#4A1828]/10 rounded space-y-1.5">
                <p className="font-semibold text-[#4A1828]">
                  Option A: Netlify Drop (Fastest — 30 Seconds)
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Download &amp; unzip <strong>maimoona-noor-fashion-website.zip</strong>.</li>
                  <li>Open <strong>https://app.netlify.com/drop</strong> in your browser.</li>
                  <li>Drag and drop the unzipped folder onto the page.</li>
                  <li>Netlify immediately generates your live public HTTPS URL to share with clients.</li>
                </ol>
              </div>

              <div className="p-4 bg-white border border-[#4A1828]/10 rounded space-y-1.5">
                <p className="font-semibold text-[#4A1828]">
                  Option B: GitHub Pages (Free Custom Subdomain)
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Create a new public repository on GitHub (e.g. <code>maimoona-noor-fashion</code>).</li>
                  <li>Upload <code>index.html</code>, <code>styles.css</code>, <code>app.js</code>, and the <code>assets/</code> folder.</li>
                  <li>Open <strong>Settings → Pages</strong> and select <strong>Deploy from branch: main / root</strong>.</li>
                  <li>Your public site goes live at <code>https://username.github.io/maimoona-noor-fashion/</code>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
