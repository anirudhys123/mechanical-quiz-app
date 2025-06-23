import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Result() {
  const router = useRouter();
  const { score, total, time, accuracy } = router.query;
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('quiz-analysis');
    if (storedData) {
      setAnalysis(JSON.parse(storedData));
    }
  }, []);

  const restart = () => {
    localStorage.removeItem('quiz-analysis');
    router.replace('/');
  };

  const getPerformanceMessage = () => {
    const acc = parseInt(accuracy, 10);
    const timeTaken = parseInt(time, 10);

    if (acc >= 90 && timeTaken <= 60) {
      return "🌟 Excellent performance! You're interview-ready!";
    } else if (acc >= 70) {
      return "✅ Good job! A little more practice will make you perfect.";
    } else if (acc >= 50) {
      return "⚠️ Fair attempt. Review key concepts and try again.";
    } else {
      return "🔄 Needs improvement. Practice regularly to build confidence.";
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>Quiz Completed</h1>
      <h3 className="text-success my-3">Score: {score} / {total}</h3>
      <p><strong>Time Taken:</strong> {time} seconds</p>
      <p><strong>Accuracy:</strong> {accuracy}%</p>

      <div className="alert alert-info mt-4" role="alert">
        {getPerformanceMessage()}
      </div>

      <h4 className="mt-5">Detailed Analysis</h4>
      <div className="table-responsive">
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {analysis.map((item, index) => {
              const isCorrect = item.selected === item.correct;
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-start">{item.question}</td>
                  <td className={isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}>
                    {item.selected}
                  </td>
                  <td className="bg-success text-white">{item.correct}</td>
                  <td>{item.timeSpent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mt-4" onClick={restart}>Try Again</button>
    </div>
  );
}
