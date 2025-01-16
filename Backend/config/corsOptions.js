import allowedOrigins from './allowedOrigins.js'

const corsOptions= {
    origin: (origin , Callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 ){
            Callback(null , true) ;
        } else {
            Callback(new Error (" not allowed by CORS "))
        }
    },

    Credentials : true ,
    optionsSuccessStatus : 200 ,
}

export default corsOptions ; 