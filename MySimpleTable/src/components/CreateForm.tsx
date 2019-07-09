import { Form, Input, Modal, Select, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (
    fieldsValue: any,
  ) => void;
  handleModalVisible: () => void;
}

const OptionStatus: any[] = [
  { value: 1, label: '状态1' },
  { value: 2, label: '状态2' },
  { value: 3, label: '状态3' },
  { value: 4, label: '状态4' },
]

class CreateForm extends Component<CreateFormProps> {

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="新建"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Column1">
          {form.getFieldDecorator('column1', {
            rules: [{ required: true, message: '请输入！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Column2">
          {form.getFieldDecorator('column2', {
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Column3">
          {form.getFieldDecorator('column3', {
            rules: [{ required: true, message: '请输入！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Column4">
          {form.getFieldDecorator('column4', {
            rules: [{ required: true, message: '请选择时间！' }],
          })(<DatePicker style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Column5">
          {form.getFieldDecorator('column5', {
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
};

export default Form.create<CreateFormProps>()(CreateForm);
