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
			"details": string
		}
		"inserisciSpedizione": {
			"title": string,
			"next" : string
			"vehicleSection": string
			"trailerSection": string
			"insertComplete": string
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
		}
		"inserisciOrdine": {
			"title": string,
			"senderSection": string,
			"receiverSection": string,
			"orderSection": string,
			"insert": string
		}
	},
	"domain": {
		"orderState": {
			[key in StatoOrdine]: string
		},
		"shipmentState": {
			[key in StatoSpedizione]: string
		},
		"orderProperties": {
			"id":         string,
			"desc":       string,
			"from":       string,
			"to":         string,
			"load":       string,
			"unload":     string,
			"dimension":  string,
			"mass":       string,
			"state":      string
		},
		"shipmentProperties": {
			"id":            string,
			"departureDate": string,
			"arrivalDate":   string,
			"drivers":       string,
			"duration":      string,
			"distance":      string,
			"state":         string,
			"vehicle":       string,
			"vehicleModel":  string,
			"vehiclePlate":  string,
			"vehicleWeight": string,
			"trailer":       string,
			"trailerDim":    string,
			"maxLoad":       string,
			"unladenMass":   string,
			"numOrders":     string,
			"numStops":      string
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