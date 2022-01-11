export interface ActualEmissionModel {
  id: number;
  carbonDioxide: number;
  methaneEmissionsTon: number;
  methaneEmissionsCo2: number;
  nitrousOxideTon: number;
  nitrousOxideCo2: number;
  perfluorocarbonTon: number;
  perfluorocarbonCo2: number;
  totalTon: number;
  totalCo2: number;
  processName: string;
  plantProcessMaterialId: number;
  reportId: number;
  materials: Array<MaterialsModel>;
}
export interface MaterialsModel {
  id: number;
  carbonDioxide: number;
  methaneEmissionsTon: number;
  methaneEmissionsCo2: number;
  nitrousOxideTon: number;
  nitrousOxideCo2: number;
  perfluorocarbonTon: number;
  perfluorocarbonCo2: number;
  dicMaterialName: string;
}
