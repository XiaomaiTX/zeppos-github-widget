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

    build(props) {
        // this.setState(props);

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
                        label: "Update GitHub Token",
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
                        value: this.state.githubToken.replace(/./g, "*"),
                        multiline: true,
                        rows: 5,
                        onChange: (val) => {
                            this.state.githubToken = val;
                            try {
                                props.settingsStorage.setItem("GithubWidget.Token", val)
                                this.state.githubToken = "";
                            } catch (error) {
                                console.error("set token failed:", error);

                                
                            }
                        },
                    }),
                ]),
            ]
        );
    },
});
