// pages/quiz.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Shuffle utility for arrays
const shuffleArray = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};

export default function Quiz() {
  const router = useRouter();
  const { category, difficulty } = router.query;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (difficulty && category) {
      fetch(`/data/${category.toLowerCase().replace(/\s+/g, '_')}_${difficulty}.json`)
        .then((res) => res.json())
        .then((data) => {
          const shuffledQuestions = shuffleArray(data).map(q => ({
            ...q,
            options: shuffleArray(q.options) // shuffle options as well
          }));
          setQuestions(shuffledQuestions);
          setStartTime(Date.now());
        });
    }
  }, [category, difficulty]);

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected('');
    } else {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = score + (selected === questions[current].answer ? 1 : 0);
      const accuracy = Math.round((finalScore / questions.length) * 100);

      router.push(
        `/result?score=${finalScore}&total=${questions.length}&time=${timeTaken}&accuracy=${accuracy}`
      );
    }
  };

  if (!questions.length) return <div className="container mt-5">Loading questions...</div>;

  return (
    <div className="container mt-5">
      <h4>Question {current + 1} of {questions.length}</h4>
      <p className="lead">{questions[current].question}</p>

      <div className="list-group">
        {questions[current].options.map((opt, idx) => (
          <button
            key={idx}
            className={`list-group-item list-group-item-action ${selected === opt ? 'active' : ''}`}
            onClick={() => setSelected(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <button className="btn btn-success mt-4" disabled={!selected} onClick={handleNext}>
        {current + 1 === questions.length ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}
