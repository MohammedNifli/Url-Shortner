import UserController from "../controllers/userController.js";
import UserService from "../services/userService.js";
import UserRepository from "../repositories/userRepository.js";
import passport from "passport";
import session from 'express-session'


import {Router} from 'express'

const userRoute=Router()

const userRepository=new UserRepository();
const userService=new UserService(userRepository)
const userController=new UserController(userService)


userRoute.use(passport.initialize())
userRoute.use(passport.session())
userRoute.get('/auth/google',passport.authenticate('google-user',{scope:['email','profile']}));
userRoute.get('/auth/google/callback',
    passport.authenticate('google-user', {
        successRedirect: '/user/google/success',
        failureRedirect: '/google/failure'
    }))

    userRoute.get('/google/success', (req, res) => {
        console.log('Google Sign-in success');
        userController.googleSignUp(req, res);
    });


userRoute.post('/register',userController.register.bind(userController))
userRoute.post('/login',userController.Login.bind(userController))
export default userRoute;