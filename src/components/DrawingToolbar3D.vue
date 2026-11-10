<template>
  <div class="drawing-toolbar" @click.stop>
    <!-- 样式编辑面板（浮动在工具栏左侧） -->
    <transition name="slide-fade">
      <div class="style-panel-container" v-if="showStylePanel">
        <!-- 面板标题 -->
        <div class="style-panel-header">
          <span class="style-panel-icon">
            <svg viewBox="0 0 14 14" width="13" height="13">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span class="style-panel-title">{{ panelTitle }}</span>
          <!-- 关闭按钮 -->
          <button class="style-panel-close-btn" @click="closeStylePanel" title="关闭样式面板">
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 边线颜色（点要素同样使用该颜色，与 2D 一致） -->
        <div class="style-row" v-if="!isTextType">
          <label class="style-label">边线颜色</label>
          <div class="style-control">
            <input
              type="color"
              class="color-input"
              v-model="strokeColor"
              @input="onStyleChange"
            />
            <span class="color-value">{{ strokeColor }}</span>
          </div>
          <div class="preset-colors">
            <button
              v-for="c in presetColors"
              :key="'s-' + c"
              class="preset-color-swatch"
              :class="{ active: strokeColor.toUpperCase() === c.toUpperCase() }"
              :style="{ background: c }"
              @click="selectPresetColor(c, 'stroke')"
              :title="c"
            ></button>
          </div>
        </div>

        <!-- 边线宽度 -->
        <div class="style-row" v-if="!isTextType">
          <label class="style-label">边线宽度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="strokeWidth"
              min="1" max="20" step="0.5"
              @input="onStyleChange"
            />
            <span class="range-value">{{ strokeWidth }}px</span>
          </div>
        </div>

        <!-- 边线透明度 -->
        <div class="style-row" v-if="!isTextType">
          <label class="style-label">边线透明度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="strokeOpacity"
              min="0" max="1" step="0.05"
              @input="onStyleChange"
            />
            <span class="range-value">{{ Math.round(strokeOpacity * 100) }}%</span>
          </div>
        </div>

        <!-- 边线类型（实线/虚线） -->
        <div class="style-row" v-if="hasStroke">
          <label class="style-label">边线类型</label>
          <div class="style-control">
            <div class="dash-toggle-group">
              <button
                class="dash-toggle-btn"
                :class="{ active: strokeDashType === 'solid' }"
                @click="strokeDashType = 'solid'; onStyleChange()"
              >
                <svg viewBox="0 0 40 12" width="28" height="10">
                  <line x1="2" y1="6" x2="38" y2="6" stroke="currentColor" stroke-width="2.5"/>
                </svg>
                实线
              </button>
              <button
                class="dash-toggle-btn"
                :class="{ active: strokeDashType === 'dashed' }"
                @click="strokeDashType = 'dashed'; onStyleChange()"
              >
                <svg viewBox="0 0 40 12" width="28" height="10">
                  <line x1="2" y1="6" x2="8" y2="6" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="12" y1="6" x2="18" y2="6" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="22" y1="6" x2="28" y2="6" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="32" y1="6" x2="38" y2="6" stroke="currentColor" stroke-width="2.5"/>
                </svg>
                虚线
              </button>
            </div>
          </div>
        </div>

        <!-- 虚线间隔（仅虚线时显示） -->
        <template v-if="strokeDashType === 'dashed' && hasStroke">
          <div class="style-row">
            <label class="style-label">虚线长度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="dashLength"
                min="2" max="20" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ dashLength }}px</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">虚线间隔</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="dashGap"
                min="1" max="20" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ dashGap }}px</span>
            </div>
          </div>
        </template>

        <!-- ===== 自由绘制（线要素） ===== -->
        <template v-if="canFreehand">
          <div class="style-separator freehand-sep">自由绘制</div>
          <div class="freehand-hint">按住 Shift + 左键拖动即可自由绘制，松开左键完成</div>
        </template>

        <!-- ===== 边线描边（外边线，点要素同样支持） ===== -->
        <div class="style-separator outline-sep" v-if="!isTextType">边线描边</div>

        <div class="style-row" v-if="!isTextType">
          <label class="style-label">启用描边</label>
          <div class="style-control">
            <button
              class="switch-toggle"
              :class="{ active: outlineEnabled }"
              @click="toggleOutline"
              :title="outlineEnabled ? '点击关闭描边' : '点击开启描边'"
            >
              <span class="switch-knob"></span>
            </button>
            <span class="switch-text">{{ outlineEnabled ? '已开启' : '已关闭' }}</span>
          </div>
        </div>

        <template v-if="outlineEnabled">
          <div class="style-row">
            <label class="style-label">描边颜色</label>
            <div class="style-control">
              <input
                type="color"
                class="color-input"
                v-model="outlineColor"
                @input="onStyleChange"
              />
              <span class="color-value">{{ outlineColor }}</span>
            </div>
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="'o-' + c"
                class="preset-color-swatch"
                :class="{ active: outlineColor.toUpperCase() === c.toUpperCase() }"
                :style="{ background: c }"
                @click="selectPresetColor(c, 'outline')"
                :title="c"
              ></button>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">描边宽度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="outlineWidth"
                min="0.5" max="12" step="0.5"
                @input="onStyleChange"
              />
              <span class="range-value">{{ outlineWidth }}px</span>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">描边透明度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="outlineOpacity"
                min="0" max="1" step="0.05"
                @input="onStyleChange"
              />
              <span class="range-value">{{ Math.round(outlineOpacity * 100) }}%</span>
            </div>
          </div>
        </template>

        <!-- 填充颜色 -->
        <div class="style-row" v-if="hasFill">
          <label class="style-label">填充颜色</label>
          <div class="style-control">
            <input
              type="color"
              class="color-input"
              v-model="fillColor"
              @input="onStyleChange"
            />
            <span class="color-value">{{ fillColor }}</span>
          </div>
          <div class="preset-colors">
            <button
              v-for="c in presetColors"
              :key="'f-' + c"
              class="preset-color-swatch"
              :class="{ active: fillColor.toUpperCase() === c.toUpperCase() }"
              :style="{ background: c }"
              @click="selectPresetColor(c, 'fill')"
              :title="c"
            ></button>
          </div>
        </div>

        <!-- 填充透明度 -->
        <div class="style-row" v-if="hasFill">
          <label class="style-label">填充透明度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="fillOpacity"
              min="0" max="1" step="0.05"
              @input="onStyleChange"
            />
            <span class="range-value">{{ Math.round(fillOpacity * 100) }}%</span>
          </div>
        </div>

        <!-- 半径 -->
        <div class="style-row" v-if="hasRadius">
          <label class="style-label">{{ radiusLabel }}</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="featureRadius"
              min="1" max="500" step="1"
              @input="onStyleChange"
            />
            <span class="range-value">{{ Math.round(featureRadius) }}</span>
          </div>
        </div>

        <!-- ===== 点动态样式（与 2D 一致） ===== -->
        <template v-if="isPointType">
          <div class="style-separator animate-sep">动态样式</div>

          <div class="style-row">
            <label class="style-label">动态开关</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: pointAnimated }"
                @click="toggleAnimate"
                :title="pointAnimated ? '点击切换为静态样式' : '点击切换为动态样式'"
              >
                <span class="switch-knob"></span>
              </button>
              <span class="switch-text">{{ pointAnimated ? '动态' : '静态' }}</span>
            </div>
          </div>

          <template v-if="pointAnimated">
            <div class="style-row">
              <label class="style-label">动画类型</label>
              <div class="style-control">
                <div class="anim-type-group">
                  <button
                    v-for="a in animTypes"
                    :key="a.value"
                    class="anim-type-btn"
                    :class="{ active: pointAnimType === a.value }"
                    @click="pointAnimType = a.value; onStyleChange()"
                    :title="a.tip"
                  >
                    <i v-html="a.icon"></i>
                    <span>{{ a.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="style-row">
              <label class="style-label">动画速度</label>
              <div class="style-control">
                <input
                  type="range"
                  class="range-input"
                  v-model.number="pointAnimSpeed"
                  min="0.2" max="3" step="0.1"
                  @input="onStyleChange"
                />
                <span class="range-value">{{ pointAnimSpeed }}x</span>
              </div>
            </div>
          </template>
        </template>

        <!-- 箭头专用控制 -->
        <template v-if="isArrow">
          <div class="style-row">
            <label class="style-label">箭头大小</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="arrowScale"
                min="0.5" max="20" step="0.5"
                @input="onStyleChange"
              />
              <span class="range-value">{{ arrowScale }}x</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">箭头宽度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="arrowHeadWidth"
                min="1" max="20" step="0.5"
                @input="onStyleChange"
              />
              <span class="range-value">{{ arrowHeadWidth }}px</span>
            </div>
          </div>
        </template>

        <!-- 军标箭头渐变控制 -->
        <template v-if="isBattleArrow">
          <div class="style-separator">渐变填充</div>
          <div class="style-row">
            <label class="style-label">启用渐变色</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: gradientEnabled }"
                @click="toggleGradient"
                :title="gradientEnabled ? '点击关闭渐变色' : '点击开启渐变色'"
              >
                <span class="switch-knob"></span>
              </button>
              <span class="switch-text">{{ gradientEnabled ? '已开启' : '已关闭' }}</span>
            </div>
            <div class="freehand-hint" v-if="!gradientEnabled">未开启时：使用边线颜色纯色填充</div>
          </div>
          <template v-if="gradientEnabled">
          <div class="style-row">
            <label class="style-label">起始颜色（尾）</label>
            <div class="style-control">
              <input type="color" class="color-input" v-model="gradientStartColor" @input="onStyleChange" />
              <span class="color-value">{{ gradientStartColor }}</span>
            </div>
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="'gs-' + c"
                class="preset-color-swatch"
                :class="{ active: gradientStartColor.toUpperCase() === c.toUpperCase() }"
                :style="{ background: c }"
                @click="selectPresetColor(c, 'gradientStart')"
                :title="c"
              ></button>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">起始透明度</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="gradientStartOpacity" min="0" max="1" step="0.05" @input="onStyleChange" />
              <span class="range-value">{{ Math.round(gradientStartOpacity * 100) }}%</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">结束颜色（头）</label>
            <div class="style-control">
              <input type="color" class="color-input" v-model="gradientEndColor" @input="onStyleChange" />
              <span class="color-value">{{ gradientEndColor }}</span>
            </div>
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="'ge-' + c"
                class="preset-color-swatch"
                :class="{ active: gradientEndColor.toUpperCase() === c.toUpperCase() }"
                :style="{ background: c }"
                @click="selectPresetColor(c, 'gradientEnd')"
                :title="c"
              ></button>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">结束透明度</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="gradientEndOpacity" min="0" max="1" step="0.05" @input="onStyleChange" />
              <span class="range-value">{{ Math.round(gradientEndOpacity * 100) }}%</span>
            </div>
          </div>
          </template>
        </template>

        <!-- ===== 文字标注样式 ===== -->
        <template v-if="isTextType">
          <div class="style-row">
            <label class="style-label">文字内容</label>
            <div class="style-control">
              <input
                type="text"
                class="text-content-input"
                v-model="textContent"
                @input="onStyleChange"
                placeholder="输入标注文字"
                maxlength="60"
              />
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">字体大小</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="textFontSize" min="8" max="64" step="1" @input="onStyleChange" />
              <span class="range-value">{{ textFontSize }}px</span>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">文字颜色</label>
            <div class="style-control">
              <input type="color" class="color-input" v-model="textColor" @input="onStyleChange" />
              <span class="color-value">{{ textColor }}</span>
            </div>
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="'t-' + c"
                class="preset-color-swatch"
                :class="{ active: textColor.toUpperCase() === c.toUpperCase() }"
                :style="{ background: c }"
                @click="selectPresetColor(c, 'text')"
                :title="c"
              ></button>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">加粗</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textBold }"
                @click="textBold = !textBold; onStyleChange()"
                :title="textBold ? '点击取消加粗' : '点击加粗文字'"
              >
                <span class="switch-knob"></span>
              </button>
              <span class="switch-text">{{ textBold ? '已加粗' : '常规' }}</span>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">旋转角度</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="textRotation" min="0" max="360" step="1" @input="onStyleChange" />
              <span class="range-value">{{ textRotation }}°</span>
            </div>
          </div>

          <div class="style-separator">位置偏移</div>

          <div class="style-row">
            <label class="style-label">水平偏移</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="textOffsetX" min="-200" max="200" step="1" @input="onStyleChange" />
              <span class="range-value">{{ textOffsetX }}px</span>
            </div>
            <div class="freehand-hint">负值向左，正值向右</div>
          </div>
          <div class="style-row">
            <label class="style-label">垂直偏移</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="textOffsetY" min="-200" max="200" step="1" @input="onStyleChange" />
              <span class="range-value">{{ textOffsetY }}px</span>
            </div>
            <div class="freehand-hint">负值向上，正值向下</div>
          </div>

          <div class="style-separator">文字背景</div>

          <div class="style-row">
            <label class="style-label">启用背景</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textBgEnabled }"
                @click="textBgEnabled = !textBgEnabled; onStyleChange()"
                :title="textBgEnabled ? '点击关闭文字背景' : '点击开启文字背景'"
              >
                <span class="switch-knob"></span>
              </button>
              <span class="switch-text">{{ textBgEnabled ? '已开启' : '已关闭' }}</span>
            </div>
          </div>

          <template v-if="textBgEnabled">
            <div class="style-row">
              <label class="style-label">背景颜色</label>
              <div class="style-control">
                <input type="color" class="color-input" v-model="textBgColor" @input="onStyleChange" />
                <span class="color-value">{{ textBgColor }}</span>
              </div>
              <div class="preset-colors">
                <button
                  v-for="c in presetColors"
                  :key="'tb-' + c"
                  class="preset-color-swatch"
                  :class="{ active: textBgColor.toUpperCase() === c.toUpperCase() }"
                  :style="{ background: c }"
                  @click="selectPresetColor(c, 'textBg')"
                  :title="c"
                ></button>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">背景透明度</label>
              <div class="style-control">
                <input type="range" class="range-input" v-model.number="textBgOpacity" min="0" max="1" step="0.05" @input="onStyleChange" />
                <span class="range-value">{{ Math.round(textBgOpacity * 100) }}%</span>
              </div>
            </div>
          </template>

          <div class="style-separator">文字边框</div>

          <div class="style-row">
            <label class="style-label">启用边框</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textBorderEnabled }"
                @click="textBorderEnabled = !textBorderEnabled; onStyleChange()"
                :title="textBorderEnabled ? '点击关闭边框' : '点击开启边框'"
              >
                <span class="switch-knob"></span>
              </button>
              <span class="switch-text">{{ textBorderEnabled ? '已开启' : '已关闭' }}</span>
            </div>
          </div>

          <template v-if="textBorderEnabled">
            <div class="style-row">
              <label class="style-label">边框颜色</label>
              <div class="style-control">
                <input type="color" class="color-input" v-model="textBorderColor" @input="onStyleChange" />
                <span class="color-value">{{ textBorderColor }}</span>
              </div>
              <div class="preset-colors">
                <button
                  v-for="c in presetColors"
                  :key="'tb2-' + c"
                  class="preset-color-swatch"
                  :class="{ active: textBorderColor.toUpperCase() === c.toUpperCase() }"
                  :style="{ background: c }"
                  @click="selectPresetColor(c, 'textBorder')"
                  :title="c"
                ></button>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">边框透明度</label>
              <div class="style-control">
                <input type="range" class="range-input" v-model.number="textBorderOpacity" min="0" max="1" step="0.05" @input="onStyleChange" />
                <span class="range-value">{{ Math.round(textBorderOpacity * 100) }}%</span>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">边框宽度</label>
              <div class="style-control">
                <input type="range" class="range-input" v-model.number="textBorderWidth" min="0.5" max="8" step="0.5" @input="onStyleChange" />
                <span class="range-value">{{ textBorderWidth }}px</span>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">边框圆角</label>
              <div class="style-control">
                <input type="range" class="range-input" v-model.number="textBorderRadius" min="0" max="24" step="1" @input="onStyleChange" />
                <span class="range-value">{{ textBorderRadius }}px</span>
              </div>
            </div>
          </template>

          <!-- 内边距：背景 / 边框共用同一盒子 -->
          <div class="style-row" v-if="textBgEnabled || textBorderEnabled">
            <label class="style-label">内边距</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="textPadding" min="0" max="24" step="1" @input="onStyleChange" />
              <span class="range-value">{{ textPadding }}px</span>
            </div>
          </div>

          <div class="style-separator">文字描边</div>

          <div class="style-row">
            <label class="style-label">启用描边</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textOutlineEnabled }"
                @click="textOutlineEnabled = !textOutlineEnabled; onStyleChange()"
                :title="textOutlineEnabled ? '点击关闭文字描边' : '点击开启文字描边'"
              >
                <span class="switch-knob"></span>
              </button>
              <span class="switch-text">{{ textOutlineEnabled ? '已开启' : '已关闭' }}</span>
            </div>
          </div>

          <template v-if="textOutlineEnabled">
            <div class="style-row">
              <label class="style-label">描边颜色</label>
              <div class="style-control">
                <input type="color" class="color-input" v-model="textOutlineColor" @input="onStyleChange" />
                <span class="color-value">{{ textOutlineColor }}</span>
              </div>
              <div class="preset-colors">
                <button
                  v-for="c in presetColors"
                  :key="'to-' + c"
                  class="preset-color-swatch"
                  :class="{ active: textOutlineColor.toUpperCase() === c.toUpperCase() }"
                  :style="{ background: c }"
                  @click="selectPresetColor(c, 'textOutline')"
                  :title="c"
                ></button>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">描边宽度</label>
              <div class="style-control">
                <input type="range" class="range-input" v-model.number="textOutlineWidth" min="0.5" max="8" step="0.5" @input="onStyleChange" />
                <span class="range-value">{{ textOutlineWidth }}px</span>
              </div>
            </div>
          </template>
        </template>

        <!-- 删除选中要素按钮 -->
        <button
          v-if="selectedFeature"
          class="delete-feature-btn"
          @click="deleteSelectedFeature"
        >
          <svg viewBox="0 0 14 14" width="13" height="13">
            <path d="M3 4h8M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M10 4v7a1 1 0 01-1 1H5a1 1 0 01-1-1V4"
              fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          删除选中要素
        </button>
      </div>
    </transition>

    <!-- 绘制工具按钮组 -->
    <div class="tool-group">
      <button
        v-for="tool in tools"
        :key="tool.type"
        class="tool-btn"
        :class="{ active: activeTool === tool.type }"
        :title="tool.label"
        @click="activateTool(tool.type)"
      >
        <i v-html="tool.icon"></i>
        <span class="tool-label">{{ tool.label }}</span>
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="tool-divider"></div>

    <!-- 操作按钮 -->
    <div class="tool-actions">
      <button class="action-btn clear-btn" @click="clearDrawings" title="清除所有绘制">
        <svg viewBox="0 0 14 14" width="14" height="14">
          <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4"
            fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>清除</span>
      </button>
      <button class="action-btn undo-btn" @click="undoLast" title="撤销上一步">
        <svg viewBox="0 0 14 14" width="14" height="14">
          <path d="M3 5h5a3 3 0 013 3v0a3 3 0 01-3 3H6"
            fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 3L3 5l2 2"
            fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>撤销</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, markRaw } from 'vue'
