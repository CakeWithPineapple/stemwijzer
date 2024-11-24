// scripts/state.js
export const state = {
  data: null,
  vragen: [],
  partijen: [],
  antwoordenGebruiker: [],
  wegingsfactoren: [],
  huidigeVraagIndex: 0,
  selectedImportance: 1,
  isExtraVragen: false,
  extraVragen: null,
  extraAntwoorden: {},
  currentLanguage: "nl",
  translations: null,
  definities: {},
  tiebreakerParties: [],
  partijById: {},
};

export function initializeState() {
  state.antwoordenGebruiker = Array(state.vragen.length).fill(null);
  state.wegingsfactoren = Array(state.vragen.length).fill(1);
}
