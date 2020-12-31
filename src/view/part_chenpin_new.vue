<template>
    <div class="main">
        <com-board :tb_header='tb_header' :tb_height='tb_height' :url_info='url_info' :size='size' :warehouse_name='warehouse_name'></com-board>
    </div>
</template>

<script>
import ComBoard from '@/components/boardChenpin.vue'
export default {
  name: 'viewmain',
  data () {
    return {
      // 列表的表头
      tb_header: ['客户名称', '货品代号', '货品名称', '发货数量/只', '发货件数', '已出库数量', '未出库数量', '当前库存', '完成'],
      // 是否开启列表的height:100%和width:100%
      tb_height: true,
      // 请求url的地址
      url_info: ':4000/chenpin',
      // 设置一页显示多少条数据
      size: 9,
      // 仓库名称
      warehouse_name: '成品仓库发货通知看板'
    }
  },
  components: {
    ComBoard
  }
}
</script>

<style lang="scss" scoped>

</style>
