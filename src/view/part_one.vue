<template>
    <div class="main">
        <com-board :tb_header='tb_header' :tb_height='tb_height' :url_info='url_info' :size='size' :warehouse_name='warehouse_name'></com-board>
    </div>
</template>

<script>
import ComBoard from '@/components/board.vue'
export default {
  name: 'viewmain',
  data () {
    return {
      // 列表的表头
      tb_header: ['供应商名称', '货品代号', '货品名称', '单位', '订单数量', '已收料', '完成率'],
      // 是否开启列表的height:100%和width:100%
      tb_height: true,
      // 请求url的地址
      url_info: ':4000/part',
      // 设置一页显示多少条数据
      size: 5,
      // 设置柱状图一页显示多少条数据
      size_zhu: 6,
      // 仓库名称
      warehouse_name: '零件仓库管理看板',
	  // 柱状图名称
	  zhuTitleName: '供应商送货完成率',
	  // 折线图名称
	  lineTitleName: '供应商退货次数'
    }
  },
  components: {
    ComBoard
  }
}
</script>

<style lang="scss" scoped>

</style>
