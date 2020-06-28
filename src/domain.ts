export interface Ordine {
	id:                 number; // integer
	magazzinoCaricoId:  number; // integer
	magazzinoScaricoId: number; // integer
	spedizioneId?:      number; // integer
	tappaCaricoId?:     number; // integer
	tappaScaricoId?:    number; // integer
	descrizione:        string;
	nomeMittente:       string;
	nomeDestinatario:   string;
	dimX:               number; // integer
	dimY:               number; // integer
	dimZ:               number; // integer
	massa:              number; // double
	stato:              StatoOrdine; // integer
	getSpedizione()  : Spedizione | undefined
	getInfoCarico()  : [Magazzino, Tappa?]
	getInfoScarico() : [Magazzino, Tappa?]
}

export interface OrdineRaw {
	descrizione:        string;
	nomeMittente:       string;
	nomeDestinatario:   string;
	dimX:               number; // integer
	dimY:               number; // integer
	dimZ:               number; // integer
	massa:              number; // double
}

export enum StatoOrdine {
	INSERITO,     // 0
	PROGRAMMATO,  // 1
	INVIATO,      // 2
	CONSEGNATO    // 3
}

export interface Magazzino {
	id: number;        // integer
	indirizzo: string; // Via, Civico, Comune, Provincia, ZIPCode, Nazione
}

export interface MagazzinoRaw {
	indirizzo: string; // Via, Civico, Comune, Provincia, ZIPCode, Nazione
}

export interface Spedizione {
	id: number; // integer
	veicoloTarga: string;
	veicoloModello: string;
	veicoloMassa: number;       // double
	rimorchioDimX: number;      // integer
	rimorchioDimY: number;      // integer
	rimorchioDimZ: number;      // integer
	rimorchioCaricoMax: number; // double
	rimorchioMassa: number;     // double
	stato: StatoSpedizione;
	camionisti: [Camionista, Camionista?];
	getOrdini() : Ordine[]
	getTappe()  : Tappa[]
}

export interface SpedizioneRaw {
	veicoloTarga: string;
	veicoloModello: string;
	veicoloMassa: number;       // double
	rimorchioDimX: number;      // integer
	rimorchioDimY: number;      // integer
	rimorchioDimZ: number;      // integer
	rimorchioCaricoMax: number; // double
	rimorchioMassa: number;     // double
	camionisti: [Camionista, Camionista?];
}

export enum StatoSpedizione {
	CREATA,     // 0
	IN_CORSO,   // 1
	COMPLETATA  // 2
}

export interface Tappa {
	id: number;               // integer
	magazzinoId: number;      // integer
	spedizioneId: number;     // integer
	arrivoPrevisto: number;   // timestamp (millisecondi)
	arrivoEffettivo?: number;  // timestamp (millisecondi)
	ordineItinerario: number; // integer
	getSpedizione() : Spedizione
	getMagazzino()  : Magazzino
}

export interface TappaRaw {
	magazzinoId: number,
	ordineItinerario: number,
	ordini: ["carico"|"scarico", number][] 	// [carico/scarico, idOrdine][]
}

export interface Posizione {
	lat:  number         // latitudine
	lng:  number         // longitudine
	time: number         // timestamp (millisecondi)
	spedizioneId: number // integer
}

export type SpedizioniFilter = (o: Spedizione) => boolean
export type CamionistiFilter = (o: Camionista) => boolean
export type MagazziniFilter = (o: Magazzino) => boolean
export type PosizioniFilter = (o: Posizione) => boolean
export type OrdiniFilter = (o: Ordine) => boolean
export type TappeFilter = (o: Tappa) => boolean

export interface Model {
	getSpedizioni(filter?: SpedizioniFilter) : Spedizione[]
	getCamionisti(filter?: CamionistiFilter) : Camionista[]
	getMagazzini(filter?: MagazziniFilter) : Magazzino[]
	getPosizioni(filter?: PosizioniFilter) : Posizione[]
	getOrdini(filter?: OrdiniFilter) : Ordine[]
	getTappe(filter?: TappeFilter) : Tappa[]
	inserisciSpedizione(s: SpedizioneRaw, tappe: TappaRaw[], dataOraPartenza: number) : boolean
	rimuoviSpedizione(s: Spedizione) : boolean
	validaSpedizione(s: SpedizioneRaw, tappe: TappaRaw[], dataOraPartenza: number) : SpedizioneNonValida | SpedizioneValida
	inserisciOrdine(o: OrdineRaw, magazzinoCarico: MagazzinoRaw, magazzinoScarico: MagazzinoRaw) : boolean
	rimuoviOrdine(o: Ordine) : boolean
	validaOrdine(o: OrdineRaw, magazzinoCarico: MagazzinoRaw, magazzinoScarico: MagazzinoRaw) : OrdineNonValido | OrdineValido
	getMe() : GestoreSpedizioni
}

export interface GestoreSpedizioni {
	nome: string,
	cognome: string,
	userName: string
}

export interface Camionista {
	nome: string,
	cognome: string,
	userName: string
}

/*	Codici errore validazione Spedizione:
 *	601 - Camionista 1 occupato
 *	602 - Camionista 2 occupato
 *	603 - Sforato peso massimo di 44 t
 *	604 - Veicolo già impiegato in un altra spedizione
 */
export interface SpedizioneNonValida {
	result: false, 
	error: number
}

export interface SpedizioneValida {
	result: true, 
	arriviPrevisti: number[]
}

/*	Codici errore validazione Ordine:
 *	701 - Massa negativa
 *	702 - DimX > limite (50m) || DimX negativa
 *	703 - DimY > limite (5m) 	|| DimY negativa
 *	704 - DimZ > limite (15m)	|| DimZ negativa
 *	705 - Descrizione vuota
 *	706 - Nome destinatario vuoto
 *	707 - Nome mittente vuoto
 *	708 - Magazzino Carico vuoto
 *	709 - Magazzino Scarico vuoto
 *	710 - Stesso indirizzo di carico e scarico
 */
export interface OrdineNonValido {
	result: false,
	error: number
}

export interface OrdineValido {
	result: true
}