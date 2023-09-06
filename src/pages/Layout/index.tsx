import { Tabs } from 'antd';
import './index.less'
import { useMemo, useState } from 'react';

export default function Layout() {
    const [type, setType] = useState("1")

    const layoutComponent = useMemo(() => {
        switch (type) {
            case '1': return <MonitorLayout />;
            case '2': return <BaseLayout />;
            case '3': return <WaterfallLayout />;
            case '4': return <FlexLayout />;
            default: return <MonitorLayout />
        }
    }, [type])

    return <Tabs defaultActiveKey={type} type="card" onChange={setType}
        items={new Array(4).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
                label: ['', '监控布局', '基础布局', '瀑布流布局', '自适应'][+id],
                key: id,
                children: layoutComponent
            };
        })}
    />
}

const MonitorLayout = () => {
    return <div className='layout-conatiner'>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
    </div>
}

const BaseLayout = () => {
    return <div className='page-layout'>
        <div>header</div>
        <div>left</div>
        <div>center</div>
        <div>right</div>
        <div>footer</div>
    </div>
}

const WaterfallLayout = () => {
    return <div className="waterfall-layout">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
}

const FlexLayout = () => {
    return <div className="flex-layout">
        {/* <video src="" id='video'></video> */}
        <div />
        <div />
        <div>
            {/*             <Button onClick={() => navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((res) => {
                    const video: HTMLVideoElement = document.getElementById('video');
                    video!.srcObject = res;
                    video!.onloadedmetadata = () => {
                        video!.play();
                    };
                })
                .catch((err) => console.log('error', navigator.mediaDevices))}>按钮</Button> */}
            <div className="imgs" />
        </div>
    </div >
}