import { useMapStore } from '../stores/mapStore'
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian3,
  Cartesian2,
  Cartographic,
  Color,
  Material,
  Event,
  CameraEventType,
  PolylineDashMaterialProperty,
  ImageMaterialProperty,
  ColorMaterialProperty,
  CallbackProperty,
  Math as CesiumMath
} from 'cesium'

const props = defineProps({
  viewer: { type: Object, required: true }
})

const mapStore = useMapStore()
const viewer = props.viewer

// ==================== 工具定义（与 2D 绘制工具条完全一致） ====================
const tools = [
  {
    type: 'Select',
    label: '选择',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M4 3l5 12 2-5 5-2z" fill="currentColor" opacity="0.3"/><path d="M4 3l5 12 2-5 5-2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
  },
  {
    type: 'Point',
    label: '点',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="1.2" fill="currentColor"/></svg>'
  },
  {
    type: 'LineString',
    label: '线',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><polyline points="3,17 8,8 13,11 17,3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  {
    type: 'Polygon',
    label: '面',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><polygon points="10,3 17,8 14,16 6,16 3,8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><polygon points="10,3 17,8 14,16 6,16 3,8" fill="currentColor" opacity="0.15"/></svg>'
  },
  {
    type: 'Rectangle',
    label: '矩形',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="4" y="5" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="4" y="5" width="12" height="10" rx="1" fill="currentColor" opacity="0.15"/></svg>'
  },
  {
    type: 'Ellipse',
    label: '椭圆',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><ellipse cx="10" cy="10" rx="7" ry="5" fill="none" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="10" rx="7" ry="5" fill="currentColor" opacity="0.15"/></svg>'
  },
  {
    type: 'Arrow',
    label: '小箭头',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><line x1="3" y1="16" x2="14" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polygon points="14,5 10,6 11,10" fill="currentColor"/></svg>'
  },
  {
    type: 'WindArrow',
    label: '风向',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 16 Q 8 16, 10 10 T 16 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="16,4 12,5 13,8" fill="currentColor"/></svg>'
  },
  {
    type: 'BattleArrow',
    label: '军标',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 1.5 L18 9 L13 9 L13 18.5 L7 18.5 L7 9 L2 9 Z" fill="currentColor"/></svg>'
  },
  {
    type: 'CircleOutline',
    label: '画圆',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>'
  },
  {
    type: 'Text',
    label: '标注',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M4 4h12M10 4v11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.5 17.5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  }
]

// ==================== 状态 ====================
const activeTool = ref(null)
const selectedFeature = ref(null)
const isSelectPicked = ref(false)

// 样式参数（与 2D 一致）
const strokeColor = ref('#4096FF')
const strokeWidth = ref(2)
const strokeOpacity = ref(1)
const strokeDashType = ref('solid')   // 'solid' | 'dashed'
const dashLength = ref(8)
const dashGap = ref(4)
const fillColor = ref('#4096FF')
const fillOpacity = ref(0.15)
const featureRadius = ref(6)
// 描边（外边线）参数
const outlineEnabled = ref(false)
const outlineColor = ref('#FFFFFF')
const outlineWidth = ref(2)
const outlineOpacity = ref(1)
// 点动态样式参数（与 2D 一致）
const pointAnimated = ref(false)
const pointAnimType = ref('pulse')   // pulse 脉冲 | breathe 呼吸 | blink 闪烁
const pointAnimSpeed = ref(1)
// 箭头参数
const arrowScale = ref(1)
const arrowHeadWidth = ref(3)
// 军标箭头渐变参数（尾→头由淡变深）
const gradientEnabled = ref(true)
const gradientStartColor = ref('#FFB3B3')
const gradientEndColor = ref('#D32F2F')
const gradientStartOpacity = ref(0.3)
const gradientEndOpacity = ref(1)
// 文字标注参数（默认值与 2D 文字标注一致）
const textContent = ref('标注文字')
const textFontSize = ref(14)
const textBold = ref(false)
const textColor = ref('#FFFFFF')
const textRotation = ref(0)              // 旋转角度（度）
const textOffsetX = ref(0)               // 水平偏移：负=向左，正=向右（px）
const textOffsetY = ref(0)               // 垂直偏移：负=向上，正=向下（px）
const textOutlineEnabled = ref(false)
const textOutlineColor = ref('#000000')
const textOutlineWidth = ref(3)
const textBgEnabled = ref(false)
const textBgColor = ref('#000000')
const textBgOpacity = ref(0.45)
const textPadding = ref(4)
// 文字边框（默认值与 2D 一致）
const textBorderEnabled = ref(false)
const textBorderColor = ref('#4096FF')
const textBorderOpacity = ref(1)
const textBorderWidth = ref(1.5)
const textBorderRadius = ref(4)

// 预设颜色（与 2D 一致）
const presetColors = [
  '#4096FF',  // 科技蓝
  '#F5222D',  // 红色
  '#FAAD14',  // 黄色
  '#52C41A',  // 绿色
  '#722ED1',  // 紫色
  '#13C2C2',  // 青色
  '#FF7A69',  // 珊瑚红
  '#000000',  // 黑色
  '#FFFFFF',  // 白色
]

// 选择预设颜色
function selectPresetColor(color, target) {
  if (target === 'stroke') strokeColor.value = color
  else if (target === 'fill') fillColor.value = color
  else if (target === 'outline') outlineColor.value = color
  else if (target === 'gradientStart') gradientStartColor.value = color
  else if (target === 'gradientEnd') gradientEndColor.value = color
  else if (target === 'text') textColor.value = color
  else if (target === 'textBg') textBgColor.value = color
  else if (target === 'textBorder') textBorderColor.value = color
  else if (target === 'textOutline') textOutlineColor.value = color
  onStyleChange()
}

