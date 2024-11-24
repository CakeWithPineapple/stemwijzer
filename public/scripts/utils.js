// scripts/utils.js
import { state } from "./state.js";

export async function loadTerms() {
  try {
    const response = await fetch("terms.json");
    if (!response.ok) {
      throw new Error("Failed to fetch terms.json");
    }
    const json = await response.json();
    state.definities = json[state.currentLanguage] || {};
  } catch (error) {
    console.error("Error loading terms.json:", error);
  }
}

export function markeerTermen(text, processDefinitions = true) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${text}</div>`, "text/html");

  const currentDefinitions = state.definities || {};

  const walker = document.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        let insideTooltip = false;
        let parent = node.parentNode;
        while (parent) {
          if (parent.classList && parent.classList.contains("tooltip")) {
            insideTooltip = true;
            break;
          }
          parent = parent.parentNode;
        }
        return insideTooltip
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    },
    false
  );

  const nodesToProcess = [];
  let node;
  while ((node = walker.nextNode())) {
    nodesToProcess.push(node);
  }

  nodesToProcess.forEach((node) => {
    let replacedText = node.textContent;

    Object.keys(currentDefinitions).forEach((term) => {
      const definitie = currentDefinitions[term];
      const regex = new RegExp(`(^|\\s)${escapeRegExp(term)}(?=$|\\s)`, "gu");

      replacedText = replacedText.replace(regex, (match, p1) => {
        const processedDefinitie = processDefinitions
          ? definitie
          : markeerTermen(definitie, false);

        return `${p1}<span class="term">${match.trim()} <i class="tooltip-icon">ⓘ</i><span class="tooltip">${processedDefinitie}</span></span>`;
      });
    });

    if (replacedText !== node.textContent) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = replacedText;

      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      node.parentNode.replaceChild(fragment, node);
    }
  });

  return doc.body.innerHTML;
}

// Utility function to escape regex special characters in terms
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}








