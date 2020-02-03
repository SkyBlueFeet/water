<script lang="tsx">
import { formatDate } from "../../utils/util";
import { VNode, VueConstructor, CreateElement } from "vue/types/umd";
import { Vue, Prop, Component } from "vue-property-decorator";
import "./test1.scss";

interface ListItem {
    title: string;
    url: string;
}

type List = ListItem[];

@Component({})
export default class VListItem extends Vue {
    name = "v-list-item";

    // 渲染列表
    //
    @Prop({
        // []
        default: [],
        required: true,
        type: Array
    })
    list: List;

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
</script>
<style lang="scss">
@import "./test.scss";
.v-list-item {
    color: aqua;
    &:hover {
        color: blueviolet;
    }
}
</style>
