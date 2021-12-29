export interface PlantModel {
  id?: number;
  namePlant: string;
  inactive: boolean;
  address: string;
  oblastId: number;
  regionId: number;
  subRegionId: number;
  villageId: number;
  userId: number;
  oblastName: string;
  regionName: string;
  subRegionName: string;
  villageName: string;
  lat: number;
  lng: number;
  coords: string;
}
