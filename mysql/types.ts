export enum Identity {
    USER = "USER",
    MEMBER = "MEMBER",
    ADMIN = "ADMIN"
}

export type user = {
    uid?: string;
    uidentity?: Identity;
    uname: string;
    uaccount?: string;
    utel: string;
    upwd?: string;
    udate: string;
    uemail: string;
};
