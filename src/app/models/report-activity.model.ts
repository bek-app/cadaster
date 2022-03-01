export interface ReportActivityModel {
  id: number
  activityName: string
  children: Array<Children>
}

interface Children {
  id: number
  rootActivityId: number
  rootActivityName: string
  activityId: number
  activityName: string
  dicUnitId: number
  dicUnitName: string
  plantId: number
  countVolume: number
}
