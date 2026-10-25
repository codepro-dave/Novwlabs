import React, { useState } from 'react';
import { 
  UserProfile, 
  AcademyCourse, 
  AcademyLesson 
} from '../types';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Play, 
  Star, 
  Users, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles, 
  Check, 
  X,
  Code,
  Layers,
  GraduationCap,
  Copy,
  Terminal,
  CheckSquare
} from 'lucide-react';

interface AcademyViewProps {
  userProfile: UserProfile;
  courses: AcademyCourse[];
  onCompleteCourse: (courseId: string, xpEarned: number) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  userProfile,
  courses,
  onCompleteCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCourse, setActiveCourse] = useState<AcademyCourse | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  
  // Interactive Quiz State
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);

  const categories = [
    'All',
    'Programming',
    'Robotics & Electronics',
    'Artificial Intelligence',
    'Mathematics & Physics',
    'Entrepreneurship',
  ];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || !activeCourse) return;
    const correct = selectedAnswer === activeCourse.quiz.answer;
    setIsAnswerCorrect(correct);
    setQuizSubmitted(true);

    if (correct && !userProfile.completedCourses.includes(activeCourse.id)) {
      onCompleteCourse(activeCourse.id, activeCourse.xpReward);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Academy Hero Header */}
      {!activeCourse ? (
        <>
          <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 glow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    FREEDREAM STEM & INNOVATION CURRICULUM
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  FREEDREAM <span className="text-amber-400">ACADEMY</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Comprehensive mastery modules across programming, AI, robotics, physics, and deep-tech entrepreneurship with interactive knowledge checks and certifications.
                </p>
              </div>

              {/* Learning Stats Bar */}
              <div className="p-3.5 rounded-2xl bg-[#050814] border border-slate-800 flex items-center gap-4 text-xs font-mono shrink-0">
                <div>
                  <span className="text-slate-400 block text-[10px]">COURSES COMPLETED</span>
                  <span className="text-amber-400 text-sm font-bold">
                    {userProfile.completedCourses.length} of {courses.length}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px]">TOTAL XP EARNED</span>
                  <span className="text-cyan-400 text-sm font-bold">
                    {userProfile.xp} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-6 flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#050814]/90 border border-slate-800/80 text-xs font-medium">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map(course => {
              const isCompleted = userProfile.completedCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="rounded-2xl bg-[#090e29]/80 border border-slate-800 hover:border-cyan-500/40 p-5 flex flex-col justify-between space-y-4 glow-card transition-all hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        +{course.xpReward} XP
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white font-display">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {course.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.enrolledCount}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      Level: <strong className="text-slate-200">{course.level}</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveCourse(course);
                        setActiveLessonIndex(0);
                        setShowQuiz(false);
                      }}
                      className={`w-full py-2.5 rounded-xl font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-md shadow-cyan-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Course Completed (Review)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Start Course & Earn XP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Course Detail & Interactive Lesson Viewer */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveCourse(null)}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Academy Catalog</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono border border-cyan-800">
              {activeCourse.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar: Lessons List */}
            <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
              <div>
                <h3 className="font-bold text-white font-display text-base">
                  {activeCourse.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {activeCourse.lessons.length} Modules • {activeCourse.duration}
                </p>
              </div>

              <div className="space-y-1.5">
                {activeCourse.lessons.map((lesson, idx) => {
                  const isCurrent = activeLessonIndex === idx && !showQuiz;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonIndex(idx);
                        setShowQuiz(false);
                      }}
                      className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-500 text-black font-semibold shadow-md'
                          : 'bg-[#050814] text-slate-300 hover:bg-slate-800/80 border border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                          isCurrent ? 'bg-black text-cyan-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="line-clamp-1">{lesson.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 ${isCurrent ? 'text-black' : 'text-slate-500'}`}>
                        {lesson.duration}
                      </span>
                    </button>
                  );
                })}

                {/* Final Knowledge Check Quiz Tab */}
                <button
                  onClick={handleStartQuiz}
                  className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    showQuiz
                      ? 'bg-amber-500 text-black font-semibold border-amber-400 shadow-md'
                      : 'bg-[#050814] text-amber-300 border-amber-500/30 hover:bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Final Mastery Assessment</span>
                  </div>
                  <span className={`text-[10px] font-mono ${showQuiz ? 'text-black' : 'text-amber-400'}`}>
                    +{activeCourse.xpReward} XP
                  </span>
                </button>
              </div>
            </div>

            {/* Main Lesson Content or Quiz Screen */}
            <div className="lg:col-span-2">
              {!showQuiz ? (
                /* Lesson Content */
                <div className="p-6 rounded-2xl bg-[#090e29] border border-cyan-500/30 space-y-6 glow-card">
                  <div className="space-y-2 border-b border-slate-800 pb-4">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase">
                      Module {activeLessonIndex + 1} of {activeCourse.lessons.length}
                    </span>
                    <h2 className="text-xl font-bold font-display text-white">
                      {activeCourse.lessons[activeLessonIndex].title}
                    </h2>
                  </div>

                  {/* Interactive Lesson Text, Code & Practical Hardware Schematics */}
                  {(() => {
                    const currentLesson = activeCourse.lessons[activeLessonIndex];
                    const isChallengeCompleted = completedChallenges.includes(currentLesson.id);

                    return (
                      <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {/* In-depth Module Content */}
                        <div className="p-4 rounded-xl bg-[#050814] border border-cyan-950/80 text-slate-200 leading-relaxed">
                          <p>{currentLesson.content || `In this module, we dissect foundational engineering principles for ${currentLesson.title}. Balance computational capability with low power constraints.`}</p>
                        </div>

                        {/* Interactive Code Snippet if present */}
                        {currentLesson.codeSnippet && (
                          <div className="rounded-xl bg-[#030611] border border-cyan-500/30 overflow-hidden shadow-inner">
                            <div className="flex items-center justify-between px-3 py-2 bg-[#060a1d] border-b border-slate-800 text-xs font-mono text-cyan-400">
                              <span className="flex items-center gap-1.5 uppercase font-semibold text-[11px]">
                                <Code className="w-3.5 h-3.5" />
                                {currentLesson.codeLanguage || 'Firmware Code'} Snippet
                              </span>
                              <button
                                onClick={() => {
                                  if (currentLesson.codeSnippet) {
                                    navigator.clipboard.writeText(currentLesson.codeSnippet);
                                    setCopiedSnippet(true);
                                    setTimeout(() => setCopiedSnippet(false), 2000);
                                  }
                                }}
                                className="flex items-center gap-1 text-[11px] hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700 transition-colors"
                              >
                                {copiedSnippet ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Code</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3.5 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                              <code>{currentLesson.codeSnippet}</code>
                            </pre>
                          </div>
                        )}

                        {/* Core Engineering Takeaways */}
                        <div className="p-4 rounded-xl bg-[#050814] border border-slate-800 space-y-2">
                          <h4 className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Core Engineering Takeaways
                          </h4>
                          <ul className="space-y-1.5 text-slate-300 text-xs">
                            {(currentLesson.takeaways && currentLesson.takeaways.length > 0 ? currentLesson.takeaways : [
                              'Always calculate maximum current draw before connecting inductive loads.',
                              'Implement hardware pull-up or pull-down resistors to prevent floating GPIO pin states.',
                              'Structure sensor telemetry into compact packets to minimize edge radio transmission energy.'
                            ]).map((takeaway, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">✓</span>
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Practical Hands-on Engineering Challenge */}
                        {currentLesson.challenge && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 to-slate-900 border border-amber-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                                Practical Lab Challenge
                              </h4>
                              <button
                                onClick={() => {
                                  setCompletedChallenges(prev => 
                                    prev.includes(currentLesson.id) 
                                      ? prev.filter(id => id !== currentLesson.id)
                                      : [...prev, currentLesson.id]
                                  );
                                }}
                                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                                  isChallengeCompleted
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                    : 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                                }`}
                              >
                                {isChallengeCompleted ? '✓ Challenge Completed' : 'Mark Challenge Done'}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 font-mono">
                              {currentLesson.challenge}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Navigation Buttons */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      disabled={activeLessonIndex === 0}
                      onClick={() => setActiveLessonIndex(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono disabled:opacity-40"
                    >
                      &larr; Previous Lesson
                    </button>

                    {activeLessonIndex < activeCourse.lessons.length - 1 ? (
                      <button
                        onClick={() => setActiveLessonIndex(prev => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono flex items-center gap-1 shadow-sm"
                      >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartQuiz}
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Take Mastery Quiz</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Interactive Knowledge Check Quiz */
                <div className="p-6 rounded-2xl bg-[#090e29] border border-amber-500/40 space-y-6 glow-card animate-in fade-in">
                  <div className="space-y-1 border-b border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold">
                        KNOWLEDGE ASSESSMENT & XP VERIFICATION
                      </span>
                      <span className="text-xs font-mono text-cyan-400">
                        Reward: +{activeCourse.xpReward} XP
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-display">
                      {activeCourse.quiz.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {activeCourse.quiz.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswer === optIdx;
                      let optionStyle = 'bg-[#050814] border-slate-800 text-slate-200 hover:border-slate-600';

                      if (quizSubmitted) {
                        if (optIdx === activeCourse.quiz.answer) {
                          optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isSelected && !isAnswerCorrect) {
                          optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswer(optIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug pt-0.5">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and Explanation */}
                  {!quizSubmitted ? (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={selectedAnswer === null}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono disabled:opacity-40 shadow-lg shadow-amber-500/20 transition-all"
                      >
                        Submit Knowledge Check
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2 border-t border-slate-800 animate-in fade-in">
                      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                        isAnswerCorrect 
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                      }`}>
                        {isAnswerCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" /> : <X className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />}
                        <div className="space-y-1 text-xs">
                          <h4 className="font-bold text-white text-sm">
                            {isAnswerCorrect ? 'Excellent! Correct Answer (+XP Awarded)' : 'Incorrect Solution'}
                          </h4>
                          <p className="text-slate-300 leading-relaxed">
                            {activeCourse.quiz.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedAnswer(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
                        >
                          Try Again
                        </button>

                        <button
                          onClick={() => setActiveCourse(null)}
                          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono shadow-sm"
                        >
                          Finish & Return to Catalog
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
