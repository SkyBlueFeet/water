import VList from "./list.vue";
import { VueConstructor } from "vue";

VList["install"] = function(Vue: VueConstructor): void {
    Vue.component(VList.name, VList);
};

export default VList;
