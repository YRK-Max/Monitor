<!-- 电路图编辑器页面 -->
<template>
  <div class="main-div">
    <!-- {{tableDefaultData}} -->
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <el-button type="primary" style="margin-right: 10px" @click="testD">保存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="19" class="centerContain" :class="{ fixed: !shrink }">
        <div
          id="canvas"
          class="canvas-content"
          :style="{height: height + 'px'}"
          @mousemove="MouseMove"
          @mousedown="MousedownCanvas"
          @mouseup="MouseupCanvas"
          @dblclick="DblClick"
          @mousewheel="MouseWheel"
        >
          <!--拖动辅助线-->
          <div id="guide-x" />
          <div id="guide-y" />
          <!-- 画布 -->
          <svg
            id="main_svg"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            class="svg-main"
            width="1920px"
            height="1080px"
          >
            <defs />
            <filter id="solid" x="0" y="0" width="1" height="1">
              <feFlood flood-color="rgb(255,255,255)" />
              <feComposite in="SourceGraphic" />
            </filter>
            <g
              v-for="(item,index) in svgLists"
              :id="item.id"
              :key="index"
              style="cursor:pointer"
              :title="item.title"
              :transform="'translate('+(item.svgPositionX)+','+(item.svgPositionY)+')' +'rotate('+item.angle+')'"
              :class="item.class"
              @mousedown="MousedownSvg(item.id,index)"
            >
              <SvgComponents
                :height="item.height"
                :color="item.svgColor"
                :width="item.width"
                :eq-id="item.id"
                :type="item.type"
                :tableData="item.tableData"
                :fontSize="item.fontSize"
                :svgText="item.svgText"
                :editable="editable"
              />
            </g>
          </svg>
        </div>
      </el-col>
      <el-col :span="5">
        <el-card
          style="margin-bottom: 8px"
          :body-style="{padding: '8px'}"
        >
          <LeftToolBar :style="{height: height/2 + 'px'}" />
        </el-card>
        <RightToolBar :style="{height: height/2 -20 + 'px'}" :svg-info="selectSvgInfo" @setTableAttr="setTableAttr" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LeftToolBar from './components/LeftToolBar.vue'
import RightToolBar from './components/RightToolBar.vue'
import SvgComponents from './components/SvgComponents.vue'
import global from './global/global.js'// 全局变量
import { GenUUid } from './util/UCore'

