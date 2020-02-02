import { formatDate } from "../../utils/util";
import { VNode, VueConstructor, CreateElement } from "vue/types/umd";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({})
export default class VListItem extends Vue {
    name = "v-list-item";
    @Prop() list: Record<string, string>[];

    render(h: CreateElement): VNode {
        return (
            <div>
                {this.list.map(item => (
                    <a class="v-list-item" href={item.url}>
                        {item.title}
                    </a>
                ))}
            </div>
        );
    }
}
