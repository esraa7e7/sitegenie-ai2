import React, { useState } from 'react';
import { 
  Sparkles, Code, Zap, Shield, Rocket, Globe, 
  Layout, ChevronRight, 
  Stars, ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  setView: (view: 'dashboard') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const features = [
    { icon: Code, title: 'AI Code Generation', desc: 'Multi-agent architecture that thinks through design, code, and UX.', color: 'indigo' },
    { icon: Zap, title: 'Real-time Preview', desc: 'VFS technology keeps your changes synced across all environments instantly.', color: 'yellow' },
    { icon: Shield, title: 'Enterprise Grade', desc: 'Isolated E2B execution environments for verifying generated code security.', color: 'green' },
    { icon: Layout, title: 'Responsive DNA', desc: 'Perfect previews for desktop, tablet, and mobile automatically.', color: 'purple' },
    { icon: Rocket, title: 'One-Click Ship', desc: 'Deploy to Vercel or Netlify with zero manual configuration.', color: 'pink' },
    { icon: Globe, title: 'Global CDN', desc: 'Lightning fast delivery through distributed edge networks worldwide.', color: 'blue' },
  ];

  const colorStyles: Record<string, string> = {
    indigo: 'bg-indigo-500/15 text-indigo-300',
    yellow: 'bg-yellow-500/15 text-yellow-300',
    green: 'bg-emerald-500/15 text-emerald-300',
    purple: 'bg-purple-500/15 text-purple-300',
    pink: 'bg-pink-500/15 text-pink-300',
    blue: 'bg-sky-500/15 text-sky-300',
  };

  const pricingPlans = [
    { name: 'Starter', price: 'Free', features: ['Unlimited projects', 'AI-assisted build flow', 'Live previews', 'Secure sandboxing'] },
    { name: 'Scale', price: 'Flexible', features: ['Team collaboration', 'Advanced analytics', 'Custom deployment targets'] },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className={`flex flex-col border-r border-slate-800 bg-slate-950/95 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'}`}>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-300">
                <Sparkles className="w-5 h-5" />
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-semibold text-slate-100">SiteGenie</p>
                  <p className="text-xs text-slate-500">AI Builder</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="rounded-full bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
          </div>

          <div className="border-b border-slate-800 px-5 pb-4">
            <button
              onClick={() => setView('dashboard')}
              className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-slate-700 hover:bg-slate-800 transition"
            >
              <Zap className="h-4 w-4 text-indigo-400" />
              {sidebarOpen ? 'New Chat' : 'Chat'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            {sidebarOpen ? (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-4">Chat History</p>
                <div className="space-y-3">
                  {['Landing Tour', 'Build Coffee Shop', 'Deploy Flow'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-800 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="h-2 w-8 rounded-full bg-slate-700" />
                <div className="h-2 w-8 rounded-full bg-slate-700" />
                <div className="h-2 w-8 rounded-full bg-slate-700" />
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 px-5 py-4">
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-400">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Secure by default
              </div>
              <p className="text-xs leading-5">All generated sites are sandboxed and reviewed before deployment.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_28%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_24%)] pointer-events-none" />

          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex-1 rounded-[32px] border border-slate-800 bg-slate-950/95 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex flex-col items-center text-center gap-4 pb-8 md:pb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <Stars className="h-4 w-4 text-amber-400" />
                  AI Workspace
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">SiteGenie AI Builder</h1>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                    Turn ideas into polished websites with a sleek AI workflow. Your content, your layout, your deployment — all centered in one ChatGPT-inspired experience.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700 hover:bg-slate-900">
                      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl ${colorStyles[feature.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 rounded-[28px] border border-slate-800 bg-slate-900/70 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Platform</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Built for teams and solo creators</h3>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-slate-400">
                    SiteGenie ships with a free-first model. Build as many projects as you need and keep your workflow simple, secure, and scalable.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {pricingPlans.map((plan) => (
                    <div key={plan.name} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 transition hover:border-slate-700 hover:bg-slate-900">
                      <div className="mb-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{plan.name}</p>
                        <p className="mt-1 text-3xl font-black text-white">{plan.price}</p>
                      </div>
                      <ul className="space-y-3 text-sm text-slate-400">
                        {plan.features.map((item) => (
                          <li key={item} className="before:mr-2 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-slate-500 before:align-middle">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-20 border-t border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-end gap-3 rounded-3xl border border-slate-800 bg-slate-900/95 px-4 py-3 shadow-[0_4px_30px_rgba(15,23,42,0.4)]">
              <textarea
                rows={1}
                placeholder="Send a prompt to SiteGenie..."
                className="min-h-[48px] w-full resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500 text-white transition hover:bg-indigo-400"
                aria-label="Send message"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

