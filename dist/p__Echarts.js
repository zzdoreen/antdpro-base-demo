(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[31],{85062:function(v,d,e){"use strict";e.r(d),e.d(d,{default:function(){return g}});var x=e(13062),h=e(71230),w=e(89032),i=e(15746),S=e(7359),F=e(27279),L=e(34792),p=e(48086),m=e(99165),E=e(79496),r=e(67294),C=e(53961),B=e(99802),u=e(85893);function l(o,t){(0,r.useEffect)(function(){var n=E.S1(o.current);n.setOption(t);var a=function(){return n==null?void 0:n.resize()};return window.addEventListener("resize",a),function(){n==null||n.dispose(),window.addEventListener("resize",a)}},[])}var f=function(t){var n=t.opts,a=function(D){navigator.clipboard.writeText(D),p.ZP.success("\u590D\u5236\u6210\u529F\uFF01")};return(0,u.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:["code",(0,u.jsx)(m.Z,{onClick:function(){return a(n)}})]})},s=function(t){var n=t.refs,a=t.option;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("div",{className:"charts",ref:n}),(0,u.jsx)(F.Z,{children:(0,u.jsx)(F.Z.Panel,{header:(0,u.jsx)(f,{opts:a}),children:(0,u.jsx)("div",{style:{height:500,overflowY:"scroll"},children:(0,u.jsx)(C.Z,{language:"javascript",style:B.Z,children:a})})},"1")})]})},A=function(){var t=(0,r.useRef)(null),n=`{
        // \u6807\u9898
        title: {
            text: "bar & line"
        },

        // \u8FB9\u8DDD
        grid: {
            left: "5%",
            top: "20%",
            bottom: "10%",
            width: "auto",
            containLabel: true // grid\u533A\u57DF\u662F\u5426\u5305\u542B\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6807\u7B7E
        },

        // \u63D0\u793A\u6846
        tooltip: {
            confine: true // \u662F\u5426\u5C06tooltip\u9650\u5236\u5728\u56FE\u8868\u5185
        },

        // \u56FE\u4F8B
        legend: {
            type: "scroll", // \u56FE\u4F8B\u7C7B\u578B plain | scroll \u666E\u901A | \u7FFB\u6EDA\u7FFB\u9875
            // icon: 'circle' // \u56FE\u4F8B\u9879\u7684icon
            // orient: 'vertical' // \u56FE\u4F8B\u671D\u5411'vertical' | 'horizontal'
            bottom: 0,
            width: 250 // \u56FE\u4F8B\u603B\u5BBD\u5EA6
        },

        // x\u8F74
        xAxis: {
            // \u60AC\u505C \u5750\u6807\u8F74\u6307\u793A\u5668
            axisPointer: {
                show: true,
                type: "shadow" // \u9634\u5F71 | \u76F4\u7EBF
            },
            // minInterval: 100, // \u6700\u5C0F\u95F4\u9694
            // min:'2023-06-09',
            // max: '2023-06-16',
            type: 'category',// value | category | time | log \u6570\u503C | \u7C7B\u76EE | \u65F6\u95F4 | \u5BF9\u6570
            data: ['2023-06-09', '2023-06-10', '2023-06-11', '2023-06-12', '2023-06-13', '2023-06-14',],
            name: "x",
            nameLocation: "end", // \u5750\u6807\u8F74\u540D\u79F0\u663E\u793A\u4F4D\u7F6E

            splitLine: {
                // grid \u533A\u57DF\u5206\u5272\u7EBF ( \u7AD6 )
                show: true,
                lineStyle: {
                    type: "dashed"
                    // { color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
                }
            },

            axisLine: {
                // [\u5750\u6807\u8F74\u7EBF] \u76F8\u5173\u914D\u7F6E
                // show: false
                symbol: "none", // ['none' | 'arrow', 'none' | 'arrow'] | 'none' | 'arrow' // \u8F74\u7EBF\u4E24\u8FB9\u7684\u7BAD\u5934
                lineStyle: {
                    // { color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
                }
            },

            axisTick: {
                // \u5750\u6807\u8F74\u523B\u5EA6
                show: true,
                inside: true // \u523B\u5EA6\u662F\u5426\u671D\u5185
            },

            axisLabel: {
                // \u523B\u5EA6\u6807\u7B7E
            }
        },

        // y\u8F74
        yAxis: {
            name: "y",
            // minInterval: number // \u6700\u5C0F\u95F4\u9694

        },

        // \u6570\u636E\u5C55\u793A\u7684\u989C\u8272
        color: ["#085078", "#85D8CE"],

        // \u6570\u636E
        series: [
            {
                name: "a",
                type: "line", // \u7C7B\u578B\u4E00\u822C\u5C31 bar | line | pie
                data: [0, -20, 36, 10, 100, 20],

                // \u533A\u57DF\u586B\u5145\u6837\u5F0F
                areaStyle: {
                    // color: "pink",
                    // color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']

                    // new echarts.graphic.LinearGradient(\u53F3,\u4E0B,\u5DE6,\u4E0A) \u8D77\u6B62\u4F4D\u7F6E
                    // 0 0 0 1\u5219\u4EE3\u8868\u6E10\u53D8\u8272\u4ECE\u6B63\u4E0A\u65B9\u5F00\u59CB
                    // 0 1 0 0\u4EE3\u8868\u4ECE\u6B63\u4E0B\u65B9\u5411\u6B63\u4E0A\u65B9\u6E10\u53D8
                    // 1 0 0 1\u4EE3\u8868\u4ECE\u53F3\u4E0A\u65B9\u5411\u5DE6\u4E0B\u65B9\u6E10\u53D8
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(58,77,233,1)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(58,77,233,0.3)'
                        }
                    ])
                },

                // \u6807\u6CE8\u70B9
                markPoint: {
                    symbol: "pin", // \u6837\u5F0F
                    symbolSize: 35, // \u5927\u5C0F
                    data: [
                        {
                            name: "a1",
                            type: "max" // max | min | average ( \u6700\u5927 | \u6700\u5C0F | \u4E2D\u95F4\u503C )
                        }
                    ]
                },

                // \u6807\u7EBF
                markLine: {
                    name: "\u6807\u7EBF",
                    symbol: "none",
                    label: {
                        formatter: "{c}-{b}",
                        offset: [0, 10] // \u6587\u5B57\u504F\u79FB\u91CF [+\u53F3 -\u5DE6\uFF0C+\u4E0B -\u4E0A]
                    },
                    lineStyle: {
                        type: "dashed",
                        width: 1
                    },
                    data: [
                        {
                            name: "\u6807\u7EBF",
                            yAxis: 66, // xAxis: '\u88E4\u5B50' \u9700\u8981\u6CE8\u610F\u6570\u503C\u6700\u503C\u9650\u5236
                            lineStyle: {},
                            label: {
                                position: "middle" // start | end | middle
                            }
                        }
                    ]
                },

                // \u6807\u57DF
                markArea: {
                    data: [
                        [
                            {
                                name: "mark-area",
                                type: "average"
                            },
                            {
                                type: "max"
                            }
                        ]
                    ]
                }
            },
            {
                name: "b",
                type: "bar",
                barMinHeight: 2,
                data: [20, 0,
                    {
                        value: 136,
                        itemStyle: {
                            color: { // \u989C\u8272\u914D\u7F6E https://echarts.apache.org/zh/option.html#color
                                type: 'linear',
                                x: 1,
                                y: 1,
                                x2: 0,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: '#9FEAE5' // 0% \u5904\u7684\u989C\u8272
                                }, {
                                    offset: 1, color: '#FFC0CB' // 100% \u5904\u7684\u989C\u8272
                                }],
                                global: false // \u7F3A\u7701\u4E3A false
                            }
                        }

                    },
                    100, 100, 120],
                barWidth: 15, // \u67F1\u6761\u5BBD\u5EA6
                barGap: "20%" // \u67F1\u95F4\u8DDD \u67F1\u6761\u5BBD\u5EA6=100%
            }
        ],

        // \u533A\u57DF\u7F29\u653E
        dataZoom: [
            {
                type: "inside", // inside | slider
                zoomOnMouseWheel: true,
                moveOnMouseWheel: true,
                moveOnMouseMove: true
            }
        ]
    }`;return l(t,{title:{text:"bar & line"},grid:{left:"5%",top:"20%",bottom:"10%",width:"auto",containLabel:!0},tooltip:{confine:!0},legend:{type:"scroll",bottom:0,width:250},xAxis:{axisPointer:{show:!0,type:"shadow"},type:"category",data:["2023-06-09","2023-06-10","2023-06-11","2023-06-12","2023-06-13","2023-06-14"],name:"x",nameLocation:"end",splitLine:{show:!0,lineStyle:{type:"dashed"}},axisLine:{symbol:"none",lineStyle:{}},axisTick:{show:!0,inside:!0},axisLabel:{}},yAxis:{name:"y"},color:["#085078","#85D8CE"],series:[{name:"a",type:"line",data:[0,-20,36,10,100,20],areaStyle:{color:new E.Q.o(1,0,0,1,[{offset:0,color:"rgba(58,77,233,1)"},{offset:1,color:"rgba(58,77,233,0.3)"}])},markPoint:{symbol:"pin",symbolSize:35,data:[{name:"a1",type:"max"}]},markLine:{name:"\u6807\u7EBF",symbol:"none",label:{formatter:"{c}-{b}",offset:[0,10]},lineStyle:{type:"dashed",width:1},data:[{name:"\u6807\u7EBF",yAxis:66,lineStyle:{},label:{position:"middle"}}]},markArea:{data:[[{name:"mark-area",type:"average"},{type:"max"}]]}},{name:"b",type:"bar",barMinHeight:2,data:[20,0,{value:136,itemStyle:{color:{type:"linear",x:1,y:1,x2:0,y2:0,colorStops:[{offset:0,color:"#9FEAE5"},{offset:1,color:"#FFC0CB"}],global:!1}}},100,100,120],barWidth:15,barGap:"20%"}],dataZoom:[{type:"inside",zoomOnMouseWheel:!0,moveOnMouseWheel:!0,moveOnMouseMove:!0}]}),(0,u.jsx)(s,{refs:t,option:n})},y=function(){var t=(0,r.useRef)(null),n=`{
        title: {
            text: "\\n \\n pie",
            subtext: "\u526F\u6807\u9898:16 \\n aaa:20 \\n bbb:100",
            top: 'center',
            right: 'center'
        },

        // \u63D0\u793A\u6846
        tooltip: {
            trigger: "item"
        },

        // \u5BF9\u997C\u56FE\u4E0D\u751F\u6548
        // grid: {},
        legend: {
            orient: "vertical",
            left: "left",
            top: 0
        },
        color: ["pink", "red", "black", "green", "blue"],
        series: [
            {
                type: "pie",
                name: "From",

                center: ["50%", "60%"], // \u5706\u5FC3\u5750\u6807 [number|string,number|string] [\u6A2A\u5750\u6807,\u7EB5\u5750\u6807]

                radius: ["30%", "45%"], // \u997C\u56FE\u534A\u5F84\uFF0Cnumber | string eg:'20%'\u5916\u534A\u5F84\u5360\u5BBD/\u9AD8(\u77ED\u7684\u90A3\u4E2A)\u7684\u6BD4\u4F8B | [number|string,number|string] [\u5185\u534A\u5F84,\u5916\u534A\u5F84]

                data: [
                    { value: 1048, name: "S" },
                    { value: 735, name: "D" },
                    { value: 580, name: "E" },
                    { value: 484, name: "U" },
                    { value: 300, name: "V" }
                ],

                // \u6587\u672C\u6807\u7B7E
                label: {
                    // show:false,
                    position: "outside", // 'outside' \u997C\u56FE\u5916\u4FA7\uFF0C\u901A\u8FC7\u89C6\u89C9\u5F15\u5BFC\u7EBF\u8FDE\u63A5 | inside === inner | 'center'
                    // formatter: '{a}:{b}-{c}-{d}%',
                    formatter: ["{a| {a}:}{b| {b}-}", "{c| {c}-}{d| {d}%}"].join("\\n"),
                    // width: 80,
                    // overflow: 'break', // \u8BBE\u7F6E\u4E86width\u624D\u751F\u6548\uFF0Cnone | truncate \u622A\u65AD\u672B\u5C3E\u663E\u793Aellipsis\u914D\u7F6E\u7684\u6587\u672C \u9ED8\u8BA4... | break | breakAll \u5F3A\u5236\u5355\u8BCD\u5185\u6362\u884C

                    // \u81EA\u5B9A\u4E49\u5BCC\u6587\u672C\u6837\u5F0F
                    // {styleName| text content } \u6362\u884C\u7528 

                    rich: {
                        a: {
                            color: "red",
                            fontWeight: 700
                        },
                        b: {
                            fontSize: 18
                        },
                        c: {
                            backgroundColor: "#449933"
                            /* 
                                \u6240\u6709\u5C5E\u6027\uFF0Clabel\u540C\u7406
                                { 
                                    color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , 
                                    borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur ,
                                    shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , 
                                    textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY 
                                }
                                                
                            */
                        }
                    }

                    // alignTo: 'labelLine', // \u6807\u7B7E\u5BF9\u9F50\u65B9\u5F0F none | lableLine \u672B\u7AEF\u5BF9\u9F50 | edge \u6587\u5B57\u5BF9\u9F50\u4E0EedgeDistance(\u6587\u5B57\u8FB9\u8DDD)\u914D\u5408\u4F7F\u7528  \uFF08position\u4E3Aoutside\u65F6\u751F\u6548\uFF09
                },

                // \u89C6\u89C9\u5F15\u5BFC\u7EBF\u76F8\u5173\u914D\u7F6E
                labelLine: {
                    // show: true,
                    // showAbove: true,
                    length: 10, // \u9760\u5185\u5F15\u5BFC\u7EBF
                    length2: 15, // \u9760\u5916\u5F15\u5BFC\u7EBF
                    minTurnAngle: 90 // \u6700\u5C0F\u5939\u89D2  maxTurnAngle

                    /*
                    lineStyle: {
                        color, width, type, dashOffset, cap, join, miterLimit, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, opacity
                    }
                    */
                },

                // \u6807\u7B7E\u7EDF\u4E00\u5E03\u5C40\u914D\u7F6E
                labelLayout: () => ({
                    // labelLayout: (p) => ({
                    //     x: p.rect.x - 10,
                    //     ...
                    // })

                    // align: 'left'
                    // verticalAlign: 'top' | 'middle' | 'bottom'
                    // draggable: boolean

                    hideOverlap: true, // \u9690\u85CF\u91CD\u53E0\u7684\u6807\u7B7E
                    moveOverlap: "shiftY" // \u53EF\u632A\u52A8\u6807\u7B7E  shiftx | shiftY  \u6C34\u5E73/\u5782\u76F4\u65B9\u5411\u4F9D\u6B21\u4F4D\u79FB
                }),

                // \u56FE\u5F62\u6837\u5F0F
                itemStyle: {
                    borderColor: "black"
                    // borderType: solid | dashed dotted | number | [number (\u7EBF\u957F),number (\u7A7A\u767D\u957F)]
                },

                // \u9AD8\u4EAE\u72B6\u6001\u7684\u6247\u533A\u548C\u6807\u7B7E\u6837\u5F0F
                emphasis: {
                    // disabled: boolean // \u662F\u5426\u5173\u95ED\u9AD8\u4EAE
                    // scale: boolean    // \u662F\u5426\u5F00\u542F\u9AD8\u4EAE\u540E\u6247\u533A\u7684\u653E\u5927\u6548\u679C
                    // scaleSize: number    // \u653E\u5927\u5C3A\u5BF8
                    // focus: 'none' | 'self' \u4E4B\u805A\u7126\u5F53\u524D\u9AD8\u4EAE\u7684\u6570\u636E\u7684\u56FE\u5F62 | 'series' \u805A\u7126\u5F53\u524D\u9AD8\u4EAE\u7684\u6570\u636E\u6240\u5728\u7684\u7CFB\u5217\u7684\u6240\u6709\u56FE\u5F62
                    // blurScope: 'coordinateSystem' \u6DE1\u51FA\u8303\u56F4\u4E3A\u5750\u6807 | 'series' \u6DE1\u51FA\u8303\u56F4\u4E3A\u7CFB\u5217 | 'global' \u6DE1\u51FA\u8303\u56F4\u4E3A\u5168\u5C40
                }
            }
        ]
    }`;return l(t,{title:{text:`
 
 pie`,subtext:`\u526F\u6807\u9898:16 
 aaa:20 
 bbb:100`,top:"center",right:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left",top:0},color:["pink","red","black","green","blue"],series:[{type:"pie",name:"From",center:["50%","60%"],radius:["30%","45%"],data:[{value:1048,name:"S"},{value:735,name:"D"},{value:580,name:"E"},{value:484,name:"U"},{value:300,name:"V"}],label:{position:"outside",formatter:["{a| {a}:}{b| {b}-}","{c| {c}-}{d| {d}%}"].join(`
`),rich:{a:{color:"red",fontWeight:700},b:{fontSize:18},c:{backgroundColor:"#449933"}}},labelLine:{length:10,length2:15,minTurnAngle:90},labelLayout:function(){return{hideOverlap:!0,moveOverlap:"shiftY"}},itemStyle:{borderColor:"black"},emphasis:{}}]}),(0,u.jsx)(s,{refs:t,option:n})},b=function(){var t=(0,r.useRef)(null),n=`{
        title: {
            text: 'dataset'
        },
        legend: {},
        tooltip: {},
        /* 
        series.data \u6216\u8005 dataset.source \u7684\u6BCF\u4E2A\u7EAC\u5EA6\u7684\u4FE1\u606F 
      
        dataset: string[] // => {name:string}[]
        dataset: {
            name: string,
            type: number | ordinal | float | int | time,
            displayName: string // \u7528\u4E8Etooltip\u4E2D\u7EAC\u5EA6\u540D\u7684\u5C55\u793A
        }[]
         */
        dataset: {
            // \u7528 dimensions \u6307\u5B9A\u4E86\u7EF4\u5EA6\u7684\u987A\u5E8F\u3002\u76F4\u89D2\u5750\u6807\u7CFB\u4E2D\uFF0C\u5982\u679C X \u8F74 type \u4E3A category\uFF0C
            // \u9ED8\u8BA4\u628A\u7B2C\u4E00\u4E2A\u7EF4\u5EA6\u6620\u5C04\u5230 X \u8F74\u4E0A\uFF0C\u540E\u9762\u7EF4\u5EA6\u6620\u5C04\u5230 Y \u8F74\u4E0A\u3002
            // \u5982\u679C\u4E0D\u6307\u5B9A dimensions\uFF0C\u4E5F\u53EF\u4EE5\u901A\u8FC7\u6307\u5B9A series.encode \u5B8C\u6210\u6620\u5C04
            dimensions: ["product", "2015", "2016", "2017"],
            source: [
                { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
                { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
                { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
                { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 }

                /*  =>
                 ['product', '2015', '2016', '2017'],
                 ['Matcha Latte', 43.3, 85.8, 93.7],
                 ['Milk Tea', 83.1, 73.4, 55.1],
                 ['Cheese Cocoa', 86.4, 65.2, 82.5],
                 ['Walnut Brownie', 72.4, 53.9, 39.1]
                   */
            ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        // type : pie | line | bar
        series: [{ type: "line" }, { type: "bar" }, { type: "bar" }]
    }`;return l(t,{title:{text:"dataset"},legend:{},tooltip:{},dataset:{dimensions:["product","2015","2016","2017"],source:[{product:"Matcha Latte",2015:43.3,2016:85.8,2017:93.7},{product:"Milk Tea",2015:83.1,2016:73.4,2017:55.1},{product:"Cheese Cocoa",2015:86.4,2016:65.2,2017:82.5},{product:"Walnut Brownie",2015:72.4,2016:53.9,2017:39.1}]},xAxis:{type:"category"},yAxis:{},series:[{type:"line"},{type:"bar"},{type:"bar"}]}),(0,u.jsx)(s,{refs:t,option:n})};function g(){return(0,u.jsxs)(h.Z,{gutter:[12,12],children:[(0,u.jsx)(i.Z,{span:24,children:(0,u.jsx)(A,{})}),(0,u.jsx)(i.Z,{span:24,children:(0,u.jsx)(y,{})}),(0,u.jsx)(i.Z,{span:24,children:(0,u.jsx)(b,{})})]})}}}]);
