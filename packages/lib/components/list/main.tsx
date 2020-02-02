import { formatDate } from "../../utils/util";
import { VNode, CreateElement } from "vue/types/umd";
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class VList extends Vue {
    name = "v-list";
    date = formatDate(new Date());
    render(h: CreateElement): VNode {
        return (
            <div class="v-list">
                {this.$slots.default}
                <div class="v-list-date">
                    <div class="v-list-date-label">当前时间：</div>
                    <div class="v-list-date-text">{this.date}</div>
                </div>
            </div>
        );
    }
}
