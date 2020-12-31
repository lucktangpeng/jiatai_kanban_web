<template>
    <div class="main">
        <com-board :tb_header='tb_header' :tb_height='tb_height' :url_info='url_info' :size='size' :warehouse_name='warehouse_name' :yuanliaoStatus=yuanliaoStatus></com-board>
    </div>
</template>

<script>
import ComBoard from '@/components/board.vue'
export default {
  name: 'viewmain',
  data () {
    return {
      // 列表的表头
      tb_header: ['供应商名称', '物料编码', '原料名称', '本月订单数', '已交付数', '未交付数', '完成率'],
      // 是否开启列表的height:100%和width:100%
      tb_height: true,
      // 请求url的地址
      url_info: ':4000/yuanliao',
      // 设置一页显示多少条数据
      size: 5,
      // 仓库名称
      warehouse_name: '原材料采购订单完成统计看板',
      // 成品进行页面跳转到托工的状态
      yuanliaoStatus: true
    }
  },
  components: {
    ComBoard
  }
}
</script>

<style lang="scss" scoped>

</style>
