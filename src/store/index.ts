import Vue from "vue";
import Vuex, { Store } from "vuex";
import user from "./moudels/user.moudels";

Vue.use(Vuex);

export function createStore(): Store<unknown> {
    return new Vuex.Store({
        modules: {
            user
        }
    });
}
