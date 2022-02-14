export interface ParameterGasModel {
  id: string
  processName: string
  processes: Array<Processes>
  materials: Array<Materials>
}
interface Materials {
  id: number
  gasCh4: number
  gasN2O: number
  gasProcО2: number
  gasKoeffFuelNature: number
  gasWeightN2O: number
  gasWeightCh4: number
  gasCh4UnitId: number
  gasN2OUnitId: number
  gasCh4UnitName: string
  gasN2OUnitName: string
  dicMaterialName: string
}
interface Processes {
  id: number
  discriminator: string
  gasCh4: number
  gasN2O: number
  gasProcО2: number
  gasKoeffFuelNature: number
  gasWeightN2O: number
  gasWeightCh4: number
  gasCh4UnitId: number
  gasN2OUnitId: number
  gasCh4UnitName: string
  gasN2OUnitName: string
  dicMaterialName: string
}
