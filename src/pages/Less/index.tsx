import { BorderBox4 } from '@jiaminghi/data-view-react'
import './index.less'

const lessOpts = [
    {
        name: '变量复用',
        code: `
            {
                @color: rgb(199, 138, 170);
                @first-content: content;

                .@{first-content} {
                    width: 100px;
                    height: $width;
                    background-color: @color;
                }
            }`
    },
    {
        name: ' :extend 复用样式(继承)',
        code: `
        .border-style {
            border: 5px solid salmon;
        }
        &:nth-of-type(2){
            .content {
                // =>  .border-style,.content {}
                &:extend(.border-style); 
                width: 200px;
                height: 200px;
            }
        }
        `
    },
    {
        name: ' mixin 减少重复样式编写',
        code: `
        .borderStyle() {
            // 带括号不会输出该样式，不带的话会留在css样式中
            background-color: lightgreen;
            border-radius: 50%;
        }

        #boxSize(@widths: 100px) {
            width: @widths;
            height: @widths;
        }

        .box-shadow(@x: 0, @y: 0, @blur: 2px, @color: #000) {
            box-shadow: @arguments; // mixin传递的所有参数
        }

        &:nth-of-type(3) {
            .content {
                .borderStyle() !important;
                #boxSize(150px);
                .box-shadow;
            }
        }
        `
    },
    {
        name: '映射',
        code: `
        {
            @backgroundColor: {
                primary: green;
                error: red;
            }

            .content {
                background-color: @backgroundColor[primary];
                width: 100px;
                height: $width;
            }
        }
        `
    },]

export default function Less() {
    return <div>
        <div className="title">
            Less（Leaner Style Sheets 的缩写）是一种向后兼容的 CSS 语言扩展。Less.js 是将 Less 样式转换为 CSS 样式的 JavaScript 工具。
        </div>
        <div className='container'>
            {
                lessOpts.map(({ name: str }) => <div className='item' key={str}>
                    <BorderBox4 style={{ padding: 30 }} color={['#ddd', '#ccc']}>
                        <h1>{str}</h1>
                        <div className={"content" + (str === ' :extend 复用样式(继承)' ? ' border-style' : '')} />
                    </BorderBox4>
                </div>)
            }
        </div>
        <div className="container">
            {
                lessOpts.map(({ code, name }) => <div className='item' key={name}>
                    <BorderBox4 style={{ padding: 20 }} color={['#ddd', '#ccc']} reverse>
                        <pre style={{ textWrap: 'wrap' }}>
                            <code>{code}</code>
                        </pre>
                    </BorderBox4>
                </div>)
            }
        </div>
    </div>
}