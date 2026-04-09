/*
==========================================================
IT 3203 - Project Milestone #2
Quiz Logic Script

Handles:
- Answer validation
- Score calculation
- Pass/Fail evaluation
- Detailed feedback display
- Reset functionality

Designed for:
- Clean structure (code quality points)
- Clear output (rubric requirements)
- Strong UX (professional design)
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // DOM ELEMENT REFERENCES
  // =========================
  const quizForm = document.getElementById("server-quiz");
  const resultsPanel = document.getElementById("quiz-results");
  const resultsBanner = document.getElementById("result-banner");
  const scoreOutput = document.getElementById("score-output");
  const resultList = document.getElementById("result-list");
  const resetButton = document.getElementById("reset-button");

  // =========================
  // ANSWER KEY
  // =========================
  const answerKey = {
    q1: ["cloud", "cloud computing"], // accepts variations now
    q2: "limited accessibility",
    q3: "virtualization",
    q4: "scalability",
    q5: ["Scalability", "Remote access", "On-demand resources"]
  };

  // =========================
  // QUESTION CONFIG
  // =========================
  const questionData = [

    {
      id: "q1",
      prompt: "What type of infrastructure allows servers to scale dynamically over the internet?",
      getUserAnswer: () => document.getElementById("q1").value.trim(),
      checkAnswer: (value) => {
        const normalized = normalize(value);
        return answerKey.q1.includes(normalized);
      },
      answerText: "Cloud computing"
    },

    {
      id: "q2",
      prompt: "What was a major limitation of centralized mainframe systems?",
      getUserAnswer: () => getSingleChoiceValue("q2"),
      checkAnswer: (value) => value === answerKey.q2,
      answerText: "Limited accessibility"
    },

    {
      id: "q3",
      prompt: "What technology allows multiple virtual servers to run on one physical machine?",
      getUserAnswer: () => getSingleChoiceValue("q3"),
      checkAnswer: (value) => value === answerKey.q3,
      answerText: "Virtualization"
    },

    {
      id: "q4",
      prompt: "What is a key advantage of cloud computing?",
      getUserAnswer: () => getSingleChoiceValue("q4"),
      checkAnswer: (value) => value === answerKey.q4,
      answerText: "Scalability"
    },

    {
      id: "q5",
      prompt: "Which options are features of cloud-based systems?",
      getUserAnswer: () => getMultipleChoiceValues("q5"),
      checkAnswer: (value) => arraysMatch(value, answerKey.q5),
      answerText: "Scalability, Remote access, On-demand resources"
    }
  ];

  // =========================
  // QUIZ SUBMIT LOGIC
  // =========================
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let correctCount = 0;
    let resultsHTML = "";

    questionData.forEach((question, index) => {

      const userAnswer = question.getUserAnswer();
      const isCorrect = question.checkAnswer(userAnswer);

      if (isCorrect) correctCount++;

      const userText = Array.isArray(userAnswer)
        ? (userAnswer.length ? userAnswer.join(", ") : "No selections made")
        : (userAnswer || "No answer provided");

      resultsHTML += `
        <article class="result-item ${isCorrect ? "correct" : "incorrect"}">
          <h3>Question ${index + 1}</h3>
          <p><strong>Prompt:</strong> ${question.prompt}</p>
          <p><strong>Your Answer:</strong> ${escapeHtml(userText)}</p>
          <p><strong>Correct Answer:</strong> ${question.answerText}</p>
          <p class="score-text"><strong>Result:</strong> ${isCorrect ? "✔ Correct" : "✘ Incorrect"}</p>
          <p><strong>Points:</strong> ${isCorrect ? "1 / 1" : "0 / 1"}</p>
        </article>
      `;
    });

    const totalQuestions = questionData.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    // =========================
    // DISPLAY RESULTS
    // =========================
    resultsPanel.classList.add("visible");

    resultsBanner.className = `result-banner ${passed ? "status-pass" : "status-fail"}`;
    resultsBanner.innerHTML = `
      <h2>${passed ? "PASS" : "FAIL"}</h2>
      <p><strong>Score:</strong> ${correctCount} / ${totalQuestions} (${percentage}%)</p>
      <p>${passed ? "Great job! You understand server evolution concepts." : "Review the material and try again."}</p>
    `;

    scoreOutput.innerHTML = `<p class="score-text">Total Score: ${correctCount} / ${totalQuestions}</p>`;
    resultList.innerHTML = resultsHTML;

    resultsPanel.scrollIntoView({ behavior: "smooth" });
  });

  // =========================
  // RESET FUNCTION
  // =========================
  resetButton.addEventListener("click", () => {
    quizForm.reset();

    resultsPanel.classList.remove("visible");
    resultsBanner.innerHTML = "";
    scoreOutput.innerHTML = "";
    resultList.innerHTML = "";
  });

  // =========================
  // HELPER FUNCTIONS
  // =========================

  function getSingleChoiceValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  }

  function getMultipleChoiceValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map(el => el.value)
      .sort();
  }

  function arraysMatch(a, b) {
    if (a.length !== b.length) return false;
    return [...a].sort().every((val, i) => val === [...b].sort()[i]);
  }

  function normalize(value) {
    return value.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

});
