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

	inserisciOrdine(o: D.OrdineRaw, mC: D.MagazzinoRaw, mS: D.MagazzinoRaw) : boolean {
		const maxIdReducer = <U extends { id: number }>(maxId: number, elem: U) => maxId > elem.id ? maxId : elem.id
		let magazzinoCarico  : D.Magazzino = db.Magazzini.filter(m => m.indirizzo === mC.indirizzo)[0]
		let magazzinoScarico : D.Magazzino = db.Magazzini.filter(m => m.indirizzo === mS.indirizzo)[0]

		if(!this.validaOrdine(o, mC, mS)) return false

		// se magazzinoCarico non esiste, lo aggiungo al db
		if(!magazzinoCarico) {
			magazzinoCarico = {
				...mC,
				id: 1 + db.Magazzini.reduce(maxIdReducer, -1)
			}
			db.Magazzini.push(magazzinoCarico)
		}

		// se magazzinoScarico non esiste, lo aggiungo al db
		if(!magazzinoScarico) {
			magazzinoScarico = {
				...mS,
				id: 1 + db.Magazzini.reduce(maxIdReducer, -1)
			}
			db.Magazzini.push(magazzinoScarico)
		}

		// inserimento ordine nel db

		db.Ordini.push({
			...o,
			id: 1 + db.Ordini.reduce(maxIdReducer, -1), // integer
			magazzinoCaricoId:  magazzinoCarico.id,     // integer
			magazzinoScaricoId: magazzinoScarico.id,    // integer
			stato:              D.StatoOrdine.INSERITO, // integer
			getSpedizione: db.getSpedizione,
			getInfoCarico: db.getInfoCarico,
			getInfoScarico: db.getInfoScarico
		})

		return true
	},

	rimuoviOrdine(o: D.Ordine) : boolean {
		if(o.stato != D.StatoOrdine.INSERITO) return false;
		db.Ordini.splice(db.Ordini.findIndex(e => e.id === o.id), 1)
		return true
	},

	// (50 x 5 x 15 ) m
	validaOrdine(o: D.OrdineRaw, magazzinoCarico: D.MagazzinoRaw, magazzinoScarico: D.MagazzinoRaw) : boolean {
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