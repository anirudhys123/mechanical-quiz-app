import { useState } from 'react';
import { useRouter } from 'next/router';

const examSubjects = {
  GATE: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Theory of Machines", "Engineering Mathematics"],
  FORMULAE: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Theory of Machines", "Engineering Mathematics"],
  GMAT: ["Quantitative Reasoning", "Verbal Reasoning"],
  PGNEET: ["Pathology"],
  SOFTWARE: ["Python", "Data Science"],
  UPSC: ["Static"],
  JEE: ["Maths", "Physics", "Chemistry"]
};

const subjectChapters = {
  // GMAT
  "Quantitative Reasoning": ["Algebra", "Percentages", "Ratios and Proportions", "SI and CI"],
  "Verbal Reasoning": ["Reading Comprehension", "Sentence Correction"],

  // PGNEET
  "Pathology": ["Cell Injury", "Neoplasia", "Inflammation"],

  // UPSC
  "Static": ["Art and Culture", "Geography"],

  // JEE
  "Maths": ["Trigonometry", "Vectors"],
  "Physics": ["Laws of Motion"],
  "Chemistry": ["Periodic Table"]
};

export default function Home() {
  const router = useRouter();
  const [exam, setExam] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');

  const startQuiz = () => {
    const needsChapter = ['GMAT', 'PGNEET', 'UPSC', 'JEE'].includes(exam);
    if (!exam || !subject || (needsChapter && !chapter)) {
      alert('Please complete all fields.');
      return;
    }

    const category = needsChapter
      ? `${exam}_${subject}_${chapter}`
      : `${exam}_${subject}`;

    router.push(`/quiz?category=${category}`);
  };

  return (
    <div className="container mt-5 text-white">
      <h1 className="text-center mb-4 fw-bold" style={{ color: 'yellow' }}>
        Quiz App
      </h1>

      <div className="mb-3">
        <label className="form-label fw-semibold">Select Exam</label>
        <select
          className="form-select"
          value={exam}
          onChange={(e) => {
            setExam(e.target.value);
            setSubject('');
            setChapter('');
          }}
        >
          <option value="">-- Choose --</option>
          <option value="GATE">GATE Mechanical</option>
          <option value="FORMULAE">GATE Formulae Test</option>
          <option value="GMAT">GMAT</option>
          <option value="PGNEET">PG NEET</option>
          <option value="SOFTWARE">Software Engineering</option>
          <option value="UPSC">UPSC</option>
          <option value="JEE">JEE Formulae Test</option>
        </select>
      </div>

      {exam && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Subject</label>
          <select
            className="form-select"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setChapter('');
            }}
          >
            <option value="">-- Choose --</option>
            {examSubjects[exam]?.map((sub, idx) => (
              <option key={idx} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {(exam === 'GMAT' || exam === 'PGNEET' || exam === 'UPSC' || exam === 'JEE') && subject && (
        <div className="mb-4">
          <label className="form-label fw-semibold">Select Chapter</label>
          <select
            className="form-select"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {subjectChapters[subject]?.map((chap, idx) => (
              <option key={idx} value={chap}>{chap}</option>
            ))}
          </select>
        </div>
      )}

      <div className="text-center mb-2">
        <button
          className="btn btn-outline-primary px-4 py-2 fw-semibold"
          onClick={startQuiz}
        >
          Start Quiz
        </button>
      </div>

      <div className="text-center mt-5 mb-3">
        <p className="fw-semibold" style={{ color: 'yellow' }}>
          &copy; 2025 Developed by Anirudh YS
        </p>
      </div>
    </div>
  );
}
