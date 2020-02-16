import mysql, { PoolConnection } from "mysql";
import databaseConfig from "../mysql/db.config";

export type QueryResult<T> = {
    results: T[];
    fields: mysql.FieldInfo[];
};

const pool = mysql.createPool(databaseConfig);

export function simpleQuery<T>(sql: string): Promise<QueryResult<T>> {
    return new Promise<QueryResult<T>>((resolve, reject) => {
        pool.getConnection(function(err, conn) {
            if (err) reject(err);
            conn.query(sql, function(err, results, fields) {
                if (err) reject(err);
                resolve({
                    results,
                    fields
                });
                conn.release(); // 释放链接
            });
        });
    });
}

export function getConn(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, conn) {
            if (err) reject(err);
            resolve(conn);
        });
    });
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

export function releaseConn(conn: PoolConnection): void {
    conn.end();
}
