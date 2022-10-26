const XLSX = require("xlsx");
const moment = require("moment");
const util = require("util");
const { faker } = require("@faker-js/faker");

const campaignDbJSON = require("./data/campaign");
const FuncUtils = require("./utils/utils");
const adDbJSON = require("./data/ads");
const messageSentJSON = require("./data/message");
const responseSentJSON = require("./data/response");

const workbook = XLSX.readFile("data.xlsx");
const sheet_name_list = workbook.SheetNames;
const campaigns = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
const messages = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
const response = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);

const getValueBeforeDash = (value) => {
  return value.toString().split("-")[0];
};

// ADS ID
const campaignIdsRaw = campaigns.map((campaign) =>
  getValueBeforeDash(campaign["ID ELEMENTO"])
);

const xlsFullDate = (value) => {
  const excelHour = FuncUtils.ExcelDateToJSDate(value)
    .toISOString()
    .split("T")[1];
  const excelDate = new Date(Date.UTC(0, 0, value - 1))
    .toISOString()
    .split("T")[0];
  const excelFullDate = `${excelDate}T${excelHour}`;
  return excelFullDate;
};

const idUser = "460df5b1-af21-4744-bb73-cdd6100d3034";
const nameUser = "TEST ADMIN ESTADISTICA";
const campaignIds = [...new Set(campaignIdsRaw)];

// 1. GENERAR UNA CAMPAÑA POR CADA ID
const campaignGenerateSchemas = () => {
  // INICIO UN LOOP POR CADA CAMPAÑA
  const schemasForCampaigns = campaignIds.map((campaignId) => {
    // OBTENER ELEMENTOS DE LA CAMPAÑA
    const adsThisCampaign = campaigns.filter(
      (campaign) => campaign["ID CAMPAÑA"] == campaignId
    );
    // INFO CAMPAÑA
    const campaignInfo = campaigns.find(
      (campaign) => campaign["ID CAMPAÑA"] == campaignId
    );
    // HORA DE CREACIÓN PARA UNA CAMPAÑA BASADA EN EL PRIMER ADS
    const excelHour = FuncUtils.ExcelDateToJSDate(campaignInfo.FECHA)
      .toISOString()
      .split("T")[1];
    const excelDate = new Date(Date.UTC(0, 0, campaignInfo.FECHA - 1))
      .toISOString()
      .split("T")[0];
    const excelFullDate = `${excelDate}T${excelHour}`;
    // CREACIÓN DE LOS SCHEDULES PARA CADA CAMPAIGN
    const schedules = adsThisCampaign.map((ads) => {
      const excelHourAd = FuncUtils.ExcelDateToJSDate(ads.FECHA)
        .toISOString()
        .split("T")[1];
      const excelDateAd = new Date(Date.UTC(0, 0, ads.FECHA - 1))
        .toISOString()
        .split("T")[0];
      const excelFullDateAd = `${excelDateAd}T${excelHourAd}`;
      const scheduleObject = {
        S: moment(excelFullDateAd).format("YYYY-MM-DD HH:mm:ss"),
      };
      return scheduleObject;
    });
    // CREACIÓN DE LOS SENDTYPE POR CADA AD PARA CAMPAIGN
    const sendType = adsThisCampaign.map((ad) => {
      const sendTypeObject = {
        M: {
          Channel: {
            M: {
              Id: {
                S: "1",
              },
              Name: {
                S: `${ad.CANAL} ${ad.SUBTIPO.toUpperCase()}`,
              },
            },
          },
        },
      };
      return sendTypeObject;
    });
    // ASIGNACIÓN DEL CONTACT LIST QUANTITY PARA CAMPAÑA
    const biggerQuantity = [...adsThisCampaign].sort(
      (a, b) => b["CANTIDAD MENSAJES"] - a["CANTIDAD MENSAJES"]
    );
    const payload = {
      campaignId: campaignInfo["ID CAMPAÑA"],
      userId: idUser,
      userName: campaignInfo.USUARIO_NOMBRE,
      channel: campaignInfo.CANAL,
      quantity: biggerQuantity[0]["CANTIDAD MENSAJES"],
      speech: messages.find((message) =>
        getValueBeforeDash(message["ID ELEMENTO"] == campaignId)
      ).SPEECH,
      sendType: { L: sendType },
      creationDate: excelFullDate,
      segment: `${campaignInfo.SEGMENTO.toUpperCase()}S`,
      programmingSchedules: { L: schedules },
    };
    return campaignDbJSON(payload);
  });
  return schemasForCampaigns;
};
const schemasForCampaigns = campaignGenerateSchemas();

