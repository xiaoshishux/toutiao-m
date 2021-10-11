<template>
    <div class="my-container">
      <!-- 已登录界面 -->
      <van-cell-group>
        <van-cell 
        title="单元格" 
        value="内容"
        center
         >
          <van-image
            slot="icon"
            width="50"
            height="50"
            round
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="title">昵称</div>
          <van-button 
          size = "small"
          round
           >编辑资料</van-button>
         </van-cell>
         <van-grid>
            <van-grid-item icon="photo-o" text="文字" />
            <van-grid-item icon="photo-o" text="文字" />
            <van-grid-item icon="photo-o" text="文字" />
            <van-grid-item icon="photo-o" text="文字" />
          </van-grid>
      </van-cell-group>
      <van-grid>
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
      </van-grid>
      <van-cell title = "消息通知" is-link to = "/"/>
      <van-cell title = "消息通知" is-link to = "/"/>
      <van-cell title = "消息通知"/>
      <!-- 未登录界面 -->
      </div>
</template>

<script>
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
</style>
