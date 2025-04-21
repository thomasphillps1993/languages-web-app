const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const domainName = event.requestContext.domainName;
  const stage = event.requestContext.stage;

  // Store the connection ID in DynamoDB
  await ddb.put({
    TableName: "WebSocketConnections",
    Item: { connectionId }
  }).promise();

  // Prepare to send message back to the client
  const apiGateway = new AWS.ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`
  });

  const message = {
    action: "register",
    connectionId: connectionId
  };

  await apiGateway.postToConnection({
    ConnectionId: connectionId,
    Data: JSON.stringify(message)
  }).promise();

  return { statusCode: 200 };
};
