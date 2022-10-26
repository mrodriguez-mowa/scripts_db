const campaignDbJSON = require('./data/campaign');
const Utils = require('./utils/utils');
const XLSX = require('xlsx');
const workbook = XLSX.readFile('data.xlsx');
const sheet_name_list = workbook.SheetNames;
const campaigns = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
const messages = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]])
const response = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]])

// UTILS

const getValueBeforeDash = (value) => {
    return value.split("-")[0]
}

// 1. GENERAR UNA CAMPAÑA POR CADA ID

const campaignIdsRaw = campaigns.map((campaign) => getValueBeforeDash(campaign['ID ELEMENTO']));
const campaignIds = [...new Set(campaignIdsRaw)]

// SENDCONTENT

// INICIO UN LOOP POR CADA CAMPAÑA

const schemasForCampaigns = campaignIds.map((campaignId) => {
    // OBTENER ELEMENTOS DE LA CAMPAÑA
    const adsThisCampaign = campaigns.filter((campaign) => campaign['ID CAMPAÑA'] == campaignId);
    // PRIMER ELEMENTO PARA OBTENER INFORMACIÓN BÁSICA
    const dataToUse = adsThisCampaign[0];
    // INFO CAMPAÑA
    const campaignInfo = campaigns.find((campaign) => campaign['ID CAMPAÑA'] == campaignId)
    const schedules = adsThisCampaign.map((ads) => new Date(Utils.ExcelDateToJSDate(ads.FECHA)).toLocaleString())
    console.log(schedules);
    const programmingSchema = {
        "M": {
            "Channel": {
                "M": {
                    "Id": {
                        "S": "1"
                    },
                    "Name": {
                        "S": "SMS"
                    }
                }
            },
            "Intensity": {
                "N": `${adsThisCampaign.length}` 
            },
            "Schedules": {
                "L": schedules
            }
        }
    }
    
    const payload = {
        campaignId: campaignInfo['ID CAMPAÑA'],
        userId: campaignInfo.USUARIO,
        userName: campaignInfo.USUARIO_NOMBRE,
        channel: campaignInfo.CANAL,
        quantity: dataToUse['CANTIDAD MENSAJES'],
        speech: messages.find((message) => getValueBeforeDash(message['ID ELEMENTO'] == campaignId )).SPEECH,
        sendType: campaignInfo.SUBTIPO,
        creationDate: new Date(parseExcel(campaign.FECHA)).toISOString(),
        segment: `${campaignInfo.SEGMENTO.toUpperCase()}S`
    }
    
})


const campaignsSchemas = campaigns.map((campaign) => {
    const payload = {
        campaignId: campaign['ID CAMPAÑA'],
        userId: campaign.USUARIO,
        userName: campaign.USUARIO_NOMBRE,
        channel: campaign.CANAL,
        quantity: campaign['CANTIDAD MENSAJES'],
        speech: "SPEECH DE PRUEBA",
        sendType: campaign.SUBTIPO,
        creationDate: new Date(Utils.ExcelDateToJSDate(campaign.FECHA)).toISOString(),
        segment: `${campaign.SEGMENTO.toUpperCase()}S`
    }
    return campaignDbJSON(payload)
})

