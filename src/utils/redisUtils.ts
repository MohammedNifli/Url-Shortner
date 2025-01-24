import client from "../config/redisConfig.js";

const set = async (key: string, value: string) => {
  try {
    if (key && value) {
      await client.set(key, value);
      console.log(`Key "${key}" has been stored in Redis with value: "${value}"`);
    }
  } catch (error) {
    console.error("Error setting key in redis", error);
  }
};

const get=async(key:string)=>{
    try{
        const value=await client.get(key);
        if(value==null){
            return null
        }
        console.log(`Key "${key}" retrieved from Redis with value: "${value}"`);
        return value;

    }catch(error){
        console.error(error)
    }
}


export {set,get}