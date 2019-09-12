window.onload = init;

function init(){
	var list = document.querySelector('#list');
	list.addEventListener('click', checked);
	
}

var itemList = document.getElementsByTagName("LI");
var objList = [];

function refresh() {
	itemList = document.getElementsByTagName("LI");
	objList = [];
	for(var i = 0; i < itemList.length; i++){
		var itemName = itemList[i].firstElementChild.innerHTML;
		var obj = {
			txt: itemName,
			pos: i
		}
		objList.push(obj);
	}
}

function message() {
	var items = [];
	for(var i = 0; i < objList.length; i++){
		items.push(objList[i].txt);
	}
	return items;
}

function checked(evt) {
	if (evt.target){
		if(evt.target.tagName === 'LI'){
			evt.target.classList.toggle("checked");
			evt.target.firstElementChild.classList.toggle("crossout");
		}
		if(evt.target.nodeName != 'INPUT' &&
			evt.target.classList.contains("txt")){
			evt.target.parentElement.classList.toggle("checked");
			evt.target.classList.toggle("crossout");
		}
		if(evt.target.classList == "delButton"){
			list.removeChild(evt.target.closest('LI'));
		}
		if(evt.target.classList == "editButton"){
			var item = evt.target.closest('LI');
			var child = item.firstElementChild;
			if(child.nodeName == 'DIV'){
				var newInput = document.createElement('INPUT');
				newInput.value = child.innerHTML;
				newInput.classList = child.classList;
				item.replaceChild(newInput, child);
			}
			else {
				var newEle = document.createElement('DIV');
				newEle.innerHTML = child.value;
				newEle.classList = child.classList;
				item.replaceChild(newEle, child);
			}
			refresh();
		}
	}
}

function add(){

	var task = document.querySelector('#inputs');
	if (task.value !== undefined && task.value !== ""){
		var ul = document.querySelector('#list');
		var newItem = document.createElement("LI");
		
		var txt = document.createElement("DIV");
		txt.innerHTML = task.value;
		txt.classList.toggle("txt");
		task.value = "";
		
		var buttons = document.createElement("DIV");
		buttons.classList.toggle("list-buttons");
		
		var delButton = document.createElement("SPAN");
		delButton.innerHTML = "Delete";
		delButton.classList.toggle("delButton");
		
		var editButton = document.createElement("SPAN");
		editButton.innerHTML = "Edit";
		editButton.classList.toggle("editButton");	
		
		buttons.appendChild(editButton);
		buttons.appendChild(delButton);
		
		newItem.append(txt);
		newItem.append(buttons);
		
		ul.appendChild(newItem);
		itemList.append(newItem);
	}
}

function clearList(){
	for(var i = itemList.length-1; i >= 0; i--){
		document.querySelector('#list').removeChild(itemList[i]);
	}
}

function getEditStatus(item) {
	
}

