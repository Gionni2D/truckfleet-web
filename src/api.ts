import * as db from './db'
import * as D from './domain'

const api : D.Model = {
	getSpedizioni(filter?: D.SpedizioniFilter) : D.Spedizione[] {
		return []
	},

	getMagazzini(filter?: D.MagazziniFilter) : D.Magazzino[] {
		return []
	},

	getOrdini(filter?: D.OrdiniFilter) : D.Ordine[] {
		return filter ?
			db.Ordini.filter(filter) :
			db.Ordini;
	},

	getTappe(filter?: D.TappeFilter) : D.Tappa[] {
		return []
	},

	inserisciSpedizione(s: D.Spedizione) : boolean {
		return false
	},

	rimuoviSpedizione(s: D.Spedizione) : boolean {
		return false
	},

	validaSpedizione(s: D.Spedizione) : boolean {
		return false
	},

	inserisciOrdine(o: D.Ordine, magazzinoCarico: D.Magazzino, magazzinoScarico: D.Magazzino) : boolean {
		return false
	},

	rimuoviOrdine(o: D.Ordine) : boolean {
		return false
	},

	validaOrdine(o: D.Ordine, magazzinoCarico: D.Magazzino, magazzinoScarico: D.Magazzino) : boolean {
		return false
	},

	getMe() : D.GestoreSpedizioni {
		return db.gestoreSpedizioni
	}
}

export default api