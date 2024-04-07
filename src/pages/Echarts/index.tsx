import { Col, Row } from 'antd';
import './index.less'
import { BarChart, DatasetChart, PieChart } from './components';

export default function Echarts() {
    return <Row gutter={[12, 12]}>
        <Col span={24}><BarChart /></Col>
        <Col span={24}><PieChart /></Col>
        <Col span={24}><DatasetChart /></Col>
    </Row>
}