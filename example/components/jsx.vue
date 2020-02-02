<script lang="jsx">
export default {
  data() {
    return {
      msg: "测试JSX",
      testList:[{title:"Hello"},{title:"World"},{title:"!"}]
    };
  },
  created(){

  },
  render(h){
    return <div><v-list-item list={ this.testList }></v-list-item> <h1>{`消息：${this.msg}`}</h1> <v-list>默认插槽</v-list></div>
  }
};
</script>
