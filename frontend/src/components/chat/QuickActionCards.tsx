import React from 'react';
import { BookOpen, CheckSquare, Award, Sparkles, FileText, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface QuickActionCardsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onSelectPrompt }) => {
  const { user } = useAuth();
  const dept = user?.departmentCode || 'CSE';

  // Department-specific prompt customization
  const getDeptAction = () => {
    switch (dept) {
      case 'AIML':
        return {
          title: 'AIML: Deep Learning & Neural Nets',
          desc: 'Unit topics, CNN/RNN architectures, backpropagation and lab grading',
          icon: Cpu,
          color: 'from-purple-500 to-indigo-600',
          prompt: 'What is the course syllabus, lab requirements, and grading scheme for AI & Machine Learning in our department?',
        };
      case 'DS':
        return {
          title: 'DS: Big Data & Analytics',
          desc: 'Data warehousing, PySpark, statistical modeling, and project evaluation',
          icon: Cpu,
          color: 'from-cyan-500 to-blue-600',
          prompt: 'Explain the Data Science curriculum, required libraries, and internal evaluation criteria for semester coursework.',
        };
      case 'ECE':
        return {
          title: 'ECE: VLSI & Digital Signal Processing',
          desc: 'Verilog HDL, CMOS layout, filter design, and laboratory guidelines',
          icon: Cpu,
          color: 'from-blue-500 to-cyan-600',
          prompt: 'Summarize the ECE course syllabus for VLSI Design and Digital Signal Processing (DSP) including internal assessment marks.',
        };
      case 'EEE':
        return {
          title: 'EEE: Power Systems & Control',
          desc: 'Transmission lines, stability, switchgear protection, and lab assessments',
          icon: Cpu,
          color: 'from-amber-500 to-yellow-600',
          prompt: 'What is the syllabus outline and passing criteria for Power Systems and Control Engineering in the EEE curriculum?',
        };
      case 'MECH':
        return {
          title: 'MECH: Thermodynamics & CAD/CAM',
          desc: 'Heat transfer, thermal cycles, FEA modeling, and workshop safety',
          icon: Cpu,
          color: 'from-orange-500 to-red-600',
          prompt: 'Provide details on the Mechanical Engineering Thermodynamics and CAD/CAM syllabus and workshop examination rules.',
        };
      case 'CIVIL':
        return {
          title: 'CIVIL: Structural & Concrete Tech',
          desc: 'IS 456 standards, soil mechanics, surveying, and lab testing',
          icon: Cpu,
          color: 'from-emerald-500 to-green-600',
          prompt: 'What are the core topics and laboratory experiments in the Civil Engineering Structural Analysis and Concrete Technology curriculum?',
        };
      case 'CSE':
      default:
        return {
          title: 'CSE: Data Structures & Algorithms',
          desc: 'Trees, graph algorithms, asymptotic complexity, and lab evaluation',
          icon: BookOpen,
          color: 'from-emerald-500 to-teal-600',
          prompt: 'What is the detailed syllabus for Data Structures (CS201), especially Unit 3 graph algorithms and continuous internal assessment?',
        };
    }
  };

  const actions = [
    getDeptAction(),
    {
      title: 'Analyze Uploaded Document',
      desc: 'Ground answers in any PDF or DOCX file uploaded by faculty or student',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      prompt: 'Please analyze the uploaded document and summarize the key units, exam regulations, and important topics.',
    },
    {
      title: 'Attendance Requirements',
      desc: '75% semester eligibility, medical condonation, and detention thresholds',
      icon: CheckSquare,
      color: 'from-blue-500 to-academic-600',
      prompt: 'What is the exact attendance requirement for my semester exams, and how does medical condonation work?',
    },
    {
      title: 'Grading & CGPA Scale',
      desc: '10-point letter grades, credit weightage, and passing cut-offs',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      prompt: 'Explain the university 10-point grading system, grade point calculation, and minimum CGPA for degree conferment.',
    },
    {
      title: 'Examination Rules',
      desc: 'Hall ticket issuance, registration deadlines, and conduct rules',
      icon: Sparkles,
      color: 'from-indigo-500 to-violet-600',
      prompt: 'What are the official examination rules regarding hall tickets, prohibited items, and registration deadlines?',
    },
    {
      title: 'Department Curriculum & Electives',
      desc: `Explore 8 semester roadmap for ${dept} department`,
      icon: BookOpen,
      color: 'from-teal-500 to-emerald-600',
      prompt: `What are the core subjects and elective options across the 8 semesters for the ${dept} department?`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl mx-auto my-6 px-4">
      {actions.map((act, index) => {
        const Icon = act.icon;
        return (
          <div
            key={index}
            onClick={() => onSelectPrompt(act.prompt)}
            className="group relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-navy-900/60 backdrop-blur-sm cursor-pointer hover:border-academic-400 dark:hover:border-academic-600 hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5"
          >
            <div>
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-sm mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-academic-600 dark:group-hover:text-academic-400 transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {act.desc}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-medium text-academic-600 dark:text-academic-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Ask AI Assistant &rarr;
            </div>
          </div>
        );
      })}
    </div>
  );
};