// 动画类型定义（与 2D 一致）
const animTypes = [
  {
    value: 'pulse',
    label: '脉冲',
    tip: '向外扩散的脉冲光圈',
    icon: '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="2.5" fill="currentColor"/><circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.7"/><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.35"/></svg>'
  },
  {
    value: 'breathe',
    label: '呼吸',
    tip: '圆点大小循环缩放',
    icon: '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.5"/><circle cx="10" cy="10" r="3.2" fill="currentColor" opacity="0.85"/></svg>'
  },
  {
    value: 'blink',
    label: '闪烁',
    tip: '圆点透明度循环闪烁',
    icon: '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="4.5" fill="currentColor" opacity="0.25"/><circle cx="10" cy="10" r="2.5" fill="currentColor"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/></svg>'
  }
]

// 开关切换
function toggleOutline() {
  outlineEnabled.value = !outlineEnabled.value
  onStyleChange()
}

function toggleAnimate() {
  pointAnimated.value = !pointAnimated.value
  onStyleChange()
}

// 军标箭头：启用/关闭渐变色
function toggleGradient() {
  gradientEnabled.value = !gradientEnabled.value
  onStyleChange()
}

// 面板更新标志
let isUpdatingPanel = false

// 箭头类型列表
const ARROW_TYPES = ['Arrow', 'WindArrow', 'BattleArrow']

// 当前操作要素类型
const currentFeatureType = computed(() => {
  if (selectedFeature.value) return selectedFeature.value.drawType
  return activeTool.value
})

// 是否显示样式面板
const showStylePanel = computed(() => {
  // 选择工具：只有在地图上选中要素后才显示面板
  if (activeTool.value === 'Select') {
    return !!selectedFeature.value
  }
  // 绘制工具：激活即显示面板，便于实时调参
  return !!activeTool.value || !!selectedFeature.value
})

// 面板标题
const panelTitle = computed(() => {
  if (selectedFeature.value) {
    const type = selectedFeature.value.drawType
    const typeMap = {
      Point: '点要素', LineString: '线要素', Polygon: '面要素',
      Rectangle: '矩形要素', Ellipse: '椭圆要素',
      Arrow: '小箭头', WindArrow: '风向箭头', BattleArrow: '军标箭头',
      CircleOutline: '圆形要素', Text: '文字标注'
    }
    return `编辑${typeMap[type] || '要素'}样式`
  }
  return '绘制样式设置'
})

// 是否有边线（所有要素除纯点外都有边线；圆形按线要素渲染，同样支持边线/描边）
const hasStroke = computed(() => {
  const t = currentFeatureType.value
  return t !== 'Point' && t !== 'Text'
})

// 是否为文字标注
const isTextType = computed(() => currentFeatureType.value === 'Text')

// 是否为点要素（支持动态样式）
const isPointType = computed(() => currentFeatureType.value === 'Point')

// 是否是箭头类型
const isArrow = computed(() => {
  return ARROW_TYPES.includes(currentFeatureType.value)
})

// 是否为军标箭头（需要渐变控制）
const isBattleArrow = computed(() => {
  return currentFeatureType.value === 'BattleArrow'
})

// 是否有填充
const hasFill = computed(() => {
  return ['Polygon', 'Rectangle', 'Ellipse', 'WindArrow'].includes(currentFeatureType.value)
})

// 是否有半径控制
const hasRadius = computed(() => {
  const t = currentFeatureType.value
  return t === 'Point' || t === 'CircleOutline'
})

// 半径标签
const radiusLabel = computed(() => {
  const t = currentFeatureType.value
  if (t === 'Point') return '点大小'
  if (t === 'CircleOutline') return '半径大小'
  return '半径'
})

// 是否支持自由绘制（仅线要素）
const canFreehand = computed(() => currentFeatureType.value === 'LineString')

// ==================== 绘制要素管理 ====================
// 逻辑要素：{ id, drawType, styleParams, coords:[[lng,lat,h]], entity, fillEntity, strokeEntity, ringFn, ... }
const features = ref([])
let featureSeq = 0

// 绘制交互状态
let handler = null
let drawState = null
let clickTimer = null
let savedDepthTest = false

// 自由绘制 / 相机交互状态
let skipClick = false              // 自由绘制结束后忽略随之而来的 click
let savedCameraTypes = null        // 绘制时临时改写的相机输入配置

// 预览实体
let previewLine = null
let previewFill = null

// 点击序列类工具（单击加点，双击/右键结束）
const CLICK_SEQUENCE_TYPES = ['LineString', 'Polygon', 'Arrow', 'WindArrow', 'BattleArrow']
// 拖拽类工具
const DRAG_TYPES = ['Rectangle', 'Ellipse', 'CircleOutline']

// ==================== 坐标与几何工具 ====================
const M_PER_DEG_LAT = 110540

function mPerDegLng(lat) {
  return 111320 * Math.cos((lat * Math.PI) / 180)
}

/**
 * 屏幕坐标 → 经纬度 + 高度（优先拾取地形真实高度，失败回退椭球面）
 */
function pickLngLat(position) {
  if (!position) return null
  const scene = viewer.scene
  let cartesian = null
  try {
    cartesian = scene.pickPosition(position)
  } catch (e) { /* 忽略 */ }
  if (!cartesian) {
    try {
      cartesian = viewer.camera.pickEllipsoid(position, scene.globe.ellipsoid)
    } catch (e) { /* 忽略 */ }
  }
  if (!cartesian) return null
  const carto = Cartographic.fromCartesian(cartesian)
  return {
    lng: CesiumMath.toDegrees(carto.longitude),
    lat: CesiumMath.toDegrees(carto.latitude),
    height: carto.height
  }
}

function toCartesians(coords, fallbackHeight) {
  return coords.map(c => Cartesian3.fromDegrees(c[0], c[1], c[2] ?? fallbackHeight ?? 0))
}

function avgH(pts) {
  if (!pts.length) return 0
  let s = 0
  for (const p of pts) s += (p[2] ?? p.height ?? 0)
  return s / pts.length
}

// 经纬度 → 局部米制坐标（围绕中心点，避免经度纬度比例失真）
function toLocalMeters(coords) {
  const refLng = coords.reduce((s, c) => s + c[0], 0) / coords.length
  const refLat = coords.reduce((s, c) => s + c[1], 0) / coords.length
  const kx = mPerDegLng(refLat)
  return {
    refLng,
    refLat,
    kx,
    pts: coords.map(c => [(c[0] - refLng) * kx, (c[1] - refLat) * M_PER_DEG_LAT])
  }
}

// 局部米制坐标 → 经纬度（恢复高度）
function fromLocalMeters(local, pts, h) {
  const { refLng, refLat, kx } = local
  return pts.map(p => [refLng + p[0] / kx, refLat + p[1] / M_PER_DEG_LAT, h])
}

// ==================== 颜色 / 材质 ====================
function cssColor(hex, alpha) {
  return Color.fromCssColorString(hex).withAlpha(alpha ?? 1)
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 文字标注画布：绘制文字 + 背景 + 边框 + 描边，返回 canvas 与逻辑尺寸
// 尺寸用 2x 物理像素绘制，通过 imageWidth/imageHeight 还原为逻辑大小，保证文字清晰
function createTextCanvas(p) {
  const text = String(p.textContent || '标注文字')
  const fontSize = p.textFontSize || 14
  const font = `${p.textBold ? 'bold ' : ''}${fontSize}px sans-serif`
  const lines = text.split('\n')
  // 内边距：背景 / 边框共用同一盒子，统一用 textPadding
  const pad = p.textPadding ?? 4

  // 测量文本宽度
  const measure = document.createElement('canvas').getContext('2d')
  measure.font = font
  let tw = 0
  for (const l of lines) tw = Math.max(tw, measure.measureText(l).width)
  const lineH = fontSize * 1.25
  const w = Math.ceil(tw + pad * 2)
  const h = Math.ceil(lines.length * lineH + pad * 2)

  const dpr = 2
  const canvas = document.createElement('canvas')
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const r = Math.min(p.textBorderRadius ?? 4, Math.min(w, h) / 2)
  const roundRectPath = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  // 背景
  if (p.textBgEnabled) {
    roundRectPath(ctx, 0, 0, w, h, r)
    ctx.fillStyle = hexToRgba(p.textBgColor || '#000000', p.textBgOpacity ?? 0.45)
    ctx.fill()
  }

  // 边框（画在背景之上，内缩一半线宽避免被裁切）
  if (p.textBorderEnabled) {
    const bwd = p.textBorderWidth ?? 1.5
    const inset = bwd / 2
    roundRectPath(ctx, inset, inset, w - bwd, h - bwd, Math.max(0, r - inset))
    ctx.strokeStyle = hexToRgba(p.textBorderColor || '#4096FF', p.textBorderOpacity ?? 1)
    ctx.lineWidth = bwd
    ctx.stroke()
  }

  // 文字（水平垂直居中）
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const cx = w / 2
  if (p.textOutlineEnabled) {
    ctx.strokeStyle = hexToRgba(p.textOutlineColor || '#000000', 1)
    ctx.lineWidth = p.textOutlineWidth ?? 3
    ctx.lineJoin = 'round'
    ctx.miterLimit = 2
  }
  lines.forEach((l, i) => {
    const y = pad + lineH * (i + 0.5)
    if (p.textOutlineEnabled) ctx.strokeText(l, cx, y)
    ctx.fillStyle = hexToRgba(p.textColor || '#FFFFFF', 1)
    ctx.fillText(l, cx, y)
  })

  return { canvas, width: w, height: h }
}

// ==================== 边线描边材质 ====================
// 自定义 Fabric 材质：在实线/虚线基础上叠加"外边线描边"（每侧固定像素宽度，与 2D 绘制一致）。
// 用单一材质一次绘制，避免双层线叠加导致同位置深度冲突（描边把主线盖掉）。
const OUTLINE_DASH_TYPE = 'PolylineOutlineDash'
let outlineDashRegistered = false

const OUTLINE_DASH_SOURCE = `
uniform vec4 color;
uniform vec4 gapColor;
uniform vec4 outlineColor;
uniform float outlineWidth;
uniform float dashLength;
uniform float dashPattern;

in float v_width;
in float v_polylineAngle;

const float maskLength = 16.0;

mat2 rotate(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat2(c, s, -s, c);
}

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;

    // 描边区判定（与 Cesium 内置 PolylineOutline 一致的像素宽度算法）
    float halfInteriorWidth = 0.5 * (v_width - outlineWidth) / v_width;
    float b = step(0.5 - halfInteriorWidth, st.t);
    b *= 1.0 - step(0.5 + halfInteriorWidth, st.t);

    float d1 = abs(st.t - (0.5 - halfInteriorWidth));
    float d2 = abs(st.t - (0.5 + halfInteriorWidth));
    float dist = min(d1, d2);

    vec4 currentColor = mix(outlineColor, color, b);

    // 虚线掩码（间隙整体透明，描边随虚线断开）
    bool isDashed = dashPattern < 65535.0;
    if (isDashed) {
        vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;
        float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));
        float maskIndex = floor(dashPosition * maskLength);
        float maskTest = floor(dashPattern / pow(2.0, maskIndex));
        if (mod(maskTest, 2.0) < 1.0) {
            currentColor = gapColor;
        }
    } else {
        currentColor = czm_antialias(outlineColor, color, currentColor, dist);
    }

    if (currentColor.a < 0.005) {
        discard;
    }

    vec4 outColor = czm_gammaCorrect(currentColor);
    if (isDashed) {
        // 与 Cesium 内置 PolylineDash 一致：虚线走 emission，避免参与光照
        material.diffuse = vec3(0.0);
        material.emission = outColor.rgb;
    } else {
        material.diffuse = outColor.rgb;
    }
    material.alpha = outColor.a;
    return material;
}
`

function ensureOutlineDashMaterial() {
  if (outlineDashRegistered) return true
  try {
    Material._materialCache.addMaterial(OUTLINE_DASH_TYPE, {
      fabric: {
        type: OUTLINE_DASH_TYPE,
        uniforms: {
          color: Color.WHITE,
          gapColor: new Color(0, 0, 0, 0),
          outlineColor: Color.BLACK,
          outlineWidth: 1.0,
          dashLength: 16.0,
          dashPattern: 65535.0
        },
        source: OUTLINE_DASH_SOURCE
      },
      translucent: true
    })
    outlineDashRegistered = true
    return true
  } catch (err) {
    console.warn('[DrawingToolbar3D] 描边材质注册失败，将忽略描边:', err)
    return false
  }
}

// 描边（+虚线）材质属性
class OutlineDashMaterialProperty {
  constructor(options = {}) {
    this._definitionChanged = new Event()
    this._color = options.color
    this._gapColor = options.gapColor || new Color(0, 0, 0, 0)
    this._outlineColor = options.outlineColor
    this._outlineWidth = options.outlineWidth ?? 1
    this._dashLength = options.dashLength ?? 16
    this._dashPattern = options.dashPattern ?? 0xFFFF
  }

  get isConstant() { return true }
  get definitionChanged() { return this._definitionChanged }
  getType() { return OUTLINE_DASH_TYPE }

  getValue(time, result) {
    result = result || {}
    result.color = this._color
    result.gapColor = this._gapColor
    result.outlineColor = this._outlineColor
    result.outlineWidth = this._outlineWidth
    result.dashLength = this._dashLength
    result.dashPattern = this._dashPattern
    return result
  }

  equals(other) {
    return this === other
  }
}

// 线宽（开启描边时两侧各加 outlineWidth）
function lineWidthOf(p) {
  const base = p.strokeWidth || 2
  if (!p.outlineEnabled) return base
  return base + (p.outlineWidth || 0) * 2
}

// 创建边线材质（实线 = Color，虚线 = PolylineDashMaterialProperty，可叠加描边）
function createStrokeMaterial(p) {
  const color = cssColor(p.strokeColor || '#4096FF', p.strokeOpacity ?? 1)
  const dashed = p.strokeDashType === 'dashed'

  let dashTotal = 16
  let pattern = 0xFFFF
  if (dashed) {
    const dash = p.dashLength || 8
    const gap = p.dashGap || 4
    dashTotal = Math.max(1, dash + gap)
    const ratio = Math.min(1, dash / dashTotal)
    const n = Math.round(16 * ratio)
    pattern = n <= 0 ? 0 : n >= 16 ? 0xFFFF : ((0xFFFF << (16 - n)) & 0xFFFF)
  }

  // 描边：一次绘制主线 + 外侧描边
  if (p.outlineEnabled && (p.outlineWidth || 0) > 0 && ensureOutlineDashMaterial()) {
    return new OutlineDashMaterialProperty({
      color,
      gapColor: new Color(0, 0, 0, 0),
      outlineColor: cssColor(p.outlineColor || '#FFFFFF', p.outlineOpacity ?? 1),
      // 材质内 outlineWidth 为总描边宽度，故乘 2 表示"每侧"宽度
      outlineWidth: (p.outlineWidth || 0) * 2,
      dashLength: dashTotal,
      dashPattern: dashed ? pattern : 0xFFFF
    })
  }

  if (dashed) {
    return new PolylineDashMaterialProperty({ color, dashLength: dashTotal, dashPattern: pattern })
  }
  return color
}

// 军标渐变 canvas 材质
function createGradientCanvas(p) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 16
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 256, 0)
  g.addColorStop(0, hexToRgba(p.gradientStartColor || '#FFB3B3', p.gradientStartOpacity ?? 0.3))
  g.addColorStop(1, hexToRgba(p.gradientEndColor || '#D32F2F', p.gradientEndOpacity ?? 1))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 16)
  return canvas
}

