import React, { useState } from 'react';
import { AppProvider, useAppContext, PAINTER_STYLES, MODELS } from './store/AppContext';
import { cn } from './lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  FileUp, 
  CheckSquare, 
  PenTool, 
  Settings,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TWPremarket from './components/TWPremarket';
import GuidanceAnalysis from './components/GuidanceAnalysis';
import Chatbot from './components/Chatbot';

function AppContent() {
  const { theme, language, painterStyle, defaultModel, setTheme, setLanguage, setPainterStyle, setDefaultModel } = useAppContext();
  const [activeTab, setActiveTab] = useState('guidance');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'dashboard', label: language === 'English' ? 'Dashboard' : '儀表板', icon: LayoutDashboard },
    { id: 'tw-premarket', label: language === 'English' ? 'TW Premarket' : '台灣查驗登記', icon: FileText },
    { id: 'guidance', label: language === 'English' ? 'Guidance Analysis' : '指引分析與報告', icon: BookOpen },
    { id: 'pdf-md', label: language === 'English' ? 'PDF to MD' : 'PDF轉Markdown', icon: FileUp },
    { id: 'review-pipeline', label: language === 'English' ? 'Review Pipeline' : '審查流程', icon: CheckSquare },
    { id: 'notes', label: language === 'English' ? 'Note Keeper' : '筆記管理', icon: PenTool },
    { id: 'settings', label: language === 'English' ? 'Settings' : '設定', icon: Settings },
  ];

  const getPainterClass = () => {
    switch (painterStyle) {
      case 'Vincent van Gogh': return 'bg-blue-900/10';
      case 'Claude Monet': return 'bg-green-900/10';
      case 'Pablo Picasso': return 'bg-orange-900/10';
      case 'Leonardo da Vinci': return 'bg-amber-900/10';
      case 'Hokusai': return 'bg-indigo-900/10';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      theme === 'Dark' ? 'bg-gray-900 text-white' : getPainterClass(),
      theme === 'Dark' ? 'dark' : ''
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        theme === 'Dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        "border-r flex flex-col"
      )}>
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Agentic Reviewer
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    activeTab === tab.id 
                      ? (theme === 'Dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600')
                      : (theme === 'Dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                  )}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Theme</label>
            <select 
              value={theme} 
              onChange={e => setTheme(e.target.value as any)}
              className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Language</label>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value as any)}
              className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="English">English</option>
              <option value="Traditional Chinese">Traditional Chinese</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Painter Style</label>
            <select 
              value={painterStyle} 
              onChange={e => setPainterStyle(e.target.value)}
              className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              {PAINTER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Default Model</label>
            <select 
              value={defaultModel} 
              onChange={e => setDefaultModel(e.target.value)}
              className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <header className={cn(
          "sticky top-0 z-40 flex items-center px-4 h-16 border-b",
          theme === 'Dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200',
          "backdrop-blur-sm"
        )}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4">
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tw-premarket' && <TWPremarket />}
          {activeTab === 'guidance' && <GuidanceAnalysis />}
          {activeTab === 'pdf-md' && <div>PDF to MD Content</div>}
          {activeTab === 'review-pipeline' && <div>Review Pipeline Content</div>}
          {activeTab === 'notes' && <div>Note Keeper Content</div>}
          {activeTab === 'settings' && <div>Settings Content</div>}
        </div>
      </main>

      {/* WOW Feature 3: Chatbot */}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
