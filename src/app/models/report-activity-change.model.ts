export interface ReportActivityChangeModel {
  id?: number
  reportId?: number
  rootActivityId: number
  rootActivityName: string
  changeData: string
  note: string
}
