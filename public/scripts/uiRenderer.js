// scripts/uiRenderer.js
import { initEventHandlers } from "./eventHandlers.js";
import { state } from "./state.js";
import { markeerTermen } from "./utils.js";

export function updateUI() {
  if (!state.translations) {
    console.error("Translations not loaded");
    return;
  }

  const titleElement = document.getElementById("title");
  if (titleElement) {
    titleElement.textContent = state.translations.title;
  } else {
    console.error("Element with id 'title' not found");
  }

  const progressTextElement = document.getElementById("progressText");
  if (progressTextElement) {
    progressTextElement.textContent = state.translations.progress_text
      .replace("{current}", state.huidigeVraagIndex + 1)
      .replace("{total}", state.vragen.length);
  } else {
    console.error("Element with id 'progressText' not found");
  }

  const importancePromptElement = document.getElementById("importancePrompt");
  if (importancePromptElement) {
    importancePromptElement.innerHTML = "";

    const promptText = document.createElement("div");
    promptText.textContent = state.translations.importance_prompt;
    importancePromptElement.appendChild(promptText);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("importance-buttons");

    state.translations.importance_levels.forEach((level, index) => {
      const button = document.createElement("button");
      button.classList.add("importance-button");
      button.textContent = level;
      button.dataset.importance = index + 1;
      buttonsContainer.appendChild(button);
    });

    importancePromptElement.appendChild(buttonsContainer);
  } else {
    console.error("Element with id 'importancePrompt' not found");
  }

  const optionButtons = document.querySelectorAll(".options .option");
  optionButtons.forEach((button, index) => {
    button.textContent = state.translations.options[index];
  });

  const navButtons = document.querySelectorAll(".navigation .nav-button");
  navButtons.forEach((button, index) => {
    button.textContent = state.translations.navigation[index];
  });

  const partyPositionsHeading = document.querySelector(".party-positions h2");
  if (partyPositionsHeading) {
    partyPositionsHeading.textContent =
      state.translations.party_positions_heading;
  }

  const agreeLabel = document.querySelector("#eens-parties strong");
  if (agreeLabel) {
    agreeLabel.textContent = state.translations.agree_label;
  }

  const disagreeLabel = document.querySelector("#oneens-parties strong");
  if (disagreeLabel) {
    disagreeLabel.textContent = state.translations.disagree_label;
  }

  const languageSelectorLabel = document.querySelector(
    'label[for="languageSelector"]'
  );
  if (languageSelectorLabel) {
    languageSelectorLabel.textContent =
      state.translations.language_selector_label;
  }

  const languageOptions = document.querySelectorAll("#languageSelector option");
  languageOptions.forEach((option) => {
    const languageCode = option.value;
    if (
      state.translations.languages &&
      state.translations.languages[languageCode]
    ) {
      option.textContent = state.translations.languages[languageCode];
    } else {
      console.warn(`No translation found for language code: ${languageCode}`);
    }
  });
}

export function updateProgressBar() {
  const progress = ((state.huidigeVraagIndex + 1) / state.vragen.length) * 100;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  } else {
    console.error("Element with id 'progressBar' not found");
  }

  if (!state.translations || !state.translations.progress_text) {
    console.error("Translations not loaded or missing 'progress_text'");
    return;
  }

  const progressTextElement = document.getElementById("progressText");
  if (progressTextElement) {
    progressTextElement.textContent = state.translations.progress_text
      .replace("{current}", state.huidigeVraagIndex + 1)
      .replace("{total}", state.vragen.length);
  } else {
    console.error("Element with id 'progressText' not found");
  }
}

export function toonResultaat(bericht) {
  const vraagText = document.getElementById("questionText");
  if (vraagText) {
    vraagText.innerHTML = `<p>${bericht}</p>`;
  } else {
    console.error("Element with id 'questionText' not found");
  }

  const options = document.querySelector(".options");
  const importance = document.querySelector(".importance");
  const navigation = document.querySelector(".navigation");

  if (options) options.style.display = "none";
  if (importance) importance.style.display = "none";
  if (navigation) navigation.style.display = "none";
}
