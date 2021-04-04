import { Dayjs } from 'dayjs'
import { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface IEvent {
  start: Dayjs
  end: Dayjs
  summary: string
  id: string
}
