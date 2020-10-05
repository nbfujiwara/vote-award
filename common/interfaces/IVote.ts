import {IUser} from "./IUser"

export interface IVote {
  user: IUser
  nominateId: number | null
  multiVote: { [key: string]: number; }
}
