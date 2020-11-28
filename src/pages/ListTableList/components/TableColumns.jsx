const columnsRule = [
  {
    title: '规则名称',
    dataIndex: 'name',
    tip: '规则名称是唯一的 key',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    render: (dom, entity) => {
      return <a onClick={() => setRow(entity)}>{dom}</a>;
    },
  }
];

const columnsOrdinary = [
  {
    title: '描述',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    hideInForm: true,
    renderText: (val) => `${val} 万`,
  },
];

const columnsStatus = [
  {
    title: '状态',
    dataIndex: 'status',
    hideInForm: true,
    valueEnum: {
      0: {
        text: '关闭',
        status: 'Default',
      },
      1: {
        text: '运行中',
        status: 'Processing',
      },
      2: {
        text: '已上线',
        status: 'Success',
      },
      3: {
        text: '异常',
        status: 'Error',
      },
    },
  }
];

const columnsTime = [
  {
    title: '上次调度时间',
    dataIndex: 'updatedAt',
    sorter: true,
    valueType: 'dateTime',
    hideInForm: true,
    renderFormItem: (item, { defaultRender, ...rest }, form) => {
      const status = form.getFieldValue('status');

      if (`${status}` === '0') {
        return false;
      }

      if (`${status}` === '3') {
        return <Input {...rest} placeholder="请输入异常原因！" />;
      }

      return defaultRender(item);
    },
  },
];

// 组合单独columns
const columnsMap = {
  'userTable': [...columnsRule, ...columnsOrdinary, ...columnsStatus, ...columnsTime],
};

export default columnsMap;
