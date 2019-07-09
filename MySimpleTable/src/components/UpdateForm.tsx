import { DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: Partial<TableListItem>) => void;
  handleUpdate: (values: Partial<TableListItem>) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}

const FormItem = Form.Item;
const { Option } = Select;


const OptionStatus: any[] = [
  { value: 1, label: '状态1' },
  { value: 2, label: '状态2' },
  { value: 3, label: '状态3' },
  { value: 4, label: '状态4' },
]

class UpdateForm extends Component<UpdateFormProps> {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  okHandle = () => {
    const { form, handleUpdate, values } = this.props;
    console.log(values)
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const updateValue = {
        ...values,
        ...fieldsValue
      }
      handleUpdate(updateValue);
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, form, values } = this.props;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible(false, values)}
      >
        <FormItem key="column1" {...this.formLayout} label="Column1">
          {form.getFieldDecorator('column1', {
            initialValue: values.column1,
            rules: [{ required: true, message: '请输入！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="column2" {...this.formLayout} label="Column2">
          {form.getFieldDecorator('column2', {
            initialValue: values.column2,
            rules: [{ required: true, message: '请输入！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {
                OptionStatus.map(option => {
                  return <Option key={option.value} value={option.value}>{option.label}</Option>
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem key="column3" {...this.formLayout} label="Column3">
          {form.getFieldDecorator('column3', {
            initialValue: values.column3,
            rules: [{ required: true, message: '请输入！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="column4" {...this.formLayout} label="Column4">
          {form.getFieldDecorator('column4', {
            initialValue: moment(values.column4),
            rules: [{ required: true, message: '请选择时间！' }],
          })(<DatePicker style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem key="column5" {...this.formLayout} label="Column5">
          {form.getFieldDecorator('column5', {
            initialValue: values.column5,
            rules: [{ required: true, message: '请输入！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {
                OptionStatus.map(option => {
                  return <Option key={option.value} value={option.value}>{option.label}</Option>
                })
              }
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
