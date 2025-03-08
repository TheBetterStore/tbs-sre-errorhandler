import {IDlqErrorService} from "./dlqerror-service.interface";
import {SQSRecord} from "aws-lambda";

export class DlqErrorService implements IDlqErrorService {
  persistError(rec: SQSRecord) {
    const srcTokens = rec.eventSourceARN.split(':')
    const dlqName = srcTokens[5];

    console.debug(rec.body);
    console.debug('MessageId', rec.messageId);
    console.debug('Source', rec.eventSourceARN);
    console.debug('DlqNAme', dlqName);
    console.debug('Attributes', JSON.stringify(rec.attributes));
    console.debug('MessageAttributes', JSON.stringify(rec.messageAttributes));

    const requestId = rec.messageAttributes.RequestID?.stringValue;
    const errorCode = rec.messageAttributes.ErrorCode?.stringValue;
    const errorMessage = rec.messageAttributes.ErrorMessage?.stringValue;

    console.info(`Message details - requestId: ${requestId}, errorCode: ${errorCode}, errorMessage: ${errorMessage}`);

    const msg = {
      messageId: rec.messageId,
      sourceDlq: dlqName,
      requestId: requestId,
      errorCode: errorCode,
      errorMessage: errorMessage,
      payload: JSON.stringify(rec)
    };

    console.info('payload', msg);
    console.log('Pending implementation');
  };
}