// ==================== 箭头几何（米制局部坐标） ====================
// 小箭头：三角箭头尖
function computeArrowHead(coords, params) {
  const last = coords[coords.length - 1]
  const prev = coords[coords.length - 2]
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
  const scale = params.arrowScale || 1
  const headW = (params.arrowHeadWidth || 5) * scale * 0.8
  const headLen = 10 * scale
  const tip = [last[0] + Math.cos(angle) * headLen, last[1] + Math.sin(angle) * headLen]
  const baseLeft = [last[0] + Math.cos(angle + Math.PI / 2) * headW, last[1] + Math.sin(angle + Math.PI / 2) * headW]
  const baseRight = [last[0] + Math.cos(angle - Math.PI / 2) * headW, last[1] + Math.sin(angle - Math.PI / 2) * headW]
  return [tip, baseLeft, baseRight]
}

// Catmull-Rom 曲线平滑
function catmullRomSmooth(points, numSegments) {
  if (points.length < 3) return [...points]
  const result = [points[0]]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]
    for (let j = 1; j <= numSegments; j++) {
      const t = j / (numSegments + 1)
      const t2 = t * t; const t3 = t2 * t
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      result.push([x, y])
    }
  }
  result.push(points[points.length - 1])
  return result
}

// 风向箭头：锥形箭头（尾窄→体宽→尖头）
function buildTaperedArrowPolygon(coords, params, smooth = true) {
  if (!coords || coords.length < 2) return null
  let path = coords
  if (smooth && coords.length >= 3) path = catmullRomSmooth(coords, 24)

  const segLens = []
  let totalLen = 0
  for (let i = 1; i < path.length; i++) {
    const dx = path[i][0] - path[i - 1][0]
    const dy = path[i][1] - path[i - 1][1]
    const d = Math.sqrt(dx * dx + dy * dy)
    segLens.push(d)
    totalLen += d
  }
  if (totalLen < 1) totalLen = 1

  const scale = params.arrowScale || 1
  const sw = params.strokeWidth || 2
  const headW = (params.arrowHeadWidth || 8) * scale        // 头部半宽
  const bodyW = headW * 0.6                                // 体部半宽
  const tailW = Math.max(sw * 0.4, 1) * scale              // 尾部半宽

  const leftSide = []
  const rightSide = []
  let acc = 0

  for (let i = 0; i < path.length; i++) {
    if (i > 0) acc += segLens[i - 1]
    const t = acc / totalLen
    let hw
    if (t < 0.2) {
      hw = tailW + (bodyW - tailW) * (t / 0.2)
    } else if (t < 0.8) {
      hw = bodyW
    } else {
      const p = (t - 0.8) / 0.2
      hw = bodyW + (headW - bodyW) * p
    }
    let dx, dy
    if (i === 0) {
      dx = path[1][0] - path[0][0]; dy = path[1][1] - path[0][1]
    } else if (i === path.length - 1) {
      dx = path[i][0] - path[i - 1][0]; dy = path[i][1] - path[i - 1][1]
    } else {
      dx = path[i + 1][0] - path[i - 1][0]; dy = path[i + 1][1] - path[i - 1][1]
    }
    const nl = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = -dy / nl
    const ny = dx / nl
    leftSide.push([path[i][0] + nx * hw, path[i][1] + ny * hw])
    rightSide.push([path[i][0] - nx * hw, path[i][1] - ny * hw])
  }

  // 尖端从最后一个点向外延伸
  const last = path[path.length - 1]
  const prev = path[path.length - 2]
  const lastAngle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
  const tipExtend = headW * 1.6
  const tip = [last[0] + Math.cos(lastAngle) * tipExtend, last[1] + Math.sin(lastAngle) * tipExtend]

  // 闭合多边形：左侧 → 尖端 → 右侧（逆序），不重复首点
  return [...leftSide, tip, ...rightSide.reverse()]
}

// 军标箭头：窄尾柄 + 宽三角头
function buildBattleArrowPolygon(coords, params) {
  if (!coords || coords.length < 2) return null

  const scale = params.arrowScale || 1
  const arrowHeadWidth = params.arrowHeadWidth || 6
  const baseW = arrowHeadWidth * scale * 1.8   // 三角头底部半宽
  const stemW = baseW * 0.42                    // 箭杆半宽

  const segLens = []
  let totalLen = 0
  for (let i = 1; i < coords.length; i++) {
    const dx = coords[i][0] - coords[i - 1][0]
    const dy = coords[i][1] - coords[i - 1][1]
    const d = Math.sqrt(dx * dx + dy * dy)
    segLens.push(d)
    totalLen += d
  }
  if (totalLen < 1) totalLen = 1

  const headRatio = Math.min(0.45, Math.max(0.25, (baseW * 2.5) / totalLen))
  const minSamples = 24
  const numSamples = Math.max(minSamples, Math.ceil(totalLen / 6))

  function pointAtT(t) {
    if (t <= 0) return [coords[0][0], coords[0][1]]
    if (t >= 1) return [coords[coords.length - 1][0], coords[coords.length - 1][1]]
    const target = t * totalLen
    let acc = 0
    for (let i = 0; i < coords.length - 1; i++) {
      if (acc + segLens[i] >= target) {
        const local = (target - acc) / segLens[i]
        return [
          coords[i][0] + (coords[i + 1][0] - coords[i][0]) * local,
          coords[i][1] + (coords[i + 1][1] - coords[i][1]) * local
        ]
      }
      acc += segLens[i]
    }
    return [coords[coords.length - 1][0], coords[coords.length - 1][1]]
  }

  function dirAtT(t) {
    const eps = 1 / numSamples
    const p1 = pointAtT(Math.max(0, t - eps))
    const p2 = pointAtT(Math.min(1, t + eps))
    const dx = p2[0] - p1[0]
    const dy = p2[1] - p1[1]
    const nl = Math.sqrt(dx * dx + dy * dy) || 1
    return [-dy / nl, dx / nl]
  }

  const leftSide = []
  const rightSide = []

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples
    const p = pointAtT(t)
    const [nx, ny] = dirAtT(t)

    let hw
    if (t <= 1 - headRatio + 1e-6) {
      hw = stemW
    } else {
      const localT = (t - (1 - headRatio)) / headRatio
      hw = baseW * Math.max(0, 1 - localT)
    }

    leftSide.push([p[0] + nx * hw, p[1] + ny * hw])
    rightSide.push([p[0] - nx * hw, p[1] - ny * hw])
  }

  return [...leftSide, ...rightSide.reverse()]
}

// ==================== 面类几何 ====================
function rectRingFromTwoPoints(s, e, h) {
  return [
    [s.lng, s.lat, h],
    [s.lng, e.lat, h],
    [e.lng, e.lat, h],
    [e.lng, s.lat, h]
  ]
}

function ellipseFromTwoPoints(s, e) {
  const kx = mPerDegLng((s.lat + e.lat) / 2)
  const rx = Math.max(1, Math.abs(e.lng - s.lng) * kx / 2)
  const ry = Math.max(1, Math.abs(e.lat - s.lat) * M_PER_DEG_LAT / 2)
  return { rx, ry, center: { lng: (s.lng + e.lng) / 2, lat: (s.lat + e.lat) / 2 } }
}

function distMeters(a, b) {
  const kx = mPerDegLng((a.lat + b.lat) / 2)
  const dx = (b.lng - a.lng) * kx
  const dy = (b.lat - a.lat) * M_PER_DEG_LAT
  return Math.sqrt(dx * dx + dy * dy)
}

function ellipseRingMeters(center, rx, ry, h) {
  const kx = mPerDegLng(center.lat)
  const ring = []
  const steps = 64
  for (let i = 0; i < steps; i++) {
    const a = (2 * Math.PI * i) / steps
    ring.push([center.lng + (rx * Math.cos(a)) / kx, center.lat + (ry * Math.sin(a)) / M_PER_DEG_LAT, h])
  }
  return ring
}

// ==================== 点样式（与 2D 一致：描边 + 动态动画） ====================
// 像素半径基准（对应 2D 的 baseR = radius || strokeWidth * 3）
function pointBaseRadius(p) {
  const sw = p.strokeWidth || 2
  return Math.max(1, p.radius || sw * 3)
}

// 呼吸系数：半径在 0.7~1.4 倍之间循环（与 2D 一致）
function pointBreatheFactor(p, now) {
  const w = (2 * Math.PI * (p.pointAnimSpeed || 1)) / 1800
  return 1.05 + 0.35 * Math.sin(now * w)
}

// 闪烁系数（0.12 ~ 1，与 2D 一致）
function pointBlinkFactor(p, now) {
  const w = (2 * Math.PI * (p.pointAnimSpeed || 1)) / 1000
  return 0.12 + 0.88 * (0.5 + 0.5 * Math.sin(now * w))
}

// 填充透明度（静态 0.3；闪烁时随明暗变化）
function pointFillAlphaAt(p, now) {
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  if (p.pointAnimated && (p.pointAnimType || 'pulse') === 'blink') return so * 0.45 * pointBlinkFactor(p, now)
  return so * 0.3
}

// 边线透明度（静态取 strokeOpacity；闪烁时随明暗变化）
function pointStrokeAlphaAt(p, now) {
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  if (p.pointAnimated && (p.pointAnimType || 'pulse') === 'blink') return so * pointBlinkFactor(p, now)
  return so
}

// 脉冲相位（0→1 循环，三圈错开 1/3 周期）
function pointPulsePhase(p, index, now) {
  const period = 1800 / (p.pointAnimSpeed || 1)
  return ((now + (index * period) / 3) % period) / period
}

// 按时间驱动的属性（Cesium 每帧求值，实现动态样式）
function timeProperty(getter) {
  return new CallbackProperty(() => getter(performance.now()), false)
}

