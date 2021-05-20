<template>
  <div class="demo-view">
    <div>
      <div class="demo-title">基础用法</div>
      <div class="demo-block">
        <pinyin-scroll :data="data" />
      </div>
    </div>
    <div>
      <div class="demo-title">高阶用法</div>
      <div class="demo-block block2">
        <el-checkbox-group v-model="checkList" style="width: 100%; height: 100%">
          <pinyin-scroll :data="data2" text-key="name" search search-placeholder="请输入模糊匹配" scroll-active>
            <template #default="{ node }">
              <el-checkbox :label="node.id">{{ node.name }}</el-checkbox>
            </template>
          </pinyin-scroll>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import PinyinScroll from '@/components/PinyinScroll'
const names = [
  '周杰伦', '张学友', '成龙', '王多鱼', '大聪明', '#大路', '夏洛', '秋雅', '马冬梅', '小明', '马什么梅', '￥100', '~字符', 'Kobe', '卧龙凤雏'
]
export default {
  name: 'Home',
  components: {
    PinyinScroll
  },
  data() {
    return {
      data: names.map((n, i) => ({ id: i, text: n })),
      data2: names.map((n, i) => ({ id: i, name: n })),
      checkList: []
    }
  },
}
</script>

<style lang="scss" scoped>
.demo-view {
  padding: 50px 0;
  display: flex;
  align-content: center;
  justify-content: space-around;
}
.demo-title {
  width: 500px;
  margin: 20px auto 0;
}
.demo-block {
  height: 500px;
  width: 500px;
  margin: 0 auto;
  border: 1px solid #e6e6e6;
  background: #fff;
}
::v-deep {
  .block2 {
    .pinyin-scroll__item {
      display: inline-block;
      width: 33.33%;
      margin-bottom: 20px;
    }
  }
}
</style>