export default {
  name: 'LayoutDesigner',
  components: { LeftToolBar, RightToolBar, SvgComponents },
  data() {
    return {
      shrink: true, // 收缩状态  true收缩  false展开
      svgLists: [],
      // 鼠标位置
      mousePosition: {
        positionX: '',
        positionY: ''
      },
      // 辅助线元素
      guideX: '',
      guideY: '',
      CurrentlySelectedToolBarType: '', // 选中的工具栏svg类型
      CurrentlySelectedToolBarTypeName: '', // 选中的工具栏svg类型名称
      CurrentlySelectedToolBarTitle: '', // 选中的工具栏svg标题
      CurrentlySelectedToolBarColor: '', // 选中的工具栏svg颜色
      CurrentlySelectedToolBarHeight: '', // 选中的工具栏svg高度
      CurrentlySelectedToolBarFontSize: '', // 选中的工具栏svg字体大小
      CurrentlySelectedToolBarText: '', // 选中的工具栏svg文字
      CurrentlySelectedToolBarWidth: '', // 选中的工具栏svg高度
      CurrentlySelectedToolBarAngle: '', // 选中的工具栏svg角度
      moveSvgID: '', // 要移动的svg
      moveSvgIndex: 0,
      testvalue: 0,
      selectSvgInfo: {},
      tableRowCount: 2, // 表格默认行数
      tableColCount: 2, // 表格默认列数
      tableDefaultData: [],
      canvasZoom: 70, // 画布缩放百分比
      userInfo: '',
      editable: true,
      getSvgObj: {
        data: ''
      },
      svgObj: {
        data: ''
      },
      svgString: {
        data: ''
      }
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 160
    }
  },
  mounted() {
    const _this = this
    const canvasdiv = document.querySelector('#canvas')
    _this.guideX = document.querySelector('#guide-x')// 辅助线x轴
    _this.guideY = document.querySelector('#guide-y')// 辅助线y轴
    canvasdiv.addEventListener('dragover', function(e) {
      e.preventDefault()
      _this.CurrentlySelectedToolBarType = global.CurrentlySelectedToolBarType
      _this.CurrentlySelectedToolBarTitle = global.CurrentlySelectedToolBarTitle
      _this.CurrentlySelectedToolBarTypeName = global.CurrentlySelectedToolBarTypeName
      _this.CurrentlySelectedToolBarColor = global.CurrentlySelectedToolBarColor
      _this.CurrentlySelectedToolBarHeight = global.CurrentlySelectedToolBarHeight
      _this.CurrentlySelectedToolBarFontSize = global.CurrentlySelectedToolBarFontSize
      _this.CurrentlySelectedToolBarText = global.CurrentlySelectedToolBarText
      _this.CurrentlySelectedToolBarWidth = global.CurrentlySelectedToolBarWidth
      _this.CurrentlySelectedToolBarAngle = global.CurrentlySelectedToolBarAngle
    }, false)
    canvasdiv.addEventListener('drop', function(e) {
      e.preventDefault()
      if (_this.CurrentlySelectedToolBarType === '') {
        return
      }
      const tableData = []
      if (_this.CurrentlySelectedToolBarType === 'TableSvg') {
        for (let r = 0; r < _this.tableRowCount; r++) {
          const tableColDataList = []
          for (let c = 0; c < _this.tableColCount; c++) {
            const tableColData = {
              'id': GenUUid(),
              'val': `${r + 1}行${c + 1}列`
            }
            tableColDataList.push(tableColData)
          }
          const tableRowData = {
            'cols': tableColDataList
          }
          tableData.push(tableRowData)
        }
      }
      // 根据类型和鼠标位置创建组件
      const svgItem = {
        id: GenUUid(),
        sort: 0,
        title: _this.CurrentlySelectedToolBarTitle,
        type: _this.CurrentlySelectedToolBarType,
        typeName: _this.CurrentlySelectedToolBarTypeName,
        svgColor: _this.CurrentlySelectedToolBarColor,
        svgPositionX: e.offsetX,
        svgPositionY: e.offsetY,
        height: _this.CurrentlySelectedToolBarHeight,
        width: _this.CurrentlySelectedToolBarWidth,
        fontSize: _this.CurrentlySelectedToolBarFontSize,
        svgText: _this.CurrentlySelectedToolBarText,
        tableRowCount: _this.tableRowCount,
        tableColCount: _this.tableColCount,
        tableData: tableData,
        angle: _this.CurrentlySelectedToolBarAngle
        // translate:`translate(${this.mousePosition.positionX},${this.mousePosition.positionY})`
      }
      _this.svgLists.push(svgItem)
      setTimeout(function() {
        // 获取所有g标签 将当前标签追加选中样式
        const gAnyList = document.querySelectorAll('g')
        gAnyList.forEach(g => {
          g.classList.remove('topo-layer-view-selected')
        })
        document.getElementById(svgItem.id).classList.add('topo-layer-view-selected')
        _this.selectSvgInfo = svgItem
      }, 100)
    }, false)

    // 获取数据库存储的svg layout
    this.getFile()
  },
  created() {
    const _this = this
    // 当前页面监视键盘输入
    document.onkeydown = function(e) {
      // 获取当前选中组件
      const selectSvgInfo = _this.selectSvgInfo
      if (selectSvgInfo === undefined || selectSvgInfo == null || selectSvgInfo === '') {
        return
      }
      // 事件对象兼容
      // eslint-disable-next-line
      const e1 = e || window.event || arguments['callee'].caller['arguments'][0]
      // 键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      if (e1 && e1.keyCode === 37) {
        e.preventDefault()
        selectSvgInfo.svgPositionX -= 1
      } else if (e1 && e1.keyCode === 38) {
        e.preventDefault()
        selectSvgInfo.svgPositionY -= 1
      } else if (e1 && e1.keyCode === 39) {
        e.preventDefault()
        selectSvgInfo.svgPositionX += 1
      } else if (e1 && e1.keyCode === 40) {
        e.preventDefault()
        selectSvgInfo.svgPositionY += 1
      } else if (e1 && e1.ctrlKey && e1.keyCode === 67) { // ctrl  c
        e.preventDefault()
        const copySvgInfoStr = JSON.stringify(selectSvgInfo)
        const copySvgInfo = JSON.parse(copySvgInfoStr)
        copySvgInfo.id = GenUUid()
        copySvgInfo.svgPositionX = selectSvgInfo.svgPositionX + 10
        copySvgInfo.svgPositionY = selectSvgInfo.svgPositionY + 10
        _this.svgLists.push(copySvgInfo)
        _this.selectSvgInfo = copySvgInfo
        setTimeout(function() {
          // 获取所有g标签 将当前标签追加选中样式
          const gAnyList = document.querySelectorAll('g')
          gAnyList.forEach(g => {
            g.classList.remove('topo-layer-view-selected')
          })
          document.getElementById(copySvgInfo.id).classList.add('topo-layer-view-selected')
        }, 100)
      } else if (e1 && e1.keyCode === 46) { // deleted
        e.preventDefault()
        // 根据当前id找到当前元素的index
        const selectSvgIndex = _this.svgLists.indexOf(_this.svgLists.filter(f => f.id === selectSvgInfo.id)[0])
        _this.svgLists.splice(selectSvgIndex, 1)
      }
    }
  },
  methods: {
    getFile() {
      // getSvgList().then(res => {
      //   this.getSvgObj.data = res.data
      //   // console.log(res.data)
      //   this.svgLists = JSON.parse(this.getSvgObj.data)
      //   // console.log(this.svgLists)
      // })
    },
    uploadFile() {
      // postSvgList(this.svgObj).then(res => {
      //   Message({
      //     message: res.message || '上传LayoutList成功',
      //     type: 'success',
      //     duration: 5 * 1000
      //   })
      //   postSvgLayout(this.svgString).then(res => {
      //     Message({
      //       message: res.message || '上传Layout成功',
      //       type: 'success',
      //       duration: 5 * 1000
      //     })
      //   },
      //   error => {
      //     Message({
      //       message: error.message || '上传Layout失败',
      //       type: 'error',
      //       duration: 5 * 1000
      //     })
      //   })
      // },
      // error => {
      //   Message({
      //     message: error.message || '上传LayoutList失败',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // })
    },
    // 全屏
    fullScreen() {
      const _this = this
      this.shrink = !this.shrink
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      }
      // 监听全屏后esc事件
      window.onresize = function() {
        if (!checkFull()) {
          _this.shrink = !_this.shrink
        }
      }

      function checkFull() {
        var isFull =
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement
        if (isFull === undefined) isFull = false
        return isFull
      }
    },
    // 退出全屏
    exitFullscreen() {
      // this.shrink = !this.shrink
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    MouseMove(e) {
      if (e.offsetX === -1) {
        return
      }
      if (e.target.nodeName === 'INPUT') {
        return
      }
      if (e.offsetY === -1) {
        return
      }
      if (this.moveSvgID === '') {
        return
      }
      this.mousePosition.positionX = e.offsetX
      this.mousePosition.positionY = e.offsetY
      if (this.mousePosition.positionX < 1) {
        this.mousePosition.positionX = 10
      }
      if (this.mousePosition.positionY < 1) {
        this.mousePosition.positionY = 10
      }
      const svgID = this.svgLists[this.moveSvgIndex].id
      // 排除当前元素剩下的所有svg元素的列表
      const anyPositionList = this.svgLists.filter(function(list) {
        return list.id !== svgID
      })
      // 将要移动的元素坐标设备为鼠标坐标
      let svgPositionX = this.mousePosition.positionX
      let svgPositionY = this.mousePosition.positionY
      const _this = this
      setTimeout(function() {
        // 少于十个像素自动吸附
        // 从所有的x坐标列表中查与当前坐标少于10个像素的组件是否存在
        const exitsAdsorbX = anyPositionList.filter(function(list) {
          return (list.svgPositionX - svgPositionX) > -10 && (list.svgPositionX - svgPositionX) < 10
        })
        if (exitsAdsorbX.length > 0) {
          svgPositionX = exitsAdsorbX[0].svgPositionX
        }
        // y轴相同 横向坐标自动吸附
        const exitsAdsorbY = anyPositionList.filter(function(list) {
          return (list.svgPositionY - svgPositionY) > -10 && (list.svgPositionY - svgPositionY) < 10
        })
        if (exitsAdsorbY.length > 0) {
          svgPositionY = exitsAdsorbY[0].svgPositionY
        }
        _this.svgLists[_this.moveSvgIndex].svgPositionX = svgPositionX
        _this.svgLists[_this.moveSvgIndex].svgPositionY = svgPositionY
        // 从所有的x坐标列表中查当前坐标是否存在
        const exitsNowX = anyPositionList.filter(function(list) {
          return list.svgPositionX === svgPositionX
        })
        if (exitsNowX.length > 0) {
          _this.guideY.style.setProperty('left', svgPositionX - 1 + 'px')
          _this.guideY.style.display = 'inline'
        } else {
          _this.guideY.style.display = 'none'
        }
        // 从所有的y坐标列表中查当前坐标是否存在
        const exitsNowY = anyPositionList.filter(function(list) {
          return list.svgPositionY === svgPositionY
        })
        if (exitsNowY.length > 0) {
          _this.guideX.style.setProperty('top', svgPositionY + 'px')
          _this.guideX.style.display = 'inline'
        } else {
          _this.guideX.style.display = 'none'
        }
      }, 1)
    },
    MousedownCanvas() {
      // console.log('点击了画布');

    },
    MousedownSvg(id, index) {
      global.CurrentlySelectedToolBarType = ''
      global.CurrentlySelectedToolBarTitle = ''
      this.CurrentlySelectedToolBarType = ''
      this.CurrentlySelectedToolBarTitle = ''
      // 从数组里面根据index找到当前元素
      this.moveSvgID = id
      this.moveSvgIndex = index
      this.selectSvgInfo = this.svgLists[index]
      // 获取所有g标签 将当前标签追加选中样式
      const gAnyList = document.querySelectorAll('g')
      gAnyList.forEach(g => {
        g.classList.remove('topo-layer-view-selected')
      })
      document.getElementById(id).classList.add('topo-layer-view-selected')
    },
    MouseupCanvas() {
      this.guideX.style.display = 'none'
      this.guideY.style.display = 'none'
      if (this.CurrentlySelectedToolBarTitle !== '' || this.CurrentlySelectedToolBarType !== '') {
        return
      }
      this.moveSvgID = ''
    },
    MouseWheel(e) {
      // 获取当前选中组件
      // const selectSvgInfo = this.selectSvgInfo
      if (this.selectSvgInfo === undefined || this.selectSvgInfo == null || this.selectSvgInfo === '') {
        return
      }
      e.preventDefault()
      // 判断滚轮方向 -100是往上滑 100是下滑
      // if (Math.abs(e.deltaY) > 100) {
      //   console.log(e)
      // }
      // const svgZoom = e.deltaY < 0 ? -5 : 5
      this.selectSvgInfo.height += (e.deltaY < 0 ? 5 : -5)
      if (this.selectSvgInfo.height < 1) {
        this.selectSvgInfo.height = 1
      }
    },
    DblClick() {
      // 获取所有g标签 清除所有选中样式
      const gAnyList = document.querySelectorAll('g')
      gAnyList.forEach(g => {
        g.classList.remove('topo-layer-view-selected')
      })
      this.selectSvgInfo = {}
    },
    testD() {
      // 导出前先取消选中, 避免将选中状态一同导出
      this.DblClick()
      const svg_ele = document.getElementById('main_svg')
      // 深克隆元素
      const clone_svg_ele = svg_ele.cloneNode(true)
      // 移除class
      clone_svg_ele.removeAttribute('class')

      // 保存svg元素
      // console.log(clone_svg_ele.outerHTML)
      // alert(clone_svg_ele.outerHTML)
      this.svgString.data = clone_svg_ele.outerHTML

      // 保存svg list
      // console.log(JSON.stringify(this.svgLists))
      // alert(JSON.stringify(this.svgLists))
      this.svgObj.data = JSON.stringify(this.svgLists)

      this.uploadFile()
    },
    testE() {
      this.svgLists = global.AnalogData
    },
    testH() {
      localStorage.setItem('svginfo', JSON.stringify(this.svgLists))
      this.$router.push({
        path: '/setting/layout-preview',
        name: 'LayoutPreview'
      })
    },
    // 设置表格属性
    setTableAttr(id, rowCount, colCount) {
      // 根据当前id找到当前表格的index
      const tableIndex = this.svgLists.indexOf(this.svgLists.filter(f => f.id === id)[0])
      if (tableIndex === -1) {
        return
      }
      const svgType = this.svgLists.filter(f => f.id === id)[0].type
      if (svgType !== 'TableSvg') {
        return
      }
      const tableData = []
      for (let r = 0; r < rowCount; r++) {
        const tableColDataList = []
        for (let c = 0; c < colCount; c++) {
          if (this.svgLists[tableIndex].tableData.length >= r + 1 && this.svgLists[tableIndex].tableData[r].cols.length >= c + 1) {
            tableColDataList.push(this.svgLists[tableIndex].tableData[r].cols[c])
          } else {
            const tableColData = {
              'id': GenUUid(),
              'val': `${r + 1}行${c + 1}列`
            }
            tableColDataList.push(tableColData)
          }
        }
        const tableRowData = {
          'cols': tableColDataList
        }
        tableData.push(tableRowData)
      }
      this.svgLists[tableIndex].tableData = tableData
    }
  }

}
</script>

