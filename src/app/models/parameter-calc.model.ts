export interface ParameterCalc {
  id: string;
  materials: Array<Materials>;
}
export interface Materials {
  id: number;
  q4: number;
  q3: number;
  slagCarbon: number;
  slagAmount: number;
  fuelConsumption: number;
  dicMaterialName: string;
  paramCalcUnitId: number;
  paramCalcUnitName: string;
}
