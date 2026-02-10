import {inject, injectable} from "inversify";
import TYPES from "../../infrastructure/types";
import {IAlarmService} from "./alarm-service.interface";
import {ICloudwatchAlarm} from "../../domain/models/cloudwatch-alarm.interface";
import { IAwsDynamoDBClient } from '../../infrastructure/interfaces/aws-dynamodb-client.interface';
import {PutCommandInput, ScanCommandInput} from '@aws-sdk/lib-dynamodb';

@injectable()
export class AlarmService implements IAlarmService {

  constructor(@inject(TYPES.IAwsDynamoDBClient) private ddbClient: IAwsDynamoDBClient,
              @inject(TYPES.AlarmTableName) private alarmTableName: string) {

  }

  async persistAlarm(a: ICloudwatchAlarm) {

    const tokens = a.AlarmName.split('-');
    const applicationName = tokens.slice(0, -3).join('-');

    const dto = {
      alarmName: a.AlarmName,
      alarmArn: a.AlarmArn,
      application: applicationName,
      alarmDescription: a.AlarmDescription,
      trigger:
        {
          metricName: a.Trigger.MetricName,
          namespace: a.Trigger.Namespace,
          statistic: a.Trigger.Statistic,
          comparisonOperator: a.Trigger.ComparisonOperator,
          threshold: a.Trigger.Threshold,
          dimensions: a.Trigger.Dimensions
        }
    };

    console.info('payload', dto);

    const params: PutCommandInput = {
      TableName: this.alarmTableName,
      Item: dto,
      ReturnValues: 'ALL_OLD',
    };

    const res = await this.ddbClient.put(params);
    return res;

  };

  async getAlarms(): Promise<any> {

    console.info('Getting all alarms');

    const params: ScanCommandInput = {
      TableName: this.alarmTableName
    };

    const res = await this.ddbClient.scan(params);
    return res;

  };
}
