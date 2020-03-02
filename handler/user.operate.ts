import { NextFunction } from "express";
import { select } from "./create.sql";
import { User } from "../mysql/types";
import { handleQuery } from "./error";
import query from "./query";

export default async function(uid: string, next: NextFunction): Promise<User> {
    const getUser = select<User>("user", { uid: uid });
    const { results } = await handleQuery(next, query<User>(getUser));

    return results[0];
}
