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

        <!-- ===== 几何样式（非文字标注） ===== -->
        <template v-if="!isTextType">

        <!-- 边线颜色 -->
        <div class="style-row">
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
        <div class="style-row">
          <label class="style-label">边线宽度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="strokeWidth"
              min="1" max="10" step="0.5"
              @input="onStyleChange"
            />
            <span class="range-value">{{ strokeWidth }}px</span>
          </div>
        </div>

        <!-- 边线透明度 -->
        <div class="style-row">
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

        <!-- ===== 边线描边（外边线） ===== -->
        <div class="style-separator outline-sep">边线描边</div>

        <div class="style-row">
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

        <!-- ===== 点动态样式 ===== -->
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

        </template><!-- /几何样式 -->

        <!-- ===== 文字标注样式 ===== -->
        <template v-if="isTextType">
          <div class="style-row">
            <label class="style-label">文字内容</label>
            <div class="style-control">
              <input
                ref="textInputRef"
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
            <label class="style-label">文字大小</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="textFontSize"
                min="8" max="64" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ textFontSize }}px</span>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">文字颜色</label>
            <div class="style-control">
              <input
                type="color"
                class="color-input"
                v-model="textColor"
                @input="onStyleChange"
              />
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
                @click="toggleTextBold"
                :title="textBold ? '点击取消加粗' : '点击加粗文字'"
              >
                <span class="switch-knob"></span>
              </button>
              <button
                class="bold-preview-btn"
                :class="{ active: textBold }"
                @click="toggleTextBold"
                title="加粗预览"
              >Aa</button>
              <span class="switch-text">{{ textBold ? '已加粗' : '常规' }}</span>
            </div>
          </div>

          <div class="style-row">
            <label class="style-label">旋转角度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="textRotation"
                min="0" max="360" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ textRotation }}°</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">角度微调</label>
            <div class="style-control">
              <div class="rotation-quick-group">
                <button v-for="a in rotationQuick" :key="a" class="rotation-quick-btn" @click="textRotation = a; onStyleChange()">{{ a }}°</button>
                <button class="rotation-quick-btn" @click="textRotation = 0; onStyleChange()" title="归零">归零</button>
              </div>
            </div>
          </div>

          <div class="style-separator text-sep">文字背景</div>

          <div class="style-row">
            <label class="style-label">启用背景</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textBgEnabled }"
                @click="toggleTextBg"
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
                <input
                  type="color"
                  class="color-input"
                  v-model="textBgColor"
                  @input="onStyleChange"
                />
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
                <input
                  type="range"
                  class="range-input"
                  v-model.number="textBgOpacity"
                  min="0" max="1" step="0.05"
                  @input="onStyleChange"
                />
                <span class="range-value">{{ Math.round(textBgOpacity * 100) }}%</span>
              </div>
            </div>
          </template>

          <div class="style-row">
            <label class="style-label">启用边框</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textBorderEnabled }"
                @click="toggleTextBorder"
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
                <input
                  type="color"
                  class="color-input"
                  v-model="textBorderColor"
                  @input="onStyleChange"
                />
                <span class="color-value">{{ textBorderColor }}</span>
              </div>
              <div class="preset-colors">
                <button
                  v-for="c in presetColors"
                  :key="'td-' + c"
                  class="preset-color-swatch"
                  :class="{ active: textBorderColor.toUpperCase() === c.toUpperCase() }"
                  :style="{ background: c }"
                  @click="selectPresetColor(c, 'textBorder')"
                  :title="c"
                ></button>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">边框宽度</label>
              <div class="style-control">
                <input
                  type="range"
                  class="range-input"
                  v-model.number="textBorderWidth"
                  min="0.5" max="8" step="0.5"
                  @input="onStyleChange"
                />
                <span class="range-value">{{ textBorderWidth }}px</span>
              </div>
            </div>
            <div class="style-row">
              <label class="style-label">边框圆角</label>
              <div class="style-control">
                <input
                  type="range"
                  class="range-input"
                  v-model.number="textBorderRadius"
                  min="0" max="24" step="1"
                  @input="onStyleChange"
                />
                <span class="range-value">{{ textBorderRadius }}px</span>
              </div>
            </div>
          </template>

          <div class="style-row" v-if="textBgEnabled || textBorderEnabled">
            <label class="style-label">内边距</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="textPadding"
                min="0" max="24" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ textPadding }}px</span>
            </div>
          </div>

          <div class="style-separator text-sep">文字描边</div>

          <div class="style-row">
            <label class="style-label">启用描边</label>
            <div class="style-control">
              <button
                class="switch-toggle"
                :class="{ active: textOutlineEnabled }"
                @click="toggleTextOutline"
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
                <input
                  type="color"
                  class="color-input"
                  v-model="textOutlineColor"
                  @input="onStyleChange"
                />
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
                <input
                  type="range"
                  class="range-input"
                  v-model.number="textOutlineWidth"
                  min="1" max="10" step="0.5"
                  @input="onStyleChange"
                />
                <span class="range-value">{{ textOutlineWidth }}px</span>
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
                min="0.5" max="5" step="0.1"
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
                min="1" max="10" step="0.5"
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMapStore } from '../stores/mapStore'
import Draw from 'ol/interaction/Draw'
import Select from 'ol/interaction/Select'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import CircleStyle from 'ol/style/Circle'
import Polygon from 'ol/geom/Polygon'
import LineString from 'ol/geom/LineString'

const props = defineProps({
  map: { type: Object, default: null }
})

const mapStore = useMapStore()

// ==================== 工具定义 ====================
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

// 样式参数
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
// 点动态样式参数
const pointAnimated = ref(false)
const pointAnimType = ref('pulse')   // pulse 脉冲 | breathe 呼吸 | blink 闪烁
const pointAnimSpeed = ref(1)
// 文字标注参数
const textContent = ref('标注文字')
const textFontSize = ref(14)
const textBold = ref(false)
const textColor = ref('#FFFFFF')
const textRotation = ref(0)          // 角度（度）
const textOutlineEnabled = ref(false)
const textOutlineColor = ref('#000000')
const textOutlineWidth = ref(3)
// 文字背景 / 边框参数
const textBgEnabled = ref(false)
const textBgColor = ref('#000000')
const textBgOpacity = ref(0.45)
const textBorderEnabled = ref(false)
const textBorderColor = ref('#4096FF')
const textBorderOpacity = ref(1)
const textBorderWidth = ref(1.5)
const textBorderRadius = ref(4)
const textPadding = ref(4)
// 箭头参数
const arrowScale = ref(1)
const arrowHeadWidth = ref(3)
// 军标箭头渐变参数（默认按附件样式：尾→头由淡变深）
const gradientStartColor = ref('#FFB3B3')
const gradientEndColor = ref('#D32F2F')
const gradientStartOpacity = ref(0.3)
const gradientEndOpacity = ref(1)

