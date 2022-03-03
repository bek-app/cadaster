export interface ReportCarbonUnitModel {
  id: number
  reportId: number
  report: number

  receivedFree: number
  receivedSale: number
  balance: number
  additionalPlan: number
  acquired: number
  acquiredPlan: number
  planingOffset: number
  alienated: number
  alienatedPlan: number
  transferred: number
  transferredPlan: number

  offReceivedFree: number
  offReceivedSale: number
  offBalance: number
  offAdditionalPlan: number
  offAcquired: number
  offAcquiredPlan: number
  offPlaningOffset: number
  offAlienated: number
  offAlienatedPlan: number
  offTransferred: number
  offTransferredPlan: number

  allReceivedFree: number
  allReceivedSale: number
  allBalance: number
  allAdditionalPlan: number
  allAcquired: number
  allAcquiredPlan: number
  allPlaningOffset: number
  allAlienated: number
  allAlienatedPlan: number
  allTransferred: number
  allTransferredPlan: number
}
