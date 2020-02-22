export enum Identity {
    USER = "USER",
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    ROOT = "ROOT"
}

export enum OrderStatus {
    COMPLETED = "订单已完成",
    MISSED = "未接单",
    FINISHING = "订单正在进行"
}

export enum OrderType {
    FIRST = "一类订单",
    SECOND = "二类订单"
}

export interface User {
    uid: string;
    uidentity: Identity;
    uname?: string;
    uaccount: string;
    utel?: string;
    upwd: string;
    udate?: string;
    uemail?: string;
    uvip?: number;
    uaddress?: string;
    uavatar?: string;
}

export interface Order {
    oid: string;
    odate?: string;
    uid: string;
    ohandler: string;
    otype: OrderType;
    ostatus: OrderStatus;
    olocation: string;
    oremark?: string;
    omessage: string;
    otel: string;
}

export interface Product {
    pid: string;
    title?: string;
    description: string;
    price: string;
    stock: number;
    specification: string;
    remark: string;
    banner: string;
}

export interface OrderRecord {
    oid: string;
    odate?: string;
    olocation: string;
    omessage: string;
    oremark: string;
    ostatus: string;
    membername?: string;
    mid?: string;
    membertel: string;
    username: string;
    uid: string;
    usertel: string;
}
