<template>
  <div class="board">
    <img class="logo" src="../../static/image/logo.png" width="120" height="60">
    <nav class="nav">{{warehouse_name}}</nav>
    <div class="table_div">
    <table class="table" v-if="ListNew && tableData" :style="tb_height? 'width: 100%; height: 0%':''" >
      <tr style="height: 50px;">
        <th style="height: 50px;" v-for="(item, index) in tb_header" :key="index">{{item}}</th>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index">
        <td v-for="(itemsub,indexs) in ListNew" :key="indexs">
		  <span v-if="!item['checkStatus' && itemsub !== 'checkStatus' ]" >{{item[itemsub]}}</span>
		  <!-- <span v-else-if="itemsub === 'checkStatus'" >已完成</span> -->
          
		  <!-- <span v-else-if="item['checkStatus']"><img src="../../static/image/gou.png" height='30' width='30'></span> -->
		  
        </td>
      </tr>
    </table>
    </div>
    <div class="footer">
      <slot name='chart'></slot>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
export default {
  name: 'board',
  props: {
    tb_header: {
      type: Array,
      default: null
    },
    tb_height: {
      type: Boolean,
      default: false
    },
    url_info: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 15
    },
    size_zhu: {
      type: Number,
      default: 8
    },
    size_line: {
      type: Number,
      default: 8
    },
    pro_start: {
      type: Boolean,
      default: false
    },
    warehouse_name: {
      type: String,
      default: null
    },
    tuogongStatus: {
      type: Boolean,
      default: false
    },
    yuanliaoStatus: {
      type: Boolean,
      default: false
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
        color: ['#409EFF', '#71F6F9', '#FFF065', '#FFAE8B', '#E062AE', '#E062AE', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          x: 'center'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
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
      // 柱形图的分页页数控制
      indexs_zhu: 1,
      // 柱形图的分页页数控制
      indexs_line: 1,
      // 循环一次的时间，单位毫秒
      cycle_time: 20000,
      // 控制循环是否开始，默认执行一次就会变为false，防止重复执行
      timeout_stauts: true,
      // 柱状图每个的名称
      chart_keylist: [],
      // 柱状图每个的值
      chart_vallist: [],
      // 柱状图的总个数
      chart_lenght: 0,
      // 折线图每个的名称
      ChartLineKeylist: [],
      // 折线图每个的值
      ChartLineVallist: [],
      // 折线图的总个数
      chart_line_lenght: 0,
      // 柱状图的对象
      myChart: null,
      // 折线图对象
      myChart_line: null,
      ProStart: true,
      // 柱状图名称
      zhuTitleName: '供应商送货完成率',
      // 折线图名称
      lineTitleName: '供应商退货次数'
    }
  },
  created () {
    // console.log(21.1122.toFixed(1))
    this.getdata()
    // this.getcharts_zhu()
    // this.getcharts_line()
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
        that.tableData.forEach(Element => {
          // Element.percentage = Math.round(Element.ddsl - Element.jhsl)
          if (Element.wfl === 0) {
            Element.checkStatus = '已完成'
          }else{
		  Element.checkStatus = ''
		  }
        })
		console.log(that.tableData)

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
    getcharts_zhu () {
      var that = this
      this.$axios.request({
        url: that.$store.state.url_ip + that.url_info + '_zhu' + `?page=${that.indexs_zhu}&size=${that.size_zhu}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(data => {
        var AllData = data.data.data
        that.chart_lenght = data.data.length
        // 此处用于清除之前里面的值
        that.chart_keylist = []
        that.chart_vallist = []
        // 数据的个别字段进行格式化
        AllData.forEach(Element => {
          Element.percentage = Math.round((Element.jhsl / Element.ddsl) * 100)
          Element.percentage = true
          that.chart_keylist.push(Element.csmc)
          that.chart_vallist.push(Element.percentage)
        })
        // 此处用于表头数据不足六个的时候，添加空格加满六个，不然影响charts的显示
        if (that.chart_keylist.length < that.size_zhu) {
          var KeyNumber = that.chart_keylist.length
          for (KeyNumber; KeyNumber <= that.size_zhu; KeyNumber++) {
            that.chart_keylist.push(' ')
          }
        }
        // 运行charts的数据加载函数
        that.echart_val()
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取第二个折线图显示的数据
    getcharts_line () {
      var that = this
      this.$axios.request({
        url: that.$store.state.url_ip + that.url_info + '_line' + `?page=${that.indexs_line}&size=${that.size_line}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(data => {
        that.ChartLineKeylist = []
        that.ChartLineVallist = []
        var AllData = data.data.data
        that.chart_line_lenght = data.data.length
        // 数据的个别字段进行格式化
        AllData.forEach(Element => {
          // Element.percentage = Math.round((Element.jhsl / Element.ddsl) * 100)
          that.ChartLineKeylist.push(Element.SNM)
          that.ChartLineVallist.push(Element.cs)
        })
        // 此处用于表头数据不足默认数量的时候，添加空格加满默认数量，不然影响charts的显示
        if (that.ChartLineKeylist.length < that.size_line) {
          var KeyNumber = that.chart_line_lenght
          for (KeyNumber; KeyNumber < that.size_line; KeyNumber++) {
            that.ChartLineKeylist.push(' ')
          }
        }
        // console.log(LineListTitle)
        that.echart_line_val()
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 用于获取后端总条数，并计算得出总页数,然后循环请求
    mytime () {
      var that = this
	  let reload = 0
      var tuogongTimerInt = window.setInterval(() => {
        var tuogongTimer = setTimeout(function () {
          // 列表的最大页数
          var number = Math.ceil(that.data_length / that.size)
          // 柱状图的最大页数
          // var IndexsZhu = Math.ceil(that.chart_lenght / that.size_zhu)
          // // 折线图的最大页数
          // var IndexsLine = Math.ceil(that.chart_line_lenght / that.size_line)
          // 列表
          that.getdata()
          // // 折线图
          // that.getcharts_line()
          // // 柱状图
          // that.getcharts_zhu()
          if (that.indexs >= number) {
            that.indexs = 0
            // 页面刷新到最后一页就进行换页
            if (that.tuogongStatus) {
              clearTimeout(tuogongTimer)
              clearInterval(tuogongTimerInt)
              that.$router.push({name: 'yuanliao'})
            }
          }
          // if (that.indexs_zhu === IndexsZhu) {
          //   that.indexs_zhu = 0
          // }
          // if (that.indexs_line === IndexsLine) {
          //   that.indexs_line = 0
          // }
		  reload++
          that.indexs++
		  if (reload >= 360) {
			location.reload()
		  }
          // that.indexs_zhu++
          // that.indexs_line++
        }, that.cycle_time)
      }, that.cycle_time)
    },
    // 用于柱状charts的数据加载
    echart_val () {
      this.myChart.setOption({
        color: ['#00c4f5', '#FFFF6F'],
        title: {
          text: this.zhuTitleName,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        grid: {
          top: '35px',
          right: '10px',
          left: '90px'
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
            formatter: '{value}%'
          }

        },
        series: [
          {
            data: this.chart_vallist,
            type: 'bar'
          }

        ]
      })
    },
    // 用于折线charts的数据加载
    echart_line_val () {
      this.myChart_line.setOption({
        color: '#409EFF',
        title: {
          text: this.lineTitleName,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        grid: {
          top: '35px',
          right: '10px',
          left: '90px'
        },
        xAxis: {
          type: 'category',
          data: this.ChartLineKeylist,
          axisLabel: {
            fontSize: 10,
            textStyle: {
              color: '#fff'
            },
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          max: function (value) {
            if (value.max === 1 || value.max === 2 || value.max === 3 || value.max === 4) {
              value.max = 5
            }
            return value.max
          }
        },
        series: [{
          data: this.ChartLineVallist,
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
    // this.myChart = this.$echarts.init(this.$refs.chart_1)
    // this.myChart_line = this.$echarts.init(this.$refs.chart_2)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.board{
  // background: rgb(30,32,47);
  background: url('../../static/image/back_blue.jpg') no-repeat;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #Fff;
  .logo{
    position: fixed;
    left: 80px;
    top: 5px;
  }
  .nav{
    // width: 200px;
    text-align: center;
    color: #0f8ee4;
    font-size: 30px;
    padding: 10px 0;
    // background:rgba(40, 40, 64, 0.8);
    margin-bottom: 10px;
    font-family: 'regular script';
    font-weight: 700;

  }
  .table_div{
    height: 80%;
    width: 95%;
    margin: 0 auto;
    border-radius: 10px;
    // background: rgba(40, 40, 64, 0.8);
    background: url('../../static/image/box.png') no-repeat;
    background-size: 100% 100%;;
    .table{
      padding: 10px;
      border-spacing: 0;
      margin: 0 auto;
      text-align: center;
      font-weight: 700;
      font-family: 'regular script';
      // background: rgba(40, 40, 64, 0.6);
      border-radius: 10px;
      font-size: 18px;;
      tr{
        &:nth-child(2n){
          // background: rgba(40, 40, 64, 1);
        }
        th{
          border-bottom: 1px solid rgba(81, 78, 226, 0.2);
        }
        td{
          border-bottom: 1px solid rgba(81, 78, 226,.2);
          height: 40px;;
          .icon{
            font-size: 35px;
            color: green;
            font-weight: 700;
          }
        }
      }
  }
  }
  .footer{
    width: 95%;
    padding: 5px 0;
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
      // float: left;
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
