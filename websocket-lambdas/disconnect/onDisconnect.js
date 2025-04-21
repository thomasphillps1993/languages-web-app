const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  await ddb.delete({
    TableName: "WebSocketConnections",
    Key: { connectionId }
  }).promise();

  return { statusCode: 200 };
};
