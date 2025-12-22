import * as hmUI from "@zos/ui";
import { log as Logger, px } from "@zos/utils";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, effect, computed } from "@x1a0ma17x/zeppos-reactive";

import {
    generateHeatmapData,
    generateHeatmapBoxes,
    getMonthLabels,
} from "../utils/method";

const logger = Logger.getLogger("Board1");

AppWidget(
    BasePage({
        onInit() {},

        onDataRestore() {},

        build() {
            hmUI.setAppWidgetSize({
                h: px(155),
            });

            try {
                // this.httpRequest({
                //     method: "get",
                //     url: "https://n8n.cafero.town/webhook-test/c39784c1-3622-4206-961b-0ddc712244d7",
                // })
                //     .then((result) => {
                //         console.log("result.status", result.status);
                //         console.log("result.statusText", result.statusText);
                //         console.log("result.body", result.body);
                //         console.log("result.body length", result.body.length);
                //     })
                //     .catch((error) => {
                //         console.error("error=>", error);
                //     });

                const backgroundFillRect = hmUI.createWidget(
                    hmUI.widget.FILL_RECT,
                    {
                        x: px(40),
                        y: px(0),
                        w: px(400),
                        h: px(155),
                        color: 0x0d1117,
                        radius: px(36),
                    }
                );
                const strokeRect = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
                    x: px(40),
                    y: px(0),
                    w: px(400),
                    h: px(155),
                    radius: px(36),
                    line_width: 2,
                    color: 0x30363d,
                });
                const contributionText = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: px(40 + 43),
                    y: px(133),
                    w: px(136),
                    h: px(19),
                    text: "183 Contributions",
                    text_size: px(16),
                    align_h: hmUI.align.LEFT,
                    align_v: hmUI.align.CENTER_V,
                    color: 0x757d86,
                });
                const contributionImg = hmUI.createWidget(hmUI.widget.IMG, {
                    x: px(40 + 201),
                    y: px(132),
                    w: px(149),
                    h: px(19),
                    auto_scale: true,
                    src: "Board1/contribution_level.png",
                });
                const boxCanvas = hmUI.createWidget(hmUI.widget.CANVAS, {
                    x: px(40 + 29),
                    y: px(27),
                    w: px(342),
                    h: px(102),
                });
                const monthCanvas = hmUI.createWidget(hmUI.widget.CANVAS, {
                    x: px(40 + 29),
                    y: px(7),
                    w: px(342),
                    h: px(19),
                });
                const boxPerRow = 23;
                const rows = 7;
                const boxSize = 12;
                const spacing = 3;

                const githubHeatmapData = generateHeatmapData(
                    "2022-01-01",
                    "2022-03-31"
                );

                const boxList = generateHeatmapBoxes(
                    githubHeatmapData,
                    boxPerRow,
                    rows,
                    boxSize,
                    spacing
                );
                const monthLabels = getMonthLabels(
                    githubHeatmapData,
                    boxPerRow,
                    boxSize,
                    spacing
                );
                monthLabels.forEach((label) => {
                    console.log(label);
                    monthCanvas.drawText({
                        x: label.x,
                        y: 0,
                        text_size: px(14),
                        color: 0xffffff,
                        text: label.text,
                    });
                });
                boxList.forEach((box) => {
                    boxCanvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board1/common-${box.level}.png`,
                    });
                });
            } catch (error) {
                logger.log(error);
            }
        },
        onResume() {},
    })
);
