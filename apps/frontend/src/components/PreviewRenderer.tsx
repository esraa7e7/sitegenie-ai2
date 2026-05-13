import React from 'react';
import * as LucideIcons from 'lucide-react';

interface ComponentProps {
  type: string;
  props: any;
}

const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};

const Hero = ({ title, description, badge, primaryAction, secondaryAction, imageUrl }: any) => (
  <section className="relative py-24 px-6 overflow-hidden bg-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="text-left">
        {badge && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
            {badge}
          </div>
        )}
        <h1 className="text-6xl font-black tracking-tight mb-6 leading-tight text-slate-900">{title}</h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">{description}</p>
        <div className="flex gap-4">
          {primaryAction && (
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              {primaryAction}
            </button>
          )}
          {secondaryAction && (
            <button className="border border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
              {secondaryAction}
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3 scale-95 hover:rotate-0 hover:scale-100 transition-all duration-700">
          <img src={imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"} alt="Hero" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </section>
);

const Features = ({ title, subtitle, items }: any) => (
  <section className="py-24 px-6 bg-slate-50">
    <div className="max-w-7xl mx-auto text-center mb-16">
      <h2 className="text-4xl font-bold mb-4 text-slate-900">{title}</h2>
      <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {items?.map((item: any, i: number) => (
        <div key={i} className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8">
            <Icon name={item.icon || 'Zap'} className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-slate-900">{item.title}</h3>
          <p className="text-slate-500 leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const Pricing = ({ title, tiers }: any) => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-7xl mx-auto text-center mb-16">
      <h2 className="text-4xl font-bold mb-4 text-slate-900">{title}</h2>
    </div>
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers?.map((tier: any, i: number) => (
        <div key={i} className={`p-8 rounded-[32px] border ${tier.featured ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'} relative flex flex-col`}>
          {tier.featured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Most Popular
            </div>
          )}
          <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black">${tier.price}</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {tier.features?.map((f: string, j: number) => (
              <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                <LucideIcons.CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
          <button className={`w-full py-4 rounded-xl font-bold transition-all ${tier.featured ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
            Get Started
          </button>
        </div>
      ))}
    </div>
  </section>
);

const Testimonials = ({ title, items }: any) => (
  <section className="py-24 px-6 bg-slate-50">
    <div className="max-w-7xl mx-auto text-center mb-16">
      <h2 className="text-4xl font-bold mb-4 text-slate-900">{title}</h2>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {items?.map((item: any, i: number) => (
        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, j) => (
              <LucideIcons.Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-600 italic mb-8 leading-relaxed">"{item.content}"</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 italic flex items-center justify-center font-bold text-slate-300">
              {item.name?.[0]}
            </div>
            <div>
              <div className="font-bold text-slate-900">{item.name}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">{item.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Contact = ({ title, description, email, phone, address }: any) => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h2 className="text-4xl font-bold mb-6 text-slate-900">{title}</h2>
        <p className="text-slate-600 mb-12 leading-relaxed">{description}</p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><LucideIcons.Mail size={20} /></div>
            <span className="font-medium text-slate-900">{email}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><LucideIcons.Phone size={20} /></div>
            <span className="font-medium text-slate-900">{phone}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><LucideIcons.MapPin size={20} /></div>
            <span className="font-medium text-slate-900">{address}</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Message</label>
            <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help?"></textarea>
          </div>
          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Send Message</button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = ({ companyName, links }: any) => (
  <footer className="py-12 px-6 border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-xl font-bold text-slate-900">{companyName}</div>
      <div className="flex gap-8">
        {links?.map((link: any, i: number) => (
          <a key={i} href={link.url} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
            {link.label}
          </a>
        ))}
      </div>
      <div className="text-slate-400 text-xs font-medium">
        © 2024 {companyName}. Built with SiteGenie AI.
      </div>
    </div>
  </footer>
);

export const PreviewRenderer = ({ data }: { data: any }) => {
  if (!data?.components) return null;

  return (
    <div style={{ fontFamily: data.theme?.font || 'sans-serif' }}>
      {data.components.map((comp: ComponentProps, i: number) => {
        switch (comp.type) {
          case 'hero': return <Hero key={i} {...comp.props} />;
          case 'features': return <Features key={i} {...comp.props} />;
          case 'pricing': return <Pricing key={i} {...comp.props} />;
          case 'testimonials': return <Testimonials key={i} {...comp.props} />;
          case 'contact': return <Contact key={i} {...comp.props} />;
          case 'footer': return <Footer key={i} {...comp.props} />;
          default: return null;
        }
      })}
    </div>
  );
};
