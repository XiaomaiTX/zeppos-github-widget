// import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";

import { reactive, effect } from "@x1a0ma17x/zeppos-reactive";

export class ScrollListPage {
    constructor(/** @type {Object} */ params) {
        this.state = {
            buttonOffset: 0,
            items: [],
            widgets: [],
        };

        this.state.items = params.items || [];
        this.styles = this.mergeStyles(Styles, params.customStyles || {});

        hmUI.createWidget(hmUI.widget.TEXT, {
            ...this.styles.TITLE_STYLE,
            text: params.title,
        });

        const buttonsGroup = hmUI.createWidget(hmUI.widget.GROUP, {
            ...this.styles.SETTINGS_CONTAINER_STYLE,
            h:
                this.state.items.length *
                (this.styles.SETTINGS_BUTTON_STYLE.h + px(10)) + px(100),
        });

        for (let i = 0; i < this.state.items.length; i++) {
            const itemStyles = this.mergeStyles(
                this.styles,
                this.state.items[i].customStyles || {}
            );

            const buttonBg = buttonsGroup.createWidget(hmUI.widget.FILL_RECT, {
                ...itemStyles.SETTINGS_BUTTON_STYLE,
                y: itemStyles.SETTINGS_BUTTON_STYLE.y + this.state.buttonOffset,
            });
            buttonBg.addEventListener(hmUI.event.CLICK_UP, () => {
                if (this.state.items[i] && this.state.items[i].action) {
                    this.state.items[i].action();
                }
            });

            const itemWidgets = {
                id: i,
                buttonBg: buttonBg,
                titleWidget: null,
                subtitleWidget: null,
                descriptionWidget: null,
                iconWidget: null,
            };
            if (this.state.items[i]) {
                // 如果有description字段（不论是否为空字符串），就创建subtitle和description
                if (this.state.items[i].hasOwnProperty("description")) {
                    itemWidgets.subtitleWidget = buttonsGroup.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE.y +
                                this.state.buttonOffset,
                            text: this.state.items[i].title,
                        }
                    );
                    itemWidgets.subtitleWidget.setEnable(false);

                    // 总是创建descriptionWidget
                    itemWidgets.descriptionWidget = buttonsGroup.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE.y +
                                this.state.buttonOffset,
                            text: this.state.items[i].description || "",
                        }
                    );
                    itemWidgets.descriptionWidget.setEnable(false);
                } else {
                    // 无description，仅显示title
                    itemWidgets.titleWidget = buttonsGroup.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...itemStyles.SETTINGS_BUTTON_TITLE_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_TITLE_STYLE.y +
                                this.state.buttonOffset,
                            text: this.state.items[i].title,
                        }
                    );
                    itemWidgets.titleWidget.setEnable(false);
                }
            }
            if (this.state.items[i] && this.state.items[i].icon) {
                // 有icon时，显示icon
                itemWidgets.iconWidget = buttonsGroup.createWidget(
                    hmUI.widget.IMG,
                    {
                        ...itemStyles.SETTINGS_BUTTON_ICON_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_ICON_STYLE.y +
                            this.state.buttonOffset,
                        src: this.state.items[i].icon,
                    }
                );
                itemWidgets.iconWidget.setEnable(false);
            }
            this.state.widgets.push(itemWidgets);
            this.state.buttonOffset +=
                itemStyles.SETTINGS_BUTTON_STYLE.h + px(10);
        }
    }
    mergeStyles(defaultStyles, customStyles) {
        const merged = { ...defaultStyles };

        for (const [key, value] of Object.entries(customStyles)) {
            if (
                merged[key] &&
                typeof merged[key] === "object" &&
                typeof value === "object"
            ) {
                merged[key] = { ...merged[key], ...value };
            } else {
                merged[key] = value;
            }
        }

        return merged;
    }
    updateUI(params) {
        this.state.buttonOffset = 0;
        for (let i = 0; i < params.items.length; i++) {
            const itemData = params.items[i];
            const itemWidgets = this.state.widgets[i];

            const itemStyles = this.mergeStyles(
                this.styles,
                params.items[i].customStyles || {}
            );

            if (itemData) {
                if (itemData.hasOwnProperty("description")) {
                    itemWidgets.subtitleWidget.setProperty(hmUI.prop.MORE, {
                        ...itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE.y +
                            this.state.buttonOffset,
                        text: itemData.title,
                    });
                    itemWidgets.descriptionWidget.setProperty(hmUI.prop.MORE, {
                        ...itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE.y +
                            this.state.buttonOffset,
                        text: itemData.description || "",
                    });
                } else {
                    itemWidgets.titleWidget.setProperty(hmUI.prop.MORE, {
                        ...itemStyles.SETTINGS_BUTTON_TITLE_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_TITLE_STYLE.y +
                            this.state.buttonOffset,
                        text: itemData.title,
                    });
                }
            }
            if (itemData && itemData.icon) {
                itemWidgets.iconWidget.setProperty(
                    hmUI.prop.SRC,
                    itemData.icon
                );
            }
            this.state.buttonOffset +=
                itemStyles.SETTINGS_BUTTON_STYLE.h + px(10);
        }
    }
}

const Styles = {
    TITLE_STYLE: {
        x: px(50),
        y: px(100),
        w: px(380),
        h: px(70),
        color: 0xffffff,
        text_size: px(48),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "HELLO, Zepp OS",
    },
    SETTINGS_CONTAINER_STYLE: {
        x: px(30),
        y: px(180),
        w: px(420),
        h: px(80),
    },
    SETTINGS_TEXT_STYLE: {
        x: px(20),
        y: px(0),
        w: px(420),
        h: px(35),
        color: 0x9e9e9e,
        text_size: px(24),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },
    SETTINGS_BUTTON_STYLE: {
        x: px(0),
        y: px(0),
        w: px(420),
        h: px(100),
        radius: px(10),
        color: 0x0a0a0a,
    },
    SETTINGS_BUTTON_TITLE_STYLE: {
        x: px(20),
        y: px(25),
        w: px(380),
        h: px(50),
        color: 0xffffff,
        text_size: px(36),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },

    SETTINGS_BUTTON_SUBTITLE_STYLE: {
        x: px(20),
        y: px(8),
        w: px(380),
        h: px(42),
        color: 0xffffff,
        text_size: px(36),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },
    SETTINGS_BUTTON_DESCRIPTION_STYLE: {
        x: px(20),
        y: px(50),
        w: px(380),
        h: px(36),
        color: 0x9e9e9e,
        text_size: px(32),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },
    SETTINGS_BUTTON_ICON_STYLE: {
        x: px(375),
        y: px(38),
        w: px(24),
        h: px(24),
    },
};
