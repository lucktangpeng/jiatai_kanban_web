<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            v-for="(item,index) in header_body"
            :key="index"
            :prop="item['prop']"
            :label="item['label']">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'newboard',
  data () {
    return {
      tableData: [],
      // 表头名称和字段名
      tb_header: ['生产日期', '部门', '制令单', '任务单号', '工位号', '货品代号', '货品名称', '派工量', '已完成数量', '当天产出', '操作员', '完成率'],
      ListNew: [],
      header_body: [],

      chart_keylist: [],
      chart_vallist: [],
      indexs: 1,
      size: 8,
      url_info: 'http://192.168.3.17:4001/progress',
      data_length: 0,
      pro_start: true,
      tb_status: true,
      list_pro_name: true

    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      var that = this
      this.$axios.request({
        url: that.url_info + `?page=${that.indexs}&size=${that.size}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (date) {
        that.tableData = date.data.data
        that.data_length = date.data.length
        if (that.pro_start) {
          // 此处用于清除之前里面的值
          that.chart_vallist = []
          that.chart_keylist = []
          // 数据的个别字段进行格式化
          that.tableData.forEach(Element => {
            Element.percentage = Math.round((Element.qty_fin / Element.qty) * 100)
            Element.op_dd = moment(Element.op_dd).format('YYYY-MM-DD-h:mm:ss')
            that.chart_keylist.push(Element.name)
            that.chart_vallist.push(Element.percentage)
          })
          // console.log(that.chart_keylist)
          // console.log(that.chart_vallist)
          // 此处用于表头数据不足六个的时候，添加空格加满六个，不然影响charts的显示
          if (that.chart_keylist.length < 6) {
            var KeyNumber = that.chart_keylist.length
            for (KeyNumber; KeyNumber <= 6; KeyNumber++) {
              that.chart_keylist.push(' ')
            }
          }
          // 运行charts的数据加载函数
          // that.echart_val()
        }
        // 遍历出数据对象中的字段名，用于html处循环输出值
        if (that.tb_status) {
          for (var key in that.tableData[0]) {
            that.ListNew.push(key)
          }
          // console.log(that.ListNew)
          that.tb_status = false
        }
        if (that.list_pro_name) {
          for (var j = 0; j < that.tb_header.length; j++) {
            that.header_body.push({'label': that.tb_header[j], 'prop': that.ListNew[j]})
          }
          that.list_pro_name = false
        }
      }).catch(function () {
      // 请求发送失败
        console.log('请求失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
