export interface ParameterKoefModel {
  id: string;
  processName: string;
  materials: [
    {
      id: number;

      dicUnitId: number;
      dicUnitName: string;
      koefVolume: number;

      koefOperatingWeight: number;
      koefOperatingWeightUnitId: number;
      koefOperatingWeightUnitName: string;

      koefLowerCalorific: number;
      koefLowerCalorificUnitId: number;
      koefLowerCalorificUnitName: string;

      koefCaseBurning: number;
      koefCaseBurningUnitId: number;
      koefCaseBurningUnitName: string;

      koefCo2: number;
      koefCo2UnitId: number;
      koefCo2UnitName: string;

      koefCh4: number;
      koefCh4UnitId: number;
      koefCh4UnitName: string;

      koefN2O: number;
      koefN2OUnitId: number;
      koefN2OUnitName: string;

      koefPerfluorocarbons: number;
      koefPerfluorocarbonsUnitId: number;
      koefPerfluorocarbonsUnitName: string;

      dicMaterialName: string;
    }
  ];
}
