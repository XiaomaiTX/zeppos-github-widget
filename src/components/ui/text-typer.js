import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";

import { Fx } from "@x1a0ma17x/zeppos-fx";

const CONDITION = {
    TYPING: "typing",
    IDLE: "idle",
};

export class TextTyper {
    constructor(/** @type {Object} */ params = {}) {
        this.params = {
            cursorEnable: params.cursorEnable ?? true,
            charInterval: params.charInterval ?? 100,
            text: {
                x: params.text?.x ?? px(0),
                y: params.text?.y ?? px(0),
                w: params.text?.w ?? px(200),
                h: params.text?.h ?? (params.text?.text_size ?? px(40)) + 10,
                align_h: params.text?.align_h ?? hmUI.align.LEFT,
                align_v: params.text?.align_v ?? hmUI.align.CENTER_V,
                color: params.text?.color ?? 0xffffff,
                text_size: params.text?.text_size ?? px(40),
                text: params.text?.text ?? [""],
            },
            cursor: {
                color: params.cursor?.color ?? 0x0986d4,
                width: params.cursor?.width ?? px(4),
                move_anim: params.cursor?.move_anim ?? Fx.Styles.EASE_IN_QUAD,
                blink_time: params.cursor?.blink_time ?? 500,
            },
        };
        this.cursorPosX = 0;
        this.condition = CONDITION.IDLE;
        this.textBuffer = [""];
        this.displayedText = "";
        this.currentTextIndex = 0;
        if (typeof this.params.text.text === "string") {
            this.params.text.text = [this.params.text.text];
        }
        this.textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
            x: this.params.text.x,
            y: this.params.text.y,
            w: this.params.text.w,
            h: this.params.text.h,
            align_h: this.params.text.align_h,
            align_v: this.params.text.align_v,
            color: this.params.text.color,
            text_size: this.params.text.text_size,
            text: this.params.text.text[this.currentTextIndex],
        });
        if (this.params.cursorEnable) this.createCursor();
    }
    createCursor() {
            this.cursor = hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: this.params.text.x,
            y: this.params.text.y,
            w: this.params.cursor.width,
            h: this.params.text.text_size,
            color: this.params.cursor.color,
        });
    }
    setTextBuffer(/** @type {string} */ newText) {
        this.textBuffer = Array.isArray(newText) ? newText : [newText];
    }
    start(callback) {
        if (this.condition === CONDITION.TYPING) {
            console.log("already typing");
            return;
        }
        console.log("start typing");
        this.condition = CONDITION.TYPING;
        this.displayedText = "";
        this.currentTextIndex = 0;

        const typeNextText = () => {
            if (this.currentTextIndex >= this.params.text.text.length) {
                console.log("all texts typed");
                hmUI.deleteWidget(this.textWidget);
                hmUI.deleteWidget(this.cursor);
                hmUI.redraw();
                this.condition = CONDITION.IDLE;
                if (callback) callback();
                return;
            }

            this.textBuffer = this.params.text.text[this.currentTextIndex];
            let charIndex = 0;
            const totalChars = this.textBuffer.length;
            console.log(
                "typing text",
                this.currentTextIndex,
                "totalChars",
                totalChars
            );

            const typeNextChar = () => {
                if (charIndex < totalChars) {
                    this.displayedText += this.textBuffer.charAt(charIndex);
                    this.textWidget.setProperty(hmUI.prop.MORE, {
                        text: this.displayedText,
                    });
                    charIndex++;
                    this.moveCursorToEnd();
                    setTimeout(typeNextChar, this.params.charInterval);
                } else {
                    this.condition = CONDITION.IDLE;
                    setTimeout(() => {
                        this.cleanupDisplay(() => {
                            this.currentTextIndex++;
                            setTimeout(typeNextText, 500);
                        });
                    }, 1000);
                }
            };

            typeNextChar();
        };

        typeNextText();
    }

    cleanupDisplay(callback) {
        if (this.condition === CONDITION.TYPING) {
            console.log("cannot cleanup while typing");
            return;
        }
        this.condition = CONDITION.TYPING;
        let charIndex = this.displayedText.length;

        const removeNextChar = () => {
            if (charIndex > 0) {
                this.displayedText = this.displayedText.slice(0, -1);
                this.textWidget.setProperty(hmUI.prop.MORE, {
                    text: this.displayedText,
                });
                charIndex--;
                this.moveCursorToEnd();
                setTimeout(removeNextChar, this.params.charInterval * 0.2);
            } else {
                this.condition = CONDITION.IDLE;
                if (callback) callback();
            }
        };

        removeNextChar();
    }
    moveCursorToEnd() {
        if (!this.params.cursorEnable) return;
        const textLayout = hmUI.getTextLayout(this.displayedText, {
            text_size: this.params.text.text_size,
            text_width: 0,
        });
        this.cursor.setProperty(hmUI.prop.MORE, {
            x:
                this.cursorPosX +
                (this.params.text.x + textLayout.width - this.cursorPosX) +
                2,
            y: this.params.text.y,
            w: this.params.cursor.width,
            h: this.params.text.text_size,
        });
    }
}
