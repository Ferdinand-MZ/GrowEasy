import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["userId"], // Track Based dari userId di Clerk
    rules:[
        tokenBucket({
            mode:"LIVE",
            refillRate:10, // 10 request per jam
            interval: 3600, // 1 jam
            capacity: 10, // Maksimal 10 request per jam
        })
    ]
})

export default aj;