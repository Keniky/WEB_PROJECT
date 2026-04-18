let pageNumber = document.getElementById("pageNumber");

let removeButton = document.getElementById("remove");
let addButton = document.getElementById("add");

removeButton.addEventListener("click" , (ev) => {
    pageNumber.innerHTML --;
});

addButton.addEventListener("click" , (ev) => {
    pageNumber.innerHTML ++;
});





// aaaaaaaaaaaaaaaaaaaaaaaaaaaa

let addImage = document.getElementById("add-image");
console.log("aaa");

let img = document.querySelector("#add-image img");
let file = document.querySelector("#add-image input");    

addImage.addEventListener("click",(ev) => {
    alert("aaa")
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