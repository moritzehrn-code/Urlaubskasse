let currentId = null;


function login() {
const id = document.getElementById('kassenId').value;


if (!/^\d{4,8}$/.test(id)) {
alert('ID muss 4–8 Zahlen haben');
return;
}


currentId = id;


if (!localStorage.getItem(id)) {
localStorage.setItem(id, JSON.stringify({ saldo: 0 }));
}


document.getElementById('login').classList.add('hidden');
document.getElementById('kasse').classList.remove('hidden');


updateSaldo();
}


function updateSaldo() {
const data = JSON.parse(localStorage.getItem(currentId));
document.getElementById('betrag').innerText = data.saldo;
}


function addMoney() {
const value = Number(document.getElementById('amount').value);
if (value <= 0) return;


const data = JSON.parse(localStorage.getItem(currentId));
data.saldo += value;
localStorage.setItem(currentId, JSON.stringify(data));
updateSaldo();
}


function removeMoney() {
const value = Number(document.getElementById('amount').value);
const data = JSON.parse(localStorage.getItem(currentId));


if (value <= 0 || data.saldo - value < 0) return;


data.saldo -= value;
localStorage.setItem(currentId, JSON.stringify(data));
updateSaldo();
}


function logout() {
currentId = null;
document.getElementById('kasse').classList.add('hidden');
document.getElementById('login').classList.remove('hidden');
}


function showPrivacy() {
document.getElementById('privacy').classList.remove('hidden');
}



