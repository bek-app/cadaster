export interface ReportCommentModel {
  id: number;
  note: string;
  recordId: string;
  controlId: string;
  controlValue: string;
  discriminator: string;
  isMark: boolean;
  isActive: boolean;
  reportId: number;
}
