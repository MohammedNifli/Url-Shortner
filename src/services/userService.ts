
import { IUserService } from "../Interfaces/user/IUserService";
import { IUserRepository } from "../Interfaces/user/IUserRepository";
import {IUser} from '../models/userModel'
import bcrypt from 'bcryptjs'
import { generateAccessToken } from "../utils/jwtUtils.js";

class UserService implements IUserService{
    private userRepository:IUserRepository
    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository

    }

    public async register(name:string,email:string,password:string):Promise<IUser | null>{
        try{
            const hashedPassword = await bcrypt.hash(password, 10);

            
            const userData=await this.userRepository.register(name,email,hashedPassword)
            return userData

        }catch(error){
            throw error
        }
    }

    public async findUserByEmail(email: string): Promise<IUser | null> {
        try {
        
          const existingUser = await this.userRepository.findUserByEmail(email);
          
          return existingUser;
        } catch (error:any) {
          throw new Error(`Service error: ${error.message}`);
        }
      }

      public async Login(email: string, password: string): Promise<any> {
        try {
         
          const user = await this.userRepository.findUserByEmail(email);
    
          if (!user) {
            throw new Error('User not found');
          }
    
        
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error('Invalid password');
          }

        
    
         
          const token = generateAccessToken(user._id.toString());
          console.log("'ttotoot",token)
    
          return { user, token }; 
        } catch (error:any) {
          throw new Error(error.message);
        }
      }
}

export default UserService