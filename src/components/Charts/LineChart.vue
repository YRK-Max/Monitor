<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    showSplitLine: {
      type: Boolean,
      default: true
    },
    seriesData: {
      type: Array,
      default: () => [{ name: '设备1', data: [86, 82, 83, 80, 85, 87, 90] }]
    },
    xAxis: {
      type: Array,
      default: () => ['设备1', '设备2', '设备3', '设备4']
    },
    yAxis: {
      type: Array,
      default: () => [{
        name: '单位：%',
        type: 'value',
        scale: true,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#666666'
          }
        },
        splitLine: {
          show: true
        }
      }]
    },
    boundaryGap: {
      type: Boolean,
      default: false
    },
    dataZoomEnable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    'seriesData': {
      handler(newVal, oldVal) {
        this.setOptions(this.xAxis, newVal, this.showSplitLine)
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.xAxis, this.seriesData, this.showSplitLine)
    },
    setOptions(x_axis, series, showSplitLine) {
      const color = ['#459AF0', '#38C3B0', '#86CA5A', '#BFD44F', '#FCC248', '#FCE448', '#F58B41', '#F7765B', '#525ECD', '#547FDB']
      const series_value = []

      for (let i = 0; i < series.length; i++) {
        const s = series[i]
        const ser = {
          name: s['name'],
          type: s['type'] || 'line',
          data: s['data'],
          symbolSize: 6,
          barMaxWidth: 30,
          stack: s['stack'] || null,
          symbol: 'none',
          smooth: true,
          yAxisIndex: s['yIndex'] || 0,
          lineStyle: {
            color: color[i % 10]
          },
          itemStyle: {
            normal: {
              color: color[i % 10],
              borderColor: color[i % 10]
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: color[i % 10] + 'b3'
            },
            {
              offset: 1,
              color: color[i % 10] + '03'
            }
            ])
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                  offset: 0,
                  color: '#fe9a8b'
                },
                {
                  offset: 0.4,
                  color: '#fe9a8b'
                },
                {
                  offset: 0.5,
                  color: '#fff'
                }, {
                  offset: 0.7,
                  color: '#fff'
                }, {
                  offset: 0.8,
                  color: '#fff'
                }, {
                  offset: 1,
                  color: '#fff'
                }
                ]
              },
              borderColor: '#fe9a8b',
              borderWidth: 2
            }
          }
        }
        if (s['markLine']) {
          const m = s['markLine']
          ser['markLine'] = {
            data: [{
              yAxis: m['data'],
              valueIndex: 1,
              lineStyle: {
                normal: {
                  width: 2,
                  type: 'dashed'
                }
              }
            }]
          }
        }
        series_value.push(ser)
      }

      const optionData = {
        legend: {
          type: 'scroll',
          show: true,
          top: '1%',
          left: '20',
          width: '70%'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: {
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {}
          }
        },
        grid: {
          left: '60px',
          right: '45px',
          top: '70px',
          bottom: '12%'
        },
        xAxis: [{
          type: 'category',
          data: x_axis,
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            textStyle: {
              color: '#666666'
            },
            margin: 15
          },
          boundaryGap: this.boundaryGap
        }],
        yAxis: this.yAxis,
        series: series_value
      }

      if (this.dataZoomEnable) {
        optionData.grid.bottom = '63px'
        optionData['dataZoom'] = [{
          show: true,
          height: 20,
          xAxisIndex: [0],
          bottom: '3%',
          handleSize: '150%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        }, {
          type: 'inside'
        }]
      }
      this.chart.setOption(optionData)
    }
  }
}
</script>
