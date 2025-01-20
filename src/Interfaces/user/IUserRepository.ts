import {IUser} from '../../models/userModel'

export interface IUserRepository{
    register(name:string,email:string,password:string):Promise<IUser | null>
    findUserByEmail(email: string): Promise<IUser | null>

}