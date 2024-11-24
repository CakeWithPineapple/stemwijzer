// scripts/quiz.js
import { state } from "./state.js";
import { updateProgressBar, toonResultaat } from "./uiRenderer.js";
import { berekenScore, berekenExtraScores } from "./scoring.js";
import { markeerTermen } from "./utils.js";

export function toonVraag(introText = "") {
  const vraagText = document.getElementById("questionText");

  if (state.isExtraVragen) {
    if (
      state.extraVragen &&
      state.huidigeVraagIndex < state.extraVragen.length
    ) {
      const vraag = state.extraVragen[state.huidigeVraagIndex];
      const vraagTekst =
        state.currentLanguage === "nl" ? vraag.vraag : vraag.vraag_uk;
      vraagText.innerHTML = `${introText}<br><p>${markeerTermen(
        vraagTekst
      )}</p>`;
    } else {
      berekenExtraScores();
    }
  } else {
    if (
      state.vragen.length > 0 &&
      state.huidigeVraagIndex < state.vragen.length
    ) {
      const vraag = state.vragen[state.huidigeVraagIndex];
      vraagText.innerHTML = `<p>Stelling ${
        state.huidigeVraagIndex + 1
      }: ${markeerTermen(vraag)}</p>`;
      updateProgressBar();
      toonPartijStandpunten(state.huidigeVraagIndex);
    } else {
      berekenScore();
    }
  }

  toggleNavigationButtons();
}

export function setImportance(level) {
  state.selectedImportance = level;
  state.wegingsfactoren[state.huidigeVraagIndex] = level;
  document.querySelectorAll(".importance-button").forEach((button) => {
    button.classList.remove("active");
  });
  const activeButton = document.querySelector(
    `.importance-button[data-importance="${level}"]`
  );
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

export function selectAnswer(antwoord) {
  if (state.isExtraVragen) {
    selectExtraAnswer(antwoord);
  } else {
    state.antwoordenGebruiker[state.huidigeVraagIndex] = antwoord;
    state.wegingsfactoren[state.huidigeVraagIndex] = state.selectedImportance;

    state.huidigeVraagIndex++;
    toonVraag();

    highlightWinners();
  }
}

export function nextQuestion() {
  if (state.huidigeVraagIndex < state.vragen.length - 1) {
    state.huidigeVraagIndex++;
    toonVraag();
  }
  toggleNavigationButtons();
}

export function previousQuestion() {
  if (state.huidigeVraagIndex > 0) {
    state.huidigeVraagIndex--;
    toonVraag();
  }
  toggleNavigationButtons();
}

export function startExtraVragen(introText, winnaars) {
  state.isExtraVragen = true;
  state.huidigeVraagIndex = 0;
  state.extraAntwoorden = {};

  if (winnaars.length === 1 && winnaars[0].id === "CJ") {
    state.tiebreakerParties = ["RattenTeFiets", "Staartslagers"];
  } else {
    state.tiebreakerParties = winnaars.map((p) => p.id);
  }

  toonVraag(introText);
}

function toggleNavigationButtons() {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  if (prevButton) {
    prevButton.disabled = state.huidigeVraagIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled = state.huidigeVraagIndex === state.vragen.length - 1;
  }
}

function toonPartijStandpunten(vraagIndex) {
  const eensPartiesContainer = document.querySelector(
    "#eens-parties .party-icons"
  );
  const oneensPartiesContainer = document.querySelector(
    "#oneens-parties .party-icons"
  );

  if (eensPartiesContainer) eensPartiesContainer.innerHTML = "";
  if (oneensPartiesContainer) oneensPartiesContainer.innerHTML = "";

  state.partijen.forEach((partij) => {
    const standpunt = partij.standpunten[vraagIndex];
    if (standpunt === "eens" || standpunt === "oneens") {
      const img = document.createElement("img");
      img.src = `img/partijen/${partij.id}.png`;
      img.alt = partij.naam;

      if (standpunt === "eens") {
        if (eensPartiesContainer) eensPartiesContainer.appendChild(img);
      } else if (standpunt === "oneens") {
        if (oneensPartiesContainer) oneensPartiesContainer.appendChild(img);
      }
    }
  });
}

function highlightWinners() {
  const scores = state.partijen.map((partij) => {
    let score = 0;
    partij.standpunten.forEach((standpunt, index) => {
      if (standpunt === state.antwoordenGebruiker[index]) {
        score += state.wegingsfactoren[index];
      }
    });
    return { id: partij.id, naam: partij.naam, score: score };
  });

  scores.sort((a, b) => b.score - a.score);
  const hoogsteScore = scores[0]?.score || 0;
  const winnaars = scores.filter((partij) => partij.score === hoogsteScore);

  document.querySelectorAll(".party-icons img").forEach((img) => {
    img.classList.remove("highlight-winner");
  });

  winnaars.forEach((winnaar) => {
    const winnerIcon = document.querySelector(
      `.party-icons img[alt="${winnaar.naam}"]`
    );
    if (winnerIcon) {
      winnerIcon.classList.add("highlight-winner");
    }
  });
}

function selectExtraAnswer(antwoord) {
  state.extraAntwoorden[state.huidigeVraagIndex] = antwoord;

  if (state.huidigeVraagIndex < state.extraVragen.length - 1) {
    state.huidigeVraagIndex++;
    toonVraag();
  } else {
    berekenExtraScores();
  }
}
