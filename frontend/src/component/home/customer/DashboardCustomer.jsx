import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { request } from '../../../util/helper';
import { Card, Space, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
function DashboardCustomer() {
    const [customers, setCustomers] = useState(0);


    // get customers
    useEffect(() => {
        const getCustomers = async () => {
            try {
                const res = await request("customer", "get", {}); // Using request helper
                if (res && res.list && Array.isArray(res.list)) {
                    setCustomers(res.list.length);
                } else if (Array.isArray(res)) { // Fallback if the API directly returns an array
                    setCustomers(res.length);
                } else {
                    console.warn("Customer data is not in expected format ({list: array} or array):", res);
                    setCustomers(0); // Default to 0 if unexpected format
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
                setCustomers(0); // Set to 0 on error
            }
        };
        getCustomers();
    }, []); // Empty dependency array ensures this runs once on mount
    function DashboardCustomer({ title, value, icon }) {
    return (
        <Card direction='horizontal' style={{width: "210px",height: "120px", backgroundColor: "rgba(235, 42, 39, 0.55)", display: "flex", alignItems: "center" }}>
            <Space >
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
}
    return (
        <Space style={{fontWeight: "bold"}}>
            <DashboardCustomer
                icon={
                    <UserOutlined
                        style={{
                            color: "purple",
                            backgroundColor: "rgba(128,0,128,0.25)",
                            borderRadius: 50,
                            fontSize: 40,
                            padding: 8,
                        }}
                    />
                }
                title={"Customers"}
                value={customers}
            />
        </Space>
    )
}
DashboardCustomer.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired
}
export default DashboardCustomer