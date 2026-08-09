document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const randomScrollButton = document.getElementById("random-scroll-button");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const tarotCards = document.querySelectorAll(".tarot-card");
    const arcanaSections = document.querySelectorAll(".arcana-section");

    // Clean Input Focus Lifecycle
    const originalPlaceholder = searchInput.placeholder;
    searchInput.addEventListener("focus", () => {
        searchInput.placeholder = "";
    });
    searchInput.addEventListener("blur", () => {
        if (!searchInput.value.trim()) {
            searchInput.placeholder = originalPlaceholder;
        }
    });

    // Reset Highlighting Utility
    function removeHighlights() {
        tarotCards.forEach(card => card.classList.remove("selected-div"));
    }

    // Standard Reset Filter Behavior
    function resetToAllFilter() {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.classList.add("active");

        // Make all cards and their layout structures visible again
        tarotCards.forEach(card => card.style.display = "");
        arcanaSections.forEach(sec => sec.style.display = "");
    }

    // Smooth-Scroll Positioning Helper
    function executeVisualFocus(targetCard) {
        targetCard.classList.add("selected-div");
        targetCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
        });
    }

    // Unified Intelligent Match Search Handler
    function runDeckSearch(event) {
        if (event) event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        removeHighlights();
        let finalMatch = null;

        // Stage 1: Attempt exact / close matching directly against card titles
        for (const card of tarotCards) {
            const titleElem = card.querySelector(".card-title");
            if (titleElem && titleElem.textContent.toLowerCase().includes(query)) {
                finalMatch = card;
                break;
            }
        }

        // Stage 2: Fallback search matches through entire description text bodies
        if (!finalMatch) {
            for (const card of tarotCards) {
                if (card.textContent.toLowerCase().includes(query)) {
                    finalMatch = card;
                    break;
                }
            }
        }

        // Execution of Match Scroll & Visibility
        if (finalMatch) {
            const activeFilterButton = document.querySelector(".filter-btn.active");
            const currentFilter = activeFilterButton ? activeFilterButton.dataset.filter : "all";
            const targetCategory = finalMatch.dataset.category;

            // If the matched card is currently hidden, reset visual filter limits to display it
            if (currentFilter !== "all" && currentFilter !== targetCategory) {
                resetToAllFilter();
            }

            executeVisualFocus(finalMatch);
        }
    }

    // Expose search globally to fulfill legacy HTML element inline click attributes safely
    window.search = runDeckSearch;

    // Direct Event Listeners for Search
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            runDeckSearch(e);
        }
    });

    if (searchButton) {
        searchButton.addEventListener("click", runDeckSearch);
    }

    // Context-Aware Random Selector
    if (randomScrollButton) {
        randomScrollButton.addEventListener("click", () => {
            // Pick only from cards currently visible on screen to preserve filter context
            const activePool = Array.from(tarotCards).filter(card => {
                return window.getComputedStyle(card).display !== "none";
            });

            if (activePool.length === 0) return;

            const rollIndex = Math.floor(Math.random() * activePool.length);
            const rolledCard = activePool[rollIndex];

            removeHighlights();
            executeVisualFocus(rolledCard);
        });
    }

    // Category / Suit Actionable Filter Routing
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                const requestedFilter = button.dataset.filter;

                // Adjust Navigation UI Active Classes
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                removeHighlights();

                tarotCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    if (requestedFilter === "all" || cardCategory === requestedFilter) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });

                // Dynamically hide empty arcana sections if they have no visible child elements
                arcanaSections.forEach(section => {
                    const sectionType = section.dataset.section;
                    if (requestedFilter === "all" || sectionType === requestedFilter) {
                        section.style.display = "";
                    } else {
                        section.style.display = "none";
                    }
                });
            });
        });
    }
});