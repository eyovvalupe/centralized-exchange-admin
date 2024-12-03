const upColor = "#55C860";
const downColor = "#FD4938";
const noChangeColor = "#7D919D";
export const klineConfig = {
    // 类别
    grid: {
        show: true,
        horizontal: {
            show: true,
            size: 1,
            color: '#EDEDED',
            style: 'dashed',
            dashedValue: [2, 2]
        },
        vertical: {
            show: true,
            size: 1,
            color: '#EDEDED',
            style: 'dashed',
            dashedValue: [2, 2]
        }
    },
    separator: {
        size: 1,
        color: "#EEF1FA",
        fill: true,
    },
    candle: {
        type: "area", // area, candle_solid
        tooltip: {
            // showRule: "always", // none
            showRule: "follow_cross", // none
            showType: "rect",
            custom: [
                // { title: "time", value: "{time}" },
                { title: "open", value: "{open}" },
                { title: "high", value: "{high}" },
                { title: "low", value: "{low}" },
                { title: "close", value: "{close}" },
                { title: "volume", value: "{volume}" }
            ],
            rect: {
                // 'fixed' | 'pointer'
                position: "pointer",
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 4,
                paddingBottom: 4,
                offsetLeft: 4,
                offsetTop: 4,
                offsetRight: 4,
                offsetBottom: 4,
                borderRadius: 4,
                borderSize: 1,
                borderColor: "#f5f5f5",
                color: "#ffffffbd"
            },
            text: {
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: '#333',
                marginLeft: 8,
                marginTop: 4,
                marginRight: 8,
                marginBottom: 4
            },
        },
        bar: {
            upColor,
            downColor,
            noChangeColor,
            upBorderColor: upColor,
            downBorderColor: downColor,
            noChangeBorderColor: noChangeColor,
            upWickColor: upColor,
            downWickColor: downColor,
            noChangeWickColor: noChangeColor
        },
        area: {
            // lineSize: 2,
            // backgroundColor: [
            //     {
            //         offset: 0,
            //         color: "rgba(59, 130, 246, 0)"
            //     },
            //     {
            //         offset: 1,
            //         color: "rgba(59, 130, 246, 0)"
            //     }
            // ],
            // smooth: true,
            // point: {
            //     show: true,
            //     color: "rgba(59, 130, 246, 0)",
            //     radius: 4,
            //     rippleColor: "rgba(59, 130, 246, 0)", // getAlphaBlue(0.3),
            //     rippleRadius: 8,
            //     animation: true,
            //     animationDuration: 1000
            // }
        },
        priceMark: {
            show: true,
            // 最高价标记
            high: {
                show: true,
                color: "#D9D9D9",
                textOffset: 5,
                textSize: 10,
                textFamily: "Helvetica Neue",
                textWeight: "normal"
            },
            // 最低价标记
            low: {
                show: true,
                color: "#D9D9D9",
                textOffset: 5,
                textSize: 10,
                textFamily: "Helvetica Neue",
                textWeight: "normal"
            },
            // 最新价标记
            last: {
                show: false,
                upColor,
                downColor,
                noChangeColor,
                line: {
                    show: true,
                    // 'solid' | 'dashed'
                    style: "dashed",
                    dashedValue: [4, 4],
                    size: 1
                },
                text: {
                    show: true,
                    // 'fill' | 'stroke' | 'stroke_fill'
                    style: "fill",
                    size: 12,
                    paddingLeft: 4,
                    paddingTop: 4,
                    paddingRight: 4,
                    paddingBottom: 4,
                    // 'solid' | 'dashed'
                    borderStyle: "solid",
                    borderSize: 0,
                    borderColor: "transparent",
                    borderDashedValue: [2, 2],
                    color: "#FFFFFF",
                    family: "Helvetica Neue",
                    weight: "normal",
                    borderRadius: 2
                }
            }
        }
    },
    indicator: {
        bars: [
            {
                // 'fill' | 'stroke' | 'stroke_fill'
                style: "stroke_fill",
                // 'solid' | 'dashed'
                borderStyle: "dashed",
                borderSize: 0,
                borderDashedValue: [1, 1],
                upColor: "rgba(85, 200, 96, 1)",
                downColor: "rgba(253, 73, 56, 1)",
                noChangeColor: "rgba(125, 145, 157, 1)"
            }
        ],
        lines: [
            {
                // 'solid' | 'dashed'
                style: "solid",
                smooth: false,
                size: 0,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)" // '#FF9600'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#935EBD'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#2196F3'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#E11D74'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#01C5C4'
            }
        ]
    },
    xAxis: {
        show: true,
        size: "auto",
        // x轴线
        axisLine: {
            show: false,
            color: "#9EA3AE", // "#888888",
            size: 0.5
        },
        // x轴分割文字
        tickText: {
            show: true,
            color: "#9EA3AE", // #D9D9D9"
            family: "Helvetica Neue",
            weight: "normal",
            size: 12,
            marginStart: 0, // 4,
            marginEnd: 0 // 4
        },
        // x轴分割线
        tickLine: {
            show: true,
            size: 0.5,
            length: 3,
            color: "#9EA3AE" // "#888888"
        }
    },
    // y轴
    yAxis: {
        show: true,
        size: "auto",
        // 'left' | 'right'
        position: "right",
        // 'normal' | 'percentage' | 'log'
        type: "normal",
        inside: true,
        reverse: false,
        // y轴线
        axisLine: {
            show: false,
            color: "#888", // #888
            size: 0.5
        },
        // y轴分割文字
        tickText: {
            show: true,
            color: "#D9D9D9", // #D9D9D9
            family: "Helvetica Neue",
            weight: "normal",
            size: 12,
            marginStart: 0, // 4,
            marginEnd: 0 //4
        },
        // y轴分割线
        tickLine: {
            show: false,
            size: 1,
            length: 3,
            color: "red"
        }
    }
};
