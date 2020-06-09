const nothing = "Data o výskytu doposud nejsou v databázi NDOP";
const noModelsRandomExpansion = "Modely nelze vytvořit vzhledem k zcela náhodnému šíření druhů";
const noModelsFreeExpansion = "Modely nelze vytvořit, jelikož se předpokládá samovolné šíření druhu ve volné přírodě (doposud neprokázáno)";
const noGisModelUnknownEcology = "Modely budoucího rozšíření nelze vytvořit pro nedostatek dat o ekologických nárocích druhu";
const noGisModelUnsuitableEcology = "Modely budoucího rozšíření nelze vytvořit vzhledem k ekologii druhu";
const noBiomodModelGBM = "Nebylo možné spočítat model GBM z důvodu rozložení vstupních dat";
const noBiomodModelMAXENT = "Nebylo možné spočítat model MAXENT z důvodu rozložení vstupních dat";

export default {
	"933cace6-cc31-49fc-9f0d-3f52ad4bb328": {
		// jelen sika
		noGisModel: noGisModelUnsuitableEcology
	},
	"3e9a7970-9b1f-4cc5-99f8-93f0a091b53b": {
		// borovice vejmutovka
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	}
}