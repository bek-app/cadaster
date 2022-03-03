export interface ReportPlanModel {
  id?: number
  periodicity: string
  deviations: string
  reasons: string
  note: string
  reportId?: number
  plantProcessId: number
  plantProcessName: string
}
