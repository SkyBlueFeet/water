<script lang="tsx">
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class HomeView extends Vue {
    title = "SaoirseRonan";
    render(h) {
        return (
            <div class="home">
                <div class="home-images">
                    <img
                        class="home-images-cover1"
                        src="/public/images/SaoirseRonan1.jpg"
                    />
                </div>
                <router-link class="home-link" to="/detail">
                    MORE
                </router-link>
            </div>
        );
    }
}
</script>

<style lang="less" scoped>
.home {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    padding: 20px;
    padding-top: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background-color: #fff;

    &-images {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-bottom: 60px;

        &-cover1 {
            width: 600px;
            margin: 15px;
        }
    }

    &-link {
        display: block;
        font-size: 22px;
        font-weight: 600;
        text-decoration: none;
        color: #000;
        padding: 16px 70px;
        border: 1px solid #000;
        border-radius: 5px;
    }
}
</style>