// 2. ADS PARA CAMPAÑA
const adsGenerateSchemas = () => {
  const schemasForAds = campaignIds.map((campaignId) => {
    // console.log(campaignId, "LN 120");
    const adsThisCampaign = campaigns.filter(
      (campaign) => campaign["ID CAMPAÑA"] == campaignId
    );
    // INFO CAMPAÑA
    const campaignInfo = campaigns.find(
      (campaign) => campaign["ID CAMPAÑA"] == campaignId
    );
    const adSchema = adsThisCampaign.map((ad) => {
      const payload = {
        adId: ad["ID ELEMENTO"].replace("-", "_"),
        userId: idUser,
        userName: nameUser,
        campaignId: ad["ID CAMPAÑA"],
        channel: ad.CANAL,
        quantity: ad["CANTIDAD MENSAJES"],
        createdAt: xlsFullDate(ad.FECHA),
        schedule: moment(xlsFullDate(ad.FECHA)).format("YYYY-MM-DD HH:mm:ss"),
        segment: ad.SEGMENTO,
        speech: messages.find((message) =>
          getValueBeforeDash(message["ID ELEMENTO"] == campaignId)
        ).SPEECH,
        sendType: ad.SUBTIPO,
      };
      // console.log(payload, `PAYLOAD ${ad["ID ELEMENTO"]}`);
      const adSchemaObject = adDbJSON(payload);
      return adSchemaObject;
    });
    return adSchema;
  });
  return schemasForAds;
};

// const adSchemasForCampaign = adsGenerateSchemas();

// 3. MENSAJES ENVIADOS PARA ADS
const messageGenerateSchemas = () => {
  // INICIO UN LOOP POR CADA CAMPAÑA
  const arrayMessagesSchemas = [];
  campaignIds.map((campaignId) => {
    // OBTENER ELEMENTOS DE LA CAMPAÑA
    const adsThisCampaign = campaigns.filter(
      (campaign) => campaign["ID CAMPAÑA"] == campaignId
    );
    // RECORRER CADA AD Y OBTENER SUS RESPECTIVOS MENSAJES
    adsThisCampaign.map((ad) => {
      const messagesThisAd = messages.filter(
        (message) => message["ID ELEMENTO"] === ad["ID ELEMENTO"]
      );
      messagesThisAd.map((message) => {
        const sentDate = xlsFullDate(message["HORA ENVIO"]);

        const payload = {
          conversationId: faker.random.alphaNumeric(10),
          creationDate: sentDate,
          adsId: message["ID ELEMENTO"].replace("-", "_"),
          campaignId: ad["ID CAMPAÑA"],
          channel: ad.CANAL,
          sendType: ad.SUBTIPO.toUpperCase(),
          segment: ad.SEGMENTO,
          userId: idUser,
          userName: nameUser,
          contactId: `${faker.random.alphaNumeric(5)}_${message["NÚMERO"]}`,
          speech: message.SPEECH,
          sender: message["NÚMERO"],
          sentAt: sentDate,
          isByTool: message.HERRAMIENTAS,
          isSeen: message[LEÍDO],
        };
        arrayMessagesSchemas.push(messageSentJSON(payload));
      });
    });
  });
  // console.log(arrayMessagesSchemas)
  return arrayMessagesSchemas;
};

// 4. MENSAJES RESPONDIDOS PARA ADS
const responseGenerateSchemas = () => {
  // INICIO UN LOOP POR CADA CAMPAÑA
  const arrayResponseSchemas = [];
  campaignIds.map((campaignId) => {
    // OBTENER ELEMENTOS DE LA CAMPAÑA
    const adsThisCampaign = campaigns.filter(
      (campaign) => campaign["ID CAMPAÑA"] == campaignId
    );
    // RECORRER CADA AD Y OBTENER SUS RESPECTIVOS MENSAJES
    adsThisCampaign.map((ad) => {
      const messagesThisAd = response.filter(
        (message) => message["ID ELEMENTO"] === ad["ID ELEMENTO"]
      );
      messagesThisAd.map((message) => {
        const sentDate = xlsFullDate(message["HORA RESPUESTA"]);
        const payload = {
          conversationId: faker.random.alphaNumeric(10),
          creationDate: sentDate,
          adsId: message["ID ELEMENTO"].replace("-", "_"),
          campaignId: ad["ID CAMPAÑA"],
          channel: ad.CANAL,
          sendType: ad.SUBTIPO.toUpperCase(),
          segment: ad.SEGMENTO,
          userId: idUser,
          userName: nameUser,
          contactId: `${faker.random.alphaNumeric(5)}_${message["NÚMERO"]}`,
          speech: message.RESPUESTA,
          sender: message["NÚMERO"],
          sentAt: sentDate,
          isByTool: 0,
          isSeen: message["LEÍDO"],
          qualification: message["TIPIFICACIÓN"],
        };
        arrayResponseSchemas.push(responseSentJSON(payload));
      });
    });
  });
  console.log(util.inspect(arrayResponseSchemas[0], false, null, true /* enable colors */))
  return arrayResponseSchemas;
};

// messageGenerateSchemas();
responseGenerateSchemas();