<style scoped lang="scss">
.main-div {
  padding: 8px;

  ::v-deep aside {
    padding: 10px;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f2f2f2;
  box-shadow: 1px 1px 5px #838383 inset;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #a2a2a2;
}

.leftNav aside {
  flex: 0 0 260px !important;
  max-width: 260px !important;;
  min-width: 260px !important;
  width: 260px !important;
}

.rightNav aside {
  flex: 0 0 300px !important;
  max-width: 300px !important;;
  min-width: 300px !important;
  width: 300px !important;
}

.svg-main {
  background: #fcfcfc;
  background-image: linear-gradient(rgba(171, 171, 171, 0.3) 1px, transparent 0),
  linear-gradient(90deg, rgba(183, 183, 183, 0.43) 1px, transparent 0),
  linear-gradient(#9d9d9d 1px, transparent 0),
  linear-gradient(90deg, #c3c3c3 1px, transparent 0);
  background-size: 15px 15px, 15px 15px, 75px 75px, 75px 75px;
}

.pageMain {
  /*position: absolute;*/
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  overflow: auto;
}

.leftNav {
  /*position: absolute;*/
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  overflow: auto;
  flex: 0 0 260px !important;
  max-width: 260px !important;
  min-width: 260px !important;
  width: 260px !important;
}

.centerContain {
  /*position: absolute;*/
  overflow: auto !important;
  transition: all 0.3s;
  z-index: 111;

  &.fixed {
    position: fixed;
  }

  .canvas-content {
    width: 1500px;
    height: 300px;
  }

  .btns-content {
    position: fixed;
    bottom: 10px;
    right: 320px;
    left: 280px;

    button {
      margin-left: 10px;
    }
  }
}

.rightNav {
  /*position: absolute;*/
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  overflow: auto;
  flex: 0 0 300px !important;
  max-width: 300px !important;
  min-width: 300px !important;
  width: 300px !important;
}

.icon-shrink {
  position: fixed;
  right: 20px;
  top: 5px;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  background: #1890ff;
  width: 38px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-radius: 50%;
  user-select: none;
  z-index: 1111;
}

#guide-x {
  display: none;
  /*position: absolute;*/
  border-top: 1px dashed #55f;
  width: 100%;
  left: 0;
  top: 500px;

}

#guide-y {
  display: none;
  /*position: absolute;*/
  border-left: 1px dashed #55f;
  height: 100%;
  left: 100px;
  top: 0;

}

#canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.ant-slider {
  margin-bottom: 16px;
}

.topo-layer {
  width: 100%;
  height: 100%;
  /*position: absolute;*/
  transform-origin: left top;
  overflow: auto;

  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
  linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.resize-left-top {
  /*position: absolute;*/
  height: 10px;
  width: 10px;
  background-color: white;
  border: 1px solid #0cf;
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}

.resize-left-bottom {
  /*position: absolute;*/
  height: 10px;
  width: 10px;
  background-color: white;
  border: 1px solid #0cf;
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}

.resize-right-top {
  /*position: absolute;*/
  height: 10px;
  width: 10px;
  background-color: white;
  border: 1px solid #0cf;
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}

.resize-right-bottom {
  /*position: absolute;*/
  height: 10px;
  width: 10px;
  background-color: white;
  border: 1px solid #0cf;
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}

.topo-layer-view-selected {
  outline: 1px solid #0cf;
}
</style>
