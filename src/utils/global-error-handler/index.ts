import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";


export const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message, errorDetails: err.errorDetails })
}