// 点位置处的米/像素换算：把屏幕像素半径换算为地面米制半径，
// 使点及其光环以"地面圆"的形式呈现，旋转视角时与地面平行
function metersPerPixel(position) {
  const camera = viewer.camera
  const canvas = viewer.scene.canvas
  const distance = Cartesian3.distance(camera.positionWC, position)
  const frustum = camera.frustum
  let span
  if (frustum.fovy !== undefined) {
    span = 2 * distance * Math.tan(frustum.fovy * 0.5)
  } else {
    // 正交投影：视口高度即世界单位跨度
    span = (frustum.top - frustum.bottom) || distance
  }
  return span / (canvas.clientHeight || 1)
}

// 贴地圆环坐标（米制半径 → 经纬度）
function circlePositions(center, radiusMeters, h) {
  return toCartesians(ellipseRingMeters(center, radiusMeters, radiusMeters, h), h)
}

// 点要素渲染：贴地圆面 + 圆环边线 + 描边外圈 + 脉冲光环
// 直径/半径按相机比例换算为地面米，点始终平铺于地面（旋转视角不会立起来）
function applyPointStyle(f, p) {
  const c = f.coords[0]
  const h = c[2] ?? f.height
  const pos = Cartesian3.fromDegrees(c[0], c[1], h)
  const center = { lng: c[0], lat: c[1] }
  const sc = p.strokeColor || '#4096FF'
  const sw = p.strokeWidth || 2
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  const baseR = pointBaseRadius(p)
  const animated = !!p.pointAnimated
  const animType = p.pointAnimType || 'pulse'
  const breathe = animated && animType === 'breathe'
  const blink = animated && animType === 'blink'

  // 地面半径（米）：像素半径按相机比例换算为地面半径并缓存，
  // 仅在"点大小/边线宽度"变化时重算，避免只调颜色/透明度时尺寸跳变
  const radiusKey = `${baseR}`
  if (f.pointRadiusKey !== radiusKey) {
    const mppNow = metersPerPixel(pos)
    f.pointRadiusKey = radiusKey
    f.pointMetersPerPixel = mppNow
    // 上限 20km，避免远视距下调样式产生夸张的大圆
    f.pointRadiusMeters = Math.min(20000, Math.max(0.5, baseR * mppNow))
  }
  const mpp = f.pointMetersPerPixel
  const dotR = f.pointRadiusMeters

  // 半径取值（呼吸动画随时间缩放）
  const radiusAt = now => (breathe ? dotR * pointBreatheFactor(p, now) : dotR)

  // 填充：贴地圆面
  f.fillEntity.polygon = {
    hierarchy: breathe
      ? timeProperty(now => circlePositions(center, radiusAt(now), h))
      : circlePositions(center, dotR, h),
    material: blink
      ? new ColorMaterialProperty(timeProperty(now => cssColor(sc, pointFillAlphaAt(p, now))))
      : cssColor(sc, so * 0.3),
    // 贴地：圆面平铺在地形上，与地面平行
    clampToGround: true
  }

  // 圆点边线：贴地圆环
  f.strokeEntity.polyline = {
    positions: breathe
      ? timeProperty(now => circlePositions(center, radiusAt(now), h))
      : circlePositions(center, dotR, h),
    width: sw,
    material: blink
      ? new ColorMaterialProperty(timeProperty(now => cssColor(sc, pointStrokeAlphaAt(p, now))))
      : cssColor(sc, so),
    clampToGround: true
  }

  // 描边：外圈光环（环带覆盖 [dotR, dotR + outlineWidth 像素]，与 2D 一致）
  if (p.outlineEnabled) {
    if (!f.outlineEntity) {
      f.outlineEntity = viewer.entities.add({})
      f.outlineEntity.__drawFeature = f
    }
    const ow = p.outlineWidth || 2
    const bandR = dotR + (ow * mpp) / 2
    f.outlineEntity.show = true
    f.outlineEntity.polyline = {
      positions: breathe
        ? timeProperty(now => circlePositions(center, radiusAt(now) + (ow * mpp) / 2, h))
        : circlePositions(center, bandR, h),
      width: Math.max(1, ow),
      material: cssColor(p.outlineColor || '#FFFFFF', p.outlineOpacity !== undefined ? p.outlineOpacity : 1),
      clampToGround: true
    }
  } else if (f.outlineEntity) {
    f.outlineEntity.show = false
  }

  // 脉冲：三圈贴地扩散光环（与地面平行，错相位，越外越淡）
  if (!f.pulseEntities) f.pulseEntities = []
  const needPulse = animated && animType === 'pulse'
  for (let i = 0; i < 3; i++) {
    let e = f.pulseEntities[i]
    // 非脉冲状态：不创建多余实体，已有的隐藏即可
    if (!needPulse) {
      if (e) e.show = false
      continue
    }
    if (!e) {
      e = viewer.entities.add({})
      e.__drawFeature = f
      f.pulseEntities[i] = e
    }
    e.show = true
    e.polyline = {
      positions: timeProperty(now => {
        const t = pointPulsePhase(p, i, now)
        const r = dotR + t * (dotR * 2.4 + 10 * mpp)
        return circlePositions(center, Math.max(0.5, r), h)
      }),
      width: Math.max(1.2, sw * 0.9),
      material: new ColorMaterialProperty(timeProperty(now => {
        const t = pointPulsePhase(p, i, now)
        return cssColor(sc, (1 - t) * (1 - t) * so * 0.95)
      })),
      // 贴地：光环始终与地面平行，不被地形遮挡
      clampToGround: true
    }
  }
}

// ==================== 样式应用 ====================
function getCurrentParams() {
  return {
    strokeColor: strokeColor.value,
    strokeWidth: strokeWidth.value,
    strokeOpacity: strokeOpacity.value,
    strokeDashType: strokeDashType.value,
    dashLength: dashLength.value,
    dashGap: dashGap.value,
    fillColor: fillColor.value,
    fillOpacity: fillOpacity.value,
    outlineEnabled: outlineEnabled.value,
    outlineColor: outlineColor.value,
    outlineWidth: outlineWidth.value,
    outlineOpacity: outlineOpacity.value,
    radius: featureRadius.value,
    pointAnimated: pointAnimated.value,
    pointAnimType: pointAnimType.value,
    pointAnimSpeed: pointAnimSpeed.value,
    arrowScale: arrowScale.value,
    arrowHeadWidth: arrowHeadWidth.value,
    gradientEnabled: gradientEnabled.value,
    gradientStartColor: gradientStartColor.value,
    gradientEndColor: gradientEndColor.value,
    gradientStartOpacity: gradientStartOpacity.value,
    gradientEndOpacity: gradientEndOpacity.value,
    textContent: textContent.value,
    textFontSize: textFontSize.value,
    textBold: textBold.value,
    textColor: textColor.value,
    textRotation: textRotation.value,
    textOffsetX: textOffsetX.value,
    textOffsetY: textOffsetY.value,
    textOutlineEnabled: textOutlineEnabled.value,
    textOutlineColor: textOutlineColor.value,
    textOutlineWidth: textOutlineWidth.value,
    textBgEnabled: textBgEnabled.value,
    textBgColor: textBgColor.value,
    textBgOpacity: textBgOpacity.value,
    textPadding: textPadding.value,
    textBorderEnabled: textBorderEnabled.value,
    textBorderColor: textBorderColor.value,
    textBorderOpacity: textBorderOpacity.value,
    textBorderWidth: textBorderWidth.value,
    textBorderRadius: textBorderRadius.value
  }
}

