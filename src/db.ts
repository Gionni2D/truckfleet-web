import { Magazzino, Ordine, Tappa, Spedizione, StatoSpedizione, StatoOrdine } from "./domain";
import * as faker from "faker/locale/it";


export const Spedizioni : Spedizione[] = []
export const Ordini : Ordine[] = []
export const Magazzini : Magazzino[] = []
export const Tappe : Tappa[] = []

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

// CREAZIONE SPEDIZIONI

for(let i = 0; i < 5; i++) {
	Spedizioni.push({
		id: i,
		veicoloTarga: targhe[i],
		veicoloModello: modelli[faker.random.number(3)],
		veicoloMassa: 11.5,     // double
		rimorchioDimX: 250,     // integer
		rimorchioDimY: 350,     // integer
		rimorchioDimZ: 700,     // integer
		rimorchioCaricoMax: 20, // double
		rimorchioMassa: 10.8,   // double
		stato: StatoSpedizione.CREATA,
		getOrdini( ) { return Ordini.filter(x => x.spedizioneId == this.id) },
		getTappe() { return Tappe.filter(x => x.spedizioneId == this.id) }
	});
}

// CREAZIONE MAGAZZINI

for(let i = 0; i < 10; i++) {
	Magazzini.push({
		id: i,  // integer
		indirizzo: `${faker.address.streetName()}, ${faker.random.number(50)+1}, ${citta[faker.random.number(6)]}, Italia`// Via, Civico, Comune, Provincia, ZIPCode, Nazione
	});
}

// CREAZIONE ORDINI

for(let i = 0; i < 15; i++) {
	let magazzinoCaricoId = faker.random.number(9);
	let magazzinoScaricoId : number;

	do {
		magazzinoScaricoId = faker.random.number(9);
	} while(magazzinoCaricoId == magazzinoScaricoId);

	Ordini.push({
		id: i, // integer
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
		getSpedizione() {
			return Spedizioni.filter(x => x.id == this.spedizioneId)[0]
		},
		getInfoCarico()  {
			const t = Tappe.filter(x => x.id == this.tappaCaricoId)[0]
			const m = Magazzini.filter(x => x.id == this.magazzinoCaricoId)[0]
			return [ m, t]
		},
		getInfoScarico() {
			const t = Tappe.filter(x => x.id == this.tappaScaricoId)[0]
			const m = Magazzini.filter(x => x.id == this.magazzinoScaricoId)[0]
			return [ m, t]
		}
	})
}

// CREAZIONE TAPPE

for(let i = 0; i < Spedizioni.length; i++) {
	let arrivoPre = faker.date.future(1).getTime();

	for(let j = 0; j < 3; j++) {
		Tappe.push({
			id: j,                               // integer
			magazzinoId: faker.random.number(9), // integer
			spedizioneId: i,                     // integer
			arrivoPrevisto: arrivoPre,           // timestamp (millisecondi)
			ordineItinerario: j + 1,             // integer
			getSpedizione() {
				return Spedizioni.filter(x => x.id == this.spedizioneId)[0]
			},
			getMagazzino() {
				return Magazzini.filter(x => x.id == this.magazzinoId)[0]
			}
		});

		arrivoPre = arrivoPre + faker.random.number(1000*60*60)+1000*60*20;

		// popolare proprietà ordini non definite
	}
}


