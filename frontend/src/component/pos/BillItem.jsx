
import { Config } from "../../util/config";
import styles from "./BillItem.module.css";
import { Button, Col, Row, Space } from "antd";
import { MdAdd, MdDelete, MdHorizontalRule } from "react-icons/md";
import PropTypes from "prop-types";
function BillItem({
  name,
  image,
  brand,
  category_name,
  price,
  discount,
  cart_qty,
  sugarLevel,
  handleIncrease,
  handleDescrease,
  handleRemove,
}) {
  var final_price = price;
  if (discount != 0 && discount != null) {
    final_price = price - (price * discount) / 100;
    final_price = final_price.toFixed(2);
  }
  return (
    <div className={styles.container}>
      <Row>
        <Col span={6}>
          <img
            src={Config.image_path + image}
            alt={image}
            style={{ width: 70, marginRight: 10 }}
          />
        </Col>
        <Col span={18}>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div className={styles.p_name}>{name}</div>
            <div>
              <Button
                onClick={handleRemove}
                danger
                shape="circle"
                icon={<MdDelete />}
              />
            </div>
          </div>
          <div>
            {category_name} - {brand} -sugar {sugarLevel}%
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {discount != 0 && discount != null ? (
              <div className={styles.p_price_container}>
                <div className={styles.p_price}>{price}$</div>
                <div className={styles.p_dis}> {discount}%</div>
                <div className={styles.p_final_price}>{final_price}$</div>
              </div>
            ) : (
              <div className={styles.p_price_container}>
                <div className={styles.p_final_price}>{final_price}$</div>
              </div>
            )}
            <div style={{ fontWeight: "bold" }}>
              {(cart_qty * final_price).toFixed(2) + "$"}
            </div>
          </div>
          <Space>
            <Button
              onClick={handleDescrease}
              shape="circle"
              type="primary"
              icon={<MdHorizontalRule />}
            />
            <div style={{ fontWeight: "bold" }}>{cart_qty}</div>
            <Button
              type="primary"
              onClick={handleIncrease}
              shape="circle"
              icon={<MdAdd />}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
}
//proptypes
BillItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  category_name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  barcode: PropTypes.string,
  cart_qty: PropTypes.number.isRequired,
  handleIncrease: PropTypes.func.isRequired,
  handleDescrease: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  sugarLevel: PropTypes.number.isRequired,
};

export default BillItem;