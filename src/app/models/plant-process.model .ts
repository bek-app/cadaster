export interface PlantProcessModel {
  id: number;
  plantId: number;
  oddsLevel: string;
  amountConsumed: string;
  calculatingCalorific: string;
  calculatingConversion: string;
  calculatingCarbon: string;

  materials: Array<number>,
  materialList: string,
  materialNames: string,

  dicProcessId: number;
  processName: string,
  isMaterial:boolean
  subProccesses: Array<number>,
  subProccessList: string,
  subProccessNames: string
}
