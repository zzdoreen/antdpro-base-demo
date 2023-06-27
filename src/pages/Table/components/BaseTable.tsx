import ImportProcess from "@/components/Common/ImportComponent"
import ProTable, { ProFormModal, useProTable } from "@/components/ProTable"
import { callProTableData } from "@/services"
import type { BaseResponse } from "@/services/entities"
import type { ProColumns } from "@ant-design/pro-table"
import { Button, Space } from "antd"
import type { ReactNode } from "react";
import React, { useMemo, useRef } from "react"

interface IBaseTable<T> {
    column: ProColumns<T>[],
    listService: (param?: any) => Promise<BaseResponse<{ list: any[]; total: number; }>>,
    addService: (param?: any) => Promise<BaseResponse<any>>,
    editService: (param?: any) => Promise<BaseResponse<any>>,
    extra?: ReactNode[],// 额外的按钮
    addText?: string,
    importSetting?: {
        name: string
        service: () => Promise<BaseResponse<any>>
        modalName: string
        templateUrl: string
    }
}

const BaseTableComponents: React.FC<IBaseTable<any>> = (
    { addText, extra = [], column, importSetting, listService, addService, editService }) => {
    const searchRef = useRef<Object>()
    const columns: ProColumns<any>[] = useMemo(() => [
        ...column,
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 200,
            render: (_: any, item: any) => <Space>
                <Button type="link" onClick={() => setModal({ visible: true, title: '编辑', defaultFormValues: { ...item } })}>编辑</Button>
            </Space >
        }], [column])

    const { proTableProps, setModal, proFormModalProps, reload, modal } = useProTable({
        columns,
        request: callProTableData(listService)
    })

    const proFormColumns = useMemo(() => {
        const { columns } = proFormModalProps
        if (modal.isAdd) return columns
        // return columns.map(e => {
        //     if (['id', 'account', 'description'].includes(e.dataIndex as string))
        //         return {
        //             ...e,
        //             readonly: true
        //         }
        //     return e
        // })
        return columns

    }, [proFormModalProps.columns, modal.isAdd])

    const onSubmit = (val: any, isAdd: boolean | undefined) => {
        const service = isAdd ? addService : editService
        service(val).then(({ code, message, data }) => {
            if (code == 0) {
                reload()
            }
        })
    }
    return <>
        <ProTable
            {...proTableProps}
            addText={addText}
            beforeSearchSubmit={val => searchRef.current = val}
            extraActions={[...extra,
            importSetting && <ImportProcess name={importSetting.modalName} service={importSetting.service} reload={reload}
                template={importSetting.templateUrl}
                tootip="仅支持xlsx格式文件,文件小于30MB" accept=".xlsx"
            >
                <Button type="primary" >导入{importSetting.name}</Button>
            </ImportProcess>
            ]}

        />

        <ProFormModal {...proFormModalProps} columns={proFormColumns}
            style={{ overflowY: 'auto', maxHeight: 600 }}
            modelProps={{ width: 600 }} onSubmit={vals => onSubmit(vals, modal.isAdd)}
        />
    </>
}

export default React.memo(BaseTableComponents)