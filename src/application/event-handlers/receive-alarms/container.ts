import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import { IAlarmService } from '../../services/alarm-service.interface';
import { AlarmService } from '../../services/alarm-service';
import {AwsDynamoDBClient} from "../../../infrastructure/adapters/aws/aws-dynamodb-client";
import {IAwsDynamoDBClient} from "../../../infrastructure/interfaces/aws-dynamodb-client.interface";

const container = new Container();

container.bind<IAlarmService>(TYPES.IAlarmService).to(AlarmService).inSingletonScope();
container.bind<IAwsDynamoDBClient>(TYPES.IAwsDynamoDBClient).to(AwsDynamoDBClient).inSingletonScope();
container.bind<string>(TYPES.AlarmTableName).toConstantValue(process.env.DDB_ALARM_TABLE_NAME || '');
container.bind<string>(TYPES.AlarmPriorityThreshold).toConstantValue(process.env.ALARM_PRIORITY_THRESHOLD || '4');
container.bind<string>(TYPES.EnrichedErrorSNSTopicArn).toConstantValue(process.env.ENRICHED_ERROR_SNS_TOPIC_ARN || '');
export default container;
