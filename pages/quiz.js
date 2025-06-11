import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Safely shuffle array
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
  const [timer, setTimer] = useState(60);
  const [answerData, setAnswerData] = useState([]);

  useEffect(() => {
    if (!category) return;

    const parts = category.split('_');
    const exam = parts[0];
    const subject = parts[1];
    const chapter = parts[2]; // optional

    let filePath = '';

  if (exam === 'GATE') {
  filePath = `/data/gate/${subject.toLowerCase().replace(/\s+/g, '_')}.json`;
} else if (exam === 'SOFTWARE') {
  filePath = `/data/software/${subject.toLowerCase().replace(/\s+/g, '_')}.json`;
} else if (exam === 'FORMULAE') {
  filePath = `/data/formulae/${subject.toLowerCase().replace(/\s+/g, '_')}.json`;
} else if (exam && subject && chapter) {
  filePath = `/data/${exam.toLowerCase()}/${subject.toLowerCase().replace(/\s+/g, '_')}/${chapter.toLowerCase().replace(/\s+/g, '_')}.json`;
} else {
  console.error('Invalid category format:', parts);
  return;
}


    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Expected JSON array of questions');
        const randomTen = shuffleArray(data)
          .slice(0, 10)
          .map((q) => ({
            ...q,
            options: shuffleArray(q.options),
          }));
        setQuestions(randomTen);
        setStartTime(Date.now());
      })
      .catch((err) => {
        console.error('Failed to load quiz data:', err.message);
        alert('❌ Failed to load quiz. Please check file path or format.');
      });
  }, [category]);

  useEffect(() => {
    if (!questions.length) return;
    if (timer === 0) {
      handleNext(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions]);

  useEffect(() => {
    setTimer(60);
  }, [current]);

  const handleNext = () => {
    const currentQuestion = questions[current];
    const isCorrect = selected === currentQuestion.answer;
    const updatedScore = isCorrect ? score + 1 : score;

    const currentAnswerData = {
      question: currentQuestion.question,
      selected: selected || 'Not Answered',
      correct: currentQuestion.answer,
    };
    setAnswerData((prev) => [...prev, currentAnswerData]);

    if (current + 1 < questions.length) {
      setScore(updatedScore);
      setCurrent(current + 1);
      setSelected('');
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

    const currentAnswerData = {
      question: currentQuestion.question,
      selected: selected || 'Not Answered',
      correct: currentQuestion.answer,
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
      <h4>
        Question {current + 1} of {questions.length}
      </h4>
      <p className="lead">{questions[current].question}</p>
      <div className="mb-2 text-danger fw-bold">Time left: {timer}s</div>

      <div className="list-group">
        {questions[current].options.map((opt, idx) => (
          <button
            key={idx}
            className={`list-group-item list-group-item-action ${
              selected === opt ? 'active' : ''
            }`}
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
