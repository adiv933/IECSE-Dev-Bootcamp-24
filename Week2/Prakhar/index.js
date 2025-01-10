const addButton= document.getElementById("addBut");
const newTaskinput=document.getElementById("newitem");
const list=document.getElementById("list");
const delButton=document.getElementById("delete");
const delTaskinput=document.getElementById("discard");

addButton.onclick=function(){
    let newValue=newTaskinput.value;
    const newListitem=document.createElement('li');
    newListitem.textContent=newValue;
    list.appendChild(newListitem);
    newTaskinput.value='';
}
delButton.onclick=function(){
    let delValue=delTaskinput.value;
    list.children[delValue-1].remove();
    delValue.value='';
}