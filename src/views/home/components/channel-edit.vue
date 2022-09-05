<template>
  <div class="channel-edit">
    <van-cell>
      <div slot="title" center :border="false" class="channel-title">
        我的频道
      </div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <!--  :class="{ active: index === 激活的频道 }" -->
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channels, index) in userChannels"
        :key="index"
        :text="channels.name"
        @click="onUserChannelClick(index)"
      />
    </van-grid>

    <van-cell>
      <div slot="title" center :border="false" class="channel-title">
        频道推荐
      </div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channels, index) in recommendChannels"
        :key="index"
        :text="channels.name"
        @click="onAdd(channels)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from "@/api/channel";

export default {
  name: "ChannelEdit",
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      AllChannels: [], //所有频道数据列表
      isEdit: false //控制编辑的显示状态
    };
  },
  computed: {
    // 推荐的频道列表
    recommendChannels() {
      // 所有频道 - 我的频道 = 剩下的推荐频道
      // filter 方法：过滤数据，根据方法返回的布尔值   ture 来手机数据

      return this.AllChannels.filter(channel => {
        // find 方法查找满足条件的单个元素
        return !this.userChannels.find(userChannel => {
          //取反就是剩下的频道数据
          // 找到满足该条件的元素
          return userChannel.id === channel.id;
        });
      });
    }
  },
  watch: {},
  created() {
    this.loadAllChannels();
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      console.log(data);
      this.AllChannels = data.data.channels;
    },
    onAdd(channels) {
      this.userChannels.push(channels);
    },
    onUserChannelClick(index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(index);
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index);
      }
    },

    deleteChannel(index) {
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit("update-active", this.active - 1);
      }
      this.userChannels.splice(index, 1);

      // 数据持久化
    },

    switchChannel(index) {
      // 切换频道
      this.$emit("update-active", index);
      // 关闭弹出层
      this.$emit("close");
    }
  }
};
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 150px;

  .channel-title {
    font-size: 16px;
    color: #333333;
  }

  .grid-item {
    width: 100px;
    height: 80px;
    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/.van-grid-item__icon {
      position: absolute;
      right: -5px;
      font-size: 20px;
      color: #ccc;
      top: -5px;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
