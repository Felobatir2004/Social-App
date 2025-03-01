

export const validation = async (Schema,args) =>{

        const results = Schema.validate(data, {abortEarly:false})
        if(results.error){
            throw new Error(results.error)
        }
        return true
    
}