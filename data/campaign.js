const { faker } = require('@faker-js/faker')

const campaignStructure = (payload) => {
    const { campaignId, userId, userName, channel, quantity, speech, sendType, creationDate, segment } = payload
    const structure = {
        "PK": {
            "S": `CLIENT#${userId}`
        },
        "SK": {
            "S": `CAMPAIGN#${campaignId}`
        },
        "CampaignType": {
            "M": {
                "Id": {
                    "S": "CAMPAIGN-TYPE#3"
                },
                "Name": {
                    "S": "INTELIGENTE"
                }
            }
        },
        "Channel": {
            "L": [
                {
                    "M": {
                        "Id": {
                            "S": "1"
                        },
                        "Name": {
                            "S": `${channel}`
                        }
                    }
                }
            ]
        },
        "Client": {
            "M": {
                "Id": {
                    "S": `CLIENT#${userId}`
                },
                "Name": {
                    "S": `${userName}`
                }
            }
        },
        "ContactList": {
            "L": [
                {
                    "M": {
                        "Channel": {
                            "M": {
                                "Id": {
                                    "S": "1"
                                },
                                "Name": {
                                    "S": `${channel}`
                                }
                            }
                        },
                        "ContactList": {
                            "M": {
                                "FileName": {
                                    "S": `${faker.database.mongodbObjectId()}.xlsx`
                                },
                                "Quantity": {
                                    "N": `${quantity}`
                                }
                            }
                        }
                    }
                }
            ]
        },
        "CreatedAt": {
            "S": `${creationDate}`
        },
        "Description": {
            "S": `Campaña ${faker.random.numeric(2)}`
        },
        "DiscardedContacts": {
            "L": [
                {
                    "M": {
                        "Channel": {
                            "M": {
                                "Id": {
                                    "S": "1"
                                },
                                "Name": {
                                    "S": `${channel}`
                                }
                            }
                        },
                        "DiscardedContacts": {
                            "M": {
                                "FileName": {
                                    "NULL": true
                                },
                                "Quantity": {
                                    "N": "0"
                                }
                            }
                        }
                    }
                }
            ]

        },
        "Programming": {
            "L": [
                {
                    "M": {
                        "Channel": {
                            "M": {
                                "Id": {
                                    "S": "1"
                                },
                                "Name": {
                                    "S": `${channel}`
                                }
                            }
                        },
                        "Intensity": {
                            "N": "1" // ADS FOR THIS USER LENGTH
                        },
                        "Schedules": {
                            "L": [ // ARRAY SCHEDULES THIS CAMPAIGN
                                {
                                    "S": "2022-10-17 17:19:15"
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "Segment": {
            "M": {
                "Id": {
                    "S": "SEGMENT#1"
                },
                "Name": {
                    "S": `${segment}`
                }
            }
        },
        "SendContent": {
            "L": [
                {
                    "M": {
                        "Channel": {
                            "M": {
                                "Id": {
                                    "S": "1"
                                },
                                "Name": {
                                    "S": `${channel}`
                                }
                            }
                        },
                        "Content": { // SPEECH THIS CAMPAIGN
                            "S": `${speech}`
                        },
                        "Format": {
                            "S": "plain/text"
                        },
                        "IsFavorite": {
                            "BOOL": false
                        },
                        "Type": {
                            "N": "1"
                        }
                    }
                }
            ]
        },
        "SendType": {
            "L": [
                {
                    "M": {
                        "Channel": {
                            "M": {
                                "Id": {
                                    "S": "1"
                                },
                                "Name": {
                                    "S": `${channel}`
                                }
                            }
                        },
                        "Id": {
                            "S": sendType === 'LARGO' ? "1" : "2" 
                        },
                        "Name": {
                            "S": `${channel}${sendType}`
                        }
                    }
                }
            ]
        },
        "Status": {
            "N": "1"
        },
        "Tools": {
            "L": [
                {
                    "M": {
                        "Antispam": {
                            "N": "1"
                        },
                        "AutomaticResponses": {
                            "M": {
                                "Califications": {
                                    "L": []
                                },
                                "Patterns": {
                                    "L": []
                                }
                            }
                        },
                        "Channel": {
                            "M": {
                                "Id": {
                                    "S": "1"
                                },
                                "Name": {
                                    "S": `${channel}`
                                }
                            }
                        },
                        "IndecopiBlacklist": {
                            "BOOL": false
                        },
                        "InternalBlacklist": {
                            "BOOL": true
                        },
                        "Keywords": {
                            "L": []
                        },
                        "MaskingNumber": {
                            "N": "1"
                        }
                    }
                }
            ]
        }
    }
    return structure;
}

module.exports = campaignStructure;