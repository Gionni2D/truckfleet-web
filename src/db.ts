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

// Via, Civico, Comune, Provincia, ZIPCode, Nazione

const indirizzi : string[] = [
	"Via Messina, 35/37, Milano, Milano, 20100, Italia",
	"Via Scuole, 6, Brescia, Brescia, 25128, Italia",
	"Via Polveriera Vecchia, 12, Verona, Verona, 37100, Italia",
	"Via della Motorizzazione Civile, 6, Mestre, Venezia, 30100, Italia",
	"Via Aposazza, 3, Bologna, Bologna, 40128, Italia",
	"Via Morara, 202, Medicina, Bologna, 40059, Italia",
	"Strada Val Nure, 9, Piacenza, Piacenza, 29122, Italia",
	"Via Varisco, 1A, Rimini, Rimini, 47924, Italia",
	"Via Paolo Carnicelli, 2, Grosseto, Grosseto, 58100, Italia",
	"Via Gregorio XVI, 3, Belluno, Belluno, 32100, Italia",
	"Via Codussi, 9, Bergamo, Bergamo, 24100, Italia",
	"viale Druso, 116, Bolzano, Bolzano, 39100, Italia",
	"Viale Marconi, 300, Cagliari, Cagliari, 09100, Italia",
	"Viale della Regione, 196, Caltanissetta, Caltanissetta, 93100, Italia",
	"Via S. Antonio Dei Lazzari, 5/a, Campobasso, Campobasso, 86100, Italia",
	"Via Cesare Beccaria, 31, Catania, Catania, 95123, Italia",
	"Via Vinicio Cortese, 11, Catanzaro, Catanzaro, 88100, Italia",
	"Via Filippo Masci, 115, Chieti, Chieti, 66100, Italia",
	"Via Valleggio, 15, Como, Como, 22100, Italia",
	"Viale della Repubblica, 56, Cosenza, Cosenza, 87100, Italia",
	"Via Nazario Sauro, 14, Cremona, Cremona, 26100, Italia",
	"Corso A. De Gasperi, 71, Cuneo, Cuneo, 12100, Italia",
	"Via Verga, 125, Ferrara, Ferrara, 44124, Italia",
	"Via G. La Farina, 28, Firenze, Firenze, 50132, Italia",
	"Piazza G.B. Fraticelli, 1, Foggia, Foggia, 71100, Italia",
	"Via Albertazzi, 2, Genova, Genova, 16100, Italia",
	"Via dei Leoni, 33, Gorizia, Gorizia, 34170, Italia",
	"Via G. Strato, 2, Imperia, Imperia, 18100, Italia",
	"Piazzale Angelo Guglielmi, 2, Isernia, Isernia, 86170, Italia",
	"Via Antoniana, 10, La, La, 19125, Italia",
	"Viale Pescara, 85, L'Aquila, L'Aquila, 67100, Italia",
	"Piazzale Carturan, 1, Latina, Latina, 04100, Italia",
	"Viale Grassi, 86, Lecce, Lecce, 73100, Italia",
	"Via Amendola, 4, Lecco, Lecco, 23900, Italia",
	"Via Campania, 25, Livorno, Livorno, 57124, Italia",
	"Viale Piacenza, 83, Lodi, Lodi, 26900, Italia",
	"Viale Indipendenza, 158, Macerata, Macerata, 62100, Italia",
	"Viale Risorgimento, 16, Mantova, Mantova, 46100, Italia",
	"Via Massa Avenza, 121/P, Massa, Massa, 54100, Italia",
	"Via Giuseppe Giglio, 3, Matera, Matera, 75100, Italia",
	"Via Antonio Salandra, 39, Messina, Messina, 98124, Italia",
	"Via Formigina, 125, Modena, Modena, 41100, Italia",
	"Largo Tarantini, 1, Napoli, Napoli, 80100, Italia",
	"Via Pietro Generali, 19, Novara, Novara, 28100, Italia",
	"Via del Porto, 6, Oristano, Oristano, 09170, Italia",
	"Via S. Fidenzio, 3, Padova, Padova, 35100, Italia",
	"Via Scarlatti, 16, Palermo, Palermo, 90100, Italia",
]
const N_SPEDIZIONI = 5
const N_MAGAZZINI  = indirizzi.length
const N_ORDINI     = 25
const N_ORD_X_SPED = 4 // ≤ N_ORDINI / N_SPEDIZIONI

export const getOrdini = function(this: Spedizione) {
	return Ordini.filter(x => x.spedizioneId == this.id)
}

