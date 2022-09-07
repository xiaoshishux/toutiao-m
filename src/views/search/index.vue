<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        @search="onSearch"
        @cancel="$router.back()"
        placeholder="请输入搜索关键词"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-results v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" />
    <!-- /联想建议 -->

    <!-- 搜索历史 -->
    <search-history v-else />
    <!-- /搜索历史 -->
  </div>
</template>

<script>
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchHistory from "./components/search-history.vue";
import SearchResults from "./components/search-results.vue";
export default {
  name: "SearchPage",
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResults
  },
  props: {},
  data() {
    return {
      searchText: "", //搜索框的内容
      isResultShow: false //控制搜索结果显示状态
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearch() {
      this.isResultShow = true;
    }
  }
};
</script>

<style scoped lang="less"></style>
