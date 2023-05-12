import {
    loadCards,
    loadCard,
} from "./card.js";
import { setupButtons } from "./navigation.js";
import cardData from "../data/cards.js"

document.addEventListener("DOMContentLoaded", () => {
    // Start with overlay
    triggerInitialOverlay();
    // log current url
    const urlParams = new URLSearchParams(window.location.search);
    const lastPath = urlParams.get("card");

    let cardIndex = 0;
    const cards = loadCards();
    let card = cards[cardIndex];

    // Account for refresh
    if (lastPath) {
        cardIndex = cardData.findIndex((card) => card.class === lastPath);
        card = loadCard(cardData[cardIndex]);
    }

    const container = document.querySelector("#card-container");

    // add fade-in animation
    container.classList.add("fade-in");
    container.appendChild(cards[cardIndex]);

    // Setup prev and next buttons
    setupButtons(cardIndex, container, cards);
});

const triggerInitialOverlay = () => {
    const overlay = document.querySelector("#overlay");
    const container = document.querySelector("#container");
    overlay.classList.add("fade-out-slow");
    setTimeout(() => {
        overlay.style.display = "none";
        container.style.display = "flex";
    }, 2000);
}
