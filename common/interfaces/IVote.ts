import {IUser} from "./IUser"

export interface IVote {
  user: IUser
  nominateId: number | null
}
