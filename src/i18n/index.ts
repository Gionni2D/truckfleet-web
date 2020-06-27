import { StatoOrdine, StatoSpedizione } from '../domain';

export interface i18n {
	"routes": {
		"home": {
			"title": string,
			"orderManagementText": string,
			"orderManagementButton": string,
			"shipmentManagementText": string,
			"shipmentManagementButton": string
		},
		"gestioneSpedizioni": {
			"search": string,
			"actions": string,
			"delete": string,
			"details": string,
			"shipmentProperty": {
				"departureDate": string,
				"arrivalDate":   string,
				"drivers":       string,
				"duration":      string,
				"distance":      string,
				"state":         string,
				"vehicle":       string,
				"trailer":       string,
				"maxLoad":       string,
				"unladenMass":   string,
			}
		}
		"inserisciSpedizione": {
		}
		"visualizzaSpedizione": {
			"associatedOrders":  string,
			"stops":             string,
			"map":               string
		}
		"gestioneOrdini": {
			"insertOrder": string,
			"search": string,
			"manageOrders": string,
			"actions": string,
			"delete": string,
			"ordersProperty": {
				"id":         string,
				"desc":       string,
				"from":       string,
				"to":         string,
				"load":       string,
				"unload":     string,
				"dimension":  string,
				"mass":       string,
				"state":      string
			}
		}
		"inserisciOrdine": {
			"insert": string
		}
	},
	"domain": {
		"orderState": {
			[key in StatoOrdine]: string
		},
		"shipmentState": {
			[key in StatoSpedizione]: string
		}
	},
	"components": {
		"drawer": {
			"settings":           string,
			"home":               string,
			"orderManagement":    string,
			"shipmentManagement": string,
			"shipmentDetails":    string
		}
	}
}

export { default } from './it-IT'