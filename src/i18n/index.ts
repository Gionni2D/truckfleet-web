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
			"next" : string,
			"back" : string,
			"hintOptimizedShipment": string
			"vehicleSection":  string
			"trailerSection":  string
			"ordersSection":   string
			"warehouse":       string
			"stageSection":    string
			"otherSection":    string
			"addStageButton":  string
			"summarySection":  string
			"insertButton":    string
			"insertComplete":  string
			"modal": {
				"title":          string
				"ok":             string
				"cancel":         string
				"addressSection": string
				"ordersSection":  string
			},
			"errors": {
				"601": string
				"602": string
				"603": string
				"604": string
			}
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
			"numStops":      string,
			"stage":         string,
			"mainDriver":    string,
			"supportDriver": string
		},
		"stageProperties": {
			"indirizzo":       string
			"arrivoPrevisto":  string
			"arrivoEffettivo": string
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