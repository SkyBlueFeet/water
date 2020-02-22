import axios from "axios";

const user = {
    namespaced: true,

    state: {
        images: []
    },

    getters: {},

    mutations: {
        setImages(state, images): void {
            state.images = images;
        }
    },

    actions: {
        getImages({ commit }): void {
            const url = "http://127.0.0.1:7070/api/detail";

            axios.get(url).then(res => {
                const {
                    data: { data }
                } = res;
                commit("setImages", data);
            });
        }
    }
};

export default user;
