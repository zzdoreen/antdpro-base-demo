import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'
import './index.less'
import { Button, Input } from 'antd'
import { useRef, useState } from 'react'

export default function Preview() {
    /* 
    https://github.com/Alcumus/react-doc-viewer/blob/master/src/plugins/msdoc/index.tsx

    msoffic是通过office提供的在线预览https://view.officeapps.live.com/op/view.aspx?src= 生成iframe
    
    msoffic不支持本地文件预览 需要上传到服务器 （但是乱码? 大概和响应头有关

    (有些在docviewer能看的文件 office在线预览不能看，office在线预览能看的 docviewer不能看 ？？)
    */
    const [officeUri, setOfficeUri] = useState('https://gitee.com/zzdoreen/test/raw/master/1.xlsx')
    const inputRef = useRef('https://gitee.com/zzdoreen/test/raw/master/1.xlsx')

    return <div className='preview-container'>
        <DocViewer
            documents={[
                { uri: '/zzdoreen/test/raw/master/api.docx' },
                { uri: '/template/_template_api.pdf', },
                { uri: '/favicon.png' },
            ]}
            pluginRenderers={DocViewerRenderers}
        />
        <div>
            <div>
                <Input onChange={(e) => inputRef.current = e.target.value} placeholder='https://gitee.com/zzdoreen/test/raw/master/1.xlsx' />
                <Button onClick={() => setOfficeUri(inputRef.current)}>确定</Button>
            </div>
            <iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${officeUri}`} width={600} height={700} />
        </div>
    </div>
}