class ToThis {
    text: string;
    constructor(parameters: string) {
        this.text = parameters;
    }

    static test(): any {
        return new this("hello World");
    }
}

console.log(ToThis.test().text);

console.log(["/", "/user/login"].includes("/user/login"));
