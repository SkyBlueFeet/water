import { VNode, CreateElement } from "vue/types/umd";
import { Vue } from "vue-property-decorator";
export default class VListItem extends Vue {
    name: string;
    list: Record<string, string>[];
    render(h: CreateElement): VNode;
}
