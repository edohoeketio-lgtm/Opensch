import React, { useState } from 'react';
import { Plus, Trash, GripVertical, Clock, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  videoTimestamp: number;
}

interface QuizBuilderProps {
  lessonId?: string;
  quizData: QuizQuestion[] | null | undefined;
  onChange: (newQuizData: QuizQuestion[]) => void;
}

export default function QuizBuilder({ quizData, onChange, lessonId }: QuizBuilderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const questions = Array.isArray(quizData) ? quizData : [];

  const handleGenerateAI = async () => {
    if (!lessonId) return;
    setIsGenerating(true);
    toast.info("Analyzing transcript and generating quiz questions...");
    try {
      const res = await fetch('/api/admin/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz");
      
      onChange([...questions, ...data]);
      toast.success(`Successfully generated ${data.length} questions!`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      videoTimestamp: 0,
    };
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    onChange(newQuestions);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    onChange(newQuestions);
  };

  return (
    <div className="flex flex-col gap-4 bg-ink rounded-xl border border-admin-border p-5">
      {questions.map((q, qIndex) => (
        <div key={q.id} className="bg-admin-surface border border-admin-border rounded-xl p-4 flex gap-4 transition-all overflow-hidden relative">
          
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
               {/* Question Title */}
               <div className="flex-1 flex flex-col gap-1.5">
                 <div className="flex items-center justify-between">
                     <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted shrink-0">Question {qIndex + 1}</label>
                     <button onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors p-1 rounded-md">
                       <Trash className="w-3.5 h-3.5" />
                     </button>
                 </div>
                 <input 
                   type="text"
                   value={q.question}
                   onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                   placeholder="Enter the quiz question..."
                   className="w-full bg-ink border border-admin-border rounded-lg px-3 py-2 text-[13px] text-surface focus:outline-none focus:border-accent/50 transition-colors"
                 />
               </div>
               
               {/* Video Timestamp */}
               <div className="w-full md:w-32 flex flex-col gap-1.5 shrink-0">
                 <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted shrink-0 flex items-center gap-1"><Clock className="w-3 h-3"/> Time (Secs)</label>
                 <input 
                   type="number"
                   value={q.videoTimestamp}
                   onChange={(e) => updateQuestion(qIndex, { videoTimestamp: parseInt(e.target.value) || 0 })}
                   placeholder="0"
                   className="w-full bg-ink border border-admin-border rounded-lg px-3 py-2 text-[13px] text-surface focus:outline-none focus:border-accent/50 transition-colors font-mono"
                 />
               </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuestion(qIndex, { correctIndex: optIndex })}
                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${q.correctIndex === optIndex ? 'border-accent bg-accent' : 'border-admin-border hover:border-admin-muted bg-ink'}`}
                  >
                    {q.correctIndex === optIndex && <div className="w-2 h-2 rounded-full bg-ink" />}
                  </button>
                  <input 
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${['A','B','C','D'][optIndex]}`}
                    className={`w-full bg-ink border rounded-lg px-3 py-1.5 text-[12px] focus:outline-none transition-colors ${q.correctIndex === optIndex ? 'border-accent/50 text-surface' : 'border-admin-border text-admin-muted hover:text-surface'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col md:flex-row gap-3 mt-2 pr-0">
        <button onClick={addQuestion} className="w-full py-4 border border-dashed border-admin-border hover:border-admin-muted rounded-xl flex items-center justify-center gap-2 text-admin-muted hover:text-surface transition-colors cursor-pointer group bg-ink hover:bg-admin-surface">
           <Plus className="w-4 h-4 rounded-full transition-colors" />
           <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-surface">Add Quiz Question</span>
        </button>
        {lessonId && (
          <button 
            onClick={handleGenerateAI} 
            disabled={isGenerating}
            className="w-full md:w-auto px-6 py-4 border border-accent/30 bg-accent/10 hover:bg-accent/20 rounded-xl flex items-center justify-center gap-2 text-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
             {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
             <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">Auto-Generate</span>
          </button>
        )}
      </div>

    </div>
  );
}
