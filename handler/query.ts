import mysql, { PoolConnection } from "mysql";
import databaseConfig from "../mysql/db.config";

export type OperateResult = {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
};

export type queryType = "QUERY" | "OPERATE";

export type QueryResult<T> = {
    results: T;
    fields: mysql.FieldInfo[];
};

let pool = mysql.createPool(databaseConfig);

/**
 * @description 从连接池获取连接，如果连接池对象被释放，则重新创建
 */
export function getConn(): Promise<PoolConnection> {
    if (!pool) pool = mysql.createPool(databaseConfig);

    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, conn) {
            if (err) reject(err);
            resolve(conn);
        });
    });
}

export function releaseConn(conn: PoolConnection): void {
    conn.end();
}

export function query<T>(
    conn: PoolConnection,
    sql: string
): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, results, fields) => {
            if (err) reject(err);
            resolve({
                results,
                fields
            });
            conn.release();
        });
    });
}

export default function simpleQuery<T>(
    sql: string,
    queryType?: "QUERY"
): Promise<QueryResult<T[]>>;
export default function simpleQuery<T>(
    sql: string,
    queryType: "OPERATE"
): Promise<QueryResult<OperateResult>>;
export default async function simpleQuery<T>(
    sql: string
): Promise<QueryResult<OperateResult | T[]>> {
    //从连接池获取连接
    return query(await getConn(), sql);
}
