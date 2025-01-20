
import { Request,Response } from "express";
import { HttpStatusCode } from "../enums/httpStatus.js";
import { IUserService } from "../Interfaces/user/IUserService";
import { IUserController } from "../Interfaces/user/IUserController";


class UserController implements IUserController{
  private userService:IUserService;
    constructor(userService:IUserService){
        this.userService=userService

    }

    public async register(req: Request, res: Response): Promise<void> {
        console.log("hello world")
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
           res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Credentials are missing' });
           return
        }
    
        try {
            const existingUser = await this.userService.findUserByEmail(email);

            if (existingUser) {
               res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User with this email already exists' });
               return
            }
        
          
          const userData = await this.userService.register(name, email, password);
          
           res.status(HttpStatusCode.CREATED).json({
            message: 'User created successfully',
            userData: {
              id: userData?._id,
              name: userData?.name,
              email: userData?.email
            }
          });
          return
        } catch (error) {
           res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
          });
          return
        }
      }

      public async Login(req:Request,res:Response):Promise<void>{
        const {email,password}=req.body;
        if(!email ||!password){
            res.status(HttpStatusCode.BAD_REQUEST).json({message:'credentials are missing'})
        }
        try{

            const {user,token}=await this.userService.Login(email,password)
            
            res.cookie('access_token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 3600 * 1000, 
              sameSite: 'none', 
            });

            console.log("skjfsjbfi",req.cookies)
            
            res.status(HttpStatusCode.OK).json({message:"user loggedIn succesfully",user,token})

        }catch(error){
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Internal Server Error',
              });
              return

        }
      }
 
      public async googleLogin(req:Request,res:Response):Promise<void>{
        try{


        }catch(error){
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: error instanceof Error ? error.message : 'Internal Server Error',
          });
          return

        }

      }


      public async googleSignUp(req:Request,res:Response):Promise<any>{
        try{
         
         
      
        }catch(error){
          console.log(error)
        }
      }

     

}


export default UserController;