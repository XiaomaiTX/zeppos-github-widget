import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";

import { Fx } from "@x1a0ma17x/zeppos-fx";

const exampleParams = {
    x: px(100),
    y: px(100),
    w: px(250),
    h: px(250),
    startAngle: -90,
    endAngle: -90,
    color: 0x000000,
    lineWidth: 20,
    style: Fx.Styles.LINEAR,
    time: 0.8,
};

export class ProgressArc {
/**
 * Creates a new ProgressArc widget with the given parameters.
 * The parameters are merged with the default values to ensure that all
 * required parameters are provided.
 *
 * @param {Object} [params={}] - The parameters to create the widget
 * @param {number} [params.x=px(480 - 250) / 2] - The x-coordinate of the widget
 * @param {number} [params.y=px(480 - 250) / 2] - The y-coordinate of the widget
 * @param {number} [params.w=px(250)] - The width of the widget
 * @param {number} [params.h=px(250)] - The height of the widget
 * @param {number} [params.startAngle=-90] - The start angle of the arc
 * @param {number} [params.endAngle=-90] - The end angle of the arc
 * @param {number} [params.color=0x000000] - The color of the arc
 * @param {number} [params.lineWidth=8] - The line width of the arc
 * @param {number} [params.style=Fx.Styles.LINEAR] - The style of the animation
 * @param {number} [params.time=0.8] - The time of the animation
 */
    constructor(/** @type {Object} */ params = {}) {  // 设置默认值为空对象
        // 合并默认参数和传入参数
        this.params = {
            x: params.x || px(480 - 50) / 2,
            y: params.y || px(480 - 50) / 2,
            w: params.w || px(50),
            h: params.h || px(50),
            startAngle: params.startAngle || -90,
            endAngle: params.endAngle || -90,
            color: params.color || 0x000000,
            lineWidth: params.lineWidth || px(5),
            style: params.style || Fx.Styles.LINEAR,
            time: params.time || 0.8,
        };
        
        this.arc = hmUI.createWidget(hmUI.widget.ARC, {
            x: this.params.x,
            y: this.params.y,
            w: this.params.w,
            h: this.params.h,
            start_angle: this.params.startAngle,
            end_angle: this.params.endAngle,
            color: this.params.color,
            line_width: this.params.lineWidth,
        });
        this.arc.setEnable(false);
        
        this.arcAnim = new Fx({
            begin: 0,
            end: 1,
            style: this.params.style,
            time: this.params.time,
            enabled: false,
            func: (value) => {
                this.arc.setProperty(hmUI.prop.MORE, {
                    start_angle: -90 + 360 * value,
                    end_angle: -90 + 360 * value + 270,
                    color: this.params.color || 0xd3d3d3,
                });
            },
            onStop: () => {
                this.arcAnim.restart();
            },
        });
    }
    
    start() {
        this.arcAnim.start();
    }
    stop() {
        this.arcAnim.stop();
    }
    pause() {
        this.arcAnim.pause();
    }
    restart() {
        this.arcAnim.restart();
    }
    destroy() {
        hmUI.deleteWidget(this.arc);
        hmUI.redraw();
    }
}