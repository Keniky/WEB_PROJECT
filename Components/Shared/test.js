let pageNumber = document.getElementById("pageNumber");

let removeButton = document.getElementById("remove");
let addButton = document.getElementById("add");

removeButton.addEventListener("click" , (ev) => {
    pageNumber.innerHTML --;
});

addButton.addEventListener("click" , (ev) => {
    pageNumber.innerHTML ++;
});



let listOfScrollPage = document.getElementsByName("page-index");
let scrollIndex = 0;
let numberOfScrollIndexes = 6;

let left = document.getElementById("left");

let right = document.getElementById("right");

left.addEventListener("click" , (ev) => {
    console.log("it is working" + "here is list of items" , listOfPages);
    listOfScrollPage[scrollIndex].removeAttribute("checked");
    scrollIndex = (scrollIndex + (numberOfScrollIndexes - 1)) % numberOfScrollIndexes;
    listOfScrollPage[scrollIndex].setAttribute("checked" , ""); 
});

right.addEventListener("click" , (ev) => {
    
    listOfScrollPage[scrollIndex].removeAttribute("checked");
    scrollIndex = (scrollIndex + 1) % numberOfScrollIndexes;
    listOfScrollPage[scrollIndex].setAttribute("checked" , ""); 

});

// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

let listOfPages = document.getElementsByName("pageindex");
let index = 0;
let numberOfIndexes = 6;

let arrowForward = document.getElementById("arrow-forward");
let arrowBackward = document.getElementById("arrow-backward");

arrowForward.addEventListener("click" , (ev) =>{
    console.log(index);
    listOfPages[index].removeAttribute("checked");
    index  = (index + 1)% numberOfIndexes;
    listOfPages[index].setAttribute("checked" ,"");
});

arrowBackward.addEventListener("click" , (ev) =>{
    console.log(index);
    listOfPages[index].removeAttribute("checked");
    index  = (index + 5)% numberOfIndexes;
    listOfPages[index].setAttribute("checked" ,"");
});

// aaaaaaaaaaaaaaaaaaaaaaaaaaaa

let addImage = document.getElementById("add-image");

let img = document.querySelector("#add-image img");
let file = document.querySelector("#add-image input");    

addImage.addEventListener("click",(ev) => {

   //add image by click lol 
   img.src = "../images/ShopPal-Logo.png";
   console.log(img.attributes);

});
https://stackoverflow.com/questions/5802580/html-input-type-file-get-the-image-before-submitting-the-form
function changePic(ev){
    let myFile = file.files[0];

    let reader = new FileReader();
    
    reader.onloadend = function(){
        img.src = reader.result;
    }

    if(myFile){
        reader.readAsDataURL(myFile);
    }else{
        img.src = "";
    }

}