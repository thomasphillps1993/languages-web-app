const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received connect event:", JSON.stringify(event, null, 2));

  // Extract the connectionId from the event
  const connectionId = event.requestContext.connectionId;
  const user = event.queryStringParameters.user;
  console.log("user:", user);

  // Save the connectionId to DynamoDB
  try {
    await ddb.put({
      TableName: "WebSocketConnections",  // DynamoDB table name
      Item: { connectionId, user }
    }).promise();

    // Respond with 200 status code to acknowledge the connection
    return {
      statusCode: 200,
      body: JSON.stringify({ action: "connected", data:connectionId })
    };
  } catch (error) {
    console.error("Error storing connectionId in DynamoDB:", error);
    return { statusCode: 500, body: "Failed to store connectionId" };
  }
};
