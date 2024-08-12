import { getRandomMusicService } from "@/services/music";
import { useRequest } from "ahooks";
import './index.less'
import { RedoOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { Divider, Tag, } from "antd";

type ArrayToUnion<T extends any[]> = T[number];

const MusicType = ['热歌榜', '新歌榜', '飙升榜', '抖音榜', '电音榜']

export default function Music() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [sort, setSort] = useState<ArrayToUnion<typeof MusicType>>(MusicType[0])
    const [play, setPlay] = useState<boolean>(false)
    // @ts-ignore
    const { data: { name, artistsname, picurl, url } = {}, run, mutate } = useRequest(getRandomMusicService, {
        defaultParams: [sort],
        refreshDeps: [sort],
        onSuccess: (v) => {
            if (v?.code === 1) {
                // @ts-ignore
                mutate(v?.data)
                setTimeout(() => {
                    if (isNaN(audioRef.current?.duration as number))
                        run(sort)
                }, 1e3);
            }
        }
    })
    return <div className="bg">
        <div className="type">
            <Divider orientation="center">分类</Divider>
            {
                MusicType.map(type => <Tag color={sort === type ? 'magenta' : "cyan"} key={type}
                    // @ts-ignore
                    onClick={(e) => setSort(e.target?.innerText)}>{type}</Tag>)
            }
            <Divider />
        </div>
        {/* @ts-ignore */}
        <div className="music-cover" style={{ '--custom-img': `url(${picurl})`, '--custom-transform': `${play ? '-200' : '-50'}px` }}>
            <div className="container" />
        </div>
        <div className="desc">
            <p>歌名：{name}</p>
            <p>歌手：{artistsname}</p>
        </div>
        <div className="opts">
            <audio src={url} autoPlay controls onEnded={() => run(sort)} ref={audioRef} onPlay={() => setPlay(true)} onPause={() => setPlay(false)} />
            <RedoOutlined onClick={() => run(sort)} />
        </div>
    </div>
}