// 预设颜色（含红色和黄色）
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
  else if (target === 'text') textColor.value = color
  else if (target === 'textOutline') textOutlineColor.value = color
  else if (target === 'textBg') textBgColor.value = color
  else if (target === 'textBorder') textBorderColor.value = color
  else if (target === 'gradientStart') gradientStartColor.value = color
  else if (target === 'gradientEnd') gradientEndColor.value = color
  onStyleChange()
}

// 动画类型定义
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

function toggleTextBold() {
  textBold.value = !textBold.value
  onStyleChange()
}

function toggleTextOutline() {
  textOutlineEnabled.value = !textOutlineEnabled.value
  onStyleChange()
}

function toggleTextBg() {
  textBgEnabled.value = !textBgEnabled.value
  onStyleChange()
}

function toggleTextBorder() {
  textBorderEnabled.value = !textBorderEnabled.value
  onStyleChange()
}

// 旋转角度快捷值
const rotationQuick = [0, 45, 90, 135, 180, 270]

// 文字内容输入框引用（落点后自动聚焦，便于立即编辑）
const textInputRef = ref(null)

// 面板更新标志
let isUpdatingPanel = false

// 箭头类型列表
const ARROW_TYPES = ['Arrow', 'WindArrow', 'BattleArrow']

// 当前操作要素类型
const currentFeatureType = computed(() => {
  if (selectedFeature.value) return selectedFeature.value.get('drawType')
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

// 是否是选择工具选中的要素（而非绘制后自动选中）
const isSelectPicked = ref(false)

// 面板标题
const panelTitle = computed(() => {
  if (selectedFeature.value) {
    const type = selectedFeature.value.get('drawType')
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

// 是否为文字标注
const isTextType = computed(() => {
  return currentFeatureType.value === 'Text'
})

// 是否有边线（所有要素除纯点外都有边线）
const hasStroke = computed(() => {
  const t = currentFeatureType.value
  return t !== 'Point' && t !== 'CircleOutline' && t !== 'Text'
})

// 是否是箭头类型
const isArrow = computed(() => {
  return ARROW_TYPES.includes(currentFeatureType.value)
})

// 是否为点要素（支持动态样式）
const isPointType = computed(() => {
  return currentFeatureType.value === 'Point'
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

// ==================== 动画渲染循环 ====================
// 仅在存在「开启动态样式的点要素」或点工具开启动态预览时驱动地图重绘
let animRAF = null

function hasAnimatedContent() {
  if (activeTool.value === 'Point' && pointAnimated.value) return true
  if (!vectorSource) return false
  return vectorSource.getFeatures().some(
    f => f.get('drawType') === 'Point' && f.get('styleParams') && f.get('styleParams').pointAnimated
  )
}

// 强制图层重新计算样式：
// OpenLayers 会把已渲染的样式缓存进 replayGroup，只有 resolution / extent / revision
// 变化时才重建。样式函数（动画）必须靠提升图层 revision 才能每帧重新求值。
function invalidateLayerStyles() {
  if (vectorLayer) vectorLayer.changed()
  if (sketchLayer) sketchLayer.changed()
}

function syncAnimationLoop() {
  if (!props.map) return
  const need = hasAnimatedContent()
  if (need && animRAF === null) {
    const tick = () => {
      animRAF = requestAnimationFrame(tick)
      invalidateLayerStyles()
      props.map.render()
    }
    animRAF = requestAnimationFrame(tick)
  } else if (!need && animRAF !== null) {
    cancelAnimationFrame(animRAF)
    animRAF = null
    invalidateLayerStyles()
    props.map.render()
  }
}

function stopAnimationLoop() {
  if (animRAF !== null) {
    cancelAnimationFrame(animRAF)
    animRAF = null
  }
}

// ==================== 矢量图层 ====================
let vectorSource = null
let vectorLayer = null
let drawInteraction = null
let sketchLayer = null      // 绘制预览（sketch）所在图层，动画预览同样需要失效缓存
let selectInteraction = null
let modifyInteraction = null

function initVectorLayer() {
  vectorSource = new VectorSource()
  vectorLayer = new VectorLayer({
    source: vectorSource,
    zIndex: 9999,
    properties: { name: 'drawing-layer' }
  })
  if (props.map) {
    props.map.addLayer(vectorLayer)
  }
}

// ==================== 样式工具函数 ====================
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 构建 Stroke 配置
function buildStroke(params) {
  const sc = params.strokeColor || '#4096FF'
  const sw = params.strokeWidth || 2
  const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
  const dashType = params.strokeDashType || 'solid'

  const strokeOpts = {
    color: hexToRgba(sc, so),
    width: sw,
    lineCap: 'round',
    lineJoin: 'round'
  }

  if (dashType === 'dashed') {
    strokeOpts.lineDash = [params.dashLength || 8, params.dashGap || 4]
  }

  return new Stroke(strokeOpts)
}

// 描边色 rgba
function outlineRgba(params) {
  const oc = params.outlineColor || '#FFFFFF'
  const oo = params.outlineOpacity !== undefined ? params.outlineOpacity : 1
  return hexToRgba(oc, oo)
}

// 是否启用描边
function hasOutline(params) {
  return !!params.outlineEnabled
}

// 构建外描边 Stroke（宽度 = 主线宽度 + 2 × 描边宽度，虚线同步主线节奏）
function buildOutlineStroke(params, baseWidth) {
  const ow = params.outlineWidth || 2
  const strokeOpts = {
    color: outlineRgba(params),
    width: baseWidth + ow * 2,
    lineCap: 'round',
    lineJoin: 'round'
  }
  if ((params.strokeDashType || 'solid') === 'dashed') {
    strokeOpts.lineDash = [params.dashLength || 8, params.dashGap || 4]
  }
  return new Stroke(strokeOpts)
}

// ==================== 点样式（支持描边 + 动态动画） ====================
// now 传入时按时间计算动画帧；不传则为静态样式
function buildPointStyles(params, now) {
  const sc = params.strokeColor || '#4096FF'
  const sw = params.strokeWidth || 2
  const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
  const baseR = params.radius || sw * 3

  const styles = []

  // 外描边圆（半径 = 主圆 + 描边宽度）
  if (hasOutline(params)) {
    styles.push(new Style({
      image: new CircleStyle({
        radius: baseR + (params.outlineWidth || 2),
        fill: new Fill({ color: outlineRgba(params) })
      })
    }))
  }

  let radius = baseR
  let strokeAlpha = so
  let fillAlpha = so * 0.3

  if (now !== undefined) {
    const speed = params.pointAnimSpeed || 1
    const animType = params.pointAnimType || 'pulse'

    if (animType === 'pulse') {
      // 脉冲：向外扩散的光圈（三圈错相位，越外圈越淡）
      const period = 1800 / speed
      for (let i = 0; i < 3; i++) {
        const t = ((now + (i * period) / 3) % period) / period
        const rr = baseR + t * (baseR * 2.4 + 10)
        const a = (1 - t) * (1 - t) * so * 0.95
        styles.push(new Style({
          image: new CircleStyle({
            radius: rr,
            stroke: new Stroke({ color: hexToRgba(sc, a), width: Math.max(1.2, sw * 0.9) })
          })
        }))
      }
    } else if (animType === 'breathe') {
      // 呼吸：半径循环缩放（0.7 ~ 1.4 倍）
      const w = (2 * Math.PI * speed) / 1800
      radius = baseR * (1.05 + 0.35 * Math.sin(now * w))
    } else if (animType === 'blink') {
      // 闪烁：明暗高对比循环（亮态额外加一圈光晕，暗态几乎隐没）
      const w = (2 * Math.PI * speed) / 1000
      const s = 0.5 + 0.5 * Math.sin(now * w)   // 0 → 1 → 0
      const k = 0.12 + 0.88 * s                  // 0.12 ~ 1.0
      strokeAlpha = so * k
      fillAlpha = so * 0.45 * k
      // 亮态光晕
      if (s > 0.35) {
        styles.push(new Style({
          image: new CircleStyle({
            radius: baseR + 3 + 4 * s,
            stroke: new Stroke({ color: hexToRgba(sc, so * (s - 0.35) * 0.9), width: Math.max(1, sw * 0.8) })
          })
        }))
      }
    }
  }

  styles.push(new Style({
    image: new CircleStyle({
      radius: Math.max(0.5, radius),
      fill: new Fill({ color: hexToRgba(sc, fillAlpha) }),
      stroke: new Stroke({ color: hexToRgba(sc, strokeAlpha), width: sw })
    })
  }))

  return styles
}

// ==================== 文字标注样式 ====================
// OL 原生 Text 样式不支持圆角背景，这里改用自定义 renderer 绘制：
// 圆角背景 + 边框 + 文字描边（光晕）+ 文字本体，全部在像素空间完成。

// 圆角矩形路径（不依赖 Canvas.roundRect，兼容旧内核）
function roundRectPath(context, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r || 0, Math.min(w, h) / 2))
  if (rr <= 0) {
    context.rect(x, y, w, h)
    return
  }
  context.moveTo(x + rr, y)
  context.lineTo(x + w - rr, y)
  context.arcTo(x + w, y, x + w, y + rr, rr)
  context.lineTo(x + w, y + h - rr)
  context.arcTo(x + w, y + h, x + w - rr, y + h, rr)
  context.lineTo(x + rr, y + h)
  context.arcTo(x, y + h, x, y + h - rr, rr)
  context.lineTo(x, y + rr)
  context.arcTo(x, y, x + rr, y, rr)
  context.closePath()
}

// 生成文字标注渲染函数
// opts.highlight = true 时只绘制用于「选中态」的高亮外框
function createTextRenderer(params, opts = {}) {
  return function textRenderer(pixelCoordinates, state) {
    const context = state && state.context
    if (!context) return
    if (!pixelCoordinates || pixelCoordinates.length === 0) return

    // Point 几何传入扁平数组 [x, y]；兼容可能的多维形式
    let px, py
    if (Array.isArray(pixelCoordinates[0])) {
      px = pixelCoordinates[0][0]
      py = pixelCoordinates[0][1]
    } else {
      px = pixelCoordinates[0]
      py = pixelCoordinates[1]
    }
    if (!isFinite(px) || !isFinite(py)) return

    const size = params.textFontSize || 14
    const bold = !!params.textBold
    const text = params.textContent !== undefined ? params.textContent : ''
    const rot = (((params.textRotation || 0) % 360) * Math.PI) / 180
    const pad = params.textPadding !== undefined ? params.textPadding : 4

    context.save()
    context.translate(px, py)
    context.rotate(rot + (state.rotation || 0))

    context.font = `${bold ? 'bold ' : ''}${size}px sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    // 量测文字实际行盒
    const m = context.measureText(text)
    const ascent = m.actualBoundingBoxAscent !== undefined ? m.actualBoundingBoxAscent : size * 0.8
    const descent = m.actualBoundingBoxDescent !== undefined ? m.actualBoundingBoxDescent : size * 0.2
    const bw = m.width + pad * 2
    const bh = ascent + descent + pad * 2
    const bx = -bw / 2
    const by = -bh / 2

    if (opts.highlight) {
      // 选中态：文字外侧再扩一圈青色高亮框
      const g = 3
      context.beginPath()
      roundRectPath(context, bx - g, by - g, bw + g * 2, bh + g * 2, (params.textBorderRadius || 0) + g)
      context.fillStyle = 'rgba(5, 245, 255, 0.14)'
      context.fill()
      context.strokeStyle = '#05f5ff'
      context.lineWidth = 1.5
      context.stroke()
      context.restore()
      return
    }

    const radius = params.textBorderRadius || 0

    // 背景
    if (params.textBgEnabled) {
      context.beginPath()
      roundRectPath(context, bx, by, bw, bh, radius)
      context.fillStyle = hexToRgba(
        params.textBgColor || '#000000',
        params.textBgOpacity !== undefined ? params.textBgOpacity : 0.45
      )
      context.fill()
    }

    // 边框
    if (params.textBorderEnabled) {
      context.beginPath()
      roundRectPath(context, bx, by, bw, bh, radius)
      context.strokeStyle = hexToRgba(
        params.textBorderColor || '#4096FF',
        params.textBorderOpacity !== undefined ? params.textBorderOpacity : 1
      )
      context.lineWidth = params.textBorderWidth || 1.5
      context.stroke()
    }

    // 文字描边（光晕）：先描后填，露出外侧一圈即为描边效果
    if (params.textOutlineEnabled) {
      context.lineJoin = 'round'
      context.miterLimit = 2
      context.lineWidth = (params.textOutlineWidth || 3) * 2
      context.strokeStyle = params.textOutlineColor || '#000000'
      context.strokeText(text, 0, 0)
    }

    // 文字本体
    context.fillStyle = params.textColor || '#FFFFFF'
    context.fillText(text, 0, 0)

    context.restore()
  }
}

// 文字标注样式数组
function buildTextStyles(params) {
  return [new Style({ renderer: createTextRenderer(params) })]
}

// 选中高亮：在文字外框一圈青色底框（本体样式保持不变）
function buildTextHighlightStyle(params) {
  return new Style({ renderer: createTextRenderer(params, { highlight: true }) })
}

// 动画点：返回 OpenLayers 样式函数（每帧按当前时间重算）
function createAnimatedPointStyle(params) {
  return function (feature) {
    const p = (feature && feature.get('styleParams')) || params || {}
    return buildPointStyles(p, performance.now())
  }
}

// 根据类型和参数创建样式
// 返回值可能是 Style 数组（静态）或样式函数（点开启动态时）
function createStyleFromParams(type, params) {
  if (type === 'Text') {
    return buildTextStyles(params)
  }

  if (type === 'Point') {
    if (params.pointAnimated) return createAnimatedPointStyle(params)
    return buildPointStyles(params)
  }

  if (type === 'Arrow' || type === 'WindArrow' || type === 'BattleArrow') return null // 箭头单独处理

  if (type === 'CircleOutline') {
    const sw = params.strokeWidth || 2
    const styles = []
    if (hasOutline(params)) {
      styles.push(new Style({ stroke: buildOutlineStroke(params, sw) }))
    }
    styles.push(new Style({ stroke: buildStroke(params) }))
    return styles
  }

  if (type === 'LineString') {
    const sw = params.strokeWidth || 2
    const styles = []
    if (hasOutline(params)) {
      styles.push(new Style({ stroke: buildOutlineStroke(params, sw) }))
    }
    styles.push(new Style({ stroke: buildStroke(params) }))
    return styles
  }

  if (['Polygon', 'Rectangle', 'Ellipse'].includes(type)) {
    const sw = params.strokeWidth || 2
    const fc = params.fillColor || '#4096FF'
    const fo = params.fillOpacity !== undefined ? params.fillOpacity : 0.15
    const styles = []
    // 外描边：无填充，仅更粗的边线，内侧一半会被填充层覆盖
    if (hasOutline(params)) {
      styles.push(new Style({ stroke: buildOutlineStroke(params, sw) }))
    }
    styles.push(new Style({
      stroke: buildStroke(params),
      fill: new Fill({ color: hexToRgba(fc, fo) })
    }))
    return styles
  }

  const sw = params.strokeWidth || 2
  const styles = []
  if (hasOutline(params)) {
    styles.push(new Style({ stroke: buildOutlineStroke(params, sw) }))
  }
  styles.push(new Style({ stroke: buildStroke(params) }))
  return styles
}

// 获取当前样式参数对象
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
    radius: featureRadius.value,
    outlineEnabled: outlineEnabled.value,
    outlineColor: outlineColor.value,
    outlineWidth: outlineWidth.value,
    outlineOpacity: outlineOpacity.value,
    pointAnimated: pointAnimated.value,
    pointAnimType: pointAnimType.value,
    pointAnimSpeed: pointAnimSpeed.value,
    textContent: textContent.value,
    textFontSize: textFontSize.value,
    textBold: textBold.value,
    textColor: textColor.value,
    textRotation: textRotation.value,
    textOutlineEnabled: textOutlineEnabled.value,
    textOutlineColor: textOutlineColor.value,
    textOutlineWidth: textOutlineWidth.value,
    textBgEnabled: textBgEnabled.value,
    textBgColor: textBgColor.value,
    textBgOpacity: textBgOpacity.value,
    textBorderEnabled: textBorderEnabled.value,
    textBorderColor: textBorderColor.value,
    textBorderOpacity: textBorderOpacity.value,
    textBorderWidth: textBorderWidth.value,
    textBorderRadius: textBorderRadius.value,
    textPadding: textPadding.value,
    arrowScale: arrowScale.value,
    arrowHeadWidth: arrowHeadWidth.value,
    gradientStartColor: gradientStartColor.value,
    gradientEndColor: gradientEndColor.value,
    gradientStartOpacity: gradientStartOpacity.value,
    gradientEndOpacity: gradientEndOpacity.value
  }
}

// 将样式应用到指定要素
function applyFeatureStyle(feature) {
  const params = feature.get('styleParams')
  const type = feature.get('drawType')
  if (!params || !type) return

  if (type === 'Arrow') {
    applySmallArrowStyle(feature, params)
  } else if (type === 'WindArrow') {
    applyWindArrowStyle(feature, params)
  } else if (type === 'BattleArrow') {
    applyBattleArrowStyle(feature, params)
  } else {
    const style = createStyleFromParams(type, params)
    if (style) feature.setStyle(style)
  }

  // 样式已替换，需提升图层 revision 才能让新样式立即生效（否则仍是缓存帧）
  invalidateLayerStyles()
}

// ==================== 小箭头样式 — 细杆 + 三角箭头尖 ====================
// 构造箭头三角几何
function buildArrowHeadTriangle(last, angle, headLen, halfW) {
  const tip = [
    last[0] + Math.cos(angle) * headLen,
    last[1] + Math.sin(angle) * headLen
  ]
  const baseLeft = [
    last[0] + Math.cos(angle + Math.PI / 2) * halfW,
    last[1] + Math.sin(angle + Math.PI / 2) * halfW
  ]
  const baseRight = [
    last[0] + Math.cos(angle - Math.PI / 2) * halfW,
    last[1] + Math.sin(angle - Math.PI / 2) * halfW
  ]
  return new Polygon([[tip, baseLeft, baseRight, tip]])
}

// 小箭头样式数组（绘制预览 & 最终要素共用）
function buildArrowStyles(coords, params) {
  const p = { ...(params || {}) }
  const sc = p.strokeColor || '#4096FF'
  const sw = p.strokeWidth || 2
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  const rgba = hexToRgba(sc, so)
  const scale = p.arrowScale || 1
  const headW = p.arrowHeadWidth || 5

  if (!coords || coords.length < 2) return [new Style({ stroke: buildStroke(p) })]

  const last = coords[coords.length - 1]
  const prev = coords[coords.length - 2]
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])

  const headLen = 10 * scale
  const halfW = headW * scale * 0.8

  const arrowHead = buildArrowHeadTriangle(last, angle, headLen, halfW)

  const styles = []

  // 描边层：更粗的杆身 + 放大的箭头三角
  if (hasOutline(p)) {
    const ow = p.outlineWidth || 2
    styles.push(new Style({ stroke: buildOutlineStroke(p, sw) }))
    styles.push(new Style({
      geometry: buildArrowHeadTriangle(last, angle, headLen + ow * 1.6, halfW + ow),
      fill: new Fill({ color: outlineRgba(p) })
    }))
  }

  styles.push(
    // 杆身
    new Style({ stroke: buildStroke(p) }),
    // 箭头三角
    new Style({
      geometry: arrowHead,
      fill: new Fill({ color: rgba }),
      stroke: new Stroke({ color: rgba, width: 1 })
    })
  )

  return styles
}

function applySmallArrowStyle(feature, params) {
  const geom = feature.getGeometry()
  if (!geom) return
  let coords
  try { coords = geom.getCoordinates() } catch (e) { return }
  feature.setStyle(buildArrowStyles(coords, params))
}

// 风向箭头样式数组（绘制预览 & 最终要素共用）
function buildWindArrowStyles(coords, params) {
  const p = { ...(params || {}) }
  const sc = p.strokeColor || '#4096FF'
  const sw = p.strokeWidth || 2
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  const fc = p.fillColor || sc
  const fo = p.fillOpacity !== undefined ? p.fillOpacity : 0.25

  const polygon = buildTaperedArrowPolygon(coords, p, true)
  if (!polygon) return [new Style({ stroke: buildStroke(p) })]

  const styles = []
  // 描边层：同几何、更粗的边线、无填充
  if (hasOutline(p)) {
    styles.push(new Style({
      geometry: polygon,
      stroke: buildOutlineStroke(p, sw)
    }))
  }
  styles.push(new Style({
    geometry: polygon,
    stroke: new Stroke({
      color: hexToRgba(sc, so),
      width: sw,
      lineJoin: 'round',
      lineCap: 'round'
    }),
    fill: new Fill({ color: hexToRgba(fc, fo) })
  }))
  return styles
}

// ==================== 风向箭头样式 — 曲线粗箭头（尾窄→体宽→尖头） ====================
function applyWindArrowStyle(feature, params) {
  const geom = feature.getGeometry()
  if (!geom) return
  let coords
  try { coords = geom.getCoordinates() } catch (e) { return }
  feature.setStyle(buildWindArrowStyles(coords, params))
}

// ==================== 军标箭头几何函数 — 攻击箭头（尾窄→体宽→V形尖） ====================
function buildTaperedArrowPolygon(coords, params, smooth = false) {
  if (!coords || coords.length < 2) return null
  let path = coords
  if (smooth && coords.length >= 3) {
    path = catmullRomSmooth(coords, 24)
  }

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

    // 宽度曲线：尾窄→体宽→头更宽
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

  // 闭合多边形：左侧 → 尖端 → 右侧（逆序）
  const ring = [...leftSide, tip, ...rightSide.reverse()]
  ring.push(ring[0])

  return new Polygon([ring])
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

// ==================== 军标箭头几何函数 — 经典填充箭头（窄尾柄 + 宽三角头） ====================
function buildBattleArrowPolygon(coords, params) {
  if (!coords || coords.length < 2) return null

  const scale = params.arrowScale || 1
  const arrowHeadWidth = params.arrowHeadWidth || 6

  // 形状比例（参考附件样式）：
  //   三角头底宽 ≈ 1.8 × 箭杆宽度基准
  //   箭杆（柄）宽度 ≈ 头底宽 × 0.42，形成明显的"翅膀"凹口
  const baseW = arrowHeadWidth * scale * 1.8   // 三角头底部半宽
  const stemW = baseW * 0.42                    // 箭杆半宽

  // 计算路径总长与各段长度
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

  // 头部占比：理想状态下约为 45%，但太短的路径会按 baseW 自动撑大
  const headRatio = Math.min(0.45, Math.max(0.25, (baseW * 2.5) / totalLen))

  // 沿路径均匀采样（保证三角头曲线顺滑，无论用户画几个点）
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

    // 宽度曲线：柄 = 常数 stemW；头部区域由 baseW 线性收窄到 0（尖端）
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

  const ring = [...leftSide, ...rightSide.reverse()]
  ring.push(ring[0])

  return new Polygon([ring])
}

// ==================== 椭圆几何函数 ====================
function getEllipseGeometryFunction() {
  return (coordinates, optGeometry) => {
    if (!optGeometry) optGeometry = new Polygon([])
    const start = coordinates[0]
    const end = coordinates[coordinates.length - 1]
    const cx = (start[0] + end[0]) / 2
    const cy = (start[1] + end[1]) / 2
    const rx = Math.abs(end[0] - start[0]) / 2
    const ry = Math.abs(end[1] - start[1]) / 2
    const steps = 64
    const ringCoords = []
    for (let i = 0; i <= steps; i++) {
      const angle = (2 * Math.PI * i) / steps
      ringCoords.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)])
    }
    optGeometry.setCoordinates([ringCoords])
    return optGeometry
  }
}

// ==================== 矩形几何函数 ====================
function getRectangleGeometryFunction() {
  return (coordinates, optGeometry) => {
    if (!optGeometry) optGeometry = new Polygon([])
    const start = coordinates[0]
    const end = coordinates[coordinates.length - 1]
    optGeometry.setCoordinates([[
      [start[0], start[1]],
      [start[0], end[1]],
      [end[0], end[1]],
      [end[0], start[1]],
      [start[0], start[1]]
    ]])
    return optGeometry
  }
}

// ==================== 工具激活 ====================
function activateTool(type) {
  if (activeTool.value === type) {
    deactivateTool()
    return
  }

  deactivateTool()

  if (!props.map) return

  mapStore.setDrawingActive(true)

  if (type === 'Select') {
    activateSelectMode()
  } else {
    activateDrawMode(type)
  }

  activeTool.value = type
  syncAnimationLoop()
}

// ==================== 选择模式 ====================
function activateSelectMode() {
  selectInteraction = new Select({
    layers: [vectorLayer]
  })

  modifyInteraction = new Modify({
    features: selectInteraction.getFeatures()
  })

  selectInteraction.on('select', (e) => {
    e.deselected.forEach(f => applyFeatureStyle(f))

    if (e.selected.length > 0) {
      selectedFeature.value = e.selected[0]
      isSelectPicked.value = true
      updatePanelFromFeature(e.selected[0])
      applySelectionHighlight(e.selected[0])
    } else {
      selectedFeature.value = null
      isSelectPicked.value = false
    }
  })

  modifyInteraction.on('modifyend', (e) => {
    e.features.forEach(f => {
      applyFeatureStyle(f)
      if (f === selectedFeature.value) applySelectionHighlight(f)
    })
  })

  props.map.addInteraction(modifyInteraction)
  props.map.addInteraction(selectInteraction)

  const viewport = props.map.getViewport()
  viewport.style.cursor = 'pointer'
}

// ==================== 选中高亮 ====================
function applySelectionHighlight(feature) {
  const type = feature.get('drawType')
  const params = feature.get('styleParams')
  if (!params) return

  const sw = params.strokeWidth || 2

  // 文字标注：保留文字本体样式，外框一圈青色底框表示选中
  if (type === 'Text') {
    feature.setStyle([...buildTextStyles(params), buildTextHighlightStyle(params)])
    invalidateLayerStyles()
    return
  }

  let baseStyles
  if (type === 'Arrow') {
    applySmallArrowStyle(feature, params)
    baseStyles = feature.getStyle()
  } else if (type === 'WindArrow') {
    applyWindArrowStyle(feature, params)
    baseStyles = feature.getStyle()
  } else if (type === 'BattleArrow') {
    applyBattleArrowStyle(feature, params)
    baseStyles = [feature.getStyle()]
  } else {
    baseStyles = createStyleFromParams(type, params)
  }

  const outerGlow = new Style({
    stroke: new Stroke({
      color: 'rgba(5, 245, 255, 0.7)',
      width: sw + 6,
      lineCap: 'round',
      lineJoin: 'round'
    }),
    fill: new Fill({ color: 'rgba(5, 245, 255, 0.06)' }),
    image: new CircleStyle({
      radius: (params.radius || sw * 3) + 8,
      fill: new Fill({ color: 'rgba(5, 245, 255, 0.1)' }),
      stroke: new Stroke({ color: 'rgba(5, 245, 255, 0.5)', width: 3 })
    })
  })

  const innerPulse = new Style({
    stroke: new Stroke({
      color: '#05f5ff',
      width: sw + 2,
      lineCap: 'round',
      lineJoin: 'round',
      lineDash: [8, 4]
    }),
    image: new CircleStyle({
      radius: (params.radius || sw * 3) + 4,
      fill: new Fill({ color: 'rgba(5, 245, 255, 0.05)' }),
      stroke: new Stroke({ color: '#05f5ff', width: 2.5, lineDash: [6, 3] })
    })
  })

  // 点要素开启动态样式时，基础样式为样式函数 —— 需按帧叠加高亮
  if (typeof baseStyles === 'function') {
    const baseFn = baseStyles
    feature.setStyle((f, resolution) => {
      const arr = baseFn(f, resolution)
      return Array.isArray(arr) ? [...arr, outerGlow, innerPulse] : [outerGlow, innerPulse]
    })
    return
  }

  if (!Array.isArray(baseStyles)) baseStyles = baseStyles ? [baseStyles] : []

  feature.setStyle([...baseStyles, outerGlow, innerPulse])
}

// ==================== 绘制模式 ====================
function activateDrawMode(type) {
  let drawOptions = {
    source: vectorSource,
    type: 'Point'
  }

  switch (type) {
    case 'Point':
      drawOptions.type = 'Point'
      break
    case 'LineString':
      drawOptions.type = 'LineString'
      break
    case 'Polygon':
      drawOptions.type = 'Polygon'
      break
    case 'Rectangle':
      drawOptions.type = 'Circle'
      drawOptions.geometryFunction = getRectangleGeometryFunction()
      break
    case 'Ellipse':
      drawOptions.type = 'Circle'
      drawOptions.geometryFunction = getEllipseGeometryFunction()
      break
    case 'Arrow':
      drawOptions.type = 'LineString'
      break
    case 'WindArrow':
      drawOptions.type = 'LineString'
      break
    case 'BattleArrow':
      drawOptions.type = 'LineString'
      break
    case 'CircleOutline':
      drawOptions.type = 'Circle'
      break
    case 'Text':
      // 标注以点几何承载，样式渲染为文字
      drawOptions.type = 'Point'
      break
    default:
      return
  }

  // 绘制预览样式
  drawOptions.style = function(feature) {
    const params = getCurrentParams()
    if (type === 'Arrow') return createArrowPreviewStyle(params, feature)
    if (type === 'WindArrow') return createWindArrowPreviewStyle(params, feature)
    if (type === 'BattleArrow') return createBattleArrowPreviewStyle(params, feature)
    return createStyleFromParams(type, params)
  }

  drawInteraction = new Draw(drawOptions)
  // sketch（绘制预览）图层：强制刷新缓存，使动态样式在落点前也能预览
  sketchLayer = drawInteraction.getOverlay()

  drawInteraction.on('drawend', (event) => {
    const feature = event.feature
    feature.set('drawType', type)
    const params = getCurrentParams()

    // 圆形要素：从几何中读取实际半径
    if (type === 'CircleOutline') {
      const geom = feature.getGeometry()
      if (geom && geom.getRadius) {
        params.radius = geom.getRadius()
      }
    }

    feature.set('styleParams', params)
    applyFeatureStyle(feature)
    syncAnimationLoop()

    // 绘制完成后自动选中要素，使样式面板可编辑
    selectedFeature.value = feature
    isSelectPicked.value = false  // 非选择工具选中，不叠加高亮
    updatePanelFromFeature(feature)

    // 标注落点后自动聚焦文字输入框，便于立即输入内容
    if (type === 'Text') {
      nextTick(() => {
        if (textInputRef.value) {
          textInputRef.value.focus()
          textInputRef.value.select()
        }
      })
    }
  })

  props.map.addInteraction(drawInteraction)

  const viewport = props.map.getViewport()
  viewport.style.cursor = 'crosshair'
}

// ==================== 箭头绘制预览样式 ====================
function createArrowPreviewStyle(params, feature) {
  if (!feature) return [new Style({ stroke: buildStroke(params) })]
  let coords = null
  try { coords = feature.getGeometry().getCoordinates() } catch (e) { coords = null }
  return buildArrowStyles(coords, params)
}

function createWindArrowPreviewStyle(params, feature) {
  if (!feature) return [new Style({ stroke: buildStroke(params) })]
  let coords = null
  try { coords = feature.getGeometry().getCoordinates() } catch (e) { coords = null }
  return buildWindArrowStyles(coords, params)
}

function createBattleArrowPreviewStyle(params, feature) {
  return new Style({
    renderer: (pixelCoordinates, state) => {
      if (!pixelCoordinates || pixelCoordinates.length < 4) return

      // 统一转为 [[x, y], ...] 像素坐标
      const pixelPath = []
      if (Array.isArray(pixelCoordinates[0])) {
        for (let i = 0; i < pixelCoordinates.length; i++) {
          pixelPath.push(pixelCoordinates[i])
        }
      } else {
        for (let i = 0; i < pixelCoordinates.length; i += 2) {
          pixelPath.push([pixelCoordinates[i], pixelCoordinates[i + 1]])
        }
      }
      if (pixelPath.length < 2) return

      // 在像素空间直接构造军标多边形：尺寸/比例稳定，不受地图投影影响
      const polygon = buildBattleArrowPolygon(pixelPath, params)
      if (!polygon) return
      const pixelRing = polygon.getCoordinates()[0]

      const context = state.context
      if (!context) return

      const sc = params.strokeColor || '#D32F2F'
      const sw = params.strokeWidth || 2
      const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
      // 起始色 = 箭尾（淡/透），结束色 = 箭头（深/饱和）
      const gs = params.gradientStartColor || '#FFB3B3'
      const ge = params.gradientEndColor || '#D32F2F'
      const gso = params.gradientStartOpacity !== undefined ? params.gradientStartOpacity : 0.3
      const geo = params.gradientEndOpacity !== undefined ? params.gradientEndOpacity : 1

      // 渐变端点：路径起点（tail） → 路径终点（tip）
      const tailPx = pixelPath[0]
      const tipPx = pixelPath[pixelPath.length - 1]

      const gradient = context.createLinearGradient(tailPx[0], tailPx[1], tipPx[0], tipPx[1])
      gradient.addColorStop(0, hexToRgba(gs, gso))
      gradient.addColorStop(1, hexToRgba(ge, geo))

      context.beginPath()
      context.moveTo(pixelRing[0][0], pixelRing[0][1])
      for (let i = 1; i < pixelRing.length; i++) {
        context.lineTo(pixelRing[i][0], pixelRing[i][1])
      }
      context.closePath()

      // 外描边：先画一圈更粗的描边，再填充渐变覆盖其内侧
      if (params.outlineEnabled) {
        context.strokeStyle = outlineRgba(params)
        context.lineWidth = sw + (params.outlineWidth || 2) * 2
        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.stroke()
      }

      context.fillStyle = gradient
      context.fill()

      context.strokeStyle = hexToRgba(sc, so)
      context.lineWidth = sw
      context.lineJoin = 'round'
      context.lineCap = 'round'
      context.stroke()
    }
  })
}

// 应用军标箭头样式（复用预览 renderer）
function applyBattleArrowStyle(feature, params) {
  feature.setStyle(createBattleArrowPreviewStyle(params, feature))
}

// ==================== 停用工具 ====================
// 兜底清理：移除地图上所有绘制类交互（Draw / Select / Modify）。
// 正常切换只会存在一个，此函数用于清除热更新或旧组件实例遗留的"幽灵"交互，
// 避免出现"取消标注后点击地图仍会落标注"这类多个绘制交互并存的问题。
function purgeDrawingInteractions() {
  if (!props.map) return
  props.map.getInteractions().getArray().slice().forEach(interaction => {
    if (
      interaction instanceof Draw ||
      interaction instanceof Select ||
      interaction instanceof Modify
    ) {
      props.map.removeInteraction(interaction)
    }
  })
  drawInteraction = null
  selectInteraction = null
  modifyInteraction = null
  sketchLayer = null
}

function deactivateTool() {
  if (drawInteraction && props.map) {
    // 先中止绘制：清掉跟随鼠标移动的草图（含文字标注的预览文字），
    // 再移除交互，并把草图图层从地图上强制摘除，确保任何取消路径都干净
    try {
      drawInteraction.abortDrawing()
    } catch (e) {
      /* 忽略中止时的异常 */
    }
    props.map.removeInteraction(drawInteraction)
    drawInteraction = null
    if (sketchLayer) {
      sketchLayer.setMap(null)
      sketchLayer = null
    }
  }
  if (selectInteraction && props.map) {
    selectInteraction.getFeatures().clear()
    props.map.removeInteraction(selectInteraction)
    selectInteraction = null
  }
  if (modifyInteraction && props.map) {
    props.map.removeInteraction(modifyInteraction)
    modifyInteraction = null
  }

  // 兜底：清掉一切残留的绘制类交互（幽灵交互清理）
  purgeDrawingInteractions()

  selectedFeature.value = null
  isSelectPicked.value = false
  activeTool.value = null
  syncAnimationLoop()

  mapStore.setDrawingActive(false)

  if (props.map) {
    const viewport = props.map.getViewport()
    viewport.style.cursor = ''
  }
}

// ==================== 样式变更处理 ====================
function onStyleChange() {
  if (isUpdatingPanel) return

  if (selectedFeature.value) {
    const params = { ...(selectedFeature.value.get('styleParams') || {}) }
    params.strokeColor = strokeColor.value
    params.strokeWidth = strokeWidth.value
    params.strokeOpacity = strokeOpacity.value
    params.strokeDashType = strokeDashType.value
    params.dashLength = dashLength.value
    params.dashGap = dashGap.value
    params.fillColor = fillColor.value
    params.fillOpacity = fillOpacity.value
    if (hasRadius.value) params.radius = featureRadius.value
    // 描边（外边线）
    params.outlineEnabled = outlineEnabled.value
    params.outlineColor = outlineColor.value
    params.outlineWidth = outlineWidth.value
    params.outlineOpacity = outlineOpacity.value
    // 点动态样式（仅点要素）
    if (isPointType.value) {
      params.pointAnimated = pointAnimated.value
      params.pointAnimType = pointAnimType.value
      params.pointAnimSpeed = pointAnimSpeed.value
    }
    // 文字标注样式
    if (isTextType.value) {
      params.textContent = textContent.value
      params.textFontSize = textFontSize.value
      params.textBold = textBold.value
      params.textColor = textColor.value
      params.textRotation = textRotation.value
      params.textOutlineEnabled = textOutlineEnabled.value
      params.textOutlineColor = textOutlineColor.value
      params.textOutlineWidth = textOutlineWidth.value
      params.textBgEnabled = textBgEnabled.value
      params.textBgColor = textBgColor.value
      params.textBgOpacity = textBgOpacity.value
      params.textBorderEnabled = textBorderEnabled.value
      params.textBorderColor = textBorderColor.value
      params.textBorderOpacity = textBorderOpacity.value
      params.textBorderWidth = textBorderWidth.value
      params.textBorderRadius = textBorderRadius.value
      params.textPadding = textPadding.value
    }
    if (isArrow.value) {
      params.arrowScale = arrowScale.value
      params.arrowHeadWidth = arrowHeadWidth.value
      // 军标箭头渐变参数
      if (currentFeatureType.value === 'BattleArrow') {
        params.gradientStartColor = gradientStartColor.value
        params.gradientEndColor = gradientEndColor.value
        params.gradientStartOpacity = gradientStartOpacity.value
        params.gradientEndOpacity = gradientEndOpacity.value
      }
    }

    selectedFeature.value.set('styleParams', params)

    const type = selectedFeature.value.get('drawType')
    if (type === 'CircleOutline' && hasRadius.value) {
      const geom = selectedFeature.value.getGeometry()
      if (geom && geom.setRadius) {
        geom.setRadius(featureRadius.value)
      }
    }

    applyFeatureStyle(selectedFeature.value)
    // 仅当通过"选择"工具手动选中时，才叠加高亮效果
    if (isSelectPicked.value) {
      applySelectionHighlight(selectedFeature.value)
    }
  }

  // 动态样式开关变化后同步动画渲染循环
  syncAnimationLoop()

  // 绘制模式下，强制地图重绘以实时预览样式变化
  if (activeTool.value && activeTool.value !== 'Select' && props.map) {
    props.map.render()
  }
}

// 从选中要素更新面板参数
function updatePanelFromFeature(feature) {
  const params = feature.get('styleParams')
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
  if (params.radius !== undefined) featureRadius.value = params.radius
  // 描边参数
  outlineEnabled.value = !!params.outlineEnabled
  outlineColor.value = params.outlineColor || '#FFFFFF'
  outlineWidth.value = params.outlineWidth !== undefined ? params.outlineWidth : 2
  outlineOpacity.value = params.outlineOpacity !== undefined ? params.outlineOpacity : 1
  // 点动态样式参数
  pointAnimated.value = !!params.pointAnimated
  pointAnimType.value = params.pointAnimType || 'pulse'
  pointAnimSpeed.value = params.pointAnimSpeed !== undefined ? params.pointAnimSpeed : 1
  // 文字标注参数
  textContent.value = params.textContent !== undefined ? params.textContent : '标注文字'
  textFontSize.value = params.textFontSize !== undefined ? params.textFontSize : 14
  textBold.value = !!params.textBold
  textColor.value = params.textColor || '#FFFFFF'
  textRotation.value = params.textRotation !== undefined ? params.textRotation : 0
  textOutlineEnabled.value = !!params.textOutlineEnabled
  textOutlineColor.value = params.textOutlineColor || '#000000'
  textOutlineWidth.value = params.textOutlineWidth !== undefined ? params.textOutlineWidth : 3
  textBgEnabled.value = !!params.textBgEnabled
  textBgColor.value = params.textBgColor || '#000000'
  textBgOpacity.value = params.textBgOpacity !== undefined ? params.textBgOpacity : 0.45
  textBorderEnabled.value = !!params.textBorderEnabled
  textBorderColor.value = params.textBorderColor || '#4096FF'
  textBorderOpacity.value = params.textBorderOpacity !== undefined ? params.textBorderOpacity : 1
  textBorderWidth.value = params.textBorderWidth !== undefined ? params.textBorderWidth : 1.5
  textBorderRadius.value = params.textBorderRadius !== undefined ? params.textBorderRadius : 4
  textPadding.value = params.textPadding !== undefined ? params.textPadding : 4
  if (params.arrowScale !== undefined) arrowScale.value = params.arrowScale
  if (params.arrowHeadWidth !== undefined) arrowHeadWidth.value = params.arrowHeadWidth
  if (params.gradientStartColor !== undefined) gradientStartColor.value = params.gradientStartColor
  if (params.gradientEndColor !== undefined) gradientEndColor.value = params.gradientEndColor
  if (params.gradientStartOpacity !== undefined) gradientStartOpacity.value = params.gradientStartOpacity
  if (params.gradientEndOpacity !== undefined) gradientEndOpacity.value = params.gradientEndOpacity

  nextTick(() => { isUpdatingPanel = false })
}

// ==================== 删除选中要素 ====================
function deleteSelectedFeature() {
  if (selectedFeature.value && vectorSource) {
    vectorSource.removeFeature(selectedFeature.value)
    selectedFeature.value = null
    syncAnimationLoop()
  }
}

// ==================== 操作 ====================
function clearDrawings() {
  if (vectorSource) {
    vectorSource.clear()
  }
  selectedFeature.value = null
  syncAnimationLoop()
}

function undoLast() {
  if (!vectorSource) return
  const features = vectorSource.getFeatures()
  if (features.length > 0) {
    const last = features[features.length - 1]
    if (selectedFeature.value === last) {
      selectedFeature.value = null
    }
    vectorSource.removeFeature(last)
    syncAnimationLoop()
  }
}

// ==================== 关闭样式面板 ====================
function closeStylePanel() {
  // 选择模式下：取消选中要素即可关闭面板
  if (activeTool.value === 'Select' && selectedFeature.value) {
    if (selectInteraction) selectInteraction.getFeatures().clear()
    selectedFeature.value = null
    isSelectPicked.value = false
    return
  }
  // 绘制模式下：停用工具
  deactivateTool()
}

// ==================== 键盘事件 ====================
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (selectedFeature.value && selectInteraction) {
      selectInteraction.getFeatures().clear()
      selectedFeature.value = null
    } else {
      deactivateTool()
    }
  }
}

// ==================== 生命周期 ====================
watch(() => props.map, (newMap) => {
  if (newMap && !vectorLayer) {
    initVectorLayer()
  }
}, { immediate: true })

onMounted(() => {
  if (props.map && !vectorLayer) {
    initVectorLayer()
  }
  // 组件挂载时清理地图上遗留的绘制类交互（热更新后旧实例的残留）
  purgeDrawingInteractions()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  deactivateTool()
  stopAnimationLoop()
  if (vectorLayer && props.map) {
    props.map.removeLayer(vectorLayer)
  }
  document.removeEventListener('keydown', handleKeydown)
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

.bold-preview-btn {
  padding: 1px 6px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(186, 224, 255, 0.6);
  background: rgba(64, 150, 255, 0.06);
  border: 1px solid rgba(64, 150, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.bold-preview-btn.active {
  font-weight: 800;
  color: #69b1ff;
  background: rgba(64, 150, 255, 0.18);
  border-color: rgba(64, 150, 255, 0.5);
}

.rotation-quick-group {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  width: 100%;
}

.rotation-quick-btn {
  flex: 1;
  min-width: 32px;
  padding: 3px 2px;
  font-size: 10px;
  color: rgba(186, 224, 255, 0.6);
  background: rgba(64, 150, 255, 0.06);
  border: 1px solid rgba(64, 150, 255, 0.18);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.rotation-quick-btn:hover {
  color: #bae0ff;
  background: rgba(64, 150, 255, 0.16);
  border-color: rgba(64, 150, 255, 0.45);
}

.style-separator.text-sep {
  color: rgba(255, 180, 120, 0.9);
  border-top-color: rgba(255, 160, 90, 0.22);
}

/* 分隔标题（描边 / 动态样式） */
.style-separator.outline-sep {
  color: rgba(105, 177, 255, 0.85);
  border-top-color: rgba(64, 150, 255, 0.22);
}

.style-separator.animate-sep {
  color: rgba(126, 232, 190, 0.85);
  border-top-color: rgba(82, 220, 170, 0.22);
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

.style-separator {
  font-size: 10px;
  color: rgba(255, 170, 0, 0.7);
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 0 0 0;
  border-top: 1px solid rgba(255, 170, 0, 0.15);
  margin-top: 2px;
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
