import * as db from './db'
import * as D from './domain'

const api : D.Model = {
	getSpedizioni(filter?: D.SpedizioniFilter) : D.Spedizione[] {
		return filter ?
			db.Spedizioni.filter(filter) :
			db.Spedizioni;
	},

	getMagazzini(filter?: D.MagazziniFilter) : D.Magazzino[] {
		return filter ?
			db.Magazzini.filter(filter) :
			db.Magazzini;
	},

	getOrdini(filter?: D.OrdiniFilter) : D.Ordine[] {
		return filter ?
			db.Ordini.filter(filter) :
			db.Ordini;
	},

	getTappe(filter?: D.TappeFilter) : D.Tappa[] {
		return filter ?
			db.Tappe.filter(filter) :
			db.Tappe;
	},

	inserisciSpedizione(s: D.Spedizione) : boolean {
		return false
	},

	rimuoviSpedizione(s: D.Spedizione) : boolean {
		if(s.stato == D.StatoSpedizione.CREATA) {
			for(let i = 0; i < db.Spedizioni.length; i++) {
				if(db.Spedizioni[i].id == s.id) {
					// imposto lo stato dell'ordine a INSERITO
					db.Spedizioni[i].getOrdini().every(x => x.stato = D.StatoOrdine.INSERITO);
					db.Spedizioni.splice(i, 1);
					return true;
				}
			}
		}
		return false
	},

	validaSpedizione(s: D.Spedizione) : boolean {
		return false
	},

	inserisciOrdine(o: D.OrdineRaw, magazzinoCarico: D.Magazzino, magazzinoScarico: D.Magazzino) : boolean {
		
		let maxId = -1;
		if(!this.validaOrdine(o, magazzinoCarico, magazzinoScarico)) return false
		
		// se magazzinoCarico non esiste, lo aggiungo al db
		if(db.Magazzini.findIndex(x => x.indirizzo == magazzinoCarico.indirizzo) == -1) {
			db.Magazzini.every(x => x.id > maxId ? maxId = x.id : maxId = maxId)
			magazzinoCarico.id = maxId+1
			db.Magazzini.push(magazzinoCarico)
		}

		// se magazzinoScarico non esiste, lo aggiungo al db
		if(db.Magazzini.findIndex(x => x.indirizzo == magazzinoScarico.indirizzo) == -1) {
			magazzinoScarico.id = maxId+2
			db.Magazzini.push(magazzinoScarico)
		}
		
		// inserimento ordine nel db
		maxId = -1;
		db.Ordini.every(x => x.id > maxId ? maxId = x.id : maxId = maxId)

		db.Ordini.push({
			id: maxId+1, // integer
			magazzinoCaricoId:  magazzinoCarico.id,             // integer
			magazzinoScaricoId: magazzinoScarico.id,            // integer
			descrizione:        o.descrizione,
			nomeMittente:       o.nomeMittente,
			nomeDestinatario:   o.nomeDestinatario,
			dimX:               o.dimX,    // integer
			dimY:               o.dimY,    // integer
			dimZ:               o.dimZ,    // integer
			massa:              o.massa, // double
			stato:              D.StatoOrdine.INSERITO,          // integer
			getSpedizione() {
				return db.Spedizioni.filter(x => x.id == this.spedizioneId)[0]
			},
			getInfoCarico()  {
				const t = db.Tappe.filter(x => x.id == this.tappaCaricoId)[0]
				const m = db.Magazzini.filter(x => x.id == this.magazzinoCaricoId)[0]
				return [ m, t]
			},
			getInfoScarico() {
				const t = db.Tappe.filter(x => x.id == this.tappaScaricoId)[0]
				const m = db.Magazzini.filter(x => x.id == this.magazzinoScaricoId)[0]
				return [ m, t]
			}
		})

		return true
	},

	rimuoviOrdine(o: D.Ordine) : boolean {
		if(o.stato == D.StatoOrdine.INSERITO) {
			for(let i = 0; i < db.Ordini.length; i++) {
				
				if(db.Ordini[i].id == o.id) {
					db.Ordini.splice(i, 1)
					return true
				}
			}
		}
		return false
	},

	// (50 x 5 x 15 ) m
	validaOrdine(o: D.OrdineRaw, magazzinoCarico: D.Magazzino, magazzinoScarico: D.Magazzino) : boolean {
		if(o.massa <= 0) return false
		if(o.dimX > 50) return false
		if(o.dimY > 5) return false
		if(o.dimZ > 15) return false
		if(o.descrizione == "") return false
		if(o.nomeDestinatario == "") return false
		if(o.nomeMittente == "") return false

		return true
	},

	getMe() : D.GestoreSpedizioni {
		return db.gestoreSpedizioni
	}
}

export default api