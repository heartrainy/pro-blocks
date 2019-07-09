import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Modal,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  tableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  updateFormValues: Partial<TableListItem>;
}


const OptionStatus: any[] = [
  { value: 1, label: '状态1' },
  { value: 2, label: '状态2' },
  { value: 3, label: '状态3' },
  { value: 4, label: '状态4' },
]

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    tableList,
    loading,
  }: {
    tableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    tableList,
    loading: loading.models.tableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'Column1',
      dataIndex: 'column1',
    },
    {
      title: 'Column2',
      dataIndex: 'column2'
    },
    {
      title: 'Column3',
      dataIndex: 'column3',
      sorter: true,
      render: (val: number) => `${val} 万`,
    },
    {
      title: 'Column4',
      dataIndex: 'column4',
      sorter: true,
      render: (val: number) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: 'Column5',
      dataIndex: 'column5'
    },
    {
      title: '操作',
      dataIndex: 'key',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleRemoveRecord([text])}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'tableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'tableList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        this.handleRemoveRecord(selectedRows.map(row => row.key))
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // 格式化日期
      const values = {
        ...fieldsValue,
        'column4': fieldsValue['column4'] && fieldsValue['column4'].format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'tableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: Partial<TableListItem>) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleAdd = (fields: any) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'tableList/add',
      payload: {
        ...fields
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: Partial<TableListItem>) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/update',
      payload: {
        ...fields
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  handleRemoveRecord = (keys: number[]) => {
    const _this = this;
    Modal.confirm({
      title: '提示',
      content: keys.length == 1 ? '确定删除该条记录？' : '确定批量删除记录？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        _this.props.dispatch({
          type: 'tableList/remove',
          payload: {
            key: keys,
          },
          callback: () => {
            _this.setState({
              selectedRows: [],
            });
          },
        });
      }
    });
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Column1">
              {getFieldDecorator('column1')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Column2">
              {getFieldDecorator('column2')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {
                    OptionStatus.map(option => {
                      return <Option key={option.value} value={option.value}>{option.label}</Option>
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Column1">
              {getFieldDecorator('column1')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Column2">
              {getFieldDecorator('column2')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {
                    OptionStatus.map(option => {
                      return <Option key={option.value} value={option.value}>{option.label}</Option>
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Column3">
              {getFieldDecorator('column3')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Column4">
              {getFieldDecorator('column4')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入日期" />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Column5">
              {getFieldDecorator('column5')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {
                    OptionStatus.map(option => {
                      return <Option key={option.value} value={option.value}>{option.label}</Option>
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      tableList: { data },
      loading
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, updateFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
        />
        {
          /*
          stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null
          */
        }
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
