document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("searchInput");
    const clearSearchButton = document.getElementById("clear-search-button");
    const randomCardButton = document.getElementById("random-scroll-button");
    const searchStatus = document.getElementById("search-status");
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const cards = Array.from(document.querySelectorAll(".tarot-card"));
    const sections = Array.from(document.querySelectorAll(".arcana-section"));

    if (
        !(searchForm instanceof HTMLFormElement) ||
        !(searchInput instanceof HTMLInputElement) ||
        !(clearSearchButton instanceof HTMLButtonElement) ||
        !(randomCardButton instanceof HTMLButtonElement) ||
        !searchStatus ||
        cards.length === 0
    ) {
        throw new Error("The Akashic Tarot directory controls or card entries are missing.");
    }

    let activeCategory = "all";

    function normalize(value) {
        return value
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase();
    }

    function updateDirectory() {
        const query = normalize(searchInput.value.trim());
        const visibleCards = [];

        cards.forEach((card) => {
            const matchesCategory =
                activeCategory === "all" || card.dataset.category === activeCategory;
            const matchesQuery = !query || normalize(card.textContent || "").includes(query);
            const isVisible = matchesCategory && matchesQuery;

            card.hidden = !isVisible;
            if (isVisible) visibleCards.push(card);
        });

        sections.forEach((section) => {
            section.hidden = !section.querySelector(".tarot-card:not([hidden])");
        });

        if (visibleCards.length === 0) {
            searchStatus.textContent = "No cards match your search. Try another name, theme, or suit.";
        } else if (query || activeCategory !== "all") {
            searchStatus.textContent = `Showing ${visibleCards.length} of ${cards.length} cards.`;
        } else {
            searchStatus.textContent = `Showing all ${cards.length} cards.`;
        }

        return visibleCards;
    }

    function clearHighlights() {
        cards.forEach((card) => card.classList.remove("selected-div"));
    }

    function focusCard(card) {
        clearHighlights();
        card.classList.add("selected-div");
        card.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "center",
            inline: "nearest"
        });
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const visibleCards = updateDirectory();
        if (visibleCards.length > 0) focusCard(visibleCards[0]);
    });

    searchInput.addEventListener("input", () => {
        clearHighlights();
        updateDirectory();
    });

    clearSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        clearHighlights();
        updateDirectory();
        searchInput.focus();
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.filter || "all";
            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });
            clearHighlights();
            updateDirectory();
        });
    });

    randomCardButton.addEventListener("click", () => {
        const visibleCards = updateDirectory();
        if (visibleCards.length === 0) return;

        const randomIndex = Math.floor(Math.random() * visibleCards.length);
        focusCard(visibleCards[randomIndex]);
    });
});
