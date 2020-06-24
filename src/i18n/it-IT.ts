import { i18n } from ".";
import { StatoOrdine } from "../domain";

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
		},
		"inserisciSpedizione": {
		},
		"visualizzaSpedizione": {
		},
		"gestioneOrdini": {
			"insertOrder": "Inserisci ordine",
			"search": "Cerca",
			"actions": "Azioni",
			"manageOrders": "Gestione ordini",
			"delete": "Elimina",
			"ordersProperty": {
				"desc":       "Descrizione",
				"from":       "Mittente",
				"to":         "Destinatario",
				"load":       "Carico",
				"unload":     "Scarico",
				"dimension":  "Dimensioni",
				"mass":       "Massa",
				"state":      "Stato"
			}
		},
		"inserisciOrdine": {
			"insert": "Inserisci"
		}
	},
	"domain": {
		"orderState": {
			[StatoOrdine.INSERITO]: "Inserito",
			[StatoOrdine.PROGRAMMATO]: "Programmato",
			[StatoOrdine.INVIATO]: "Inviato",
			[StatoOrdine.CONSEGNATO]: "Consegnato"
		}
	},
	"components": {
		"drawer": {
			"settings":           "Impostazioni account",
			"orderManagement":    "Gestione ordini",
			"shipmentManagement": "Gestione spedizioni"
		}
	}
}

export default itIT;