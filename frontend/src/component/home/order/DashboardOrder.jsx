import React, { useEffect, useState } from 'react'
import { request } from '../../../util/helper';
import { Card, Space, Statistic } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";
function DashboardOrder() {
    const [orders, setOrders] = useState(0);

    // get orders
    useEffect(() => {
        const getOrders = async () => {
            try {
                const res = await request("order", "get", {}); // Use request helper, no params for all orders
                if (res && res.list && Array.isArray(res.list)) {
                    setOrders(res.list.length);
                } else if (Array.isArray(res)) { // Fallback if the API directly returns an array
                    setOrders(res.length);
                } else {
                    console.warn("Orders data is not in expected format ({list: array} or array):", res);
                    setOrders(0); // Default to 0 if unexpected format
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders(0); // Set to 0 on error
            }
        };
        getOrders();
    }, []);

    function DashboardOrder({ title, value, icon }) {
        return (
            <Card direction='horizontal' style={{ width: "210px", height: "120px", backgroundColor: "rgba(155, 25, 231, 0.47)", display: "flex", alignItems: "center" }}>
                <Space >
                    {icon}
                    <Statistic title={title} value={value} />
                </Space>
            </Card>
        );
    }
    return (
        <Space style={{ fontWeight: "bold" }}>
            <DashboardOrder
                icon={
                    <ShoppingCartOutlined
                        style={{
                            color: "red",
                            backgroundColor: "rgba(234, 229, 216, 0.25)",
                            borderRadius: 50,
                            fontSize: 40,
                            padding: 8,
                        }}
                    />
                }
                title={"Orders"}
                value={orders}
            />
        </Space>
    )
}
DashboardOrder.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired
}
export default DashboardOrder