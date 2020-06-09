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
	"6e0c18ad-c8fd-4f32-bcd5-f04c33167a9a": {
		// muflon
		noGisModel: noGisModelUnsuitableEcology
	},
	"06f0aacf-09e8-499e-bba6-d472e8d54d7e": {
		// mýval severní
		noGisModel: noGisModelUnsuitableEcology
	},
	"2316b10f-b733-4e9b-958c-cc5bfd568735": {
		// psík mývalovitý
		noGisModel: noGisModelUnsuitableEcology
	},
	"aeb77ca2-ac1d-4cdd-b885-f1c4f922eb3f": {
		// ambrosie
		noGisModel: noGisModelUnsuitableEcology
	},
	"102e76d3-6307-4a26-ab8a-4ef5588570c7": {
		// astra novobelgická
		noGisModel: noGisModelUnsuitableEcology
	},
	"3e9a7970-9b1f-4cc5-99f8-93f0a091b53b": {
		// borovice vejmutovka
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	},
	"5e3a1bb6-fddb-472c-a77f-1bf339aa726f": {
		// dub červený
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	},
	"da298627-95e4-4b8e-8b65-1dd46fa1346f": {
		// jasan pensylvánský
		noGisModel: noGisModelUnknownEcology
	},
	"775cf11e-22ad-4e07-865c-fae608863ea2": {
		// javor jasanolistý
		noBiomodParticularModel: {
			noBiomodModelGBM
		}
	},
	"c445b9a9-a6a3-47a6-baf7-ca48a063cbcb": {
		// klejcha hedvábná
		noGisModel: noGisModelUnknownEcology
	},
	"385e6a88-4dda-474f-81d0-700f8785d092": {
		// kolotočník ozdobný
		noGisModel: noGisModelUnknownEcology
	},
	"c91a552d-59a1-4531-886e-1de5cac3992c": {
		// komule davidova
		noGisModel: noGisModelUnknownEcology,
		noBiomodParticularModel: {
			noBiomodModelGBM
		}
	},
	"4df5dd73-e05d-442d-88b9-909cbc752484": {
		// loubinec pětilistý
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	},
	"0c2a25e7-9feb-4b54-bfcb-a5db7de4d700": {
		// loubinec popínavý
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	},
	"843ddf31-2030-445d-ad6c-9d4bf99e384f": {
		// netýkavka žláznatá
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	},
	"8fb79c32-ddad-4e83-9035-7dd81ed9fb82": {
		// svída výběžkatá
		noGisModel: noGisModelUnknownEcology
	},
	"44fdbffe-c75a-4437-b647-ac1508361ac7": {
		// trnovník akát
		noBiomodParticularModel: {
			noBiomodModelMAXENT
		}
	},
	"eee60ad0-b8d5-4074-a2b5-c532f7ec5065": {
		// žanovec měchýřník
		noGisModel: noGisModelUnknownEcology
	},
	"b16e8b7c-7607-470f-9469-107990a3c973": {
		// zimolez kozí list
		noGisModel: noGisModelUnknownEcology
	},
	"64dace45-50b4-4349-9ee1-e28bd747c78d": {
		// blěšivec velkohrbý
		nothing
	},
	"da8924f1-3c73-485b-8e0f-acc0d6650e8d": {
		// krab čínský
		nothing
	},
	"dc301b57-6a6d-4f37-90a0-f98f71600b81": {
		// norek americký
		noGisModel: noGisModelUnsuitableEcology
	},
	"edfdd933-86fe-4b08-ae20-cb77eeb6afbc": {
		// ondatra pyžmová
		noGisModel: noGisModelUnsuitableEcology
	},
	"d435f0a6-0b8f-454e-905e-85c4dbc22288": {
		// želva nádherná
		noModels: noModelsFreeExpansion
	},
	"ed135671-9da6-495e-91ad-ff305f849b94": {
		// vodní mor americký
		noModels: noModelsRandomExpansion
	},
	"ae694a84-4fda-400b-bf26-b78b4484b516": {
		// vodní mor kanadský
		noModels: noModelsRandomExpansion
	},
}