import {IUser} from '../../models/userModel'

export interface IUserService{
    register(name:string,email:string,password:string):Promise<IUser | null>
    findUserByEmail(email: string): Promise<IUser | null>
    Login(email:string,password:string):Promise<any>
}