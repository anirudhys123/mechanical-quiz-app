// pages/index.js

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const startQuiz = () => {
    if (category && difficulty) {
      router.push(`/quiz?category=${category}&difficulty=${difficulty}`);
    } else {
      alert('Please select both category and difficulty');
    }
  };

  return (
    <div className="container mt-5 text-white">
     <h1 className="text-center mb-4 fw-bold" style={{ color: 'yellow' }}>
  Mechanical Quiz App
</h1>


      <div className="mb-3">
        <label className="form-label fw-semibold">Select the Subject</label>
        <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- Choose --</option>
          <option value="Thermodynamics">Thermodynamics</option>
          <option value="Heat Transfer">Heat Transfer</option>
          <option value="Fluid Mechanics">Fluid Mechanics</option>
          <option value="Production">Production Technology</option>
          <option value="Mechanics of Solids">Strength of Materials</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Select Difficulty</label>
        <select className="form-select" onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">-- Choose --</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="text-center mb-2">
        <button className="btn btn-outline-primary px-4 py-2 fw-semibold" onClick={startQuiz}>
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
