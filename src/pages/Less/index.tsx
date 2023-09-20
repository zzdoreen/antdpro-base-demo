import './index.less'

const lessOpts = ['变量复用', ' :extend 复用样式(继承)', ' mixin 减少重复样式编写', '映射',]

export default function Less() {
    return <div>
        <div className="title">
            Less（Leaner Style Sheets 的缩写）是一种向后兼容的 CSS 语言扩展。Less.js 是将 Less 样式转换为 CSS 样式的 JavaScript 工具。
        </div>
        <div className='container'>
            {
                lessOpts.map(str => <div className='item' key={str}>
                    <h1>{str}</h1>
                    <div className={"content" + (str === ' :extend 复用样式(继承)' ? ' border-style' : '')} />
                </div>)
            }
        </div>
    </div>
}