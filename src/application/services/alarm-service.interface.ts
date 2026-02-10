import {ICloudwatchAlarm } from '../../domain/models/cloudwatch-alarm.interface';

export interface IAlarmService {
  persistAlarm(alarm: ICloudwatchAlarm);
  getAlarms(): Promise<any>;
}
