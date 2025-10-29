import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// ✅ Utility: Shuffle array
const shuffleArray = (arr) =>
  Array.isArray(arr) ? [...arr].sort(() => Math.random() - 0.5) : [];

export default function Quiz() {
  const router = useRouter();
  const { category } = router.query;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timer, setTimer] = useState(60);
  const [answerData, setAnswerData] = useState([]);

  // ✅ Load quiz questions dynamically
  useEffect(() => {
    if (!category) return;

    let filePath = "";

    try {
      // 🔹 HVAC special handling
      if (category.startsWith("hvac/")) {
        const folder = category.split("/")[1];
        filePath = `/data/hvac/${folder}/${folder}.json`;
      }

      // 🔹 Electrical → GIS special handling
      else if (category === "electrical/gis") {
        filePath = `/data/electrical/gis.json`;
      }

      // 🔹 ICSE special handling
      else if (category === "ICSE_Mathematics_Exponents") {
        filePath = "/data/icse/mathematics/exponents.json";
      }

      // 🔹 Generic dynamic handler
      else {
        const parts = category.split("_");
        if (parts.length === 2) {
          const [exam, subject] = parts;
          filePath = `/data/${exam.toLowerCase()}/${subject
            .toLowerCase()
            .replace(/\s+/g, "_")}.json`;
        } else if (parts.length === 3) {
          const [exam, subject, chapter] = parts;
          filePath = `/data/${exam.toLowerCase()}/${subject
            .toLowerCase()
            .replace(/\s+/g, "_")}/${chapter
            .toLowerCase()
            .replace(/\s+/g, "_")}.json`;
        } else {
          throw new Error("Invalid category format");
        }
      }

      // 🔹 Fetch JSON data
      fetch(filePath)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) throw new Error("Invalid question format");
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
          console.error("❌ Failed to load quiz:", err.message);
          alert("❌ Could not load quiz. Please check your folder or file name.");
        });
    } catch (e) {
      console.error("❌ Error building quiz path:", e.message);
      alert("❌ Could not build quiz path.");
    }
  }, [category]);

  // ✅ Timer
  useEffect(() => {
    if (!questions.length) return;
    if (timer === 0) {
      handleNext();
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, questions]);

  useEffect(() => setTimer(60), [current]);

  // ✅ Next question handler
  const handleNext = () => {
    const currentQuestion = questions[current];
    const isCorrect = selected === currentQuestion.answer;
    const updatedScore = isCorrect ? score + 1 : score;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const currentAnswerData = {
      question: currentQuestion.question,
      selected: selected || "Not Answered",
      correct: currentQuestion.answer,
      timeSpent: `${timeSpent} sec`,
    };

    setAnswerData((prev) => [...prev, currentAnswerData]);

    if (current + 1 < questions.length) {
      setScore(updatedScore);
      setCurrent(current + 1);
      setSelected("");
      setQuestionStartTime(Date.now());
    } else {
      finishQuiz(updatedScore, [...answerData, currentAnswerData]);
    }
  };

  // ✅ Submit early
  const submitImmediately = () => {
    if (!confirm("Submit quiz now?")) return;
    const currentQuestion = questions[current];
    const isCorrect = selected === currentQuestion.answer;
    const finalScore = score + (isCorrect ? 1 : 0);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const currentAnswerData = {
      question: currentQuestion.question,
      selected: selected || "Not Answered",
      correct: currentQuestion.answer,
      timeSpent: `${timeSpent} sec`,
    };

    finishQuiz(finalScore, [...answerData, currentAnswerData]);
  };

  // ✅ Finish quiz helper
  const finishQuiz = (finalScore, finalData) => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((finalScore / questions.length) * 100);

    localStorage.setItem("quiz-analysis", JSON.stringify(finalData));

    router.push(
      `/result?score=${finalScore}&total=${questions.length}&time=${totalTime}&accuracy=${accuracy}`
    );
  };

  if (!questions.length)
    return (
      <div className="container mt-5 text-center text-light">
        <h4>Loading questions...</h4>
      </div>
    );

  const question = questions[current];

  return (
    <div className="container mt-5 text-light">
      <h4>
        Question {current + 1} of {questions.length}
      </h4>
      <p className="lead">{question.question}</p>
      <div className="mb-2 text-danger fw-bold">⏱ Time left: {timer}s</div>

      <div className="list-group">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`list-group-item list-group-item-action ${
              selected === opt ? "active" : ""
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
          {current + 1 === questions.length ? "Finish" : "Next"}
        </button>
        <button className="btn btn-danger" onClick={submitImmediately}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
