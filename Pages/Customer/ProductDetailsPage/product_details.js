let numberOfProducts = document.getElementById("numberOfProducts");
const remove = document.getElementById("remove");
const add = document.getElementById("add");
const maxNumberOfProducts = 20;
remove.addEventListener("click" , (ev)=>{
    if(numberOfProducts.innerText >= 1){
        numberOfProducts.innerText --;
    }
});
add.addEventListener("click" , (ev)=>{
    if(numberOfProducts.innerText < maxNumberOfProducts){
        numberOfProducts.innerText ++;
    }
});


let mainImage = document.getElementById("image");


const image1 = document.getElementById("image1");
mainImage.src = image1.src;
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");

image1.addEventListener("click",(ev) =>{
    mainImage.src = image1.src;
    console.log(mainImage.attributes.src);
});
image2.addEventListener("click",(ev) =>{
    mainImage.src = image2.src;
    console.log(mainImage.attributes.src);
});
image3.addEventListener("click",(ev) =>{
    mainImage.src = image3.src;
    console.log(mainImage.attributes.src);
});