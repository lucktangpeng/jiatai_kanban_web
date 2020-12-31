<template>
    <div class="progressone">
        <com-board :tb_header='tb_header' :url_info='url_info' :size='size' :pro_start='pro_start' :warehouse_name='warehouse_name' :line_url='line_url'></com-board>
    </div>
</template>

<script>
import ComBoard from '@/components/board_progress.vue'
export default {
  name: 'progressone',
  data () {
    return {
      // 列表的表头
      tb_header: ['制令单', '工位号', '货品代号', '货品名称', '派工量', '已完成数量', '不良品数量', '完成率', '合格率'],
      // 列表的限制总高度
      tb_height: 50,
      // 请求url的地址
      url_info: ':4001/wenkong_lianjie',
      // 折线图的数据地址
      line_url: ':4001/wenkong_lianjie_line',
      // 设置一页显示多少条数据
      size: 5,
      // 设置进度仓独有的设置
      pro_start: true,
      // 仓库名称  家泰零件仓库存
      warehouse_name: '温控连接器车间生产进度表'
    }
  },
  components: {
    ComBoard
  }
}
</script>

<style lang="scss" scoped>

</style>
