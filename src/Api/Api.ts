import { RequestHandler,Response,Request } from 'express';
import express = require('express');

export class Api {
    static handPostApi(fnc: Function) {
        return async function (req:Request, res:Response){
            try {
                res.json(await fnc(req.body))
                res.end()
            }
            catch (e) {
                res.json({
                    isSucc: false,
                    errMsg: e.message
                })
                res.end()
            }
        }
    }
}
