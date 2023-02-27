import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { deadline, title } = JSON.parse(event.body) as ICreateTodo;
  const { userid } = event.pathParameters;
  
  // const response = await document.query({
  //   TableName: "todos",
  //   KeyConditionExpression: "id = :id",
  //   ExpressionAttributeValues: {
  //     ":id": id
  //   }
  // }).promise();
  
  // const userAlreadyExists = await response.Items[0];
  
  // if (!userAlreadyExists) {
  const result = await document.put({
    TableName: "todos",
    Item: {
      id: uuidV4(),
      user_id: userid,
      title,
      done: false,
      deadline: new Date(deadline).getTime()
    }
  }).promise();
  // }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "TODO criado com sucesso!",
      result
    }),
  }
}