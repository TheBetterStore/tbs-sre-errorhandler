import {inject, injectable} from "inversify";
import TYPES from "../../infrastructure/types";
import {IAlarmService} from "./alarm-service.interface";
import {ICloudwatchAlarm} from "../../domain/models/cloudwatch-alarm.interface";
import { IAwsDynamoDBClient } from '../../infrastructure/interfaces/aws-dynamodb-client.interface';
import {GetCommandInput, PutCommandInput, ScanCommandInput} from '@aws-sdk/lib-dynamodb';

@injectable()
export class AlarmService implements IAlarmService {

  private alarmPriorityThreshold = 4;

  constructor(@inject(TYPES.IAwsDynamoDBClient) private ddbClient: IAwsDynamoDBClient,
              @inject(TYPES.AlarmTableName) private alarmTableName: string,
              @inject(TYPES.EnrichedErrorSNSTopicArn) private enrichedErrorSNSTopicArn: string,
              @inject(TYPES.AlarmPriorityThreshold) alarmPriorityThreshold: string) {
    this.alarmPriorityThreshold = Number(alarmPriorityThreshold);
  }

  async persistAlarm(a: ICloudwatchAlarm) {

    // Does alarm already exist? If so, then enrich content and send, else add.

    const getParams: GetCommandInput = {
      TableName: this.alarmTableName,
      Key: {
        alarmName: a.AlarmName
      },
    }

    const getRes = await this.ddbClient.get(getParams);
    const existingAlarm = getRes.Item as ICloudwatchAlarm || undefined;
    if(existingAlarm) {
      a.AlarmDescription = existingAlarm.AlarmDescription;
      a.Priority = existingAlarm.Priority;
      a.Remediation = existingAlarm.Remediation;
    }
    else {
      const tokens = a.AlarmName.split('-');
      const applicationName = tokens.slice(0, -3).join('-');

      const dto = {
        alarmName: a.AlarmName,
        alarmArn: a.AlarmArn,
        application: applicationName,
        alarmDescription: a.AlarmDescription,
        priority: 0,
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
    }

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
