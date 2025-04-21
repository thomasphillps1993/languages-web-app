const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;

  const apigw = new AWS.ApiGatewayManagementApi({
    endpoint: `${domain}/${stage}`
  });

  const body = JSON.parse(event.body);
  const { Name, StartedLearningDate, AbilityRating } = body;

  await ddb.put({
    TableName: "Languages",
    Item: { Name, StartedLearningDate, AbilityRating }
  }).promise();

  const connections = await ddb.scan({ TableName: "WebSocketConnections" }).promise();

  const message = JSON.stringify({
    type: "new_language",
    Name,
    StartedLearningDate,
    AbilityRating
  });

  const sendMessages = connections.Items.map(async ({ connectionId }) => {
    try {
      await apigw.postToConnection({
        ConnectionId: connectionId,
        Data: message
      }).promise();
    } catch (err) {
      if (err.statusCode === 410) {
        await ddb.delete({
          TableName: "WebSocketConnections",
          Key: { connectionId }
        }).promise();
      }
    }
  });

  await Promise.all(sendMessages);

  return { statusCode: 200 };
};
