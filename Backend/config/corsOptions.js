import allowedOrigins from './allowedOrigins.js'

const corsOptions = {
    origin: (origin, Callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            Callback(null, true);
        } else {
            Callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}

export default corsOptions; 