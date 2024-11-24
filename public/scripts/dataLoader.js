// scripts/dataLoader.js
import { state } from "./state.js";

export async function initData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonData = await response.json();
    state.data = jsonData;
    state.partijen.push(...state.data.partijen);
    state.partijen.forEach((partij) => {
      state.partijById[partij.id] = partij;
    });
    state.vragen.push(...state.data.vragen[state.currentLanguage]);
  } catch (error) {
    console.error("Fout bij het laden van JSON:", error);
  }
}
