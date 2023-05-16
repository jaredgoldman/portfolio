import {
    loadCards,
    loadCard,
} from "./card.js";
import { setupButtons } from "./navigation.js";
import cardData from "../data/cards.js"

export let cardIndex = 0

document.addEventListener("DOMContentLoaded", () => {
    // Start with overlay
    triggerInitialOverlay();
    // log current url
    const urlParams = new URLSearchParams(window.location.search);
    const lastPath = urlParams.get("card");

    const cards = loadCards();

    // Account for refresh
    if (lastPath) cardIndex = cardData.findIndex((card) => card.id === lastPath);

    const card = cards[cardIndex];
    const container = document.querySelector("#card-container");

    // add fade-in animation
    container.classList.add("fade-in");
    container.appendChild(card);

    // setup buttons
    setupButtons(container, cards, cardIndex);
    setupScrollListener();
});

const triggerInitialOverlay = () => {
    const container = document.querySelector("#container");
    const nav = document.querySelector("#nav");
    container.style.display = "none";
    nav.style.display = "none";
    // hide container
    const overlay = document.querySelector("#overlay");
    overlay.classList.add("fade-out-slow");
    setTimeout(() => {
        overlay.style.display = "none";
        container.style.display = "flex";
        nav.style.display = "flex";
    }, 2000);
}

const setupScrollListener = () => {
    const container = document.querySelector("#container");
    container.addEventListener("wheel", (event) => {
        const scrollDir = event.deltaY > 0 ? "down" : "up";
    });
}
