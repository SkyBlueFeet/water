declare const user: {
    namespaced: boolean;
    state: {
        images: any[];
    };
    getters: {};
    mutations: {
        setImages(state: any, images: any): void;
    };
    actions: {
        getImages({ commit }: {
            commit: any;
        }): void;
    };
};
export default user;
