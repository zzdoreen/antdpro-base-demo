import ProTable, { ProFormModal, useProTable } from "@/components/ProTable";
import { callProTableData } from "@/services";
import { addPlanListService, delPlanService, getPlanListService } from "@/services/api";
import type { PlanEntity } from "@/services/entities";
import { ModalConfirm, UnixTimeRender } from "@/utils/tools";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, message } from "antd";
import moment from "moment";
import { useCallback, useMemo } from "react";
import style from './index.less'

export default function Table() {
    const columns = useMemo(() => [
        {
            title: (_, type) => type === 'table' ? '字符串' : '名字(字符串',
            dataIndex: 'name',
            formItemProps: {
                rules: [{ required: true }, { max: 30 }]
            }
        },
        {
            title: '数字',
            dataIndex: 'age',
            valueType: 'digitRange',
            fieldProps: {
                // disabled: true,
                precision: 2,
                min: 0,
                max: 120
            },
            search: {
                transform: (v: [number, number]) => {
                    if (!v) return {}
                    const [min, max] = v
                    return {
                        minAge: min,
                        maxAge: max
                    }
                }
            },
            render: (_, { age }) => age
        },
        {
            title: '筛选',
            dataIndex: 'sex',
            valueEnum: new Map([
                ['female', '女'],
                ['male', '男']
            ]),
        },
        {
            title: '时间',
            dataIndex: 'time',
            valueType: 'dateRange',
            hideInForm: true,
            render: (_, { time }) => UnixTimeRender(time),
            search: {
                transform: (v?: [string, string]) => {
                    if (!v) return {}
                    const [s, e] = v
                    return {
                        createStartAt: moment(s).startOf('day').unix(),
                        createEndAt: moment(e).endOf('day').unix()
                    }
                },
            }
        },
        {
            title: '图片',
            dataIndex: 'imgs',
            valueType: 'image',
            search: false,
            hideInForm: true
        },
        {
            title: '开始日期',
            dataIndex: 'startAt',
            valueType: 'date',
            search: false,
            formItemProps: {
                rules: [{ required: true, message: '请选择${label}' }],
            },
            render: (_, { startAt }) => moment.unix(startAt).format('yyyy-MM-DD'),
            fieldProps: {
                allowClear: false,
                placeholder: '请选择',
            },
        },
        {
            title: '结束日期',
            dataIndex: 'endAt',
            valueType: 'date',
            search: false,
            formItemProps: (form) => ({
                rules: [
                    { required: true, message: '请选择${label}' },
                    {
                        validator: (rule, value) => {
                            const startAt = form?.getFieldValue('startAt')?.startOf('day').unix();
                            const endAt = value?.startOf('day').unix();
                            if (endAt < startAt) return Promise.reject('结束日期不能早于开始日期');
                            else return Promise.resolve();
                        },
                    },
                ],
            }),
            fieldProps: (form) => {
                console.log(form?.getFieldValue('startAt'))
                const startAt = form?.getFieldValue('startAt')?.startOf('day');
                return {
                    allowClear: false,
                    placeholder: '请选择',
                    disabledDate: (curr) => curr < startAt,
                };
            },
            render: (_, { endAt }) => moment.unix(endAt).format('yyyy-MM-DD'),
        },
        {
            dataIndex: 'id',
            hideInTable: true,
            search: false,
            formItemProps: {
                hidden: true
            }
        },
        {
            title: '操作',
            valueType: 'option',
            render: (dom, entity) => <>
                <Button type="link" onClick={() => setModal({
                    visible: true,
                    defaultFormValues: {
                        ...entity, startAt: moment.unix(entity.startAt),
                        endAt: moment.unix(entity.endAt)
                    },
                    title: '编辑'
                })}>编辑</Button>
                <Button danger type="link" onClick={() => handleBatchDelete(entity.id)}>删除</Button>
            </>,
        }
    ] as ProColumns<any[]>, [])


    /* 
    const columns = [
    {
        title:'',  // 标签名称
        dataIndex:'', // 绑定字段
        ellipsis: true | false,
        valueEnum: [{label:'',value:''}],
        valueType:'text' | 'date' // 值类型 ...
        order: number // 表单中的权重 越大越靠前

        search: true | false | { transfer:(value)=>any }, // 搜索启用/隐藏
        // transfer 转化值的 key, 一般用于时间区间的转化
        search:{
            transform: (v?: [string, string]) => {
                    if (!v) return {}
                    const [s, e] = v
                    return {
                        startAt: moment(s).startOf('day').unix(),
                        endAt: moment(e).endOf('day').unix()
                    }
                }
         }


        colSize: number, // 表单占用格子数量 colSpan*span
        hideInSearch: true | false,
        hideInTable:true | false,
        hideInForm:true | false,
        initialValue:any, // 初始值

        // table的render
        renderText: (text,record,index,action)=>string,
        render: (text,record,index,action)=>ReactNode|ReactNode[],

        // 表单的输入组件 proFields / antd / 自定义组件
        renderFormItem: (item, ,form)=>RecatNode,
        // 表单配置
        fieldProps: {
            precision:1 // 精度 ... antd 表单组件相关配置
        },
        formItemProps: {  //  Form.Item 相关配置
            rules:[ 
                { required:true|false,message:'' },
                {
                   message:'',
                   validator: (record,value){
                      if(value)return Promise.resolve()
                      return Promise.reject()
                   }
               }
           ]
        }
    },
    ],

    valueType :
        password	密码输入框
        money	金额输入框
        textarea	文本域
        date	日期
        dateTime	日期时间
        dateWeek	周
        dateMonth	月
        dateQuarter	季度输入
        dateYear	年份输入
        dateRange	日期区间
        dateTimeRange	日期时间区间
        time	时间
        timeRange	时间区间
        text	文本框
        select	下拉框
        treeSelect	树形下拉框
        checkbox	多选框
        rate	星级组件
        radio	单选框
        radioButton	按钮单选框
        progress	进度条
        percent	百分比组件
        digit	数字输入框
        second	秒格式化
        avatar	头像
        code	代码框
        switch	开关
        fromNow	相对于当前时间
        image	图片
        jsonCode	代码框，但是带了 json 格式化
        color	颜色选择器
        cascader 级联选择器
    */

    const { proTableProps, proFormModalProps, setModal, reload, modal } = useProTable({
        columns,
        request: callProTableData(getPlanListService),
    });


    const onSubmit = useCallback((item: PlanEntity) => {
        const service = addPlanListService({ ...item, createdAt: moment(item.createdAt).unix() });
        return service.then(({ code, message: msg }) => {
            if (code === 0) {
                message.success(`新增成功`);
                reload();
                setModal({ visible: false });
            } else {
                message.error(msg || '操作失败');
            }
        });
    }, []);

    const handleBatchDelete = useCallback((id: number) => {
        ModalConfirm({
            content: '确定删除此数据吗?',
            onOk() {
                delPlanService(id).then(({ code, message: msg }) => {
                    if (code === 0) {
                        message.success('删除成功');
                        reload(true);
                    } else message.error(msg || '删除失败');
                });
            },
        });
    }, []);

    const formColumns = useMemo(() => {
        const { columns: column } = proFormModalProps
        return column.map(e => {
            if (e.dataIndex === 'age') return {
                ...e,
                valueType: 'digit'
            }
            return e
        })
    }, [proFormModalProps.columns])

    return <>
        <ProTable
            {...proTableProps}
            searchSpan={6}
            addText="新建"
            // addButtonProps={{ disabled: !editable() }}
            // params={{ projectNumber }
            className={style._table}
        />
        <ProFormModal {...proFormModalProps} columns={formColumns} onSubmit={onSubmit as any} />
    </>
}