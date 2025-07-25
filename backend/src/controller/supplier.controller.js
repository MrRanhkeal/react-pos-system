const { db, logErr } = require("../util/helper");
const configController = require('./config.controller');

exports.getlist = async (req, res) => {
    try {
        const txtSearch = req.query.txtSearch || '';
        const product_type = req.query.product_type || '';
        
        let query = "SELECT * FROM supplier WHERE 1=1";
        let params = [];
        
        if (txtSearch) {
            query += " AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)";
            params.push(`%${txtSearch}%`, `%${txtSearch}%`, `%${txtSearch}%`, `%${txtSearch}%`);
        }
        
        if (product_type) {
            query += " AND product_type = ?";
            params.push(product_type);
        }
        
        var [list] = await db.query(query, params);
        res.json({
            list: list,
            message: "success"
        })
    }
    catch (error) {
        logErr("supplier.getlist", error, res);
    }
}
exports.create = async (req, res) => {
    try {
        var sql = "insert into supplier(name,product_type,phone,email,address,description) values(?,?,?,?,?,?,?)";
        var [check] = await db.query("SELECT * FROM supplier WHERE name = ?", req.body.name);
        if (check.length > 0) {
            return res.status(400).json({
                message: "name already exists"
            });
        }
        var [data] = await db.query(sql, [
            req.body.name,
            req.body.product_type, 
            req.body.phone,
            req.body.email,
            req.body.address,
            req.body.description
        ]);
        res.json({
            data: data,
            message: "Insert success!",
        });
    }
    catch (error) {
        logErr("supplier.create", error, res);
    }
};
exports.update = async (req, res) => {
    try {
        var sql = "UPDATE supplier SET name=?, product_type=?, phone=?, email=?, address=?, description=? WHERE id=?";
        var [data] = await db.query(sql, [
            req.body.name,
            req.body.product_type, 
            req.body.phone,
            req.body.email,
            req.body.address,
            req.body.description,
            req.body.id
        ]);
        res.json({
            data: data,
            message: "Update success!"
        })
    }
    catch (error) {
        logErr("supplier.update", error, res);
    }
};
exports.remove = async (req, res) => {
    try {
        var sql = "DELETE FROM supplier WHERE id=?";
        var [list] = await db.query(sql, req.params.id);
        res.json({
            data: list,
            message: "success"
        })
    }
    catch (error) {
        logErr("supplier.remove", error, res);
    }
};