export const getTappe = function(this: Spedizione) {
	return Tappe.filter(x => x.spedizioneId == this.id).sort((t1, t2) => t1.ordineItinerario < t2.ordineItinerario ? -1 : 1)
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
		indirizzo: indirizzi[i]
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

Magazzini.push({
	id: 101,  // integer
	indirizzo: `Via John Lennon, 13, Casalecchio di Reno, BO, 40033, Italia`// Via, Civico, Comune, Provincia, ZIPCode, Nazione
});
Magazzini.push({
	id: 102,  
	indirizzo: `Via Tolemaide, 140, Rimini, RN, 47922, Italia`
});
Magazzini.push({
	id: 103,  
	indirizzo: `Frazione Aspio, 37, Camerano, AN, 60021, Italia`
});
Magazzini.push({
	id: 104,  
	indirizzo: `Via Regolizie, 22, San Giovanni Teatino, CH, 66020, Italia`
});

Ordini.push({
	id:                 101,
	spedizioneId:				101,
	tappaCaricoId:			101,
	tappaScaricoId:			103,                            
	magazzinoCaricoId:  101,           
	magazzinoScaricoId: 103,         
	descrizione:        "Comodino regale, colore nero",
	nomeMittente:       "Ikea Bologna",
	nomeDestinatario:   "Ikea Ancona",
	dimX:               50,  
	dimY:               40,    
	dimZ:               45,    
	massa:              7, 
	stato:              StatoOrdine.CONSEGNATO,       
	getSpedizione,
	getInfoCarico,
	getInfoScarico
})
Ordini.push({
	id:                 102,
	spedizioneId:				101,
	tappaCaricoId:			101,
	tappaScaricoId:			104,
	magazzinoCaricoId:  101,
	magazzinoScaricoId: 104,
	descrizione:        "Cornice foto grande, color arcobaleno",
	nomeMittente:       "Ikea Bologna",
	nomeDestinatario:   "Ikea Chieti",
	dimX:               30,
	dimY:               40,
	dimZ:               5,
	massa:              0.8,
	stato:              StatoOrdine.CONSEGNATO,
	getSpedizione,
	getInfoCarico,
	getInfoScarico
})
Ordini.push({
	id:                 103,
	spedizioneId:				101,
	tappaCaricoId:			101,
	tappaScaricoId:			104,
	magazzinoCaricoId:  101,
	magazzinoScaricoId: 104,
	descrizione:        "Cappellino e torcia per campeggio, color verde militare",
	nomeMittente:       "Ikea Bologna",
	nomeDestinatario:   "Ikea Chieti",
	dimX:               15,
	dimY:               10,
	dimZ:               15,
	massa:              0.7,
	stato:              StatoOrdine.CONSEGNATO,
	getSpedizione,
	getInfoCarico,
	getInfoScarico
})
Ordini.push({
	id:                 104,
	spedizioneId:				101,
	tappaCaricoId:			102,
	tappaScaricoId:			103,
	magazzinoCaricoId:  102,
	magazzinoScaricoId: 103,
	descrizione:        "Casetta di legno",
	nomeMittente:       "Ikea Rimini",
	nomeDestinatario:   "Ikea Ancona",
	dimX:               300,
	dimY:               200,
	dimZ:               150,
	massa:              45.3,
	stato:              StatoOrdine.CONSEGNATO,
	getSpedizione,
	getInfoCarico,
	getInfoScarico
})
Ordini.push({
	id:                 105,
	spedizioneId:				101,
	tappaCaricoId:			103,
	tappaScaricoId:			104,
	magazzinoCaricoId:  103,
	magazzinoScaricoId: 104,
	descrizione:        "Lava-lamp",
	nomeMittente:       "Ikea Ancona",
	nomeDestinatario:   "Ikea Chieti",
	dimX:               30,
	dimY:               50,
	dimZ:               30,
	massa:              5,
	stato:              StatoOrdine.CONSEGNATO,
	getSpedizione,
	getInfoCarico,
	getInfoScarico
})

Tappe.push({
	id:               101,
	spedizioneId:     101,
	magazzinoId:      101,
	arrivoPrevisto:   1592796600000,
	arrivoEffettivo:	1592796720000,
	ordineItinerario: 0,
	getMagazzino,
	getSpedizione
})
Tappe.push({
	id:               102,
	spedizioneId:     101,
	magazzinoId:      102,
	arrivoPrevisto:   1592802300000,
	arrivoEffettivo:	1592802397000,
	ordineItinerario: 1,
	getMagazzino,
	getSpedizione
})
Tappe.push({
	id:               103,
	spedizioneId:     101,
	magazzinoId:      103,
	arrivoPrevisto:   1592809200000,
	arrivoEffettivo:	1592809044000,
	ordineItinerario: 2,
	getMagazzino,
	getSpedizione
})
Tappe.push({
	id:               104,
	spedizioneId:     101,
	magazzinoId:      104,
	arrivoPrevisto:   1592818200000,
	arrivoEffettivo:	1592818261000,
	ordineItinerario: 3,
	getMagazzino,
	getSpedizione
})

Spedizioni.push({
	id: 101,
	veicoloTarga: "DA328HG",
	veicoloModello: "Mercedes Actros",
	veicoloMassa: 11.5,     // double
	rimorchioDimX: 250,     // integer
	rimorchioDimY: 350,     // integer
	rimorchioDimZ: 700,     // integer
	rimorchioCaricoMax: 20, // double
	rimorchioMassa: 10.8,   // double
	stato: StatoSpedizione.COMPLETATA,
	camionisti: [Camionisti[0]],
	getOrdini,
	getTappe
});