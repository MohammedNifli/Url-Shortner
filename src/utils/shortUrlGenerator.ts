import {nanoid} from "nanoid";



 const generateShortUrl=(customAlias?:string)=>{
    const BASE_DOMAIN=process.env.BASE_DOMAIN;

    
    const alias=customAlias || nanoid(8)
  
    return `${BASE_DOMAIN}/${alias}`;

}

export default generateShortUrl;