import { useState } from 'react';
import { useRouter } from 'next/router';

const examSubjects = {
  GATE: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Theory of Machines", "Engineering Mathematics"],
  FORMULAE: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Theory of Machines", "Engineering Mathematics"],
  GMAT: ["Quantitative Reasoning", "Verbal Reasoning"],
  PGNEET: ["Pathology"],
  SOFTWARE: ["Python", "Data Science"],
  UPSC: ["Static"],
  JEE: ["Maths", "Physics", "Chemistry"],
  HVAC: ["Chillers", "Dehumidifiers", "Refrigeration"],   // ✅ Added both HVAC topics
  ICSE: ["Mathematics"],
  ELECTRICAL :["gis","ups"]
};

const subjectChapters = {
  "Quantitative Reasoning": ["Algebra", "Percentages", "Ratios and Proportions", "SI and CI"],
  "Verbal Reasoning": ["Reading Comprehension", "Sentence Correction"],
  "Pathology": ["Cell Injury", "Neoplasia", "Inflammation"],
  "Static": ["Art and Culture", "Geography"],
  "Maths": ["Trigonometry", "Vectors"],
  "Physics": ["Laws of Motion"],
  "Chemistry": ["Periodic Table"],
  "Mathematics": ["Exponents","Squares","Cubes","Proportions","Percentages","Mensuration","Factorization","Sets","Inequations"]
};

export default function Home() {
  const router = useRouter();
  const [exam, setExam] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');

  const startQuiz = () => {
    const needsChapter = ['GMAT', 'PGNEET', 'UPSC', 'JEE', 'ICSE'].includes(exam);

    if (!exam || !subject || (needsChapter && !chapter)) {
      alert('Please complete all fields.');
      return;
    }

    // ✅ HVAC Special handling
    if (exam === 'HVAC') {
      if (subject === 'Chillers') {
        router.push(`/quiz?category=hvac/chillers/chillers`);
        return;
      }
      if (subject === 'Dehumidifiers') {
        router.push(`/quiz?category=hvac/dehumidifiers/dehumidifiers`);
        return;
      }
      if (subject === 'Refrigeration') {
        router.push(`/quiz?category=hvac/refrigeration/refrigeration`);
        return;
      }
    }

    // ✅ Electrical (GIS) special handling
if (exam === 'ELECTRICAL') {
  if (subject === 'gis') {
    router.push(`/quiz?category=electrical/gis`);
    return;
  }
}

    // ✅ ICSE Exponent special case
    if (exam === 'ICSE' && subject === 'Mathematics' && chapter === 'Exponents') {
      router.push(`/quiz?category=ICSE_Mathematics_Exponents`);
      return;
    }

    // Default path for other exams
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

      {/* Exam selection */}
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
          <option value="HVAC">HVAC</option>
          <option value="ICSE">ICSE</option>
          <option value = "ELECTRICAL"> Electrical</option>
        </select>
      </div>

      {/* Subject selection */}
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

      {/* Chapter selection */}
      {(exam === 'GMAT' || exam === 'PGNEET' || exam === 'UPSC' || exam === 'JEE' || exam === 'ICSE') && subject && (
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

      {/* Start Quiz Button */}
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
