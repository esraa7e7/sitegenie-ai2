import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { EditorView } from './components/EditorView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// تعريف أنواع الصفحات المتاحة في التطبيق
type View = 'landing' | 'dashboard' | 'editor';

function App() {
  // حالة التحكم في الصفحة المعروضة حالياً
  const [view, setView] = useState<View>('landing');
  // حالة التحكم في المشروع المختار (لفتحه في المحرر)
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();

  // دالة التعامل مع اختيار مشروع معين
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setView('editor');
  };

  const handleNewProject = () => {
    setSelectedProjectId(undefined);
    setView('editor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* شريط التنقل العلوي */}
      <Navbar view={view} setView={setView} />
      
      {/* منطق تبديل الصفحات بناءً على الـ view */}
      <main>
        {view === 'landing' && (
          <LandingPage setView={setView} />
        )}

        {view === 'dashboard' && (
          <DashboardView onNewProject={handleNewProject} onSelectProject={handleSelectProject} />
        )}

        {view === 'editor' && (
          <EditorView projectId={selectedProjectId} />
        )}
      </main>

      {/* إظهار الفوتر في الصفحة الرئيسية فقط */}
      {view === 'landing' && <Footer />}

    </div>
  );
}

export default App;