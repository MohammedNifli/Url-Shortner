import { error } from "console";
import { IUserRepository } from "../Interfaces/user/IUserRepository";
import User,{IUser} from "../models/userModel.js";

class UserRepository implements IUserRepository{

    public async register(name:string,email:string,password:string):Promise<IUser | null>{
        try{
            const userData=await User.create({
                name:name,
                email:email,
                password:password
        })

            return userData

        }catch(error){
            throw error;
        }

    }

    public async findUserByEmail(email: string): Promise<IUser | null> {
        try {
        
          const existingUser = await User.findOne({ email });
    
          return existingUser;
        } catch (error:any) {
          throw new Error(`Error finding user by email: ${error.message}`);
        }
      }
}

export default UserRepository;