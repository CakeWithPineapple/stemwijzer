// scripts/scoring.js
import { state } from "./state.js";
import { startExtraVragen } from "./quiz.js";
import { toonResultaat } from "./uiRenderer.js";

export function berekenScore() {
  const scores = state.partijen.map((partij) => {
    let score = 0;
    partij.standpunten.forEach((standpunt, index) => {
      if (standpunt === state.antwoordenGebruiker[index]) {
        score += state.wegingsfactoren[index];
      }
    });
    return { id: partij.id, naam: partij.naam, score: score, partij };
  });

  scores.sort((a, b) => b.score - a.score);

  if (scores.length === 0) {
    console.error("Scores array is empty. Cannot determine the highest score.");
    return;
  }

  const hoogsteScore = scores[0].score;
  const winnaars = scores.filter((partij) => partij.score === hoogsteScore);

  console.log("Winnaars:", winnaars);

  winnaars.forEach((winnaar) => {
    const winnerIcon = document.querySelector(
      `.party-icons img[alt="${winnaar.naam}"]`
    );
    if (winnerIcon) {
      winnerIcon.classList.add("highlight-winner");
    }
  });

  if (winnaars.some((partij) => partij.id === "CJ")) {
    state.extraVragen = state.data.extra_vragen.coalitie_vragen;
    startExtraVragen(
      "Extra vragen om een keuze te maken binnen de CoalitieJustitie",
      winnaars
    );
  } else if (winnaars.length > 1) {
    const comboKey1 = winnaars.map((p) => p.id).join("_");
    const comboKey2 = winnaars
      .map((p) => p.id)
      .reverse()
      .join("_");

    state.extraVragen =
      state.data.extra_vragen.gelijkspel_vragen[comboKey1] ||
      state.data.extra_vragen.gelijkspel_vragen[comboKey2];

    if (state.extraVragen) {
      startExtraVragen(
        `Extra vragen om het gelijkspel te breken tussen ${winnaars
          .map((p) => p.naam)
          .join(" en ")}`,
        winnaars
      );
    } else {
      toonResultaat(
        "Geen extra vragen beschikbaar om het gelijkspel te breken."
      );
    }
  } else {
    toonResultaat(
      `De partij die het beste bij jou past is: ${winnaars[0].naam}`
    );
  }
}

export function berekenExtraScores() {
  const resultaten = {};
  state.tiebreakerParties.forEach((partijId) => {
    resultaten[partijId] = 0;
  });

  state.extraVragen.forEach((vraag, index) => {
    state.tiebreakerParties.forEach((partijId) => {
      const partijStandpunt = vraag.standpunten[partijId];
      if (partijStandpunt === undefined) {
        console.warn(
          `Standpunt undefined for partijId: "${partijId}" at question index: ${index}`
        );
        return;
      }

      if (state.extraAntwoorden[index] === partijStandpunt) {
        resultaten[partijId]++;
      }
    });
  });

  console.log("Resultaten:", resultaten);

  const sortedResults = state.tiebreakerParties
    .map((partijId) => [partijId, resultaten[partijId]])
    .sort((a, b) => b[1] - a[1]);

  if (sortedResults.length === 0) {
    console.error("No results to calculate extra scores.");
    toonResultaat("Geen resultaten beschikbaar om scores te berekenen.");
    return;
  }

  const highestScore = sortedResults[0][1];
  const topParties = sortedResults.filter(
    ([_, score]) => score === highestScore
  );

  if (topParties.length > 1) {
    toonResultaat(
      `Er is opnieuw een gelijkspel tussen ${topParties
        .map(([partijId]) => state.partijById[partijId].naam)
        .join(" en ")}.`
    );
  } else {
    const [bestePartijId] = sortedResults[0];
    const bestePartij = state.partijById[bestePartijId];
    toonResultaat(`De beste partij voor jou is: ${bestePartij.naam}`);
  }
}
