import Main from "./list-item.vue";
import { VueConstructor } from "vue/types/umd";

Main["install"] = function(Vue: VueConstructor): void {
    Vue.component(Main.name, Main);
};

export default Main;