// 将样式应用到逻辑要素（重建 geometry/材质）
function applyFeatureStyle(f) {
  const p = f.styleParams
  const t = f.drawType
  const h = f.height

  if (t === 'Point') {
    applyPointStyle(f, p)
    return
  }

  if (t === 'Text') {
    const c = f.coords[0]
    f.entity.position = Cartesian3.fromDegrees(c[0], c[1], c[2] ?? h)
    // 用 canvas 渲染文字（Billboard）：Cesium Label 不支持背景边框，canvas 可完整支持
    // 背景/边框（颜色、透明度、宽度、圆角）/文字描边/旋转
    const { canvas, width, height } = createTextCanvas(p)
    f.entity.billboard = {
      image: canvas,
      imageWidth: width,
      imageHeight: height,
      // 位置偏移（屏幕像素）：x 正=向右，y 正=向下
      pixelOffset: new Cartesian2(p.textOffsetX || 0, p.textOffsetY || 0),
      rotation: -CesiumMath.toRadians(p.textRotation || 0),
      // 标注不被地形遮挡，始终可见
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
    return
  }

  if (t === 'LineString') {
    f.strokeEntity.polyline = {
      positions: toCartesians(f.coords, h),
      width: lineWidthOf(p),
      material: createStrokeMaterial(p),
      // 贴地：避免受 depthTestAgainstTerrain 影响被地形遮挡（线在地图上不显示）
      clampToGround: true
    }
    return
  }

  if (t === 'Arrow') {
    // 杆身
    f.strokeEntity.polyline = {
      positions: toCartesians(f.coords, h),
      width: lineWidthOf(p),
      material: createStrokeMaterial(p),
      // 贴地：避免被地形遮挡
      clampToGround: true
    }
    // 三角箭头尖
    const local = toLocalMeters(f.coords)
    const head = computeArrowHead(local.pts, p)
    const headGeo = fromLocalMeters(local, head, f.coords[f.coords.length - 1][2] ?? h)
    f.fillEntity.polygon = {
      hierarchy: toCartesians(headGeo, h),
      material: cssColor(p.strokeColor || '#4096FF', p.strokeOpacity ?? 1),
      // 贴地：箭头面随地形显示，不被遮挡
      clampToGround: true
    }
    return
  }

  // 面类：Polygon / Rectangle / Ellipse / WindArrow / BattleArrow / CircleOutline
  const ring = f.ringFn ? f.ringFn(p) : f.coords
  const cartesians = toCartesians(ring, h)

  if (f.fillEntity) {
    let material
    if (t === 'BattleArrow') {
      // 关闭渐变色时用边线颜色纯色填充
      material = p.gradientEnabled === false
        ? cssColor(p.strokeColor || '#4096FF', p.strokeOpacity ?? 1)
        : new ImageMaterialProperty({
          image: createGradientCanvas(p),
          repeat: new Cartesian2(1, 1)
        })
    } else {
      material = cssColor(p.fillColor || p.strokeColor || '#4096FF', p.fillOpacity ?? 0.15)
    }
    f.fillEntity.polygon = {
      hierarchy: cartesians,
      material,
      // 贴地：面要素随地形显示，不被遮挡
      clampToGround: true
    }
  }

  f.strokeEntity.polyline = {
    positions: [...cartesians, cartesians[0]],
    width: lineWidthOf(p),
    material: createStrokeMaterial(p),
    // 贴地：面边线随地形显示，不被遮挡
    clampToGround: true
  }
}

// ==================== 实体创建 ====================
function createEntities(f) {
  const t = f.drawType
  if (t === 'Point') {
    // 点：贴地圆面（填充）+ 贴地圆环（边线）
    f.fillEntity = viewer.entities.add({ polygon: {} })
    f.fillEntity.__drawFeature = f
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
  } else if (t === 'Text') {
    f.entity = viewer.entities.add({ position: Cartesian3.fromDegrees(0, 0, 0) })
    f.entity.__drawFeature = f
  } else if (t === 'LineString') {
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
  } else if (t === 'Arrow') {
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
    f.fillEntity = viewer.entities.add({ polygon: {} })
    f.fillEntity.__drawFeature = f
  } else {
    if (t !== 'CircleOutline') {
      f.fillEntity = viewer.entities.add({ polygon: {} })
      f.fillEntity.__drawFeature = f
    }
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
  }
}

// 创建逻辑要素并添加实体
function buildFeature(drawType, params, coords, extra = {}) {
  const f = {
    id: `draw-${++featureSeq}`,
    drawType,
    styleParams: { ...params },
    coords,
    height: extra.height ?? avgH(coords),
    entity: null,
    fillEntity: null,
    strokeEntity: null,
    ringFn: extra.ringFn || null,
    rx: extra.rx,
    ry: extra.ry,
    radius: extra.radius,
    centerLng: coords.reduce((s, c) => s + c[0], 0) / coords.length,
    centerLat: coords.reduce((s, c) => s + c[1], 0) / coords.length
  }
  createEntities(f)
  applyFeatureStyle(f)
  // markRaw 阻止 Vue 深度代理 feature 及其 Cesium Entity 对象，
  // 否则 viewer.entities.contains(代理对象) 引用比较失败导致 remove 无效（清除/撤销失效）
  features.value.push(markRaw(f))
  return f
}

function removeFeature(f) {
  const ents = [f.entity, f.fillEntity, f.strokeEntity, f.outlineEntity, ...(f.pulseEntities || [])]
  for (const e of ents) {
    if (e) {
      try {
        // 直接 remove（removeById 按 entity.id 查找），不使用 contains 引用比较，
        // 避免代理对象导致 contains 返回 false 而跳过移除
        viewer.entities.remove(e)
      } catch (err) {
        console.warn('[DrawingToolbar3D] 移除实体失败:', err)
      }
    }
  }
  const idx = features.value.indexOf(f)
  if (idx > -1) features.value.splice(idx, 1)
}

// ==================== 选择模式 ====================
function startSelectMode() {
  handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((movement) => {
    const picked = viewer.scene.pick(movement.position)
    const entity = picked && picked.id
    const f = entity && entity.__drawFeature
    if (f) {
      selectFeature(f)
    } else {
      unselect()
    }
  }, ScreenSpaceEventType.LEFT_CLICK)
}

function selectFeature(f) {
  if (selectedFeature.value && selectedFeature.value !== f) unselect()
  selectedFeature.value = f
  isSelectPicked.value = true
  applySelectionHighlight(f)
  updatePanelFromFeature(f)
}

function unselect() {
  if (selectedFeature.value) {
    applyFeatureStyle(selectedFeature.value)
    selectedFeature.value = null
    isSelectPicked.value = false
  }
}

// 选中高亮：青色描边 / 加粗 / 放大
function applySelectionHighlight(f) {
  const p = f.styleParams
  const cyan = Color.fromCssColorString('#05f5ff')
  if (f.entity && f.drawType === 'Text') {
    // 文字标注：选中时用青色染色提示（取消选中会重设样式恢复原色）
    const bb = f.entity.billboard
    if (bb) bb.color = cyan
  }
  if (f.strokeEntity) {
    const cur = f.strokeEntity.polyline.width
    const w = (cur && typeof cur.getValue === 'function' ? cur.getValue() : cur) || p.strokeWidth || 2
    f.strokeEntity.polyline.width = w + 4
    // 点要素：边线染成青色作为选中提示（取消选中后按样式参数重建）
    if (f.drawType === 'Point') f.strokeEntity.polyline.material = cyan
  }
  if (f.fillEntity) {
    f.fillEntity.polygon.outline = true
    f.fillEntity.polygon.outlineColor = cyan
    f.fillEntity.polygon.outlineWidth = 2
  }
}

// ==================== 预览实体 ====================
function setPreviewLine(coords, params, h) {
  if (!previewLine) previewLine = viewer.entities.add({ polyline: {} })
  previewLine.show = true
  previewLine.polyline = {
    positions: toCartesians(coords, h),
    width: lineWidthOf(params),
    material: createStrokeMaterial(params),
    // 贴地：绘制预览线随地形显示，不被遮挡
    clampToGround: true
  }
}

function setPreviewFill(coords, material, h) {
  if (!previewFill) previewFill = viewer.entities.add({ polygon: {} })
  previewFill.show = true
  previewFill.polygon = {
    hierarchy: toCartesians(coords, h),
    material,
    // 贴地：绘制预览面随地形显示，不被遮挡
    clampToGround: true
  }
}

function hidePreviewFill() {
  if (previewFill) previewFill.show = false
}

function cleanupPreview() {
  if (previewLine) {
    viewer.entities.remove(previewLine)
    previewLine = null
  }
  if (previewFill) {
    viewer.entities.remove(previewFill)
    previewFill = null
  }
}

// ==================== 绘制时的相机交互 ====================
// 绘制需要独占左键（拖拽形状 / 自由绘制）时，把"旋转平移"临时交给中键，
// 滚轮与右键缩放保持可用，保证绘制过程中依然能调整视角。
function setDrawCameraMode() {
  if (!viewer || viewer.isDestroyed()) return
  const controller = viewer.scene.screenSpaceCameraController
  if (!controller || savedCameraTypes) return
  const tiltTypes = Array.isArray(controller.tiltEventTypes)
    ? controller.tiltEventTypes.slice()
    : [controller.tiltEventTypes]
  savedCameraTypes = {
    rotateEventTypes: controller.rotateEventTypes,
    tiltEventTypes: controller.tiltEventTypes
  }
  controller.rotateEventTypes = CameraEventType.MIDDLE_DRAG
  controller.tiltEventTypes = tiltTypes.filter(t => t !== CameraEventType.MIDDLE_DRAG)
}

function restoreDrawCameraMode() {
  if (!savedCameraTypes) return
  const valid = viewer && !viewer.isDestroyed()
  if (valid && viewer.scene && viewer.scene.screenSpaceCameraController) {
    const controller = viewer.scene.screenSpaceCameraController
    controller.rotateEventTypes = savedCameraTypes.rotateEventTypes
    controller.tiltEventTypes = savedCameraTypes.tiltEventTypes
  }
  savedCameraTypes = null
}

// ==================== 自由绘制（Freehand） ====================
// 与 OpenLayers Draw(freehand: true) 一致：按住 Shift + 鼠标左键拖动，沿轨迹连续采样成线，
// 松开左键立即完成，不需要逐点单击、也不需要双击。默认可用，无需任何开关。
//
// 实现说明（关键）：这里不使用 Cesium 的 ScreenSpaceEventHandler，而用原生 Pointer 事件，
// 并在 window 的捕获阶段监听。原因：
//   1) Cesium 的相机控制器比业务 handler 先注册，mousedown 会先被相机拿到，
//      导致拖动时地球跟着旋转、轨迹被破坏；
//   2) 在 window 捕获阶段可以抢在相机处理之前把这个手势的左键旋转改到中键；
//   3) 原生事件自带 shiftKey / button，判断条件更准确。
const FREEHAND_SAMPLE_DIST = 2.5   // 采样间隔（屏幕像素）
const FREEHAND_DRAG_THRESHOLD = 3  // 超过该距离才算"拖动"，否则视为单击

let freehandActive = false     // 是否处于自由绘制手势中
let freehandDragging = false   // 本次手势是否发生了拖动
let freehandStartPos = null    // 手势起点（经纬度）
let freehandLastScreen = null  // 上次采样的屏幕坐标

// 是否落在地图画布上（用元素类型判断，避免与 Cesium 内部 canvas 引用比较时因代理/重建失败）
function isMapCanvas(target) {
  return !!target && target.tagName === 'CANVAS' && !!target.closest && !!target.closest('.cesium-viewer')
}

function eventToCanvasPosition(e) {
  const el = e.target
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  // 超出画布范围不采样（拖动到工具栏等区域时）
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null
  return new Cartesian2(x, y)
}

// 自由绘制采样：优先与地形/椭球求交（不拾取自身预览线，避免高度抖动）
function pickGroundLngLat(position) {
  if (!position) return null
  const scene = viewer.scene
  try {
    const ray = viewer.camera.getPickRay(position)
    if (ray) {
      const cartesian = scene.globe.pick(ray, scene)
      if (cartesian) {
        const carto = Cartographic.fromCartesian(cartesian)
        return {
          lng: CesiumMath.toDegrees(carto.longitude),
          lat: CesiumMath.toDegrees(carto.latitude),
          height: carto.height
        }
      }
    }
  } catch (err) { /* 回退到通用拾取 */ }
  return pickLngLat(position)
}

// 自由绘制默认可用：按住 Shift + 左键拖动即进入自由绘制
function isFreehandGesture(e) {
  return !!drawState && drawState.type === 'LineString' && e.shiftKey
}

function onFreehandPointerDown(e) {
  if (e.button !== 0) return
  // 每次新的按下都重置上一笔遗留的 click 抑制标记
  skipClick = false
  if (!viewer || viewer.isDestroyed()) return
  if (!isMapCanvas(e.target)) return
  if (!isFreehandGesture(e)) return

  const pos = pickGroundLngLat(eventToCanvasPosition(e))
  if (!pos) return

  // 手势开始：抢在 Cesium 相机处理本次 pointerdown 之前，把左键旋转改到中键
  setDrawCameraMode()
  freehandActive = true
  freehandDragging = false
  freehandStartPos = pos
  freehandLastScreen = { x: e.clientX, y: e.clientY }
  skipClick = true

  // 捕获指针：拖出画布（如经过工具栏）仍能继续采样并在松开时收尾
  try {
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId)
  } catch (err) { /* 忽略 */ }

  // 阻止事件继续传播到 Cesium，本次手势完全由自由绘制接管
  e.preventDefault()
  e.stopPropagation()
}

function onFreehandPointerMove(e) {
  if (!freehandActive || !drawState) return
  const dx = e.clientX - freehandLastScreen.x
  const dy = e.clientY - freehandLastScreen.y
  const distSq = dx * dx + dy * dy
  if (!freehandDragging && distSq < FREEHAND_DRAG_THRESHOLD * FREEHAND_DRAG_THRESHOLD) return
  if (freehandDragging && distSq < FREEHAND_SAMPLE_DIST * FREEHAND_SAMPLE_DIST) return

  const pos = pickGroundLngLat(eventToCanvasPosition(e))
  if (!pos) return

  if (!freehandDragging) {
    // 首次拖动：这一笔就是一条新线
    freehandDragging = true
    drawState.points = [freehandStartPos]
    drawState.mousePos = null
  }
  freehandLastScreen = { x: e.clientX, y: e.clientY }
  drawState.points.push(pos)
  updatePreview()
}

function onFreehandPointerUp(e) {
  if (!freehandActive) return
  freehandActive = false
  restoreDrawCameraMode()
  freehandLastScreen = null
  skipClick = true
  e.preventDefault()
  e.stopPropagation()
  if (!drawState) return
  if (!freehandDragging) {
    // 没有拖动：按一次普通单击处理（加点）
    if (freehandStartPos) {
      drawState.points.push(freehandStartPos)
      updatePreview()
    }
    freehandStartPos = null
    return
  }
  freehandDragging = false
  freehandStartPos = null
  finishClickSequence()
}

function cancelFreehand() {
  if (!freehandActive) return
  freehandActive = false
  freehandDragging = false
  freehandStartPos = null
  freehandLastScreen = null
  restoreDrawCameraMode()
}

function setupFreehand() {
  // 必须用 pointer 事件：Cesium 在 canvas 上对 pointerdown 调用了 preventDefault()，
  // 浏览器因此不会再派发兼容的 mousedown，监听 mousedown 会完全收不到画布上的按下。
  window.addEventListener('pointerdown', onFreehandPointerDown, true)
  window.addEventListener('pointermove', onFreehandPointerMove, true)
  window.addEventListener('pointerup', onFreehandPointerUp, true)
  window.addEventListener('pointercancel', cancelFreehand, true)
  window.addEventListener('blur', cancelFreehand)
}

function teardownFreehand() {
  window.removeEventListener('pointerdown', onFreehandPointerDown, true)
  window.removeEventListener('pointermove', onFreehandPointerMove, true)
  window.removeEventListener('pointerup', onFreehandPointerUp, true)
  window.removeEventListener('pointercancel', cancelFreehand, true)
  window.removeEventListener('blur', cancelFreehand)
  cancelFreehand()
}

// ==================== 点击序列绘制（线/面/箭头） ====================
function setupClickSequence(type) {
  // 单击加点
  handler.setInputAction((movement) => {
    // 自由绘制手势结束后的那次 click 忽略掉
    if (skipClick) {
      skipClick = false
      return
    }
    if (!drawState) return
    const pos = pickLngLat(movement.position)
    if (!pos) return
    // 双击会触发两次单击，用定时器延迟加点，双击时取消
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
      return
    }
    clickTimer = setTimeout(() => {
      clickTimer = null
      if (!drawState) return
      drawState.points.push(pos)
      updatePreview()
    }, 250)
  }, ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(() => {
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
    }
    finishClickSequence()
  }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  handler.setInputAction(() => {
    finishClickSequence(true)
  }, ScreenSpaceEventType.RIGHT_CLICK)

  handler.setInputAction((movement) => {
    if (!drawState || drawState.points.length === 0) return
    const pos = pickLngLat(movement.endPosition)
    if (!pos) return
    drawState.mousePos = pos
    updatePreview()
  }, ScreenSpaceEventType.MOUSE_MOVE)
}

