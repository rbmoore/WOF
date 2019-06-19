function GetById(id) {
	return document.getElementById(id);
}

function AddClass(id, className) {
	GetById(id).classList.add(className);
}

function RemoveClass(id, className) {
	GetById(id).classList.remove(className);
}

function Hide(id) {
	var el = GetById(id);
	el.classList.remove('show');
	el.classList.add('hide');
}

function Show(id) {
	var el = GetById(id);
	el.classList.add('show');
	el.classList.remove('hide');
}

function Text(id, text) {
	GetById(id).innerHTML = text;
}

function Play(id) {
	GetById(id).play();
}

function Stop(id) {
	var fx = GetById(id);
	fx.pause();
	fx.currentTime = 0;
}
