<template>
  <div class="board">
    <img class="logo" src="static/image/logo.png" width="120" height="60">
    <nav class="nav">{{warehouse_name}}</nav>
    <div class="table_div">
    <table class="table" v-if="ListNew && tableData" :style="tb_height? 'width: 100%; height: 50%':''" >
      <tr style="height: 50px;">
        <th style="height: 50px;" v-for="(item, index) in tb_header" :key="index">{{item}}</th>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index">
        <td v-for="(itemsub,indexs) in ListNew" :key="indexs" :style="itemsub === 'percentage' || itemsub === 'qualified'?'width: 80px;':''" >
          <el-progress v-if="itemsub === 'percentage'" :text-inside="true" :stroke-width="26" :percentage="item.percentage" :status="item.percentage > 100 ? 'exception':'success'"></el-progress>
          <el-progress v-else-if="itemsub === 'qualified'" :text-inside="true" :stroke-width="26" :percentage="item.qualified" :status="item.qualified > 100 ? 'exception':'success'"></el-progress>
		  <span v-else>{{item[itemsub]}}</span>
        </td>
      </tr>
    </table>
    </div>
    <div class="footer">
      <slot name='chart'></slot>
    </div>
    <div class="footer" v-if="pro_start">
      <div class="chart" style="width: 50%;">
        <div ref="chart_1"  id="chart_1" class="canvas"></div>
      </div>
      <div  class="chart" style="width: 49%;">
        <div ref="chart_2" id="chart_2" class="canvas"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'board',
  props: {
    tb_header: {
      type: Array,
      default: null
    },
    tb_height: {
      type: Number,
      default: null
    },
    url_info: {
      type: String,
      default: null
    },
    line_url: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 15
    },
    pro_start: {
      type: Boolean,
      default: false
    },
    warehouse_name: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      option2: {
        color: '#409EFF',
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            textStyle: {
              color: '#fff'
            },
            rotate: 35
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          }
        }]
      },
      option3: {
        color: ['#00c4f5', '#FFF065', '#FFF065', '#FFAE8B', '#E062AE', '#E062AE', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: '0',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            label: {
              position: 'inner',
              formatter: '{d}%',
              color: '#fff'
            },
            data: [
              {value: 90, name: '合格'},
              {value: 10, name: '不合格'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 数据的单个数据的包含键名称
      ListNew: [],
      // 所有的数据列表
      tableData: [],
      // 控制输出表头健名称的开关，执行一次就会为false，防止重复执行
      tb_status: true,
      // 后端传过来，数据的所有条数，用于分页显示
      data_length: [],
      // 设置分页的页数控制
      indexs: 1,
      // 循环一次的时间，单位毫秒
      cycle_time: 20000,
      // 控制循环是否开始，默认执行一次就会变为false，防止重复执行
      timeout_stauts: true,
      // 柱状图每个的名称
      chart_keylist: [],
      // 柱状图每个的值
      chart_vallist: [],
      // 柱状图的对象
      myChart: null,
      // 折线图对象
      myChart_line: null,
      // 柱状图名称
      zhuTitleName: '当天计划完成率',
      // 折线图名称
      lineTitleName: '周产量曲线图'
    }
  },
  created () {
    this.getdata()
    this.getcharts_line()
    if (this.timeout_stauts) {
      this.mytime()
      this.timeout_stauts = false
    }
  },
  methods: {
    // 用于获取列表中显示的数据，并取出数据内所有的健名称信息
    getdata () {
      var that = this
      this.$axios.request({
        url: that.$store.state.url_ip + that.url_info + `?page=${that.indexs}&size=${that.size}`,
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
			// Element.qualified = Math.round(Element.qty_fin / (Element.qty_fin + Element.qty_lost) * 100)
			// Element.qualified = Element.qty_fin / (Element.qty_fin + Element.qty_lost) * 100
			// Element.qualified = Element.qualified.toFixed(2)
			Element.qualified = 100
            // Element.op_dd = moment(Element.op_dd).format('YYYY-MM-DD-h:mm:ss')
            that.chart_keylist.push(Element.name)
            that.chart_vallist.push(Element.percentage)
          })
          // 此处用于表头数据不足五个的时候，添加空格加满五个，不然影响charts的显示
          if (that.chart_keylist.length < 5) {
            var KeyNumber = that.chart_keylist.length
            for (KeyNumber; KeyNumber <= 5; KeyNumber++) {
              that.chart_keylist.push(' ')
            }
          }
          // 运行charts的数据加载函数
          that.echart_val()
        }
        // 遍历出数据对象中的字段名，用于html处循环输出值
        if (that.tb_status) {
          for (var key in that.tableData[0]) {
            that.ListNew.push(key)
          }
          that.tb_status = false
        }
      }).catch(function () {
      // 请求发送失败
        console.log('请求失败')
      })
    },
	// 判断
	isInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true;
        }
      }
      return false;
    },
    // 获取第二个折线图显示的数据
    getcharts_line () {
      var that = this
      this.$axios.request({
        url: that.$store.state.url_ip + that.line_url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(data => {
        var LineListTitle = []
        var LineListData = []
        var AllData = data.data.data
        AllData.forEach(Element => {
          Element.op_dd = moment(Element.op_dd).format('MM-DD')
          Element.qty_cur = Number(Element.qty_cur)
          LineListTitle.push(Element.op_dd)
          LineListData.push(Element.qty_cur)
        })
        that.echart_line_val(LineListTitle, LineListData)
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 用于获取后端总条数，并计算得出总页数,然后循环请求
    mytime () {
      var that = this
	  let reload = 0
      window.setInterval(() => {
        setTimeout(function () {
          var number = Math.ceil(that.data_length / that.size)
          if (that.indexs === number) {
            that.indexs = 0
          }
          that.indexs++
		  reload++
		  if (reload >= 360) {
			location.reload()
		  }
          that.getdata()
          that.getcharts_line()
        }, that.cycle_time)
      }, that.cycle_time)
    },
    // 用于柱状charts的数据加载
    echart_val () {
      // console.log(this.chart_vallist)
      this.myChart.setOption({
        color: '#00c4f5',
        title: {
          text: this.zhuTitleName,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        grid: {
          top: '40px',
          left: '60px',
          right: '10px'
        },
        xAxis: {
          type: 'category',
          data: this.chart_keylist,
          axisLabel: {
            fontSize: 10,
            textStyle: {
              color: '#fff'
            },
            rotate: 35
          }

        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            },
            formatter: '{value} %'
          }
        },
        series: [{
          data: this.chart_vallist,
          type: 'bar'
        }]
      })
    },
    // 用于折线charts的数据加载
    echart_line_val (header, datalist) {
      this.myChart_line.setOption({
        // color: '#5e24d3',
        color: '#00c4f5',
        title: {
          text: this.lineTitleName,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        grid: {
          left: '70px',
          top: '40px',
          right: '10px'
        },
        xAxis: {
          type: 'category',
          data: header,
          axisLabel: {
            fontSize: 10,
            textStyle: {
              color: '#fff'
            },
            rotate: 35
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [{
          data: datalist,
          type: 'line',
          smooth: true,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          }
        }]
      })
    }
  },
  // 初始化charts的图形模块
  mounted () {
    if (this.pro_start) {
      this.myChart = this.$echarts.init(this.$refs.chart_1)
      this.myChart_line = this.$echarts.init(this.$refs.chart_2)
      // let myChart3 = this.$echarts.init(this.$refs.chart_3)
      // myChart3.setOption(this.option3)
    }
  }
}
</script>

<style lang="scss" scoped>
.board{
  background: url('../../static/image/back_blue.jpg') no-repeat;
  // background: rgb(30,32,47);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #Fff;
  .logo{
    position: fixed;
    left: 40px;
    top: -5px;
  }
  .nav{
    text-align: center;
    color: #0f8ee4;
    font-size: 30px;
    padding: 10px 0;
    // background:rgba(56, 161, 199, 0.8);
    margin-bottom: 10px;
    font-family: 'regular script';
    font-weight: 700;
    z-index: 10;

  }
  .table_div{
    z-index: 10;
    height: 50%;
    width: 95%;
    margin: 0 auto;
    border-radius: 10px;
    // background: rgba(56, 161, 199, 0.8);
    background: url('../../static/image/box.png') no-repeat;
    background-size: 100% 100%;;
    font-size: 18px;
    .table{
      width: 100%;
      padding: 10px;
      border-spacing: 0;
      margin: 0 auto;
      text-align: center;
      font-weight: 700;
      font-family: 'regular script';
      // background: rgba(56, 161, 199, 0.8);
      border-radius: 10px;
      tr{
        &:nth-child(2n){
          // background: rgb(22, 122, 158);
        }
        th{
          border-bottom: 1px solid rgba(81, 78, 226, 0.2);
        }
        td{
          border-bottom: 1px solid rgba(81, 78, 226,.2);
          height: 40px;;
        }
      }
  }
  }
  .footer{
    width: 95%;
    padding-top: 5px;
    margin: 0 auto;
    justify-content: space-between;
    &::after{
      content: ".";
      height: 0;
      overflow: hidden;
      display: block;
      clear: both;
    }
    .chart{
      height: 200px;
      display: inline-block;
      .canvas{
        border-radius: 10px;
        height: 100%;
        width: 100%;
        background: url('../../static/image/box.png') no-repeat;
        background-size: 100% 100%;;
      }
    }
  }
}
.current-row > td {
   background: rgba(4, 4, 202, 0.219) !important;
}

</style>
