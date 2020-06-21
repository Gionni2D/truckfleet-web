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
  getOrdini() : Ordine[]
  getTappe()  : Tappa[]
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

export type SpedizioniFilter = (o: Spedizione) => boolean
export type MagazziniFilter = (o: Magazzino) => boolean
export type OrdiniFilter = (o: Ordine) => boolean
export type TappeFilter = (o: Tappa) => boolean

export interface Model {
  getSpedizioni(filter?: SpedizioniFilter) : Spedizione[]
  getMagazzini(filter?: MagazziniFilter) : Magazzino[]
  getOrdini(filter?: OrdiniFilter) : Ordine[]
  getTappe(filter?: TappeFilter) : Tappa[]
  inserisciSpedizione(s : Spedizione) : boolean
  rimuoviSpedizione(s : Spedizione) : boolean
  validaSpedizione(s : Spedizione) : boolean
  inserisciOrdine(o: Ordine) : boolean
  rimuoviOrdine(o: Ordine) : boolean
  validaOrdine(o: Ordine) : boolean
}