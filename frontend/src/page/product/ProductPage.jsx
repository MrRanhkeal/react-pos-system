import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import { request } from "../../util/helper";
import {MdDelete, MdEdit, MdImage } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddFilled } from "@ant-design/icons";
import { IoMdEye } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

//please check this
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ProductPage() {
  // const { config } = configStore();
  const { config } = configStore();
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    id: null,
    name: "",
    category_id: "",
    brand: "",
    description: "",
    qty: 0,
    price: 0,
    discount: 0,
    status: 1,
    isReadOnly: false,
    image: "",
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
  });

  const refPage = React.useRef(1);

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setImageDefault] = useState([]);
  // const [imageOptional, setImageOptional] = useState([]);
  // const [imageOptional_Old, setImageOptional_Old] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    var param = {
      ...filter,
      page: refPage.current, // get value
      // txt_search: filter.txt_search,
      // category_id: filter.category_id,
      // brand: filter.brand,
      // page: filter.page,
    };
    setState((pre) => ({ ...pre, loading: true }));
    const res = await request("product", "get", param);
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        total: refPage.current == 1 ? res.total : pre.total,
        loading: false,
      }));
    }
  };

  const onCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
      id: null,
      isReadOnly: false
    }));
    setImageDefault([]);
    // setImageOptional([]);
    formRef.resetFields();
  };
  const onFinish = async (items) => {
  //   // aaaa
  //   // console.log("imageProductOptional", imageOptional_Old);
      //console.log(items);
  //   // var imageOptional = [];
  //   if (imageOptional_Old.length > 0 && items.image_optional) {
  //     imageOptional_Old.map((item1) => {
  //       var isFound = false;
  //       if (items.image_optional) {
  //         items.image_optional.fileList?.map((item2) => {
  //           if (item1.name === item2.name) {
  //             isFound = true;
  //           }
  //         });
  //       }
  //       if (isFound == false) {
  //         imageOptional.push(item1.name);
  //       }
  //     });
  //   }

    var params = new FormData();
    // id	category_id	barcode	name	brand	description	qty	price	discount	status	image
    params.append("name", items.name);
    params.append("category_id", items.category_id);
    // params.append("barcode", items.barcode); //
    params.append("brand", items.brand);
    params.append("description", items.description);
    // params.append("qty", items.qty);
    params.append("price", items.price);
    params.append("discount", items.discount);
    params.append("status", items.status);

    // when update this two more key
    params.append("image", formRef.getFieldValue("image")); // just name image

    // if (imageOptional && imageOptional.length > 0) {
    //   // image for remove
    //   imageOptional.map((item) => {
    //     params.append("image_optional", item); // just name image
    //   });
    // }

    params.append("id", formRef.getFieldValue("id"));

    if (items.image_default) {
      if (items.image_default.file.status === "removed") {
        params.append("image_remove", "1");
      } else {
        params.append(
          "upload_image",
          items.image_default.file.originFileObj,
          items.image_default.file.name
        );
      }
    }

    // if (items.image_optional) {
    //   items.image_optional.fileList?.map((item) => {
    //     // multiple image
    //     if (item?.originFileObj) {
    //       params.append("upload_image_optional", item.originFileObj, item.name);
    //     }
    //   });
    // }

    var method = "post";
    if (formRef.getFieldValue("id")) {
      method = "put";
    }
    const res = await request("product", method, params);
    if (res && !res.error) {
      // message.success(res.message);
      message.success(`Product ${method === "put" ? "updated" : "created"} successfully`);
      onCloseModal();
      getList();
    } else {
      res.error("error");
      // res.error?.barcode && message.error(res.error?.barcode);
    }
  };
  const onBtnNew = async () => {
    setState((p) => ({
      ...p,
      visibleModal: true,
      isReadOnly: false
    }));
    getList();
    formRef.resetFields();
    setImageDefault([]); 
  };
  // const onBtnNew = async () => {
  //   const res = await request("new_barcode", "post");
  //   if (res && !res.error) {
  //     formRef.setFieldValue("barcode", res.barcode);
  //     setState((p) => ({
  //       ...p,
  //       visibleModal: true,
  //     }));
  //   }
  // };

  //please check this
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeImageDefault = ({ fileList: newFileList }) =>
    setImageDefault(newFileList);
  // const handleChangeImageOptional = ({ fileList: newFileList }) =>
  //   setImageOptional(newFileList);

  const onFilter = () => {
    getList(); 
  };

  const onClickEdit = async (item) => {
    formRef.setFieldsValue({
      ...item,
    });
    setState((pre) => ({ ...pre, visibleModal: true }));
    if (item.image != "" && item.image != null) {
      const imageProduct = [
        {
          uid: "-1",
          name: item.image,
          status: "done",
          url: "http://localhost/coffee/" + item.image,
        },
      ];
      setImageDefault(imageProduct);
    }
    
    //
    // product_image
    // const res_image = await request("product_image/" + item.id, "get");
    // if (res_image && !res_image.error) {
    //   if (res_image.list) {
    //     var imageProductOptional = [];
    //     res_image.list.map((item, index) => {
    //       imageProductOptional.push({
    //         uid: index,
    //         name: item.image,
    //         status: "done",
    //         url: "http://localhost:81/fullstack/image_pos/" + item.image,
    //       });
    //     });
    //     // setImageOptional(imageProductOptional);
    //     // setImageOptional_Old(imageProductOptional);
    //   }
    // }
  };
  const clickReadOnly = (item) => { 
    setState((p) => ({
    ...p,
    visibleModal: true,
    isReadOnly: true
  }))  

  // Handle image display for view mode
  if (item.image) {
    setImageDefault([
      {
        uid: '-1',
        name: item.image,
        status: 'done',
        url: `http://localhost/coffee/${item.image}`,
      }
    ]);
  } else {
    setImageDefault([]);
  }

  formRef.setFieldsValue({
    id: item.id,
    name: item.name,
    category_id: item.category_id,
    // barcode: item.barcode,
    brand: item.brand,
    description: item.description,
    price: item.price,
    discount: item.discount,
    status: item.status,
    image: item.image,
  });
};
  const onClickDelete = (item) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure! you want to remove porduct ${item.name}?`,
      onOk: async () => {
        const res = await request("product", "delete", item);
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  return (
    <MainPage loading={state.loading}>
      {/* <Modal
        open={previewOpen}
        // title="Image Preview"
        //footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100px',height:'100px' }} src={previewImage} />
      </Modal> */}
      <div className="pageHeader">
        <Space>
          <div>Product {state.total}</div>
          <Input.Search
            onChange={(event) =>
              setFilter((p) => ({ ...p, txt_search: event.target.value }))
            }
            allowClear
            placeholder="Search"
          />
          <Select
            allowClear
            style={{ width: 130 }}
            placeholder="Category"
            options={config.category}
            onChange={(id) => {
              setFilter((pre) => ({ ...pre, category_id: id }));
            }}

          />
          <Select
            allowClear
            style={{ width: 130 }}
            placeholder="Brand"
            options={config.brand}
            onChange={(id) => {
              setFilter((pre) => ({ ...pre, brand: id }));
            }}
          />
          <Button onClick={onFilter} type="primary">
            <FaSearch />Filter
          </Button>
        </Space>
        <Button type="primary" onClick={onBtnNew} style={{padding:"10px",marginBottom:"10px",marginLeft: "auto"}}>
          <FileAddFilled/> New
        </Button>
      </div>
      <Modal
        open={state.visibleModal}
        title={state.isReadOnly ? "View Product" : formRef.getFieldValue("id") ? "Edit Product" : "New Product"}
        footer={
          state.isReadOnly ? (
            // View Product modal - only show Close button
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onCloseModal}>
                Close
              </Button>
            </div>
          ) : (
            // Edit/New Product modal - show Save and Cancel buttons
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={onCloseModal}>
                Cancel
              </Button>
              <Button type="primary" onClick={() => formRef.submit()}>
                {formRef.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </div>
          )
        }
        onCancel={onCloseModal}
        
      >
        <Form
          form={formRef}
          layout="vertical"
          onFinish={onFinish}
          disabled={state.isReadOnly}
        >
          <div style={{ marginBottom: '20px' }}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name={"name"}
                label="Product name"
                rules={[
                  {
                    required: true,
                    message: "Please fill in product name",
                  },
                ]}
              >
                <Input placeholder="Product name" />
              </Form.Item>
              <Form.Item
                name={"brand"}
                label="Brand"
                rules={[
                  {
                    required: true,
                    message: "Please fill in product name",
                  },
                ]}
              >
                <Select
                  placeholder="Select brand"
                  options={config.brand?.map((item) => ({
                    label: item.label + " (" + item.country + ")",
                    value: item.value,
                  }))}
                />
              </Form.Item>
              {/* barcode */}
              {/* <Form.Item name={"barcode"} label="Barcode">
                <Input
                  disabled
                  placeholder="Barcode"
                  style={{ width: "100%" }}
                />
              </Form.Item> */}
              {/* <Form.Item name={"qty"} label="Quantity">
                <InputNumber placeholder="Quantity" style={{ width: "100%" }} />
              </Form.Item> */}
              <Form.Item name={"discount"} label="Discount" style={{width: "100%"}}>
                <InputNumber placeholder="Discount" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"category_id"}
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please fill in product name",
                  },
                ]}
              >
                <Select
                  placeholder="Select category"
                  options={config.category}
                  onChange={(id) => {
                    setFilter((pre) => ({ ...pre, category_id: id }));
                  }}
                />
              </Form.Item>

              <Form.Item name={"price"} label="Price">
                <InputNumber placeholder="Price" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name={"status"} label="status">
                <Select
                  placeholder="Select status"
                  options={[
                    {
                      label: "Active",
                      value: 1,
                    },
                    {
                      label: "InActive",
                      value: 0,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={"description"} label="Description" style={{ width: "100%" }}>
            <Input.TextArea placeholder="Description" autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>

          <Form.Item name={"image_default"} label="Image" className="product_image">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              // accept=""
              maxCount={1}
              listType="picture-card"
              fileList={imageDefault}
              onPreview={handlePreview} //please chech this
              onChange={handleChangeImageDefault}
            >
              <MdImage style={{ fontSize: "30px" }}/>Picture
            </Upload>
          </Form.Item>

          {/* <Form.Item name={"image_optional"} label="Image (Optional)">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              multiple={true}
              maxCount={4}
              fileList={imageOptional}
              onPreview={handlePreview} //please chech this
              onChange={handleChangeImageOptional}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item> */}

          {previewImage && (
            <Image  
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
              // style={{ width: 50, height: 50 ,borderRadius:2}}
              style={{
                width: 30,
                height: 30, 
                borderRadius: 2,
              }}
            />
          )}
          {/* <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCloseModal}>{state.isReadOnly ? "Close" : "Cancel"}</Button>
              {!state.isReadOnly && (
                <Button type="primary" htmlType="submit">
                  {formRef.getFieldValue("id") ? "Update" : "Save"}
                </Button>
              )}
            </Space>
          </Form.Item> */}
          </div>
        </Form>
      </Modal>
      <Table
        dataSource={state.list}
        loading={state.loading}
          rowKey="id"
          // pagination={{
          //   defaultPageSize: 10,
          //     showSizeChanger: true,
          //     showTotal: (total) => `Total ${total} items`,
          //     onChange: (page) => {
          //       refPage.current = page;
          //       getList();
          //     }
          // }}
        pagination={{
          pageSize: 10,
          total: state.total,
          onChange: (page) => {
            // setFilter((pre) => ({ ...pre, page: page }));
            refPage.current = page;
            getList();
          },
        }}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
            render: (text) => (
              <div className="truncate-text" title={text}>
                {text}
              </div>
            ),
          },
          // {
          //   key: "Barcode",
          //   title: "barcode",
          //   dataIndex: "barcode",
          // },
          {
            key: "Description",
            title: "description",
            dataIndex: "description",
            render: (text) => (
              <div className="truncate-text" title={text}>
                {text}
              </div>
            ),
          },

          {
            key: "category_name",
            title: "Category",
            dataIndex: "category_name",
          },
          {
            key: "brand",
            title: "Brand",
            dataIndex: "brand",
          },
          // {
          //   key: "qty",
          //   title: "Quantity",
          //   dataIndex: "qty",
          // },
          {
            key: "price",
            title: "price",
            dataIndex: "price",
          },
          {
            key: "discount",
            title: "Discount",
            dataIndex: "discount",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (status) =>
              status == 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
          },
          {
            key: "image",
            title: "Image",
            dataIndex: "image", 
            render: (value) =>
              value ? (
                <Image 
                  src={"http://localhost/coffee/" + value}
                  style={{ width: 50, height: 50 ,borderRadius:3}}
                />
              ) : (
                <div
                  style={{ backgroundColor: "#EEE", width: 40, height: 40 }}
                />
              ),
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <EditOutlined
                  type="primary"
                  style={{ color: "green", fontSize: 20 }}
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(data, index)}
                />
                <DeleteOutlined
                  type="primary"
                  danger
                  style={{ color: "red", fontSize: 20 }}
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                />
                <EyeOutlined
                  style={{ color: 'rgb(12, 59, 4)', fontSize: 20 }}
                  onClick={() => clickReadOnly(data)}
                  icon={<IoMdEye/>}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default ProductPage;