import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { Fx } from "@x1a0ma17x/zeppos-fx";

export class LoadMask {
    constructor() {
        this.mask = hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: px(0),
            y: px(0),
            w: px(480),
            h: px(480),
            color: 0x000000,
            alpha: 255,
        });
    }
    moveIn() {
        this.mask.setEnable(true);
        new Fx({
            begin: 0,
            end: 1,
            time: 1,
            style: Fx.Styles.LINEAR,
            enabled: true,
            func: (value) => {
                this.mask.setProperty(hmUI.prop.MORE, {
                    x: px(0),
                    y: px(0),
                    w: px(480),
                    h: px(480),
                    alpha: Math.floor((1 - value) * 255),
                });
            },
            onStop: () => {
                this.mask.setEnable(false);
            },
        });
    }
    moveOut(callback) {
        this.mask.setEnable(true);
        new Fx({
            begin: 0,
            end: 1,
            time: 1,
            style: Fx.Styles.LINEAR,
            enabled: true,
            func: (value) => {
                this.mask.setProperty(hmUI.prop.MORE, {
                    x: px(0),
                    y: px(0),
                    w: px(480),
                    h: px(480),
                    alpha: Math.floor(value * 255),
                });
            },
            onStop: () => {
                this.mask.setEnable(false);
                if (callback) callback();
            },
        });
    }
    destroy() {
        hmUI.deleteWidget(this.mask);
    }
}
