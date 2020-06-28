import { Magazzino, Ordine, Tappa, Spedizione, StatoSpedizione, StatoOrdine, GestoreSpedizioni, Camionista, Posizione } from "./domain";
import * as faker from "faker/locale/it";

export const Spedizioni : Spedizione[] = []
export const Ordini : Ordine[] = []
export const Magazzini : Magazzino[] = []
export const Tappe : Tappa[] = []
export const Camionisti : Camionista[] = [
	{nome: "Giovanni", cognome: "Bianchi", userName: "bianchi.giovanni.1"},
	{nome: "Matteo", cognome: "Verdi", userName: "verdi.matteo.1"},
	{nome: "Enrico", cognome: "Rossi", userName: "rossi.enrico.1"},
	{nome: "Daniele", cognome: "Bascetta", userName: "bascetta.daniele.1"}
]

const targhe : string[]  = [
	"EF122SN",
	"DA328HG",
	"EF251LA",
	"ER929RG",
	"BD381EH"
]

const modelli : string[] = [
	"Mercedes",
	"Scania",
	"DAF",
	"MAN"
]

const citta : string[] = [
	"Bologna, BO, 40123",
	"Modena, MO, 41121",
	"Rimini, RN, 47921",
	"Novara, NO, 28100",
	"Rovigo, RO, 45100",
	"Pesaro-Urbino, PU, 61122",
	"Parma, PR, 43121"
]

const N_SPEDIZIONI = 5
const N_MAGAZZINI  = 10
const N_ORDINI     = 25
const N_ORD_X_SPED = 4 // ≤ N_ORDINI / N_SPEDIZIONI

export const getOrdini = function(this: Spedizione) {
	return Ordini.filter(x => x.spedizioneId == this.id)
}

export const getTappe = function(this: Spedizione) {
	return Tappe.filter(x => x.spedizioneId == this.id)
}

export const getSpedizione = function<U extends {spedizioneId: number}>(this: U) {
	return Spedizioni.filter(x => x.id == this.spedizioneId)[0]
}

export const getInfoCarico = function(this: Ordine) : [Magazzino, Tappa?] {
	const t = Tappe.filter(x => x.id == this.tappaCaricoId)[0]
	const m = Magazzini.filter(x => x.id == this.magazzinoCaricoId)[0]
	return [m, t]
}

export const getInfoScarico = function(this: Ordine) : [Magazzino, Tappa?] {
	const t = Tappe.filter(x => x.id == this.tappaScaricoId)[0]
	const m = Magazzini.filter(x => x.id == this.magazzinoScaricoId)[0]
	return [m, t]
}

export const getMagazzino = function(this: Tappa) : Magazzino {
	return Magazzini.filter(m => m.id === this.magazzinoId)[0]
}


// CREAZIONE SPEDIZIONI
for(let i = 0; i < N_SPEDIZIONI; i++) {

	let camionista1 = faker.random.number(3);
	let camionista2: number;
	do {
		camionista2 = faker.random.number(5);//così potrebbe esserci un solo camionista
	} while(camionista1 === camionista2);

	Spedizioni.push({
		id: i,
		veicoloTarga: targhe[i],
		veicoloModello: modelli[faker.random.number(modelli.length - 1)],
		veicoloMassa: 11.5,     // double
		rimorchioDimX: 250,     // integer
		rimorchioDimY: 350,     // integer
		rimorchioDimZ: 700,     // integer
		rimorchioCaricoMax: 20, // double
		rimorchioMassa: 10.8,   // double
		stato: StatoSpedizione.CREATA,
		camionisti: [Camionisti[camionista1], Camionisti[camionista2]],
		getOrdini,
		getTappe
	});
}

// CREAZIONE MAGAZZINI

for(let i = 0; i < N_MAGAZZINI; i++) {
	Magazzini.push({
		id: i,  // integer
		indirizzo: `${faker.address.streetName()}, ${faker.random.number(50)+1}, ${citta[faker.random.number(6)]}, Italia`// Via, Civico, Comune, Provincia, ZIPCode, Nazione
	});
}

// CREAZIONE ORDINI

for(let i = 0; i < N_ORDINI; i++) {
	let magazzinoCaricoId = faker.random.number(N_MAGAZZINI - 1);
	let magazzinoScaricoId : number;

	do {
		magazzinoScaricoId = faker.random.number(N_MAGAZZINI - 1);
	} while(magazzinoCaricoId == magazzinoScaricoId);

	Ordini.push({
		id:                 i,                             // integer
		magazzinoCaricoId:  magazzinoCaricoId,             // integer
		magazzinoScaricoId: magazzinoScaricoId,            // integer
		descrizione:        faker.commerce.productName(),
		nomeMittente:       faker.company.companyName(),
		nomeDestinatario:   faker.company.companyName(),
		dimX:               faker.random.number(50)+10,    // integer
		dimY:               faker.random.number(50)+10,    // integer
		dimZ:               faker.random.number(50)+10,    // integer
		massa:              faker.random.number(10.5)+0.5, // double
		stato:              StatoOrdine.INSERITO,          // integer
		getSpedizione,
		getInfoCarico,
		getInfoScarico
	})
}

// CREAZIONE TAPPE

type TappaRaw = {
	id:               number,
	spedizioneId:     number,
	magazzinoId:      number,
	arrivoPrevisto:   number,
	ordineItinerario: number
}

function createTappa(tappaRaw: TappaRaw) {
	Tappe.push({
		...tappaRaw,
		getMagazzino,
		getSpedizione
	})
}

let indexSpedizione = 0
let nTappe = 0

// ciclo per ogni spedizione
for(let s of Spedizioni) {
	const isStarted = s.stato != StatoSpedizione.CREATA
	let arrival = faker.date[isStarted ? 'past' : 'future']().getTime()
	const ordersIndexBegin = indexSpedizione * N_ORD_X_SPED
	const orders = Ordini.slice(ordersIndexBegin, ordersIndexBegin + N_ORD_X_SPED)

	// assegno alcuni ordini ad una spedizione
	orders.forEach(o => { o.spedizioneId = s.id; o.stato = StatoOrdine.PROGRAMMATO })

	// prendo il magazzino di carico e scarico di ogni ordine
	const magOrdini = orders.map(o => [
		o.getInfoCarico()[0],
		o.getInfoScarico()[0]
	])

	// creo la tappa di carico e scarico di ogni ordine
	for(let i = 0; i < magOrdini.length; i++) {
		for(let y = 0; y < 2; y++) { // 0: carico, 1: scarico
			createTappa({
				id: nTappe++,
				spedizioneId: s.id,
				magazzinoId: magOrdini[i][y].id,
				arrivoPrevisto: arrival,
				ordineItinerario: i,
			})
			arrival += 1000*60*60*Math.floor(faker.random.number(6))
		}
	}

	indexSpedizione++;
}


export let gestoreSpedizioni: GestoreSpedizioni = {
	nome: "Mario",
	cognome: "Rossi",
	userName: "rossi.mario.3"
}

export const Posizioni : Posizione[] = []