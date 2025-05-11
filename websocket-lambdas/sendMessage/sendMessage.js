const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {


  let body = JSON.parse(event.body);

  const { Name, StartedLearningDate, AbilityRating } = body;


  await ddb.put({
    TableName: "Languages",
    Item: { Name, StartedLearningDate, AbilityRating }
  }).promise();



  try {
    await apigw.postToConnection({
      ConnectionId: event.requestContext.messageId,
      Data: body
    }).promise();
  } catch (err) {
    if (err.statusCode === 410) {
      await ddb.delete({
        TableName: "WebSocketConnections",
        Key: { connectionId }
      }).promise();
    }
  }




  return { statusCode: 200, data: event };
};
