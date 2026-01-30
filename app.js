/***********************
 * JSONBIN KONFIG
 ***********************/
const API_KEY = "$2a$10$1S9SW3C0UmyWfdnW.6CBBeIz07S5eWVlpTn9CKFLjInc5/ufxrPoC";
const BIN_ID  = "697c9e2fd0ea881f4092ddd3";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

/***********************
 * APP STATE
 ***********************/
let nickname = "";
let kassenId = "";
let localCache = null;

/***********************
 * DB FUNKTIONEN
 ***********************/
async function load() {
  if (localCache) return localCache;

  const res = await fetch(URL + "/latest", {
    headers: { "X-Master-Key": API_KEY }
  });

  const data = await res.json();
  localCache = data.record.kassen;
  return localCache;
}

function save(kassen) {
  localCache = kassen;

  fetch(URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ kassen })
  });
}

/***********************
 * HILFSFUNKTIONEN
 ***********************/
function getNickname() {
  const n = document.getElementById("nickname").value.trim();
  if (!n) throw alert("Nickname fehlt");
  return n;
}

function getKassenId() {
  const id = document.getElementById("kassenId").value.trim();
  if (!/^\d{4,8}$/.test(id)) throw alert("ID muss 4–8 Zahlen haben");
  return id;
}

/***********************
 * KASSE ERSTELLEN
 ***********************/
async function createKasse() {
  nickname = getNickname();
  kassenId = getKassenId();

  const kassen = await load();

  if (kassen[kassenId]) {
    alert("Kasse existiert bereits");
    return;
  }

  kassen[kassenId] = {
    saldo: 0,
    verlauf: []
  };

  save(kassen);
  enterKasse();
}

/***********************
 * KASSE BEITRETEN
 ***********************/
async function joinKasse() {
  nickname = getNickname();
  kassenId = getKassenId();

  const kassen = await load();

  if (!kassen[kassenId]) {
    alert("Kasse existiert nicht");
    return;
  }

  enterKasse();
}

/***********************
 * IN KASSE
 ***********************/
function enterKasse() {
  document.getElementById("login").style.display = "none";
  document.getElementById("kasse").style.display = "block";
  updateUI();
}

/***********************
 * UI AKTUALISIEREN
 ***********************/
async function updateUI() {
  const kassen = await load();
  const kasse = kassen[kassenId];

  document.getElementById("saldo").innerText = kasse.saldo;

  const ul = document.getElementById("verlauf");
  ul.innerHTML = "";

  kasse.verlauf.slice().reverse().forEach(e => {
    const li = document.createElement("li");
    li.textContent = e;
    ul.appendChild(li);
  });
}

/***********************
 * GELD ÄNDERN
 ***********************/
function changeMoney(add) {
  const betrag = Number(document.getElementById("betrag").value);
  if (betrag <= 0) return;

  const kasse = localCache[kassenId];

  if (!add && kasse.saldo < betrag) {
    alert("Nicht genug Geld");
    return;
  }

  kasse.saldo += add ? betrag : -betrag;

  const zeit = new Date().toLocaleString("de-DE");
  kasse.verlauf.push(
    `${zeit} – ${nickname} ${add ? "zahlte" : "nahm"} ${betrag} €`
  );

  updateUI();
  save(localCache);
}

function addMoney() {
  changeMoney(true);
}

function removeMoney() {
  changeMoney(false);
}
