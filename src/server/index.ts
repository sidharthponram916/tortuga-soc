import { Nitro } from "nitropack";
import mongoose from 'mongoose'

export default async (_nitroApp: Nitro) => {
    try { 
        await mongoose.connect(useRuntimeConfig().dbURI);
        console.log("Connected to MongoDB server!") 
    }
    catch (e) {   
        console.error(e); 
    }
};