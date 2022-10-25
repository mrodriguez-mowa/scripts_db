const campaignDbJSON = require('./data/campaign');
const parseExcel = require('./utils/excelDate');
const configRead = { type: 'base64', cellDate: true, dateNF: "dd/mm/yyyy hh:mm:ss" };
var XLSX = require('xlsx');
var workbook = XLSX.readFile('data.xlsx');
var sheet_name_list = workbook.SheetNames;
const campaigns = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
const messages = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]])
const response = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]])

const campaignsSchemas = campaigns.map((campaign) => {
    const payload =  {
        campaignId: campaign['ID CAMPAÑA'],
        userId: campaign.USUARIO,
        userName: campaign.USUARIO_NOMBRE,
        channel: campaign.CANAL,
        quantity: campaign['CANTIDAD MENSAJES'],
        speech: "SPEECH DE PRUEBA",
        sendType: campaign.SUBTIPO,
        creationDate: new Date(parseExcel(campaign.FECHA)).toISOString(),
        segment: `${campaign.SEGMENTO.toUpperCase()}S`
    }
    return campaignDbJSON(payload)
})

console.log(campaignsSchemas, 'CAMP SCHEMAS');