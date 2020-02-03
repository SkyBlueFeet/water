import { VNode, CreateElement } from "vue/types/umd";
import { Vue } from "vue-property-decorator";
import tsxHelp from "vue-tsx-support";
declare const VList_base: tsxHelp.TsxComponent<Vue, unknown, {}, {}, {}>;
export default class VList extends VList_base {
    name: string;
    date: string;
    render(h: CreateElement): VNode;
}
export {};
