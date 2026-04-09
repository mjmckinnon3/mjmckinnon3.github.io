/*
  IT 3203 Project Milestone #2
  This script powers the self-assessment quiz page.
  It validates answers, calculates a score, shows detailed results,
  and resets both the form and the result panel.
*/

document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("server-quiz");
  const resultsPanel = document.getElementById("quiz-results");
  const resultsBanner = document.getElementById("result-banner");
  const scoreOutput = document.getElementById("score-output");
  const resultList = document.getElementById("result-list");
  const resetButton = document.getElementById("reset-button");

  const answerKey = {
    q1: "cloud computing",
    q2: "limited accessibility",
    q3: "virtualization",
    q4: "scalability",
    q5: ["Scalability", "Remote access", "On-demand resources"]
  };

  const questionData = [
    {
      id: "q1",
      prompt: "What type of infrastructure allows servers to scale dynamically over the internet?",
      getUserAnswer: () => document.getElementById("q1").value.trim(),
      checkAnswer: (value) => normalize(value) === answerKey.q1,
      answerText: "cloud computing"
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

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let correctCount = 0;
    const resultHtml = [];

    questionData.forEach((question, index) => {
      const userAnswer = question.getUserAnswer();
      const isCorrect = question.checkAnswer(userAnswer);

      if (isCorrect) {
        correctCount += 1;
      }

      const userText = Array.isArray(userAnswer)
        ? (userAnswer.length ? userAnswer.join(", ") : "No selections made")
        : (userAnswer || "No answer provided");

      resultHtml.push(`
        <article class="result-item ${isCorrect ? "correct" : "incorrect"}">
          <h3>Question ${index + 1}</h3>
          <p><strong>Prompt:</strong> ${question.prompt}</p>
          <p><strong>Your answer:</strong> ${escapeHtml(userText)}</p>
          <p><strong>Correct answer:</strong> ${question.answerText}</p>
          <p class="score-text"><strong>Result:</strong> ${isCorrect ? "Correct" : "Incorrect"}</p>
          <p><strong>Score:</strong> ${isCorrect ? "1 / 1" : "0 / 1"}</p>
        </article>
      `);
    });

    const totalQuestions = questionData.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    resultsPanel.classList.add("visible");
    resultsBanner.className = `result-banner ${passed ? "status-pass" : "status-fail"}`;
    resultsBanner.innerHTML = `
      <h2>${passed ? "Pass" : "Fail"}</h2>
      <p>You scored <strong>${correctCount} out of ${totalQuestions}</strong> (${percentage}%).</p>
      <p>${passed ? "You demonstrated a solid understanding of the topic." : "Review the content pages and try the quiz again."}</p>
    `;
    scoreOutput.innerHTML = `<p class="score-text">Total Score: ${correctCount} / ${totalQuestions}</p>`;
    resultList.innerHTML = resultHtml.join("");
    resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetButton.addEventListener("click", () => {
    quizForm.reset();
    resultsPanel.classList.remove("visible");
    resultsBanner.className = "result-banner";
    resultsBanner.innerHTML = "";
    scoreOutput.innerHTML = "";
    resultList.innerHTML = "";
  });

  function getSingleChoiceValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  }

  function getMultipleChoiceValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((item) => item.value).sort();
  }

  function arraysMatch(first, second) {
    if (first.length !== second.length) {
      return false;
    }

    const sortedFirst = [...first].sort();
    const sortedSecond = [...second].sort();

    return sortedFirst.every((value, index) => value === sortedSecond[index]);
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
