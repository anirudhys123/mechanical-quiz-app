// pages/result.js

import { useRouter } from 'next/router';

export default function Result() {
  const router = useRouter();
  const { score, total, time, accuracy } = router.query;

  const restart = () => {
    router.replace('/'); // Clean reload
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

      <button className="btn btn-primary mt-3" onClick={restart}>Try Again</button>
    </div>
  );
}
