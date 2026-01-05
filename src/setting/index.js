var styleViewCard = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "100%",
    height: "100%",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
};

AppSettingsPage({
    state: {
        props: {},
        githubToken: "",
    },
    setItem(key, value) {
        // 确保存储的值是原始字符串
        const newString =
            typeof value === "string" ? value : JSON.stringify(value);
        this.state.props.settingsStorage.setItem(key, newString);
        const result = this.state.props.settingsStorage.getItem(key);
        console.log("result=>", result);
        console.log("setsuccess");
    },
    getItem(key) {
        // 从 settingsStorage 中读取值，并确保返回原始字符串
        const value = this.state.props.settingsStorage.getItem(key);
        try {
            return JSON.parse(value); // 尝试反序列化为对象
        } catch (e) {
            return value; // 如果反序列化失败，返回原始字符串
        }
    },
    setState(props) {
        this.state.props = props;
    },

    build(props) {
        this.setState(props);

        return View(
            {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    background: "#F5F5F5",
                    padding: "10px",
                },
            },
            [
                View({ style: styleViewCard }, [
                    TextInput({
                        label: "GitHub Token",
                        labelStyle: {
                            display: "inline-block",
                            padding: "0 16px",
                            height: "36px",
                            lineHeight: "36px",
                            border: "none",
                            borderRadius: "10px",
                            backgroundColor: "#1e88e5", // 主按钮颜色
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            textAlign: "center",
                            cursor: "pointer",
                            transition:
                                "background-color 0.3s, box-shadow 0.3s",
                            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)",
                            ":hover": {
                                backgroundColor: "#1565c0", // 悬停时的颜色
                            },
                            ":active": {
                                backgroundColor: "#1565c0", // 按下时的颜色
                                boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                            },
                            ":disabled": {
                                backgroundColor: "#9e9e9e",
                                cursor: "not-allowed",
                                boxShadow: "none",
                            },
                        },
                        disabled: false,
                        placeholder: "输入GitHub Token",
                        value: this.state.githubToken,
                        multiline: true,
                        rows: 5,
                        onChange: (val) => {
                            this.state.githubToken = val;
                            this.setItem("githubToken", val);
                        },
                    }),
                ]),
            ]
        );
    },
});
