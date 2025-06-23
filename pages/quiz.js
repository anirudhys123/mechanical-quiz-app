import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Shuffle utility
const shuffleArray = (arr) =>
  Array.isArray(arr) ? [...arr].sort(() => Math.random() - 0.5) : [];

export default function Quiz() {
  const router = useRouter();
  const { category } = router.query;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timer, setTimer] = useState(120);
  const [answerData, setAnswerData] = useState([]);

  useEffect(() => {
    if (!category) return;

    const parts = category.split('_');
    let filePath = '';

    try {
      if (parts.length === 2) {
        const [exam, subject] = parts;
        filePath = `/data/${exam.toLowerCase()}/${subject.toLowerCase().replace(/\s+/g, '_')}.json`;
      } else if (parts.length === 3) {
        const [exam, subject, chapter] = parts;
        filePath = `/data/${exam.toLowerCase()}/${subject.toLowerCase().replace(/\s+/g, '_')}/${chapter.toLowerCase().replace(/\s+/g, '_')}.json`;
      } else {
        alert('❌ Invalid quiz category format.');
        return;
      }

      fetch(filePath)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) throw new Error('Invalid question format');
          const randomTen = shuffleArray(data)
            .slice(0, 10)
            .map((q) => ({
              ...q,
              options: shuffleArray(q.options),
            }));
          setQuestions(randomTen);
          setStartTime(Date.now());
          setQuestionStartTime(Date.now());
        })
        .catch((err) => {
          console.error('❌ Failed to load quiz:', err.message);
          alert('❌ Could not load quiz. Check file path or format.');
        });
    } catch (e) {
      console.error('❌ Error:', e.message);
      alert('❌ Could not build quiz path.');
    }
  }, [category]);

  useEffect(() => {
    if (!questions.length) return;
    if (timer === 0) {
      handleNext();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions]);

  useEffect(() => {
    setTimer(120);
  }, [current]);

  const handleNext = () => {
    const currentQuestion = questions[current];
    const isCorrect = selected === currentQuestion.answer;
    const updatedScore = isCorrect ? score + 1 : score;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const currentAnswerData = {
      question: currentQuestion.question,
      selected: selected || 'Not Answered',
      correct: currentQuestion.answer,
      timeSpent: `${timeSpent} sec`,
    };
    setAnswerData((prev) => [...prev, currentAnswerData]);

    if (current + 1 < questions.length) {
      setScore(updatedScore);
      setCurrent(current + 1);
      setSelected('');
      setQuestionStartTime(Date.now());
    } else {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const accuracy = Math.round((updatedScore / questions.length) * 100);
      const finalData = [...answerData, currentAnswerData];
      localStorage.setItem('quiz-analysis', JSON.stringify(finalData));
      router.push(`/result?score=${updatedScore}&total=${questions.length}&time=${timeTaken}&accuracy=${accuracy}`);
    }
  };

  const submitImmediately = () => {
    if (!confirm('Are you sure you want to submit the quiz early?')) return;

    const currentQuestion = questions[current];
    const isCorrect = selected === currentQuestion.answer;
    const finalScore = score + (isCorrect ? 1 : 0);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const currentAnswerData = {
      question: currentQuestion.question,
      selected: selected || 'Not Answered',
      correct: currentQuestion.answer,
      timeSpent: `${timeSpent} sec`,
    };
    const finalData = [...answerData, currentAnswerData];
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((finalScore / questions.length) * 100);

    localStorage.setItem('quiz-analysis', JSON.stringify(finalData));
    router.push(`/result?score=${finalScore}&total=${questions.length}&time=${timeTaken}&accuracy=${accuracy}`);
  };

  if (!questions.length)
    return <div className="container mt-5">Loading questions...</div>;

  return (
    <div className="container mt-5">
      <h4>Question {current + 1} of {questions.length}</h4>
      <p className="lead">{questions[current].question}</p>
      <div className="mb-2 text-danger fw-bold">Time left: {timer}s</div>

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

      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-success"
          disabled={!selected}
          onClick={handleNext}
        >
          {current + 1 === questions.length ? 'Finish' : 'Next'}
        </button>
        <button
          className="btn btn-danger"
          disabled={!selected}
          onClick={submitImmediately}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
