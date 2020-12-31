<template>
    <div class="progressone">
        <com-board :tb_header='tb_header' :url_info='url_info' :size='size' :pro_start='pro_start' :warehouse_name='warehouse_name' :line_url='line_url'></com-board>
    </div>
</template>

<script>
import ComBoard from '@/components/board_hege.vue'
export default {
  name: 'progressone',
  data () {
    return {
      // 列表的表头
      tb_header: ['成品代号', '产品名称', '合格量', '不合格量', '总数', '合格率'],
      // 列表的限制总高度
      tb_height: 50,
      // 请求url的地址
      url_info: ':4001/hege',
      // 折线图的数据地址
      line_url: ':4001/hege',
      // 设置一页显示多少条数据
      size: 5,
      // 设置进度仓独有的设置
      pro_start: true,
      // 仓库名称
      warehouse_name: '生产质量月统计表'
    }
  },
  components: {
    ComBoard
  }
}
</script>

<style lang="scss" scoped>

</style>
