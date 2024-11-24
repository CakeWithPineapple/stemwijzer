// scripts/main.js
import { initData } from "./dataLoader.js";
import { initEventHandlers } from "./eventHandlers.js";
import { loadTranslations } from "./language.js";
import { loadTerms } from "./utils.js";
import { toonVraag } from "./quiz.js";
import { initializeState } from "./state.js";
import { updateUI } from "./uiRenderer.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadTranslations();
    await loadTerms();
    await initData();
    initializeState();
    updateUI(); // Update de UI eerst
    toonVraag(); // Zorg dat de vraag wordt geladen
    initEventHandlers(); // Voeg hierna pas de event-handlers toe
  } catch (error) {
    console.error("Oeps, iets ging fout bij het laden. Probeer opnieuw of geef de schuld aan het internet! Als je technisch bent, de fout is:", error);
  }
});
