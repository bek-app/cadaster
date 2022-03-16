export interface CadasterReportModel {
  id?: number;
  kindId?: number;
  firstSendDate?: Date;
  reportYear: number;
  isSign: true;
  regNumber: string;
  signXml: string;
  statusId?: number;
  plantId: number;
  statusName: string;
  oblastName: string;
  regionName: string;
  namePlant: string;
  address: string;
}
