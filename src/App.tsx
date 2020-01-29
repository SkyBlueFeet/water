import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import README from "@root//README.md";
import logo from "@root/logo.png";
import "@src/assets/css/app.css";

@Component
export default class App extends Vue {
  created(): void {
    this.$$store.state.user.info.data = "sky blue";
    console.log(_.cloneDeep(this.$$store.state.user.info));
    console.log(README);
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
