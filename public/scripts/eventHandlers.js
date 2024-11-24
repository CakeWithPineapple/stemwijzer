// scripts/eventHandlers.js
import { changeLanguage } from "./language.js";
import {
  setImportance,
  selectAnswer,
  nextQuestion,
  previousQuestion,
} from "./quiz.js";

function handleLanguageChange(e) {
  changeLanguage(e.target.value);
}

function handleImportanceClick(event) {
  const button = event.target.closest(".importance-button");
  if (button) {
    console.log("Knop geklikt:", button);
    
    const importancePromptElement = document.getElementById("importancePrompt");
    if (importancePromptElement) {
      // Verwijder de 'active' klasse van alle buttons binnen de container
      importancePromptElement.querySelectorAll(".importance-button").forEach((btn) =>
        btn.classList.remove("active")
      );
    }
    
    // Voeg de 'active' klasse toe aan de geklikte knop
    button.classList.add("active");

    // Stel de importance in
    const importance = parseInt(button.dataset.importance, 10);
    setImportance(importance);
  }
}

function handleOptionClick(event) {
  const button = event.target.closest(".option");
  if (button) {
    const answer = button.dataset.answer;
    console.log("Antwoord geselecteerd:", answer);
    selectAnswer(answer);
  }
}

function handlePrevClick() {
  previousQuestion();
}

function handleNextClick() {
  nextQuestion();
}

export function initEventHandlers() {
  // 1. Taal wijzigen met direct event listener
  const languageSelector = document.getElementById("languageSelector");
  if (languageSelector) {
    languageSelector.addEventListener("change", handleLanguageChange);
  } else {
    console.error("Element with id 'languageSelector' not found");
  }

  // 2. Event delegation voor importance-buttons, nu op het ouder-element
  const importancePromptElement = document.getElementById("importancePrompt");
  if (importancePromptElement) {
    importancePromptElement.addEventListener("click", handleImportanceClick);
  } else {
    console.error("Element with id 'importancePrompt' not gevonden");
  }

  // 3. Event delegation voor answer options
  const optionsContainer = document.querySelector(".options");
  if (optionsContainer) {
    optionsContainer.addEventListener("click", handleOptionClick);
  } else {
    console.error("Container met klasse 'options' niet gevonden");
  }

  // 4. Previous button click event
  const prevButton = document.getElementById("prevButton");
  if (prevButton) {
    prevButton.addEventListener("click", handlePrevClick);
  } else {
    console.error("Element with id 'prevButton' not found");
  }

  // 5. Next button click event
  const nextButton = document.getElementById("nextButton");
  if (nextButton) {
    nextButton.addEventListener("click", handleNextClick);
  } else {
    console.error("Element with id 'nextButton' not found");
  }
}
