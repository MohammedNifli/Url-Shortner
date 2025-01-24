import   redis from 'redis';


const client=redis.createClient({
    url:'redis://localhost:6379'
})

client.connect()
.then(()=>console.log('connected to redis'))
.catch((err)=>console.error("Redis connection:",err))

export default client;