import { i18n } from ".";
import { StatoOrdine, StatoSpedizione } from "../domain";

const itIT: i18n = {
	"routes": {
		"home": {
			"title": "Benvenuto in Truck Fleet",
			"orderManagementText": "Da questa sezione potrai visualizzare la lista degli ordini, rimuoverli e inserirne di nuovi",
			"orderManagementButton": "Gestione Ordini",
			"shipmentManagementText": "Da questa sezione potrai visualizzare la lista delle spedizioni, rimuoverle e inserirne di nuove",
			"shipmentManagementButton": "Gestione Spedizioni"
		},
		"gestioneSpedizioni": {
			"search": "cerca",
			"actions": "Azioni",
			"delete": "Elimina",
			"details": "Dettagli",
			"shipmentProperty": {
				"departureDate": "Data partenza",
				"arrivalDate":   "Data arrivo",
				"drivers":       "Autista/i",
				"duration":      "Durata",
				"distance":      "Distanza",
				"state":         "Stato",
				"vehicle":       "Veicolo",
				"trailer":       "Rimorchio",
				"maxLoad":       "Carico massimo",
				"unladenMass":   "Massa a vuoto"
			}
		},
		"inserisciSpedizione": {
		},
		"visualizzaSpedizione": {
			"associatedOrders":  "Ordini associati",
			"stops":             "Tappe",
			"map":               "Mappa"
		},
		"gestioneOrdini": {
			"insertOrder": "Inserisci ordine",
			"search": "Cerca",
			"actions": "Azioni",
			"manageOrders": "Gestione ordini",
			"delete": "Elimina"
		},
		"inserisciOrdine": {
			"title": "Inserisci ordine",
			"insert": "Inserisci"
		}
	},
	"domain": {
		"orderProperties": {
			"id":         "Id",
			"desc":       "Descrizione",
			"from":       "Mittente",
			"to":         "Destinatario",
			"load":       "Carico",
			"unload":     "Scarico",
			"dimension":  "Dimensioni",
			"mass":       "Massa",
			"state":      "Stato"
		},
		"orderState": {
			[StatoOrdine.INSERITO]: "Inserito",
			[StatoOrdine.PROGRAMMATO]: "Programmato",
			[StatoOrdine.INVIATO]: "Inviato",
			[StatoOrdine.CONSEGNATO]: "Consegnato"
		},
		"shipmentState": {
			[StatoSpedizione.CREATA]: "Creata",
			[StatoSpedizione.IN_CORSO]: "In corso",
			[StatoSpedizione.COMPLETATA]: "Completata"
		}
	},
	"components": {
		"drawer": {
			"settings":           "Impostazioni account",
			"home":               "Home",
			"orderManagement":    "Gestione ordini",
			"shipmentManagement": "Gestione spedizioni",
			"shipmentDetails":    "Dettagli spedizione"
		}
	}
}

export default itIT;