// scripts/language.js
import { updateUI } from "./uiRenderer.js";
import { toonVraag } from "./quiz.js";
import { state } from "./state.js";
import { loadTerms } from "./utils.js"; // Import loadTerms

export async function loadTranslations() {
  try {
    const response = await fetch("languages.json");
    if (!response.ok) {
      throw new Error("Failed to fetch languages.json");
    }
    const json = await response.json();
    state.translations = json[state.currentLanguage];
  } catch (error) {
    console.error("Fout bij laden van vertalingen:", error);
  }
}

export async function changeLanguage(language) {
  try {
    state.currentLanguage = language;

    await loadTranslations();
    await loadTerms();

    if (
      state.data &&
      state.data.vragen &&
      state.data.vragen[state.currentLanguage]
    ) {
      state.vragen = state.data.vragen[state.currentLanguage];
      console.log(`Vragen geladen voor taal '${language}':`, state.vragen);
    } else {
      console.error(
        `Vragen voor taal '${language}' zijn niet gevonden in data.json.`
      );
      state.vragen = [];
    }

    state.antwoordenGebruiker = Array(state.vragen.length).fill(null);
    state.wegingsfactoren = Array(state.vragen.length).fill(1);

    state.huidigeVraagIndex = 0;

    updateUI();
    toonVraag();
  } catch (error) {
    console.error("Fout tijdens taalwijziging:", error);
  }
}
