const { faker } = require("@faker-js/faker");

const adsStructure = (payload) => {
  const {
    adId,
    userId,
    userName,
    campaignId,
    channel,
    quantity,
    createdAt,
    schedule,
    segment,
    speech,
    sendType,
  } = payload;
  const structure = {
    PK: {
      S: `CLIENT#${userId}`,
    },
    SK: {
      S: `ADS#${adId}`,
    },
    AdsId: {
      S: `ADS#${adId}`,
    },
    CampaignId: {
      S: `ADS#${campaignId}`,
    },
    CampaignType: {
      M: {
        Id: {
          S: "CAMPAIGN-TYPE#3",
        },
        Name: {
          S: "INTELIGENTE",
        },
      },
    },
    Channel: {
      M: {
        Id: {
          S: "CHANNEL#1",
        },
        Name: {
          S: `${channel}`,
        },
      },
    },
    Client: {
      M: {
        Id: {
          S: `CLIENT#${userId}`,
        },
        Name: {
          S: `${userName}`,
        },
      },
    },
    ContactList: {
      M: {
        FileName: {
          S: `${faker.database.mongodbObjectId()}.xlsx`,
        },
        Quantity: {
          N: `${quantity}`,
        },
      },
    },
    CreatedAt: {
      S: `${createdAt}`,
    },
    Description: {
      S: `Campaña ${campaignId}`,
    },
    DiscardedContacts: {
      M: {
        FileName: {
          NULL: true,
        },
        Quantity: {
          N: "0",
        },
      },
    },
    Schedule: {
      S: `${schedule}`,
    },
    Segment: {
      M: {
        Id: {
          S: "SEGMENT#1",
        },
        Name: {
          S: `${segment}`,
        },
      },
    },
    SendContent: {
      M: {
        Content: {
          S: `${speech}`,
        },
        Format: {
          S: "plain/text",
        },
        IsFavorite: {
          BOOL: false,
        },
        Type: {
          N: "1",
        },
      },
    },
    SendType: {
      M: {
        Id: {
          S: `SENDTYPE#${sendType === "LARGO" ? 1 : 2}`,
        },
        Name: {
          S: `${channel} ${sendType}`,
        },
      },
    },
    Status: {
      N: "7",
    },
    StatusLabel: {
      S: "Finalizada",
    },
    Tools: {
      M: {
        Antispam: {
          N: "1",
        },
        AutomaticResponses: {
          M: {
            Califications: {
              L: [],
            },
            Patterns: {
              L: [],
            },
          },
        },
        IndecopiBlacklist: {
          BOOL: false,
        },
        InternalBlacklist: {
          BOOL: true,
        },
        Keywords: {
          L: [],
        },
        MaskingNumber: {
          N: "1",
        },
      },
    },
  };
  return structure;
};

module.exports = adsStructure;