function updatePreview() {
  const t = drawState.type
  // drawState.points 存储的是 {lng, lat, height} 对象，需转为 [lng, lat, height] 数组
  const pts = drawState.points.map(p => [p.lng, p.lat, p.height])
  const mouse = drawState.mousePos
  const mouseArr = mouse ? [mouse.lng, mouse.lat, mouse.height] : null
  const all = mouseArr ? [...pts, mouseArr] : pts
  // 折线至少需要 2 个位置，单点时先清掉预览
  if (all.length < 2) {
    cleanupPreview()
    return
  }
  const params = getCurrentParams()
  const h = avgH(all)

  if (t === 'LineString') {
    setPreviewLine(all, params, h)
    hidePreviewFill()
  } else if (t === 'Polygon') {
    setPreviewLine([...all, all[0]], params, h)
    setPreviewFill(all, cssColor(params.fillColor, params.fillOpacity), h)
  } else if (t === 'Arrow') {
    setPreviewLine(all, params, h)
    if (all.length >= 2) {
      const local = toLocalMeters(all)
      const head = computeArrowHead(local.pts, params)
      setPreviewFill(fromLocalMeters(local, head, avgH(all)), cssColor(params.strokeColor, params.strokeOpacity), h)
    } else {
      hidePreviewFill()
    }
  } else if (t === 'WindArrow') {
    setPreviewLine(all, params, h)
    if (all.length >= 2) {
      const local = toLocalMeters(all)
      const body = buildTaperedArrowPolygon(local.pts, params)
      if (body) {
        setPreviewFill(fromLocalMeters(local, body, avgH(all)), cssColor(params.fillColor, params.fillOpacity), h)
        return
      }
    }
    hidePreviewFill()
  } else if (t === 'BattleArrow') {
    setPreviewLine(all, params, h)
    if (all.length >= 2) {
      const local = toLocalMeters(all)
      const body = buildBattleArrowPolygon(local.pts, params)
      if (body) {
        setPreviewFill(
          fromLocalMeters(local, body, avgH(all)),
          params.gradientEnabled === false
            ? cssColor(params.strokeColor || '#4096FF', params.strokeOpacity ?? 1)
            : new ImageMaterialProperty({ image: createGradientCanvas(params), repeat: new Cartesian2(1, 1) }),
          h
        )
        return
      }
    }
    hidePreviewFill()
  }
}

function finishClickSequence() {
  if (!drawState) return
  const t = drawState.type
  const pts = drawState.points
  const min = t === 'Polygon' ? 3 : 2
  if (pts.length >= min) {
    const params = getCurrentParams()
    const coords = pts.map(p => [p.lng, p.lat, p.height])
    let f = null
    if (t === 'LineString') {
      f = buildFeature('LineString', params, coords)
    } else if (t === 'Polygon') {
      f = buildFeature('Polygon', params, coords, { ringFn: () => [...coords] })
    } else if (t === 'Arrow') {
      f = buildFeature('Arrow', params, coords)
    } else if (t === 'WindArrow') {
      f = buildFeature('WindArrow', params, coords, {
        ringFn: (p2) => {
          const local = toLocalMeters(coords)
          const body = buildTaperedArrowPolygon(local.pts, p2)
          return body ? fromLocalMeters(local, body, avgH(coords)) : coords
        }
      })
    } else if (t === 'BattleArrow') {
      f = buildFeature('BattleArrow', params, coords, {
        ringFn: (p2) => {
          const local = toLocalMeters(coords)
          const body = buildBattleArrowPolygon(local.pts, p2)
          return body ? fromLocalMeters(local, body, avgH(coords)) : coords
        }
      })
    }
    cleanupPreview()
    drawState.points = []
    drawState.mousePos = null
    if (f) {
      selectedFeature.value = f
      isSelectPicked.value = false
      updatePanelFromFeature(f)
    }
  } else if (pts.length > 0) {
    // 点数不足：取消本次绘制
    cleanupPreview()
    drawState.points = []
    drawState.mousePos = null
  }
}

// ==================== 拖拽绘制（矩形/椭圆/画圆） ====================
function setupDrag(type) {
  handler.setInputAction((movement) => {
    const pos = pickLngLat(movement.position)
    if (!pos) return
    drawState.startPos = pos
    drawState.endPos = pos
    drawState.dragging = true
    updateDragPreview()
  }, ScreenSpaceEventType.LEFT_DOWN)

  handler.setInputAction((movement) => {
    if (!drawState || !drawState.dragging) return
    const pos = pickLngLat(movement.endPosition)
    if (!pos) return
    drawState.endPos = pos
    updateDragPreview()
  }, ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(() => {
    if (!drawState || !drawState.dragging) return
    drawState.dragging = false
    finishDrag()
  }, ScreenSpaceEventType.LEFT_UP)
}

function updateDragPreview() {
  const t = drawState.type
  const s = drawState.startPos
  const e = drawState.endPos
  const params = getCurrentParams()
  const h = (s.height + e.height) / 2

  if (t === 'Rectangle') {
    const ring = rectRingFromTwoPoints(s, e, h)
    setPreviewFill(ring, cssColor(params.fillColor, params.fillOpacity), h)
    setPreviewLine([...ring, ring[0]], params, h)
  } else if (t === 'Ellipse') {
    const { rx, ry, center } = ellipseFromTwoPoints(s, e)
    const ring = ellipseRingMeters(center, rx, ry, h)
    setPreviewFill(ring, cssColor(params.fillColor, params.fillOpacity), h)
    setPreviewLine([...ring, ring[0]], params, h)
  } else if (t === 'CircleOutline') {
    const r = Math.max(1, distMeters(s, e))
    const ring = ellipseRingMeters({ lng: s.lng, lat: s.lat }, r, r, h)
    setPreviewLine([...ring, ring[0]], params, h)
    hidePreviewFill()
  }
}

function finishDrag() {
  const t = drawState.type
  const s = drawState.startPos
  const e = drawState.endPos
  const h = (s.height + e.height) / 2
  const params = getCurrentParams()
  let f = null

  if (t === 'Rectangle') {
    const ring = rectRingFromTwoPoints(s, e, h)
    f = buildFeature('Rectangle', params, [[s.lng, s.lat, h], [e.lng, e.lat, h]], {
      ringFn: () => [...ring]
    })
  } else if (t === 'Ellipse') {
    const { rx, ry, center } = ellipseFromTwoPoints(s, e)
    f = buildFeature('Ellipse', params, [[center.lng, center.lat, h]], {
      rx, ry,
      ringFn: () => ellipseRingMeters(center, rx, ry, h)
    })
  } else if (t === 'CircleOutline') {
    const r = Math.max(1, distMeters(s, e))
    params.radius = Math.round(r)
    const center = { lng: s.lng, lat: s.lat }
    f = buildFeature('CircleOutline', params, [[s.lng, s.lat, h]], {
      radius: r,
      ringFn: (p2) => ellipseRingMeters(center, p2.radius ?? r, p2.radius ?? r, h)
    })
  }

  cleanupPreview()
  drawState.startPos = null
  drawState.endPos = null
  if (f) {
    selectedFeature.value = f
    isSelectPicked.value = false
    updatePanelFromFeature(f)
  }
}

// ==================== 绘制模式 ====================
function startDrawMode(type) {
  // 绘制时保留相机交互（滚轮缩放 / 右键缩放 / 拖动旋转），
  // 仅拖拽类工具需要独占左键，此时把旋转临时交给中键
  viewer.scene.screenSpaceCameraController.enableInputs = true
  cancelFreehand()
  skipClick = false
  if (DRAG_TYPES.includes(type)) setDrawCameraMode()
  // 设置十字丝光标
  viewer.scene.canvas.style.cursor = 'crosshair'
  drawState = { type, points: [], mousePos: null, startPos: null, endPos: null, dragging: false }
  handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

  if (type === 'Point' || type === 'Text') {
    // 点 / 文字标注：单击落点即完成
    handler.setInputAction((movement) => {
      const pos = pickLngLat(movement.position)
      if (!pos) return
      const params = getCurrentParams()
      const f = buildFeature(type, params, [[pos.lng, pos.lat, pos.height]])
      selectedFeature.value = f
      isSelectPicked.value = false
      updatePanelFromFeature(f)
    }, ScreenSpaceEventType.LEFT_CLICK)
  } else if (CLICK_SEQUENCE_TYPES.includes(type)) {
    setupClickSequence(type)
  } else if (DRAG_TYPES.includes(type)) {
    setupDrag(type)
  }
}

// ==================== 工具激活 / 停用 ====================
function activateTool(type) {
  if (activeTool.value === type) {
    deactivateTool()
    return
  }
  deactivateTool()

  if (!viewer || viewer.isDestroyed()) return

  mapStore.setDrawingActive(true)
  activeTool.value = type

  // 箭头大小按类型给默认值（军标箭头默认 5x，其余箭头 1x）
  if (ARROW_TYPES.includes(type)) arrowScale.value = type === 'BattleArrow' ? 5 : 1

  if (type === 'Select') {
    startSelectMode()
  } else {
    startDrawMode(type)
  }
}

function deactivateTool() {
  if (clickTimer) {
    clearTimeout(clickTimer)
    clickTimer = null
  }
  cleanupPreview()
  drawState = null
  cancelFreehand()
  skipClick = false
  if (handler) {
    handler.destroy()
    handler = null
  }
  restoreDrawCameraMode()
  if (viewer && !viewer.isDestroyed() && viewer.scene) {
    viewer.scene.screenSpaceCameraController.enableInputs = true
    // 恢复默认光标
    viewer.scene.canvas.style.cursor = 'default'
  }
  unselect()
  activeTool.value = null
  mapStore.setDrawingActive(false)
}

// ==================== 样式变更处理 ====================
function onStyleChange() {
  if (isUpdatingPanel) return

  if (selectedFeature.value) {
    const f = selectedFeature.value
    const params = { ...(f.styleParams || {}) }
    params.strokeColor = strokeColor.value
    params.strokeWidth = strokeWidth.value
    params.strokeOpacity = strokeOpacity.value
    params.strokeDashType = strokeDashType.value
    params.dashLength = dashLength.value
    params.dashGap = dashGap.value
    params.fillColor = fillColor.value
    params.fillOpacity = fillOpacity.value
    params.outlineEnabled = outlineEnabled.value
    params.outlineColor = outlineColor.value
    params.outlineWidth = outlineWidth.value
    params.outlineOpacity = outlineOpacity.value
    if (hasRadius.value) params.radius = featureRadius.value
    if (isPointType.value) {
      params.pointAnimated = pointAnimated.value
      params.pointAnimType = pointAnimType.value
      params.pointAnimSpeed = pointAnimSpeed.value
    }
    if (isArrow.value) {
      params.arrowScale = arrowScale.value
      params.arrowHeadWidth = arrowHeadWidth.value
      if (currentFeatureType.value === 'BattleArrow') {
        params.gradientEnabled = gradientEnabled.value
        params.gradientStartColor = gradientStartColor.value
        params.gradientEndColor = gradientEndColor.value
        params.gradientStartOpacity = gradientStartOpacity.value
        params.gradientEndOpacity = gradientEndOpacity.value
      }
    }
    if (isTextType.value) {
      params.textContent = textContent.value
      params.textFontSize = textFontSize.value
      params.textBold = textBold.value
      params.textColor = textColor.value
      params.textRotation = textRotation.value
      params.textOffsetX = textOffsetX.value
      params.textOffsetY = textOffsetY.value
      params.textOutlineEnabled = textOutlineEnabled.value
      params.textOutlineColor = textOutlineColor.value
      params.textOutlineWidth = textOutlineWidth.value
      params.textBgEnabled = textBgEnabled.value
      params.textBgColor = textBgColor.value
      params.textBgOpacity = textBgOpacity.value
      params.textPadding = textPadding.value
      params.textBorderEnabled = textBorderEnabled.value
      params.textBorderColor = textBorderColor.value
      params.textBorderOpacity = textBorderOpacity.value
      params.textBorderWidth = textBorderWidth.value
      params.textBorderRadius = textBorderRadius.value
    }

    f.styleParams = params
    applyFeatureStyle(f)
    // 仅当通过"选择"工具手动选中时，才叠加高亮效果
    if (isSelectPicked.value) {
      applySelectionHighlight(f)
    }
  }
}

// 从选中要素更新面板参数
function updatePanelFromFeature(f) {
  const params = f.styleParams
  if (!params) return

  isUpdatingPanel = true
  strokeColor.value = params.strokeColor || '#4096FF'
  strokeWidth.value = params.strokeWidth || 2
  strokeOpacity.value = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
  strokeDashType.value = params.strokeDashType || 'solid'
  dashLength.value = params.dashLength || 8
  dashGap.value = params.dashGap || 4
  fillColor.value = params.fillColor || '#4096FF'
  fillOpacity.value = params.fillOpacity !== undefined ? params.fillOpacity : 0.15
  outlineEnabled.value = !!params.outlineEnabled
  outlineColor.value = params.outlineColor || '#FFFFFF'
  outlineWidth.value = params.outlineWidth !== undefined ? params.outlineWidth : 2
  outlineOpacity.value = params.outlineOpacity !== undefined ? params.outlineOpacity : 1
  if (params.radius !== undefined) featureRadius.value = params.radius
  pointAnimated.value = !!params.pointAnimated
  pointAnimType.value = params.pointAnimType || 'pulse'
  pointAnimSpeed.value = params.pointAnimSpeed !== undefined ? params.pointAnimSpeed : 1
  if (params.arrowScale !== undefined) arrowScale.value = params.arrowScale
  if (params.arrowHeadWidth !== undefined) arrowHeadWidth.value = params.arrowHeadWidth
  gradientEnabled.value = params.gradientEnabled !== undefined ? !!params.gradientEnabled : true
  if (params.gradientStartColor !== undefined) gradientStartColor.value = params.gradientStartColor
  if (params.gradientEndColor !== undefined) gradientEndColor.value = params.gradientEndColor
  if (params.gradientStartOpacity !== undefined) gradientStartOpacity.value = params.gradientStartOpacity
  if (params.gradientEndOpacity !== undefined) gradientEndOpacity.value = params.gradientEndOpacity
  // 文字标注参数
  if (params.textContent !== undefined) textContent.value = params.textContent
  if (params.textFontSize !== undefined) textFontSize.value = params.textFontSize
  if (params.textBold !== undefined) textBold.value = !!params.textBold
  if (params.textColor !== undefined) textColor.value = params.textColor
  if (params.textRotation !== undefined) textRotation.value = params.textRotation
  if (params.textOffsetX !== undefined) textOffsetX.value = params.textOffsetX
  if (params.textOffsetY !== undefined) textOffsetY.value = params.textOffsetY
  if (params.textOutlineEnabled !== undefined) textOutlineEnabled.value = !!params.textOutlineEnabled
  if (params.textOutlineColor !== undefined) textOutlineColor.value = params.textOutlineColor
  if (params.textOutlineWidth !== undefined) textOutlineWidth.value = params.textOutlineWidth
  if (params.textBgEnabled !== undefined) textBgEnabled.value = !!params.textBgEnabled
  if (params.textBgColor !== undefined) textBgColor.value = params.textBgColor
  if (params.textBgOpacity !== undefined) textBgOpacity.value = params.textBgOpacity
  if (params.textPadding !== undefined) textPadding.value = params.textPadding
  if (params.textBorderEnabled !== undefined) textBorderEnabled.value = !!params.textBorderEnabled
  if (params.textBorderColor !== undefined) textBorderColor.value = params.textBorderColor
  if (params.textBorderOpacity !== undefined) textBorderOpacity.value = params.textBorderOpacity
  if (params.textBorderWidth !== undefined) textBorderWidth.value = params.textBorderWidth
  if (params.textBorderRadius !== undefined) textBorderRadius.value = params.textBorderRadius

  nextTick(() => { isUpdatingPanel = false })
}

// ==================== 删除 / 清除 / 撤销 ====================
function deleteSelectedFeature() {
  if (selectedFeature.value) {
    removeFeature(selectedFeature.value)
    selectedFeature.value = null
    isSelectPicked.value = false
  }
}

function clearDrawings() {
  cleanupPreview()
  for (const f of [...features.value]) removeFeature(f)
  features.value = []
  selectedFeature.value = null
  isSelectPicked.value = false
}

function undoLast() {
  const f = features.value[features.value.length - 1]
  if (f) {
    if (selectedFeature.value === f) {
      selectedFeature.value = null
      isSelectPicked.value = false
    }
    removeFeature(f)
  }
}

// ==================== 关闭样式面板 ====================
function closeStylePanel() {
  // 选择模式下：取消选中要素即可关闭面板
  if (activeTool.value === 'Select' && selectedFeature.value) {
    unselect()
    return
  }
  // 绘制模式下：停用工具
  deactivateTool()
}

// ==================== 键盘事件 ====================
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (activeTool.value === 'Select' && selectedFeature.value) {
      unselect()
    } else {
      deactivateTool()
    }
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 开启深度测试，使 scene.pickPosition 能拾取地形高度（绘制要素贴合地形）
  if (viewer && viewer.scene && viewer.scene.globe) {
    savedDepthTest = viewer.scene.globe.depthTestAgainstTerrain
    viewer.scene.globe.depthTestAgainstTerrain = true
  }
  document.addEventListener('keydown', handleKeydown)
  // 自由绘制使用原生鼠标事件（window 捕获阶段），与 Cesium 输入处理器解耦
  setupFreehand()
})

