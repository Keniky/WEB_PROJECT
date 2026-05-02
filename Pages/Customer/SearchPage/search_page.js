const sortType = document.getElementById("sort-select");
const selectCategory = document.getElementById("select-category");
const productsContainer = document.querySelector(".products");
const resultCountElement = document.querySelector(".active-filters > div");

const itemsArray = Array.from(document.getElementsByClassName("product_card_item"));
const filterBoxes = Array.from(document.querySelectorAll(".filter-box"));
const priceInputs = document.querySelectorAll(".price-inputs input");
const minPriceInput = priceInputs[0];
const maxPriceInput = priceInputs[1];

function normalizeText(text) {
    return (text || "").trim().toLowerCase();
}

function parsePrice(value) {
    return parseFloat((value || "").replace("$", "").trim()) || 0;
}

function inferBrandFromTitle(title) {
    const normalizedTitle = normalizeText(title);

    if (normalizedTitle.includes("iphone")) return "Apple";
    if (normalizedTitle.includes("galaxy")) return "Samsung";
    if (normalizedTitle.includes("nokia")) return "Nokia";
    if (normalizedTitle.includes("asus")) return "ASUS";
    if (normalizedTitle.includes("msi")) return "MSI";
    if (normalizedTitle.includes("logitech")) return "Logitech";
    if (normalizedTitle.includes("aorus")) return "Gigabyte";

    return "";
}

function inferSpecs(category, title) {
    const specs = [];
    const normalizedCategory = normalizeText(category);
    const normalizedTitle = normalizeText(title);

    if (["laptops", "tablets", "pc components", "smartphones"].includes(normalizedCategory)) {
        specs.push("8GB RAM+");
    }

    if (["laptops", "tablets", "smartphones"].includes(normalizedCategory)) {
        specs.push("256GB Storage+");
        specs.push("Wi-Fi 6");
    }

    if (["laptops", "tablets", "monitors"].includes(normalizedCategory)) {
        specs.push("13-inch+");
    }

    if (["laptops", "monitors"].includes(normalizedCategory)) {
        specs.push("15-inch+");
    }

    if (normalizedTitle.includes("240 hz") || normalizedTitle.includes("144hz") || normalizedTitle.includes("75hz")) {
        specs.push("15-inch+");
    }

    return specs;
}

function getSelectedBySection(title) {
    const matchedBox = filterBoxes.find((box) => {
        const heading = box.querySelector("h3");
        return heading && normalizeText(heading.textContent) === normalizeText(title);
    });

    if (!matchedBox) return [];

    return Array.from(matchedBox.querySelectorAll('input[type="checkbox"]:checked')).map((input) => {
        const labelText = input.parentElement ? input.parentElement.textContent : "";
        return labelText.trim();
    });
}

function getItemMeta(item) {
    const title = item.querySelector(".card-title")?.textContent?.trim() || "";
    const category = item.querySelector(".category")?.textContent?.trim() || "";
    const brand = item.querySelector(".brand")?.textContent?.trim() || inferBrandFromTitle(title);
    const condition = item.querySelector(".condition")?.textContent?.trim() || "New";
    const specs = inferSpecs(category, title);
    const price = parsePrice(item.querySelector(".price-new")?.textContent || "");

    return { title, category, brand, condition, specs, price };
}

function applyFilters() {
    const selectedTopCategory = selectCategory?.value || "All Tech";
    const selectedCategories = getSelectedBySection("Categories:");
    const selectedBrands = getSelectedBySection("Brands:");
    const selectedConditions = getSelectedBySection("Condition:");
    const selectedSpecs = getSelectedBySection("Specs:");

    const minValue = parseFloat(minPriceInput?.value || "");
    const maxValue = parseFloat(maxPriceInput?.value || "");

    const hasMin = !Number.isNaN(minValue);
    const hasMax = !Number.isNaN(maxValue);

    let finalMin = hasMin ? minValue : null;
    let finalMax = hasMax ? maxValue : null;

    if (finalMin !== null && finalMax !== null && finalMin > finalMax) {
        const temp = finalMin;
        finalMin = finalMax;
        finalMax = temp;
    }

    let visibleCount = 0;

    itemsArray.forEach((item) => {
        const meta = getItemMeta(item);

        const categoryMatchesTop = selectedTopCategory === "All Tech" || meta.category === selectedTopCategory;
        const categoryMatchesCheckbox = selectedCategories.length === 0 || selectedCategories.includes(meta.category);
        const brandMatches = selectedBrands.length === 0 || selectedBrands.includes(meta.brand);
        const conditionMatches = selectedConditions.length === 0 || selectedConditions.includes(meta.condition);
        const specsMatch = selectedSpecs.length === 0 || selectedSpecs.every((spec) => meta.specs.includes(spec));
        const minMatches = finalMin === null || meta.price >= finalMin;
        const maxMatches = finalMax === null || meta.price <= finalMax;

        const shouldShow =
            categoryMatchesTop &&
            categoryMatchesCheckbox &&
            brandMatches &&
            conditionMatches &&
            specsMatch &&
            minMatches &&
            maxMatches;

        item.style.display = shouldShow ? "" : "none";
        if (shouldShow) {
            visibleCount += 1;
        }
    });

    if (resultCountElement) {
        resultCountElement.textContent = `${visibleCount} Results found.`;
    }
}

function sortItems() {
    if (!productsContainer) return;

    if (sortType?.value === "Name") {
        itemsArray.sort((a, b) => {
            const valA = a.querySelector(".card-title")?.textContent?.trim() || "";
            const valB = b.querySelector(".card-title")?.textContent?.trim() || "";
            return valA.localeCompare(valB);
        });
    } else {
        const direction = sortType?.value === "Price High" ? -1 : 1;
        itemsArray.sort((a, b) => {
            const valA = parsePrice(a.querySelector(".price-new")?.textContent || "");
            const valB = parsePrice(b.querySelector(".price-new")?.textContent || "");
            return (valA - valB) * direction;
        });
    }

    itemsArray.forEach((item) => productsContainer.appendChild(item));
}

selectCategory?.addEventListener("change", applyFilters);
sortType?.addEventListener("change", () => {
    sortItems();
    applyFilters();
});

filterBoxes.forEach((box) => {
    box.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener("change", applyFilters);
    });
});

minPriceInput?.addEventListener("input", applyFilters);
maxPriceInput?.addEventListener("input", applyFilters);

sortItems();
applyFilters();

