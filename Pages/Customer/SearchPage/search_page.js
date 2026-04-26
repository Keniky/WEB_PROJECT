const sortType = document.getElementById("sort-select");

const Items = document.getElementsByClassName("product_card_item");
const itemsArray = Array.from(Items);

const selectCategory = document.getElementById("select-category");

selectCategory.addEventListener("change" , (ev) => {
    //https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript

    let valueOfSelectCategory = selectCategory.options[selectCategory.selectedIndex].text;

    const queredItems = document.querySelector(".products");

    let filter = valueOfSelectCategory;


    itemsArray.forEach(item => {
        console.log(item.hidden);
        if((item.querySelector(".category").textContent) != filter && filter != "All Tech"){
            item.style.display = 'none';
        }else{
            item.style.display = "grid";
        }
    });

});

sortType.addEventListener("change" ,(ev) =>{
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
    //if item exists in document it removes it and then inserts it 
    itemsArray.forEach(item => queredItems.appendChild(item));
    //instead of foreach(item){queredItem.appendChild()};
});
