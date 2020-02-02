import VList from "./components/list";
import VListItem from "./components/list-item";
import { VueConstructor } from "vue/types/umd";

const components = [VList, VListItem];

const install: any = function(Vue: VueConstructor<Vue>) {
    if (install.installed) return;
    components.map(component => Vue.component(component.name, component));
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    VList,
    VListItem
};
