const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { Name, StartedLearningDate, AbilityRating } = event;
  await ddb.put({
    TableName: "Languages",
    Item: { Name, StartedLearningDate, AbilityRating }
  }).promise();

  return { statusCode: 200, data:event };
};
