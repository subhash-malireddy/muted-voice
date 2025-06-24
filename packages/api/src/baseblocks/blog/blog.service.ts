import { Blog } from '@baseline/types/blog';
import { getDynamodbConnection } from '@baselinejs/dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection({
  region: `${process.env.API_REGION}`,
});

export const blogService = new ServiceObject<Blog>({
  dynamoDb: dynamoDb,
  objectName: 'Blog',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-blog`,
  primaryKey: 'blogId',
});
