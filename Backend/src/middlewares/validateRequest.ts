import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AnyZodObject } from "zod/v3";

export const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: console.log("error", error)
            });
            return;
        }
        res.status(500).json({
            message: "Internal server error"
        });
    }
}