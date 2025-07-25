
import { Button, Image } from 'antd';
import PropTypes from 'prop-types';
import styles from './BillItem.module.css';
import { Config } from '../../util/config';

function BillItem({ item, handleIncrease, handleDescrease, handleRemove }) {
    const itemTotal = item.price * item.cart_qty;
    const discountAmount = item.discount ? (itemTotal * item.discount) / 100 : 0;
    const finalPrice = itemTotal - discountAmount;

    return (
        <div className={styles.cartItem}>
            <div className={styles.itemImage}>
                <Image
                    src={Config.image_path + item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    preview={false} 
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                />
            </div>
            <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                {item.sugarLevel && (
                    <div className={styles.sugarLevel}>
                        Sugar: {item.sugarLevel}
                    </div>
                )}
                <div className={styles.itemPrice}>
                    ${item.price.toFixed(2)} × {item.cart_qty}
                    {item.discount > 0 && (
                        <span className={styles.discount}>
                            (-{item.discount}%)
                        </span>
                    )}
                </div>
                {item.discount > 0 && (
                    <div className={styles.discountPrice}>
                        ${finalPrice.toFixed(2)}
                    </div>
                )}
            </div>
            <div className={styles.itemControls}>
                <Button 
                    size="small" 
                    type="text"
                    onClick={handleDescrease}
                    disabled={item.cart_qty <= 1}
                >
                    -
                </Button>
                <span className={styles.quantity}>{item.cart_qty}</span>
                <Button 
                    size="small" 
                    type="text"
                    onClick={handleIncrease}
                >
                    +
                </Button>
                <Button 
                    size="small" 
                    type="text"
                    danger 
                    onClick={handleRemove}
                >
                    ×
                </Button>
            </div>
        </div>
    );
}

BillItem.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        price: PropTypes.number.isRequired,
        cart_qty: PropTypes.number.isRequired,
        sugarLevel: PropTypes.string,
        discount: PropTypes.number
    }).isRequired,
    handleIncrease: PropTypes.func.isRequired,
    handleDescrease: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired
};

export default BillItem;