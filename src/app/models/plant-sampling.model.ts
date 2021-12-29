export interface PlantSamplingModel {
  id?: number;
  nameSampling: string;
  param: string;
  methodSampling: string;
  frequencySampling: string;
  periodTransmission: string;
  plantId?: number;
  materials: Array<number>;
  materialList?: string;
  materialNames?: string;
}
