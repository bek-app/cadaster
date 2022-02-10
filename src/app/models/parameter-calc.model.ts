export interface ParameterCalc {
  id: string
  processName: string
  materials: Array<Materials>
  processes: Array<Processes>
}
export interface Materials {
  id: number
  q4: number
  q3: number
  slagCarbon: number
  slagAmount: number
  fuelConsumption: number
  dicMaterialName: string
  paramCalcUnitId: number
  paramCalcUnitName: string
}
export interface Processes {
  id: number
  discriminator: string
  q4: number
  q3: number
  slagCarbon: number
  slagAmount: number
  fuelConsumption: number
  dicMaterialName: string
  paramCalcUnitId: number
  paramCalcUnitName: string
}
