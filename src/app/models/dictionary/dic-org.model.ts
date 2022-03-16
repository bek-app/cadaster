export interface DicOrganization {
    id: number,
    discriminator: string,
    orgName: string,
    bin: string,
    address: string,
    contactInfo: string,
    email: string,
    certificateInfo: string,
    webSite: string,
    oblastId: number,
    regionId: number,
    subRegionId: number,
    villageId: number,
    userId: string,
    oblastName: string,
    regionName: string,
    subRegionName: string,
    villageName: string,
    note: string
}