import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import * as hmRouter from "@zos/router";
import { LocalStorage } from "@zos/storage";
import { reactive } from "@x1a0ma17x/zeppos-reactive";

import {
    generateHeatmapData,
    generateHeatmapBoxes,
    convertToHeatmapData,
} from "../utils/method";

const state = reactive({
    githubHeatmapData: [],
});

AppWidget({
    onInit() {
        console.log("===onInit===");
    },
    build() {
        hmUI.setAppWidgetSize({
            h: px(194),
        });

        try {
            const backgroundFillRect = hmUI.createWidget(
                hmUI.widget.FILL_RECT,
                {
                    x: px(40),
                    y: px(0),
                    w: px(400),
                    h: px(194),
                    color: 0x0d1117,
                    radius: px(36),
                },
            );
            const strokeRect = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
                x: px(40),
                y: px(0),
                w: px(400),
                h: px(194),
                radius: px(36),
                line_width: 2,
                color: 0x30363d,
            });
            const canvas = hmUI.createWidget(hmUI.widget.CANVAS, {
                x: px(40 + 19),
                y: px(19),
                w: px(363),
                h: px(156),
            });

            const localStorage = new LocalStorage();
            const contributionsData = localStorage.getItem(
                "github-widget.contributions",
            );
            state.githubHeatmapData = convertToHeatmapData(
                JSON.parse(contributionsData).data,
            );
            console.log("[build] githubHeatmapData", state.githubHeatmapData);

            const boxPerRow = 16;
            const rows = 7;
            const boxSize = 18;
            const spacing = 5;

            const boxList = generateHeatmapBoxes(
                state.githubHeatmapData,
                boxPerRow,
                rows,
                boxSize,
                spacing,
            );

            boxList.forEach((box) => {
                if (box.x === 0 && box.y === 0) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/left-top-${box.level}@1x.png`,
                    });
                } else if (box.x + box.w === 363 && box.y === 0) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/right-top-${box.level}@1x.png`,
                    });
                } else if (box.x === 0 && box.y + box.h === 156) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/left-bottom-${box.level}@1x.png`,
                    });
                } else if (box.x + box.w === 363 && box.y + box.h === 156) {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/right-bottom-${box.level}@1x.png`,
                    });
                } else {
                    canvas.drawImage({
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                        alpha: 255,
                        image: `Board2/common-${box.level}.png`,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
    onResume() {
        
    },
});
