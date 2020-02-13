import Vue from "vue";
export default class DetailView extends Vue {
    title: string;
    asyncData({ store }: {
        store: any;
    }): any;
}