onUnmounted(() => {
  deactivateTool()
  teardownFreehand()
  document.removeEventListener('keydown', handleKeydown)
  if (viewer && !viewer.isDestroyed() && viewer.scene && viewer.scene.globe) {
    viewer.scene.globe.depthTestAgainstTerrain = savedDepthTest
  }
})
</script>

<style scoped>
.drawing-toolbar {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: rgba(13, 31, 60, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(64, 150, 255, 0.15);
  border-radius: 10px;
  padding: 5px;
  width: 52px;
  min-width: 52px;
  user-select: none;
  z-index: 20;
}

/* ===== 工具按钮组 ===== */
.tool-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: auto;
  padding: 5px 2px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(186, 224, 255, 0.85);
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  color: #bae0ff;
  background: rgba(64, 150, 255, 0.15);
}

.tool-btn.active {
  color: #69b1ff;
  background: rgba(64, 150, 255, 0.2);
  box-shadow: inset 0 0 0 1px rgba(64, 150, 255, 0.4);
}

.tool-btn i {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.tool-label {
  font-size: 11px;
  line-height: 1.2;
  margin-top: 1px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ===== 分隔线 ===== */
.tool-divider {
  height: 1px;
  background: rgba(64, 150, 255, 0.12);
  margin: 4px 2px;
}

/* ===== 样式编辑面板 ===== */
.style-panel-container {
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 240px;
  background: rgba(13, 31, 60, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 150, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 21;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;
}

.style-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(64, 150, 255, 0.12);
}

.style-panel-icon {
  display: flex;
  align-items: center;
  color: #69b1ff;
}

.style-panel-title {
  font-size: 12px;
  color: #e6f0ff;
  font-weight: 600;
  letter-spacing: 0.5px;
  flex: 1;
}

.style-panel-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgba(186, 224, 255, 0.5);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  padding: 0;
}

.style-panel-close-btn:hover {
  background: rgba(255, 122, 105, 0.15);
  color: rgba(255, 140, 120, 0.9);
}

.style-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.style-label {
  font-size: 11px;
  color: rgba(186, 224, 255, 0.7);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.style-separator {
  font-size: 10px;
  color: rgba(255, 170, 0, 0.7);
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 0 0 0;
  border-top: 1px solid rgba(255, 170, 0, 0.15);
  margin-top: 2px;
}

/* 分隔标题（描边） */
.style-separator.outline-sep {
  color: rgba(105, 177, 255, 0.85);
  border-top-color: rgba(64, 150, 255, 0.22);
}

/* 分隔标题（自由绘制） */
.style-separator.freehand-sep {
  color: rgba(126, 232, 190, 0.85);
  border-top-color: rgba(82, 220, 170, 0.22);
}

/* 分隔标题（点动态样式） */
.style-separator.animate-sep {
  color: rgba(126, 232, 190, 0.85);
  border-top-color: rgba(82, 220, 170, 0.22);
}

/* 动画类型选择 */
.anim-type-group {
  display: flex;
  gap: 4px;
  width: 100%;
}

.anim-type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 5px 2px;
  background: rgba(82, 220, 170, 0.06);
  border: 1px solid rgba(82, 220, 170, 0.15);
  border-radius: 6px;
  color: rgba(186, 224, 255, 0.6);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.anim-type-btn:hover {
  color: #bae0ff;
  background: rgba(82, 220, 170, 0.12);
}

.anim-type-btn.active {
  color: #7ee8be;
  background: rgba(82, 220, 170, 0.18);
  border-color: rgba(82, 220, 170, 0.5);
  box-shadow: inset 0 0 0 1px rgba(82, 220, 170, 0.3);
}

.anim-type-btn i {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.freehand-hint {
  font-size: 10px;
  line-height: 1.5;
  padding: 1px 0 2px 0;
  color: rgba(126, 232, 190, 0.68);
}

/* 文字标注控件 */
.text-content-input {
  width: 100%;
  padding: 4px 6px;
  font-size: 11px;
  color: #bae0ff;
  background: rgba(64, 150, 255, 0.08);
  border: 1px solid rgba(64, 150, 255, 0.25);
  border-radius: 4px;
  outline: none;
  transition: all 0.2s;
}

.text-content-input:focus {
  border-color: #4096FF;
  background: rgba(64, 150, 255, 0.14);
  box-shadow: 0 0 6px rgba(64, 150, 255, 0.3);
}

.text-content-input::placeholder {
  color: rgba(186, 224, 255, 0.35);
}

/* 开关按钮 */
.switch-toggle {
  position: relative;
  width: 38px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid rgba(64, 150, 255, 0.25);
  border-radius: 10px;
  background: rgba(64, 150, 255, 0.08);
  cursor: pointer;
  transition: all 0.22s ease;
}

.switch-toggle:hover {
  border-color: rgba(64, 150, 255, 0.5);
}

.switch-toggle.active {
  background: #4096FF;
  border-color: #4096FF;
  box-shadow: 0 0 8px rgba(64, 150, 255, 0.45);
}

.switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(186, 224, 255, 0.75);
  transition: all 0.22s ease;
}

.switch-toggle.active .switch-knob {
  left: 20px;
  background: #fff;
}

.switch-text {
  font-size: 11px;
  font-weight: 600;
  color: rgba(186, 224, 255, 0.6);
  letter-spacing: 0.3px;
}

.switch-toggle.active + .switch-text {
  color: #69b1ff;
}

.style-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 36px;
  height: 26px;
  border: 1px solid rgba(64, 150, 255, 0.25);
  border-radius: 5px;
  cursor: pointer;
  background: transparent;
  padding: 0;
  flex-shrink: 0;
}

.color-input::-webkit-color-swatch-wrapper { padding: 2px; }
.color-input::-webkit-color-swatch { border: none; border-radius: 3px; }

.color-value {
  font-size: 11px;
  color: rgba(186, 224, 255, 0.6);
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  letter-spacing: 0.3px;
}

/* 预设颜色色板 */
.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.preset-color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(64, 150, 255, 0.2);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}

.preset-color-swatch:hover {
  transform: scale(1.15);
  border-color: rgba(64, 150, 255, 0.5);
}

.preset-color-swatch.active {
  border-color: #fff;
  box-shadow: 0 0 0 1px #4096FF;
}

/* 实线/虚线切换 */
.dash-toggle-group {
  display: flex;
  gap: 4px;
  width: 100%;
}

.dash-toggle-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 5px 4px;
  background: rgba(64, 150, 255, 0.06);
  border: 1px solid rgba(64, 150, 255, 0.1);
  border-radius: 6px;
  color: rgba(186, 224, 255, 0.6);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.dash-toggle-btn:hover {
  color: #bae0ff;
  background: rgba(64, 150, 255, 0.12);
}

.dash-toggle-btn.active {
  color: #69b1ff;
  background: rgba(64, 150, 255, 0.18);
  border-color: rgba(64, 150, 255, 0.4);
  box-shadow: inset 0 0 0 1px rgba(64, 150, 255, 0.3);
}

.range-input {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(64, 150, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4096FF;
  cursor: pointer;
  border: 2px solid rgba(230, 240, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.range-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4096FF;
  cursor: pointer;
  border: 2px solid rgba(230, 240, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.range-value {
  font-size: 11px;
  color: #69b1ff;
  font-weight: 600;
  min-width: 36px;
  text-align: right;
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}

.delete-feature-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 7px;
  background: rgba(255, 122, 105, 0.1);
  border: 1px solid rgba(255, 122, 105, 0.25);
  border-radius: 6px;
  color: rgba(255, 140, 120, 0.9);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.delete-feature-btn:hover {
  background: rgba(255, 122, 105, 0.2);
  color: #ff7a69;
  border-color: rgba(255, 122, 105, 0.4);
}

/* ===== 操作按钮 ===== */
.tool-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  padding: 5px 2px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  font-weight: 500;
}

.clear-btn { color: rgba(255, 140, 120, 0.7); }
.clear-btn:hover { color: #ff7a69; background: rgba(255, 122, 105, 0.1); }
.undo-btn { color: rgba(186, 224, 255, 0.7); }
.undo-btn:hover { color: #bae0ff; background: rgba(64, 150, 255, 0.15); }

/* ===== 面板动画 ===== */
.slide-fade-enter-active { transition: all 0.25s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(8px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(8px); }
</style>
