import {IDlqErrorService} from "./dlqerror-service.interface";

export class DlqErrorService implements IDlqErrorService {
  persistError(error: any) {
    console.log('Pending implementation');
  };
}