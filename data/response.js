const responseStructure = (payload) => {
    const {
        conversationId,
        creationDate,
        adsId,
        campaignId,
        channel,
        sendType,
        segment,
        userId,
        userName,
        contactId,
        speech,
        sender,
        sentAt,
        isByTool,
        isSeen,
        qualification
    } = payload;

    const structure = {
        PK: {
            S: `CONVERSATION#${conversationId}`,
        },
        SK: {
            S: `${creationDate}`,
        },
        AdsId: {
            S: `ADS#${adsId}`,
        },
        Campaign: {
            M: {
                Description: {
                    S: `Campaña ${campaignId}`,
                },
                Id: {
                    S: `CAMPAIGN#${campaignId}`,
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
        ContactId: {
            S: `CONTACT#${contactId}`,
        },
        Content: {
            M: {
                Content: {
                    S: `${speech}`,
                },
                Format: {
                    S: "plain/text",
                },
            },
        },
        ConversationId: {
            S: `CONVERSATION#${conversationId}}`,
        },
        CreatedAt: {
            S: `${creationDate}`,
        },
        ExternalId: {
            S: "281712",
        },
        GSI1PK: {
            S: `${sender}_281712`,
        },
        GSI3PK: {
            S: `CLIENT#${userId}`,
        },
        GSI3SK: {
            S: "2022-10-25T21:37:14.425219Z",
        },
        GSI4PK: {
            S: "ADS#2078672303_1",
        },
        GSI4SK: {
            S: "2022-10-25T21:37:14.425226Z",
        },
        IsSent: {
            N: `0`,
        },
        IsSeen: {
            N: `${isSeen}`
        },
        IsReceived: {
            N: "0"
        },
        IsReplied: {
            N: "0"
        },
        Qualification: {
            S: qualification
        },
        IsByTool: {
            N: `${isByTool}`,
        },
        MessageId: {
            S: "MESSAGE#4252c650506a41dd98c1a09a5daded5a",
        },
        SearchField: {
            S: speech,
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
        Sender: {
            S: `${sender}`,
        },
        SendType: {
            M: {
                Id: {
                    S: `SENDTYPE#${sendType === "LARGO" ? 1 : 0}`,
                },
                Name: {
                    S: `${channel} ${sendType}`,
                },
            },
        },
        SentAt: {
            S: `${sentAt}`,
        },
        Status: {
            N: "1",
        },
    };
    return structure
};

module.exports = responseStructure