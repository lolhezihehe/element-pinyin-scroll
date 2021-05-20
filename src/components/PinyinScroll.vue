<template>
  <div class="pinyin-scroll">
    <el-scrollbar ref="scrollbar">
      <div class="pinyin-scroll__wrap">
        <div v-for="(list, letter) in pyGroup" :key="letter" class="pinyin-scroll__group">
          <label :ref="'label' + letter" :class="['pinyin-scroll__label', labelClass]">{{ letter }}</label>
          <div class="pinyin-scroll__list">
            <div v-for="item in list" :key="item[idKey]" class="pinyin-scroll__item">
              <slot v-if="$scopedSlots.default" :node="item" />
              <div v-else class="pinyin-scroll__text">{{ item[textKey] }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <ul class="pinyin-letter__bar">
      <li
        v-for="(list, letter) in pyGroup"
        :key="letter"
        :class="{ active: letter === activeLetter }"
        @click="letterClick(letter)"
      >
        {{ letter }}
      </li>
    </ul>
  </div>
</template>

<script>
import pinyin from "pinyin";
import throttle from "lodash/throttle";
import { getOffset } from "@/utils";
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    labelClass: {
      type: String,
      default: ''
    },
    idKey: {
      type: String,
      default: 'id'
    },
    textKey: {
      type: String,
      default: 'text'
    },
    // 是否开启 字母active样式跟随滚动
    scrollActive: {
      type: Boolean,
      default: false
    },
    // 节流延迟时间
    throttle: {
      type: Number,
      default: 300
    },
    // 第一个字母到顶部的距离，根据样式自行调整 <0表示不生效
    gutter: {
      type: Number,
      default: -1
    }
  },

  data() {
    return {
      activeLetter: '',
      throttleFn: null
    }
  },

  computed: {
    pyList() {
      return this.data.map(v => {
        const firstLetter = pinyin(v[this.textKey], {
          style: pinyin.STYLE_FIRST_LETTER
        }).join('').charAt(0).toUpperCase()
        return {
          ...v,
          letter: firstLetter >= 'A' && firstLetter <= 'Z' ? firstLetter : '#'
        }
      }).sort((a, b) => {
        if (a.letter === '#') {
          return b.letter === '#' ? 0 : 1
        } else {
          return a.letter < b.letter ? -1 : a.letter > b.letter ? 1 : 0
        }
      })
    },
    pyGroup() {
      const group = {}
      this.pyList.forEach(v => {
        if (group[v.letter]) group[v.letter].push(v)
        else group[v.letter] = [v]
      })
      return group
    },
    scrollWrap() {
      return this.$refs.scrollbar ? this.$refs.scrollbar.wrap : null
    },
    // 第一个字母到顶部的距离
    gutterTop() {
      return this.gutter > 0 ? this.gutter : 20
    }
  },

  watch: {
    data() {
      this.resetScroll()
    }
  },

  created() {
    this.throttleFn = throttle(this.scrollCallback, this.throttle)
  },

  mounted() {
    if (this.scrollActive) this.addScrollListener()
  },

  beforeDestroy() {
    if (this.scrollActive) this.removeScrollListener()
  },

  methods: {
    addScrollListener() {
      this.scrollWrap.addEventListener('scroll', this.throttleFn)
    },
    removeScrollListener() {
      this.scrollWrap.removeEventListener('scroll', this.throttleFn)
    },
    scrollCallback() {
      for (const letter in this.pyGroup) {
        const label = this.$refs['label' + letter][0]
        const { top } = getOffset(label, this.$el)
        if (top - this.gutterTop < 1) {
          this.activeLetter = letter
        }
      }
    },
    resetScroll() {
      this.activeLetter = ''
      if (this.scrollWrap) this.scrollWrap.scrollTop = 0
    },
    letterClick(letter) {
      const label = this.$refs['label' + letter][0]
      const { top } = getOffset(label, this.$el)
      this.scrollWrap.scrollTop = this.scrollWrap.scrollTop + top
      if (!this.scrollActive) this.activeLetter = letter
    },
  }
}
</script>

<style lang="scss">
$padding: 20px;
$bar-width: 32px;
.pinyin-scroll {
  position: relative;
  height: 100%;
  overflow: hidden;
  .el-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    &.is-horizontal {
      display: none;
    }
  }
}
.pinyin-scroll__wrap {
  padding: $padding $bar-width + $padding $padding $padding;
}
.pinyin-scroll__label {
  display: block;
  font-size: 12px;
  color: #666;
  margin: 0 0 15px;
}
.pinyin-scroll__text{
	margin-bottom: 20px;
}
.pinyin-letter__bar {
  position: absolute;
  top: $padding;
  bottom: $padding;
  right: $padding;
  width: $bar-width;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  list-style: none;
  margin: 0;
  li {
    list-style: none;
    margin: 3px 0;
    padding: 2px;
    color: #666;
    cursor: pointer;
    &.active {
      color: #409eff;
    }
  }
}
</style>
