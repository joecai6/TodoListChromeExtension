var taskList = [];
var inputList = [];

document.addEventListener('DOMContentLoaded', function init(){
	
	getInputList();
	var list = document.querySelector('#list');
	list.addEventListener('click', checked);
	
	var add = document.querySelector('#add');
	add.addEventListener('click', addItem);
	
	var clear = document.querySelector('#clear');
	clear.addEventListener('click', clearList);
	
	var input = document.querySelector('#inputs');
	input.addEventListener('keypress', enter);
});

function enter(evt){
	if(evt.keyCode == "13"){
		addItem();
	}
}

function addSavedItems(item){
	if (item.label !== undefined && item.label !== ""){
		var ul = document.querySelector('#list');
		var newItem = document.createElement("LI");
		
		var txt = document.createElement("DIV");
		txt.innerHTML = item.label;
		txt.classList.toggle("txt");
		
		if(item.check){
			newItem.classList.add("checked");
			txt.classList.add("crossout");
		}
		
		var buttons = document.createElement("DIV");
		buttons.classList.toggle("list-buttons");
		
		var delButton = document.createElement("SPAN");
		delButton.innerHTML = "Delete";
		delButton.classList.toggle("delButton");
		
		var editButton = document.createElement("SPAN");
		editButton.innerHTML = "Edit";
		editButton.classList.toggle("editButton");	
		
		var posLabel = document.createElement("LABEL");
		posLabel.innerHTML = "" + item.index;
		posLabel.classList.toggle("hidden");
		
		buttons.appendChild(editButton);
		buttons.appendChild(delButton);
		
		newItem.append(txt);
		newItem.append(posLabel);
		newItem.append(buttons);
		
		ul.appendChild(newItem);
	}
}

function refresh() {
	var count = 0;
	var ul = document.querySelector('#list');
	inputList.forEach(function(item){
		item.index = count;
		ul.children[count].children[1].innerHTML = "" + count;
		count++;
	});
}

function checked(evt) {
	if (evt.target){
		if(evt.target.tagName === 'LI'){
			evt.target.classList.toggle("checked");
			
			var txt = evt.target.firstElementChild;
			txt.classList.toggle("crossout");
			
			var index = parseInt(evt.target.children[1].innerHTML);
			console.log(index);
			inputList[index].check = inputList[index].check ? false : true;
			saveInput();
		}
		if(evt.target.nodeName != 'INPUT' &&
			evt.target.classList.contains("txt")){
			evt.target.parentElement.classList.toggle("checked");
			
			var txt = evt.target;
			txt.classList.toggle("crossout");
			var index = parseInt(evt.target.parentElement.children[1].innerHTML);
			console.log(index);
			if(inputList[index].check){
				inputList[index].check = false;
			} 
			else {
				inputList[index].check = true;
			}
			saveInput();
		}
		if(evt.target.classList == "delButton"){
			var li = evt.target.parentElement.parentElement;
			list.removeChild(li);
			var index = li.children[1].innerHTML;
			inputList.splice(index, 1);
			refresh();
			saveInput();
		}
		if(evt.target.classList == "editButton"){
			var item = evt.target.closest('LI');
			var child = item.firstElementChild;
			if(child.nodeName == 'DIV'){
				var newInput = document.createElement('INPUT');
				newInput.value = child.innerHTML;
				newInput.classList = child.classList;
				inputList[item.children[1].innerHTML].label = newInput.value;
				item.replaceChild(newInput, child);
				newInput.addEventListener('keypress', function(evt) {
					if(evt.keyCode == "13"){
						var newEle = document.createElement('DIV');
						newEle.innerHTML = newInput.value;
						newEle.classList = newInput.classList;
						inputList[item.children[1].innerHTML].label = newEle.innerHTML;
						item.replaceChild(newEle, newInput);
						saveInput();
					}
				});
			}
			else {
				var newEle = document.createElement('DIV');
				newEle.innerHTML = child.value;
				newEle.classList = child.classList;
				inputList[item.children[1].innerHTML].label = newEle.innerHTML;
				item.replaceChild(newEle, child);
				saveInput();
			}
		}
	}
}

function addItem(){
	refresh();
	var task = document.querySelector('#inputs');
	if (task.value !== undefined && task.value !== ""){
		var ul = document.querySelector('#list');
		var newItem = document.createElement("LI");
		
		var txt = document.createElement("DIV");
		txt.innerHTML = task.value;
		txt.classList.toggle("txt");
		
		var buttons = document.createElement("DIV");
		buttons.classList.toggle("list-buttons");
		
		var delButton = document.createElement("SPAN");
		delButton.innerHTML = "Delete";
		delButton.classList.toggle("delButton");
		
		var editButton = document.createElement("SPAN");
		editButton.innerHTML = "Edit";
		editButton.classList.toggle("editButton");	
		
		var posLabel = document.createElement("LABEL");
		posLabel.innerHTML = inputList.length;
		posLabel.classList.toggle("hidden");
		
		buttons.appendChild(editButton);
		buttons.appendChild(delButton);
		
		newItem.append(txt);
		newItem.append(posLabel);
		newItem.append(buttons);
		
		ul.appendChild(newItem);
		
		taskList.push(newItem);
		//saveList();
		inputList.push({label: task.value, check: false, index: inputList.length});
		task.value = "";
		saveInput();
	}
}

function clearList(){
	chrome.storage.local.clear(function(){
		console.log("cleared");
	});
	inputList = [];
	var itemList = document.getElementsByTagName("LI");
	for(var i = itemList.length-1; i >= 0; i--){
		document.querySelector('#list').removeChild(itemList[i]);
	}
}

function saveInput(){
	chrome.storage.local.set({list: inputList}, function() {
		//console.log(inputList);
	});
}

function getInputList(){
	chrome.storage.local.get({list:[]}, function(result){
		console.log(result.list);
		updateList(result.list);
	});
}

function updateList(array) {
	inputList = array;
	inputList.forEach(addSavedItems);
	chrome.storage.local.set({list:array}, function(){
		console.log("added list");
	});
}
