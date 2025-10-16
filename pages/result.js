import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Result() {
  const router = useRouter();
  const { score, total, time, accuracy } = router.query;
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('quiz-analysis');
    if (storedData) setAnalysis(JSON.parse(storedData));
  }, []);

  const restartQuiz = () => {
    localStorage.removeItem('quiz-analysis');
    router.replace('/');
  };

  const getPerformanceMessage = () => {
    const acc = parseFloat(accuracy || 0);
    const timeTaken = parseFloat(time || 0);

    if (acc >= 90 && timeTaken <= 60)
      return "🌟 Excellent! Lightning fast and highly accurate!";
    if (acc >= 80)
      return "🔥 Great job! Just a bit more practice for perfection.";
    if (acc >= 60)
      return "⚠️ Fair attempt. Revise the weak areas.";
    return "🔄 Keep trying! Consistent practice brings success.";
  };

  return (
    <div className="container mt-5 text-center">
      <h1 className="fw-bold mb-4">🎯 Quiz Summary</h1>

      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h3 className="text-success mb-3">Score: {score} / {total}</h3>
        <p><strong>Time Taken:</strong> {time} seconds</p>
        <p><strong>Accuracy:</strong> {accuracy}%</p>

        <div className="alert alert-info mt-3">{getPerformanceMessage()}</div>
      </div>

      <h4 className="mt-5 mb-3">📊 Detailed Analysis</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Time Spent (s)</th>
            </tr>
          </thead>
          <tbody>
            {analysis.length > 0 ? (
              analysis.map((item, index) => {
                const isCorrect = item.selected === item.correct;
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-start">{item.question}</td>
                    <td className={isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}>
                      {item.selected || '—'}
                    </td>
                    <td className="bg-success text-white">{item.correct}</td>
                    <td>{item.timeSpent}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">No analysis data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mt-4 px-4 py-2" onClick={restartQuiz}>
        🔁 Try Again
      </button>
    </div>
  );
}
