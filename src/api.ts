import * as db from './db'
import * as D from './domain'

const getOrariRandom = (begin: number, tappe: D.TappaRaw[]) => {
	const result = [ begin ]
	for(let i = 0; i < tappe.length-1; i++) {
		result.push(begin += fakerStatic.random.number(1000*60*60)+1000*60*20)
	}
	return result;
}

const api : D.Model = {
	getSpedizioni(filter?: D.SpedizioniFilter) : D.Spedizione[] {
		return filter ?
			db.Spedizioni.filter(filter) :
			db.Spedizioni;
	},

	getCamionisti(filter?: D.CamionistiFilter) : D.Camionista[] {
		return filter ?
			db.Camionisti.filter(filter) :
			db.Camionisti;
	},

	getMagazzini(filter?: D.MagazziniFilter) : D.Magazzino[] {
		return filter ?
			db.Magazzini.filter(filter) :
			db.Magazzini;
	},

	getPosizioni(filter?: D.PosizioniFilter) : D.Posizione[] {
		return filter ?
			db.Posizioni.filter(filter) :
			db.Posizioni;
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

	inserisciSpedizione(s: D.SpedizioneRaw, tappe: D.TappaRaw[], dataOraPartenza: number) : boolean {
		const maxIdReducer = <U extends { id: number }>(maxId: number, elem: U) => maxId > elem.id ? maxId : elem.id

		// da sostituire con le API Google Maps
		let arrayOrari = getOrariRandom(dataOraPartenza, tappe)


		if(this.validaSpedizione(s, tappe, dataOraPartenza).result == false) return false;

		let idSped = 1 + db.Spedizioni.reduce(maxIdReducer, -1)

		for(let i = 0; i < tappe.length; i++) {
			let t = tappe[i]
			let idTappa = 1+ db.Tappe.reduce(maxIdReducer, -1)

			db.Tappe.push({
				id: idTappa,
				arrivoPrevisto: arrayOrari[i],
				magazzinoId: t.magazzinoId,
				ordineItinerario: t.ordineItinerario,
				spedizioneId: idSped,
				getMagazzino: db.getMagazzino,
				getSpedizione: db.getSpedizione
			})

			t.ordini.forEach(x => {
				for(let o of db.Ordini) {

					if(o.id == x[1]){
						o.stato = D.StatoOrdine.PROGRAMMATO
						o.spedizioneId = idSped
						x[0] == "carico" ? o.tappaCaricoId = idTappa : o.tappaScaricoId = idTappa
					}
				}
			})

			// aumento dataOraPartenza in modo casuale per la tappa successiva
			dataOraPartenza += fakerStatic.random.number(1000*60*60)+1000*60*20
		}

		db.Spedizioni.push({
			...s,
			id: 1 + db.Spedizioni.reduce(maxIdReducer, -1), // integer
			stato:              D.StatoSpedizione.CREATA, // integer
			getOrdini:					db.getOrdini,
			getTappe:						db.getTappe
		})

		return true
	},

	rimuoviSpedizione(s: D.Spedizione) : boolean {
		if(s.stato == D.StatoSpedizione.CREATA) {
			for(let i = 0; i < db.Spedizioni.length; i++) {
				if(db.Spedizioni[i].id == s.id) {

					// imposto lo stato di ogni ordine a INSERITO
					for(let o of db.Spedizioni[i].getOrdini()) {
						o.stato = D.StatoOrdine.INSERITO
					}

					db.Spedizioni.splice(i, 1);
					return true;
				}
			}
		}
		return false
	},

	validaSpedizione(s: D.SpedizioneRaw, tappe: D.TappaRaw[], dataOraPartenza: number) : D.SpedizioneNonValida | D.SpedizioneValida {
		const arrayArrivi = getOrariRandom(dataOraPartenza, tappe)
		let n = 0;
		for(let c of s.camionisti) {
			n++;
			// controllo ogni spedizione presente nel db
			for(let spedizione of db.Spedizioni) {

				/* controllo se tra i camionisti assegnati c'è un camionista della
				 * nuova spedizione da inserire. In tal caso, controllo se gli
				 * orari delle due spedizioni si sovrappongono
				 */
				for(let cc of spedizione.camionisti) {
					if(cc?.userName == c?.userName) {

						let partenza = spedizione.getTappe()[0].arrivoPrevisto
						let arrivo = spedizione.getTappe()[spedizione.getTappe().length-1].arrivoPrevisto

						// sovrapposizione orari spedizioni
						// old |-----|
						// new   |------|

						// old   |--------|
						// new |----|
						if((arrayArrivi[0] >= partenza && arrayArrivi[0] <= arrivo)
							|| (arrayArrivi[0] <= partenza &&  arrayArrivi[arrayArrivi.length-1] >= partenza)) {
							
							return { 
								result: false, 
								error: 600 + n }	// n: indice che indica il camionista occupato in un'altra
																	// spedizione e definisce il codice di errore
						}
					}
				}
			}
		}
		return {
			result: true,
			arriviPrevisti: arrayArrivi }
	},

	inserisciOrdine(o: D.OrdineRaw, mC: D.MagazzinoRaw, mS: D.MagazzinoRaw) : boolean {
		const maxIdReducer = <U extends { id: number }>(maxId: number, elem: U) => maxId > elem.id ? maxId : elem.id
		let magazzinoCarico  : D.Magazzino = db.Magazzini.filter(m => m.indirizzo === mC.indirizzo)[0]
		let magazzinoScarico : D.Magazzino = db.Magazzini.filter(m => m.indirizzo === mS.indirizzo)[0]

		if(this.validaOrdine(o, mC, mS).result == false) return false

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
	validaOrdine(o: D.OrdineRaw, magazzinoCarico: D.MagazzinoRaw, magazzinoScarico: D.MagazzinoRaw) : D.OrdineNonValido | D.OrdineValido {
		if(o.massa <= 0) return { result: false, error: 701 }
		
		// le dimensioni sono in centimetri (50m -> 50*1000cm)
		if(o.dimX > 50*1000 || o.dimX <= 0) return { result: false, error: 702 }
		if(o.dimY > 5*1000  || o.dimY <= 0) return { result: false, error: 703 }
		if(o.dimZ > 15*1000 || o.dimZ <= 0) return { result: false, error: 704 }

		if(o.descrizione == "") return { result: false, error: 705 }
		if(o.nomeDestinatario == "") return { result: false, error: 706 }
		if(o.nomeMittente == "") return { result: false, error: 707 }

		if(magazzinoCarico.indirizzo 	== "") return { result: false, error: 708 }
		if(magazzinoScarico.indirizzo == "") return { result: false, error: 709 }

		return { result: true }
	},

	getMe() : D.GestoreSpedizioni {
		return db.gestoreSpedizioni
	}
}

export default api