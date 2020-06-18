import * as db from './db'
import * as D from './domain'

const api : D.Model = {
  getSpedizioni(filter: D.SpedizioniFilter) : D.Spedizione[] {
    return []
  },

  getMagazzini(filter: D.MagazziniFilter) : D.Magazzino[] {
    return []
  },

  getOrdini(filter: D.OrdiniFilter) : D.Ordine[] {
    return []
  },

  getTappe(filter: D.TappeFilter) : D.Tappa[] {
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

  inserisciOrdine(o: D.Ordine) : boolean {
    return false
  },

  rimuoviOrdine(o: D.Ordine) : boolean {
    return false
  },

  validaOrdine(o: D.Ordine) : boolean {
    return false
  }
}

export default api