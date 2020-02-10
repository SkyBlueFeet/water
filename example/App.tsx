import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import README from "@root/README.md";
import logo from "@root/logo.png";
import "@example/assets/css/app.css";
import ejs from "./test.ejs";

@Component
export default class App extends Vue {
    created(): void {
        console.log(README);
        console.log(ejs());
    }
    render(h: CreateElement): VNode {
        return (
            <div id="app">
                <img src={logo} />
                <router-view />
            </div>
        );
    }
}
