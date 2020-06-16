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
  getSpedizione()  : Spedizione
  getInfoCarico()  : [Magazzino, Tappa]
  getInfoScarico() : [Magazzino, Tappa]
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
  arrivoPrevisto: number;   // timestamp (secondi)
  arrivoEffettivo: number;  // timestamp (secondi)
  ordineItinerario: number; // integer
  getSpedizione() : Spedizione
  getMagazzino()  : Magazzino
}