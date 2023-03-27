/* eslint-disable no-undef */

function getMessages(requestParams, context, ee, next) {
    requestParams.headers = {
        authorization: `Bearer ${context.vars["AUTH_TOKEN"]}`,
    };
    requestParams.json = {
        operationName: "GetMessages",
        query: `query GetMessages {
            me {
              id
              unreadMessageCount
              inbox {
                id
                contents
                from {
                    id
                    unreadMessageCount
                    inbox {
                        id
                        contents
                        from {
                            id
                            unreadMessageCount
                            inbox {
                                id
                                contents
                                from {
                                    id
                                }
                                to {
                                    id
                                }
                            }
                        }
                        to {
                            id
                            unreadMessageCount
                            inbox {
                                id
                                contents
                                from {
                                    id
                                }
                                to {
                                    id
                                }
                            }
                        }
                    }
                }
                to {
                    id
                    unreadMessageCount
                    inbox {
                        id
                        contents
                        from {
                            id
                        }
                        to {
                            id
                        }
                    }
                }
              }
            }
          }`,
        variables: {},
    };

    return next();
}

function getUser(requestParams, context, ee, next) {
    requestParams.headers = {
        authorization: `Bearer ${context.vars["AUTH_TOKEN"]}`,
    };
    requestParams.json = {
        operationName: "GetUser",
        query: `query GetUser {
            me {
              id
              name
              unreadMessageCount
              inbox {
                id
                contents
                from {
                    id
                    name
                    unreadMessageCount
                }
                to {
                    id
                    name
                    unreadMessageCount
                }
              }
            }
          }`,
        variables: {},
    };

    return next();
}

function sendMessage(requestParams, context, ee, next) {
    const variables = Object.assign({}, requestParams.json);

    requestParams.json = {
        operationName: "SendMessage",
        query: `mutation SendMessage($message: String!) {
            sendRandomMessage(message: $message) {
                id
            }
          }`,
        variables,
    };

    return next();
}


function login(requestParams, context, ee, next) {
    const variables = Object.assign({}, requestParams.json);

    requestParams.json = {
        operationName: "LoginUser",
        query: `mutation LoginUser($email: String! $password: String!) {
            login(email: $email password: $password)
          }`,
        variables,
    };

    return next();
}

function storeToken(requestParams, response, context, ee, next) {
    if (response.body.data && response.body.data.login) {
        context.vars["AUTH_TOKEN"] = response.body.data.login;
    }

    return next();
}

function log(requestParams, response, context, ee, next) {
    console.log(response.body);
    return next();
}

module.exports = {
    log,
    sendMessage,
    getMessages,
    getUser,
    login,
    storeToken,
};
