// 主题色配置。目前仅支持单色，后续或许可以支持多色渐变

const themeList = [
    {
        key: "darkGreen",
        name: "暗绿",
        color: "#13547A"
    },
    {
        key: "brightBlue",
        name: "亮蓝",
        color: "#1677FF"
    },
    {
        key: "purplishRed",
        name: "紫红",
        color: "#CE9C9D"
    },
    {
        key: "leafGreen",
        name: "叶绿",
        color: "#ABD5BE"
    },
    {
        key: "darkPink",
        name: "暗粉",
        color: "#E0B394"
    },
]

const themeMap = themeList.reduce((prev, curr) => {
    prev[curr.key] = curr
    return prev
}, {})

export { themeList, themeMap }