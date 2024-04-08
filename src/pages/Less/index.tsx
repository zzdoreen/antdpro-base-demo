// @ts-ignore
import { BorderBox2 } from '@jiaminghi/data-view-react'
import './index.less'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Collapse } from 'antd';

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
        }`
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
        }`
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
        }`
    }]

export default function Less() {
    return <div>
        <div className="title">
            Less（Leaner Style Sheets 的缩写）是一种向后兼容的 CSS 语言扩展。Less.js 是将 Less 样式转换为 CSS 样式的 JavaScript 工具。
        </div>
        <div className='container'>
            {
                lessOpts.map(({ name: str, code }) => <div className='item' key={str}>
                    <BorderBox2 style={{ padding: 30, height: 400 }} color={['#ddd', '#ccc']}>
                        <h1>{str}</h1>
                        <div className={"content" + (str === ' :extend 复用样式(继承)' ? ' border-style' : '')} />
                    </BorderBox2>
                    {
                        <Collapse>
                            <Collapse.Panel key={str} header='code'>
                                <SyntaxHighlighter language='less' style={dark}>{code}</SyntaxHighlighter>
                            </Collapse.Panel>
                        </Collapse>
                    }
                </div>)
            }
        </div>

    </div>
}