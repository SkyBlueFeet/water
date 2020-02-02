import { VNode, CreateElement } from "vue/types/umd";
import { Vue } from "vue-property-decorator";
export default class VList extends Vue {
    name: string;
    date: string;
    render(h: CreateElement): VNode;
}
