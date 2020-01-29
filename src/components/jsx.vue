<script lang="jsx">
export default {
  data() {
    return {
      msg: "测试JSX"
    };
  },
  created(){

  },
  render(h){
    return <h1>{`消息：${this.msg}`}</h1>
  }
};
</script>
