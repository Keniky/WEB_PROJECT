const sortType = document.getElementById("sort-select");

sortType.addEventListener("change" ,(ev) =>{
    const Items = document.getElementsByClassName("product_card_item");
    const itemsArray = Array.from(Items);
    const queredItems = document.querySelector(".products");


    if(ev.target.value === "Name"){
        itemsArray.sort((a,b) => {
            const valA = a.querySelector(".card-title").textContent;
            const valB = b.querySelector(".card-title").textContent;

            return valA.localeCompare(valB);

        });

        itemsArray.forEach(item => queredItems.appendChild(item));
        return;
    }

    let direction = 1;
    if(ev.target.value === "Price High"){
        direction = -1;
    }
    //they said it is faster cuz of static element rather than html collection
    //static is what it is , html is still connected to html page , query works like css


    itemsArray.sort((a,b) => {
        const valA = parseFloat(a.querySelector(".price-new").textContent.replace("$" ,""));
        const valB = parseFloat(b.querySelector(".price-new").textContent.replace("$",""));

        return (valA - valB) * direction;
    });

    console.log(queredItems);
    console.log(queredItems.children.length);
    itemsArray.forEach(item => queredItems.appendChild(item));
});
