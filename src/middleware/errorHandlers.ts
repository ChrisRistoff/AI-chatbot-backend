import { NextFunction, Request, Response } from "express";

interface SQLError extends Error {
    code?: string
}

interface CustomSQLError {
    errCode: number,
    errMsg: string,
}

export function sqlErrors(err: SQLError, _: Request, res: Response, next: NextFunction): void {
    switch (err.code) {
        case ("22P02"):
            res.status(400).send({ msg: "Invalid input" });
            break;
        case ("23503"):
            res.status(400).send({ msg: "Bad request" });
            break;
        case ("23505"):
            res.status(409).send({ msg: "Already exists" });
            break;
        case "23502":
            res.status(400).send({ msg: "Not null violation" });
            break;
        case "42703":
            res.status(400).send({ msg: "Undefined column" });
            break;
        case "42P01":
            res.status(400).send({ msg: "Undefined table" });
            break;
        case "22001":
            res.status(400).send({ msg: "String data right truncation" });
            break;
        case "22003":
            res.status(400).send({ msg: "Numeric value out of range" });
            break;
        case "40001":
            res.status(409).send({ msg: "Serialization failure (possible deadlock)" });
            break;
        default:
            next(err);
    }
};

export function customErrors(err: CustomSQLError, _req: Request, res: Response, next: NextFunction): void {
    if (err.errCode) {
        res.status(err.errCode).send({ msg: err.errMsg });
    } else {
        next(err);
    }
};

export function serverError(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
};
