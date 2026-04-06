import React, { useState, useRef } from 'react';
import { useAppContext, MODELS } from '../store/AppContext';
import { generateContent, generateAudio } from '../lib/gemini';
import { extractTextFromPdf } from '../lib/pdf';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { Play, Download, FileText, Search, Settings2, Network, CheckSquare } from 'lucide-react';

export default function GuidanceAnalysis() {
  const { language, defaultModel, theme } = useAppContext();
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [guidanceText, setGuidanceText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [report1, setReport1] = useState('');
  const [report2, setReport2] = useState('');
  const [skillMd, setSkillMd] = useState('');
  
  const [templateText, setTemplateText] = useState('骨外固定器查驗登記審查指引與審查清單\\n本文件旨在規範骨外固定器（Orthopedic External Fixators）於醫療器材查驗登記時之臨床前安全與有效性要求，確保產品符合應有之品質標準。\\n\\n第一部分：骨外固定器臨床前審查指引 (Review Guidance)\\n\\n產品規格要求 (Product Specifications)\\n申請者應提供詳盡之產品資料，以評估其設計之合理性與安全性：\\n用途說明：詳列臨床適應症、適用對象及預定用途。\\n組件清單：應包含所有系統組件（如：骨針、連接桿、接合器、夾具等）。\\n工程圖面：檢附具備關鍵幾何尺寸、公差之主要組件工程圖。\\n材質證明：所有與人體接觸或具結構功能之材質，應標明符合之國際材質標準（如 ASTM F136, ISO 5832 等）。\\n等同性比較：與已上市類似品執行規格、設計及材質之列表比較，並針對差異處進評估。\\n2. 生物相容性評估 (Biocompatibility)\\n依據產品與人體接觸之性質與時間，進行風險評估：\\n\\n豁免機制：若採用常用之醫用金屬（如 Ti6Al4V, 316L 不鏽鋼等）且製程未改變，得檢具材質證明申請豁免試驗。\\n執行標準：依據 ISO 10993 系列標準。重點評估項目包括細胞毒性、敏感試驗、刺激試驗、系統毒性、基因毒性及植入試驗。\\n3. 滅菌確效 (Sterilization)\\n無菌標準：無菌包裝產品之無菌保證水準 (Sterility Assurance Level, SAL) 必須符合 10⁻⁶。\\n滅菌驗證：須依據對應之 ISO 標準（如 17665-1, 11135 或 11137）提供滅菌計畫書與報告。對於非無菌提供之產品，應提供建議之醫事機構滅菌方法。\\n4. 機械性質評估 (Mechanical Testing)\\n機械測試應能模擬臨床最壞情況（Worst-case scenario）：\\n\\n執行標準：建議參考 ASTM F1541。\\n評估項目：\\n剛性與屈折測量：評估固定器之結構穩定度。\\n靜態破壞測試：評估裝置在承受過負荷時之極限強度。\\n疲勞與鬆脫測試：模擬長期使用下之循環負荷，及接合處是否容易產生鬆動。\\n5. 特定風險與額外評估 (Special Risks and Additional Evaluations)\\n針對具備特殊宣稱或設計之產品，應額外提供資料：\\n\\n脊椎或動態機能：若具備微動或動態機能，應提供相關動態功能測試報告。\\nMRI 相容性：若宣稱 MRI 安全（MRI Safe）或 MRI 條件（MRI Conditional），須依國際標準提交相關磁共振環境評估報告。\\n第二部分：骨外固定器查驗登記審查清單 (Review Checklist)\\n審查項目 審查重點 / 具備文件 審查結果 (符合/不適用/待補) 備註說明\\n\\n產品規格\\n1.1 用途說明 是否包含完整臨床適應症與適應對象？ □\\n1.2 組件目錄 是否列出所有系統組件（錨定、橋接、接合器）？ □\\n1.3 工程圖 主要組件是否具備詳細尺寸與標註？ □\\n1.4 設計與組合 是否描述各組件之連接、鎖固機制？ □\\n1.5 材質證明 是否提供材質證明並符合 ASTM/ISO 國際標準？ □\\n1.6 等同性比較 是否與 Predicate Device 進行列表比較並評估差異？ □\\n生物相容性\\n2.1 測試報告 是否依 ISO 10993 提供細胞毒性、過敏等基本報告？ □\\n2.2 豁免說明 若申請豁免，是否提供符合常規金屬之佐證資料？ □\\n滅菌確效\\n3.1 滅菌標準 無菌保證水準 (SAL) 是否符合 ≤ 10⁻⁶？ □\\n3.2 驗證報告 是否提供符合 ISO 17665/11135/11137 之驗證資料？ □\\n機械性質\\n4.1 剛性測試 是否提供符合 ASTM F1541 之剛性測量報告？ □\\n4.2 靜態破壞 是否執行裝置整體之靜態破壞試驗？ □\\n4.3 疲勞測試 是否針對組件間之疲勞與鬆脫進行評估？ □\\n特定風險\\n5.1 動態機能 脊椎用或具動態功能者，是否提供風險評估或測試？ □\\n5.2 結構硬度 若硬度低於市場類似品，是否有安全性合理說明？ □\\n5.3 MRI 相容性 宣稱 MRI 相容者，是否提交環境相容性評估報告？ □\\n審查結論：\\n□ 建議核准\\n□ 需補件再議（補件項目：____________________）\\n□ 不予核准\\n審查人員簽章： ____________________ 日期： 2026-03-13');

  const [prompt1, setPrompt1] = useState('Analyze the provided guidance document and search for related FDA information (510(k) summary, guidance, standard). Synthesize the analysis with external research findings to create a comprehensive report in 2000~3000 words.');
  const [model1, setModel1] = useState(defaultModel);

  const [prompt2, setPrompt2] = useState('Based on the previous comprehensive report, create a new report strictly following the provided report template structure.');
  const [model2, setModel2] = useState(defaultModel);

  const [prompt3, setPrompt3] = useState('Create a skill.md file that defines a new agent skill to generate comprehensive medical device guidance based on the structure and info found in the provided guidance. Use standard skill-creator format. Add 3 additional wow features in this skill.');
  const [model3, setModel3] = useState(defaultModel);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mindmapCode, setMindmapCode] = useState<string | null>(null);
  const mindmapRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type === 'application/pdf') {
      try {
        const text = await extractTextFromPdf(file);
        setGuidanceText(text);
      } catch (err) {
        console.error("PDF extraction failed", err);
        alert("Failed to extract PDF text.");
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setGuidanceText(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!guidanceText) return;
    setIsProcessing(true);
    try {
      const sysInstruction = `You are a medical device regulatory expert. Output language MUST be ${language}.`;
      const fullPrompt = `${prompt1}\\n\\nGuidance Document:\\n${guidanceText}`;
      const result = await generateContent(model1, fullPrompt, sysInstruction, true);
      setReport1(result);
    } catch (err) {
      console.error(err);
      alert("Analysis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateTemplateReport = async () => {
    if (!report1) return;
    setIsProcessing(true);
    try {
      const sysInstruction = `You are a medical device regulatory expert. Output language MUST be ${language}.`;
      const fullPrompt = `${prompt2}\\n\\nTemplate:\\n${templateText}\\n\\nPrevious Report:\\n${report1}`;
      const result = await generateContent(model2, fullPrompt, sysInstruction, false);
      setReport2(result);
    } catch (err) {
      console.error(err);
      alert("Template report generation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateSkill = async () => {
    if (!report1) return;
    setIsProcessing(true);
    try {
      const sysInstruction = `You are an expert AI agent skill creator. Output language MUST be ${language}.`;
      const fullPrompt = `${prompt3}\\n\\nContext Report:\\n${report1}`;
      const result = await generateContent(model3, fullPrompt, sysInstruction, false);
      setSkillMd(result);
    } catch (err) {
      console.error(err);
      alert("Skill creation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!report1) return;
    setIsProcessing(true);
    try {
      // Summarize first to avoid TTS limits
      const summary = await generateContent(defaultModel, `Summarize this report in 2 paragraphs for an audio briefing in ${language}:\\n${report1}`);
      const audioBase64 = await generateAudio(summary);
      if (audioBase64) {
        const url = `data:audio/mp3;base64,${audioBase64}`;
        setAudioUrl(url);
      }
    } catch (err) {
      console.error(err);
      alert("Audio generation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateMindmap = async () => {
    if (!report1) return;
    setIsProcessing(true);
    try {
      const prompt = `Generate a Mermaid.js mindmap code representing the regulatory structure and key points of this report. Only output the raw mermaid code starting with 'mindmap', no markdown formatting.\\n\\nReport:\\n${report1}`;
      const code = await generateContent(defaultModel, prompt);
      const cleanCode = code.replace(/\`\`\`mermaid/g, '').replace(/\`\`\`/g, '').trim();
      setMindmapCode(cleanCode);
      
      setTimeout(() => {
        if (mindmapRef.current) {
          mermaid.initialize({ startOnLoad: false, theme: theme === 'Dark' ? 'dark' : 'default' });
          mermaid.render('mindmap-svg', cleanCode).then((result) => {
            if (mindmapRef.current) {
              mindmapRef.current.innerHTML = result.svg;
            }
          });
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Mindmap generation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClasses = cn(
    "w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all",
    theme === 'Dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
  );

  const cardClasses = cn(
    "p-6 rounded-xl border shadow-sm mb-6",
    theme === 'Dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Step 1: Input Guidance */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="text-blue-500" />
          {language === 'English' ? '1. Input Guidance' : '1. 輸入指引文件'}
        </h3>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setInputMode('text')}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", inputMode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300')}
          >
            Paste Text
          </button>
          <button 
            onClick={() => setInputMode('file')}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", inputMode === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300')}
          >
            Upload File (TXT, MD, PDF)
          </button>
        </div>

        {inputMode === 'text' ? (
          <textarea 
            className={cn(inputClasses, "h-40 font-mono text-sm")}
            placeholder="Paste guidance text here..."
            value={guidanceText}
            onChange={e => setGuidanceText(e.target.value)}
          />
        ) : (
          <input 
            type="file" 
            accept=".txt,.md,.pdf"
            onChange={handleFileUpload}
            className={inputClasses}
          />
        )}
      </div>

      {/* Step 2: Analyze & Research */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="text-purple-500" />
          {language === 'English' ? '2. Analyze & Research' : '2. 分析與研究 (Report 1)'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1 opacity-70">Prompt</label>
            <textarea 
              className={cn(inputClasses, "h-20 text-sm")}
              value={prompt1}
              onChange={e => setPrompt1(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Model</label>
            <select 
              className={cn(inputClasses, "h-10 py-1")}
              value={model1}
              onChange={e => setModel1(e.target.value)}
            >
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button 
              onClick={handleAnalyze}
              disabled={isProcessing || !guidanceText}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Run Analysis'}
            </button>
          </div>
        </div>

        {report1 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Comprehensive Report</h4>
              <div className="flex gap-2">
                <button onClick={handleGenerateAudio} className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-md hover:bg-emerald-200 transition-colors">
                  <Play size={14} /> WOW: Audio Briefing
                </button>
                <button onClick={handleGenerateMindmap} className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-md hover:bg-amber-200 transition-colors">
                  <Network size={14} /> WOW: Mindmap
                </button>
                <button onClick={() => downloadFile(report1, 'report1.md')} className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors">
                  <Download size={14} /> Download MD
                </button>
              </div>
            </div>
            
            {audioUrl && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium mb-2 text-emerald-800 dark:text-emerald-300">AI Voice Briefing</p>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}

            {mindmapCode && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 overflow-x-auto">
                <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-300">Regulatory Mindmap</p>
                <div ref={mindmapRef} className="flex justify-center min-w-[600px]"></div>
              </div>
            )}

            <textarea 
              className={cn(inputClasses, "h-64 font-mono text-sm")}
              value={report1}
              onChange={e => setReport1(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Step 3: Templated Report */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckSquare className="text-teal-500" />
          {language === 'English' ? '3. Templated Report' : '3. 套用範本報告 (Report 2)'}
        </h3>
        
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 opacity-70">Report Template</label>
          <textarea 
            className={cn(inputClasses, "h-32 text-sm font-mono")}
            value={templateText}
            onChange={e => setTemplateText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1 opacity-70">Prompt</label>
            <textarea 
              className={cn(inputClasses, "h-20 text-sm")}
              value={prompt2}
              onChange={e => setPrompt2(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Model</label>
            <select 
              className={cn(inputClasses, "h-10 py-1")}
              value={model2}
              onChange={e => setModel2(e.target.value)}
            >
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button 
              onClick={handleGenerateTemplateReport}
              disabled={isProcessing || !report1}
              className="mt-4 w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {report2 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Templated Report</h4>
              <button onClick={() => downloadFile(report2, 'report2.md')} className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors">
                <Download size={14} /> Download MD
              </button>
            </div>
            <textarea 
              className={cn(inputClasses, "h-64 font-mono text-sm")}
              value={report2}
              onChange={e => setReport2(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Step 4: Create Skill.md */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings2 className="text-orange-500" />
          {language === 'English' ? '4. Create Skill.md' : '4. 建立 Skill.md'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1 opacity-70">Prompt</label>
            <textarea 
              className={cn(inputClasses, "h-20 text-sm")}
              value={prompt3}
              onChange={e => setPrompt3(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70">Model</label>
            <select 
              className={cn(inputClasses, "h-10 py-1")}
              value={model3}
              onChange={e => setModel3(e.target.value)}
            >
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button 
              onClick={handleCreateSkill}
              disabled={isProcessing || !report1}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Create Skill'}
            </button>
          </div>
        </div>

        {skillMd && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Skill.md Content</h4>
              <button onClick={() => downloadFile(skillMd, 'skill.md')} className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors">
                <Download size={14} /> Download skill.md
              </button>
            </div>
            <textarea 
              className={cn(inputClasses, "h-64 font-mono text-sm")}
              value={skillMd}
              onChange={e => setSkillMd(e.target.value)}
            />
          </div>
        )}
      </div>

    </div>
  );
}
