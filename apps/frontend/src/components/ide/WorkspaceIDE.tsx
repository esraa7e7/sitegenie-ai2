import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, Download, Share2, Settings, Maximize2, Minimize2,
  Terminal, Globe, Zap, Layout, Activity, Clock, ShieldCheck, 
  History, Users, MessageSquare, ShoppingBag, Code, MousePointer2, 
  Shield, Sparkles, ChevronRight, Menu, X, FolderTree, Play,
  GitBranch, Cloud, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';

// ==================== الأنواع والواجهات ====================

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: string[];
  parentId?: string;
}

interface Project {
  id: string;
  name: string;
  lastModified: Date;
  files: FileNode[];
}

// ==================== هوك حفظ تلقائي مبسط ====================

const useAutoSave = (projectId: string, content: string, delay: number = 2000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (content) {
        setIsSaving(true);
        try {
          // محاكاة حفظ في localStorage أو API
          localStorage.setItem(`project_${projectId}`, content);
          setLastSaved(new Date());
          console.log('✅ تم الحفظ التلقائي');
        } catch (error) {
          console.error('❌ فشل الحفظ:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [content, projectId, delay]);

  return { isSaving, lastSaved };
};

// ==================== مكون شجرة الملفات ====================

const FileTree = ({ files, onFileSelect, currentFile }: { 
  files: FileNode[]; 
  onFileSelect: (file: FileNode) => void;
  currentFile: FileNode | null;
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (parentId?: string, level: number = 0) => {
    const items = files.filter(f => f.parentId === parentId);
    
    return items.map(item => (
      <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
        {item.type === 'folder' ? (
          <div className="select-none">
            <button
              onClick={() => toggleFolder(item.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <ChevronRight 
                className={`w-3 h-3 transition-transform ${expandedFolders.has(item.id) ? 'rotate-90' : ''}`} 
              />
              <FolderTree className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-neutral-300">{item.name}</span>
            </button>
            {expandedFolders.has(item.id) && renderFileTree(item.id, level + 1)}
          </div>
        ) : (
          <button
            onClick={() => onFileSelect(item)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
              currentFile?.id === item.id 
                ? 'bg-indigo-600/20 text-indigo-400' 
                : 'hover:bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="text-sm">{item.name}</span>
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="p-3">
      <div className="mb-4 px-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">مستكشف الملفات</h3>
      </div>
      {renderFileTree()}
    </div>
  );
};

// ==================== محرر الكود المحسن ====================

const CodeEditor = ({ value, onChange, language = 'html' }: {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}) => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [value]);

  return (
    <div className="h-full flex bg-slate-900 rounded-lg overflow-hidden border border-white/10">
      {/* أرقام الأسطر */}
      <div className="bg-slate-950 px-3 py-4 text-right border-r border-white/10">
        {lineNumbers.map(num => (
          <div key={num} className="text-xs text-neutral-600 font-mono leading-6">
            {num}
          </div>
        ))}
      </div>
      
      {/* منطقة التحرير */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-slate-900 text-white font-mono text-sm p-4 focus:outline-none resize-none"
        spellCheck={false}
        style={{ lineHeight: '24px' }}
      />
    </div>
  );
};

// ==================== لوحة التحكم (Console) ====================

const ConsolePanel = ({ logs }: { logs: string[] }) => {
  return (
    <div className="h-48 border-t border-white/10 bg-black/50 flex flex-col">
      <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-neutral-400" />
        <span className="text-xs font-mono text-neutral-400">Console</span>
        <div className="flex-1" />
        <button className="text-xs text-neutral-500 hover:text-white transition">
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-1">
        {logs.length === 0 ? (
          <div className="text-neutral-600 text-center py-4">
            Ready. No console output yet.
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-neutral-400">
              <span className="text-neutral-600 mr-2">$</span>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==================== شريط الحالة المحسن ====================

const StatusBar = ({ isSaving, lastSaved, errors }: {
  isSaving: boolean;
  lastSaved: Date | null;
  errors: number;
}) => {
  return (
    <div className="h-8 border-t border-white/10 bg-black/40 px-4 flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-neutral-400">
            {isSaving ? 'جاري الحفظ...' : lastSaved ? `تم الحفظ: ${lastSaved.toLocaleTimeString()}` : 'جاهز'}
          </span>
        </div>
        
        {errors > 0 && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{errors} خطأ</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-neutral-500">
        <span>UTF-8</span>
        <span>TypeScript</span>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
};

// ==================== مكون AI Chat المصغر ====================

const AIChat = ({ onGenerateCode }: { onGenerateCode: (code: string) => void }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    { role: 'ai', content: 'مرحباً! أنا مساعدك AI. أخبرني ماذا تريد بناء؟ 🚀' }
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    
    // محاكاة استجابة AI
    setTimeout(() => {
      const aiResponse = `سأقوم بإنشاء كود HTML/CSS بناءً على طلبك: "${message}"\n\nهذا نموذج بسيط يمكنك التعديل عليه...`;
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
      
      // توليد كود تجريبي
      const demoCode = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: system-ui; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; margin: 0; }
        .card { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
        h1 { color: #333; margin-bottom: 10px; }
        button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="card">
        <h1>✨ ${message}</h1>
        <button onclick="alert('Hello!')">انقر هنا</button>
    </div>
</body>
</html>`;
      
      onGenerateCode(demoCode);
      setMessage('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-sm">AI Assistant</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white/10 text-neutral-300'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="أخبرني ماذا تريد بناء..."
            className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== المكون الرئيسي WorkspaceIDE ====================

interface WorkspaceIDEProps {
  projectId?: string | null;
  onBack?: () => void;
}

export const WorkspaceIDE = ({ projectId = 'default', onBack }: WorkspaceIDEProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>موقعي - SiteGenie AI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Cairo', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .hero {
            text-align: center;
            color: white;
            max-width: 600px;
        }
        .title {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #94a3b8;
            margin-bottom: 2rem;
        }
        .btn {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none;
            padding: 12px 32px;
            border-radius: 50px;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(59,130,246,0.4);
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1 class="title">✨ SiteGenie AI</h1>
        <p class="subtitle">ابنِ مواقع الويب بذكاء اصطناعي</p>
        <button class="btn" onclick="alert('مرحباً بك في SiteGenie AI! 🚀')">ابدأ الآن</button>
    </div>
</body>
</html>`);
  
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  
  const projectKey = projectId ?? 'default';
  const { isSaving, lastSaved } = useAutoSave(projectKey, code);
  
  // ملفات تجريبية
  const [files] = useState<FileNode[]>([
    { id: '1', name: 'src', path: '/src', type: 'folder', children: ['2', '3'] },
    { id: '2', name: 'index.html', path: '/src/index.html', type: 'file', content: code, parentId: '1' },
    { id: '3', name: 'style.css', path: '/src/style.css', type: 'file', content: '/* CSS styles */', parentId: '1' },
  ]);

  // إضافة log تجريبي
  useEffect(() => {
    setConsoleLogs([
      '🚀 Server started on port 5173',
      '📦 Bundling files...',
      '✅ Build completed in 1.2s',
      '👀 Watching for file changes...'
    ]);
  }, []);

  const handleGenerateCode = (newCode: string) => {
    setCode(newCode);
    setConsoleLogs(prev => [...prev, `✨ AI generated new code at ${new Date().toLocaleTimeString()}`]);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setConsoleLogs(prev => [...prev, `📥 Downloaded project at ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      
      {/* شريط الأدوات العلوي */}
      <header className="h-14 border-b border-white/10 bg-black/30 backdrop-blur-xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition">
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">SiteGenie AI</span>
          </div>
          
          <div className="h-6 w-px bg-white/10" />
          
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-md text-sm transition ${
                activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 inline mr-1" />
              محرر
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-md text-sm transition ${
                activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Play className="w-4 h-4 inline mr-1" />
              معاينة
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isSaving && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
          
          <button onClick={handleDownload} className="p-2 hover:bg-white/10 rounded-lg transition" title="تحميل">
            <Download className="w-4 h-4" />
          </button>
          
          <button className="p-2 hover:bg-white/10 rounded-lg transition" title="مشاركة">
            <Share2 className="w-4 h-4" />
          </button>
          
          <button className="p-2 hover:bg-white/10 rounded-lg transition" title="الإعدادات">
            <Settings className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex overflow-hidden">
        {/* الشريط الجانبي - ملفات */}
        <aside className="w-64 border-r border-white/10 bg-black/20 overflow-auto">
          <FileTree 
            files={files} 
            onFileSelect={setCurrentFile}
            currentFile={currentFile}
          />
        </aside>
        
        {/* منطقة العمل الرئيسية */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'editor' ? (
            <>
              <div className="flex-1 p-4 overflow-auto">
                <CodeEditor 
                  value={code} 
                  onChange={setCode}
                  language="html"
                />
              </div>
              <ConsolePanel logs={consoleLogs} />
            </>
          ) : (
            <div className="flex-1 bg-white">
              <iframe
                srcDoc={code}
                title="preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              />
            </div>
          )}
        </div>
        
        {/* الشريط الجانبي الأيمن - AI Chat */}
        <aside className="w-80 border-l border-white/10 bg-black/20">
          <AIChat onGenerateCode={handleGenerateCode} />
        </aside>
      </div>
      
      {/* شريط الحالة السفلي */}
      <StatusBar isSaving={isSaving} lastSaved={lastSaved} errors={errors} />
    </div>
  );
};

export default WorkspaceIDE;