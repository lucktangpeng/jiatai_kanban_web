<template>
    <div class="main">
        <com-board :tb_header='tb_header' :tb_height='tb_height' :url_info='url_info' :size='size' :warehouse_name='warehouse_name' :tuogongStatus='tuogongStatus'></com-board>
    </div>
</template>

<script>
import ComBoard from '@/components/boardChenpin.vue'
export default {
  name: 'viewmain',
  data () {
    return {
      // 列表的表头
      tb_header: ['供应商', '托工零件名称', '计划数量', '原材料', '应发料数', '已发数量', '待发数量'],
      // 是否开启列表的height:100%和width:100%
      tb_height: true,
      // 请求url的地址
      url_info: ':4000/tuogong',
      // 设置一页显示多少条数据
      size: 9,
      // 仓库名称
      warehouse_name: '托工计划通知单',
      // 托工判定是否显示勾号
      tuogongStatus: true
    }
  },
  components: {
    ComBoard
  }
}
</script>

<style lang="scss" scoped>

</style>
