import { Descriptions } from "antd";
import styles from './legend.less'

export const LegendClassName = styles.legend


const HeatMapLegends = [
    {
        value: 1,
        label: '高',
        color: '#ff0404'
    },
    {
        value: 2,
        label: '中',
        color: 'rgb(227,255,55)'
    },
    {
        value: 3,
        label: '低',
        color: 'rgb(105,245,84)'
    },
    {
        value: 4,
        label: '极低',
        color: 'rgb(125,140,235)'
    },
    {
        value: 5,
        label: '无',
        color: '#071533'
    }
]

export const HeatMapLegend = () => <Descriptions
    colon={false} className="heatmap" column={1}
    title={<div className="legend-title" >人口密度图例</div>}
>
    {HeatMapLegends.map(({ color, value, label }) => (
        <Descriptions.Item key={value}
            label={<div className="legend-block" style={{
                backgroundColor: color, height: 12, top: 5, width: 12, borderRadius: '50%', ...value === 5 ? {
                    border: '1px solid #3C3C3C'
                } : {}
            }} />}
        >
            {label}
        </Descriptions.Item>
    ))}
</Descriptions >