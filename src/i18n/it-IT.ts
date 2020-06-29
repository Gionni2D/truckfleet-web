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
			"search": "Cerca",
			"actions": "Azioni",
			"delete": "Elimina",
			"details": "Dettagli"
		},
		"inserisciSpedizione": {
			"title": "Inserisci Spedizione",
			"next":  "Avanti",
			"hintOptimizedShipment": "Suggerisci spedizione ottimizzata",
			"vehicleSection":  "Informazioni veicolo",
			"trailerSection":  "Informazioni rimorchio",
			"ordersSection":   "Seleziona gli ordini",
			"warehouse":       "Magazzini di carico/scarico",
			"stageSection":    "Inserisci le tappe",
			"addStageButton":  "Aggiungi tappa",
			"insertComplete":  "La spedizione è stata inserita nel sistema",
			"modal": {
				"title":          "Aggiungi una tappa",
				"ok":             "Inserisci",
				"cancel":         "Annulla",
				"addressSection": "Seleziona indirizzo",
				"ordersSection":  "Seleziona gli ordini della tappa"
			}
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
			"senderSection": "Informazioni mittente",
			"receiverSection": "Informazioni destinatario",
			"orderSection": "Informazioni ordine",
			"insert": "Inserisci"
		}
	},
	"domain": {
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
		},
		"orderProperties": {
			"id":         "Id",
			"desc":       "Descrizione",
			"from":       "Mittente",
			"to":         "Destinatario",
			"load":       "Indirizzo di carico",
			"unload":     "Indirizzo di scarico",
			"dimension":  "Dimensioni",
			"mass":       "Massa",
			"state":      "Stato"
		},
		"shipmentProperties": {
			"id":            "Id",
			"departureDate": "Data partenza",
			"arrivalDate":   "Data arrivo",
			"drivers":       "Autisti",
			"duration":      "Durata",
			"distance":      "Distanza",
			"state":         "Stato",
			"vehicle":       "Veicolo",
			"vehicleModel":  "Modello veicolo",
			"vehiclePlate":  "Targa veicolo",
			"vehicleWeight": "Peso veicolo",
			"trailer":       "Rimorchio",
			"trailerDim":    "Spazio di carico",
			"maxLoad":       "Carico massimo",
			"unladenMass":   "Massa a vuoto",
			"numOrders":     "Numero di ordini",
			"numStops":      "Numero di tappe",
			"stage":         "Tappa"
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