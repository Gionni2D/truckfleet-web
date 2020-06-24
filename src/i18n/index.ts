import { StatoOrdine } from '../domain';

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
		}
		"inserisciSpedizione": {
		}
		"visualizzaSpedizione": {
		}
		"gestioneOrdini": {
			"insertOrder": string,
			"search": string,
			"manageOrders": string,
			"actions": string,
			"delete": string,
			"ordersProperty": {
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
		}
	},
	"components": {
		"drawer": {
			"settings":           string,
			"orderManagement":    string,
			"shipmentManagement": string
		}
	}
}

export { default } from './it-IT'