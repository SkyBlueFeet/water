<template>
    <div class="detail">
        <div v-for="(image, index) in $store.state.user.images" :key="index">
            <img :src="image" class="detail-image" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class DetailView extends Vue {
    title = "SaoirseRonan";
    asyncData({ store }) {
        return store.dispatch("user/getImages");
    }
}
</script>

<style lang="less" scoped>
.detail {
    padding: 60px 460px;
    width: 100%;
    box-sizing: border-box;

    &-image {
        width: 100%;
        margin-bottom: 100px;
    }
}
</style>
