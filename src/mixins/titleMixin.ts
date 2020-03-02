import { Vue } from "vue-property-decorator";
function getTitle(vm: Vue): string {
    const title = vm.$options["title"];
    return title && typeof title === "function" ? title.call(vm) : title;
}

const serverTitleMixin = {
    created(): void {
        const title = getTitle(this);
        if (title) this.$ssrContext.title = `${title}`;
    }
};

const clientTitleMixin = {
    mounted(): void {
        const title = getTitle(this);
        if (title && document) document.title = `${title}`;
    }
};

export default process.env.VUE_ENV === "server"
    ? serverTitleMixin
    : clientTitleMixin;
