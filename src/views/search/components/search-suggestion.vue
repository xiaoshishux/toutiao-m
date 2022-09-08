<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] //联想建议数据列表
    };
  },
  computed: {},
  watch: {
    // 属性名：要监视的数据的名称
    // searchText() {
    //   console.log("hahah");
    // }
    //监视的完整写法
    searchText: {
      // 当数据发生变化则会执行 handler 处理函数
      /**
       * bebounce 函数
       * 参数1：函数
       * 参数2: 时间
       * 返回值：防抖处理的函数
       */
      handler: debounce(async function() {
        /**
         * 找到数据接口
         * 请求获取数据
         * 模板绑定展示
         */
        const { data } = await getSearchSuggestions(this.searchText);
        // console.log(data);
        this.suggestions = data.data.options;
      }, 200),
      immediate: true //该回调将会在侦听开始之后被立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    /**
     *  a /a/gi、vue /vue/gi
     * 正则表达式 /中间内容/ 都会当作正则匹配模式字符来对待
     * RegExp 是正则表达式的构造函数
     * 参数1：字符串
     * 参数2：匹配模式
     * 返回值：正则表达式
     */
    highlight(str) {
      return str.replace(
        new RegExp(this.searchText, "gi"),
        `<span style='color:red'>${this.searchText}</span>`
      );
    }
  }
};
</script>

<style scoped lang="less"></style>
