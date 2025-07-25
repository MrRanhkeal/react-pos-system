const { logErr, db, removeFile } = require("../util/helper");

exports.getlist = async (req, res) => {
    try {
        var { txt_search, category_id, brand, page, is_list_all } = req.query;
        const pageSize = 10; // fix

        // Ensure that 'page' is a valid number and default it to 1 if not
        page = Number(page);
        if (isNaN(page) || page < 1) {
            page = 1;  // Default to page 1 if invalid or missing
        }

        const offset = (page - 1) * pageSize; // calculate offset

        var sqlSelect = "SELECT p.*, c.name AS category_name ";
        var sqlJoin = " FROM products p INNER JOIN category c ON p.category_id = c.id ";
        var sqlWhere = " WHERE true ";

        if (txt_search) {
            sqlWhere += " AND (p.name LIKE :txt_search) ";
        }
        if (category_id) {
            sqlWhere += " AND p.category_id = :category_id";
        }
        if (brand) {
            sqlWhere += " AND p.brand = :brand";
        }

        var sqlLimit = " LIMIT " + pageSize + " OFFSET " + offset;
        if (is_list_all) {
            sqlLimit = "";
        }

        var sqlList = sqlSelect + sqlJoin + sqlWhere + sqlLimit;
        var sqlparam = {
            txt_search: "%" + txt_search + "%",
            // barcode: txt_search,
            category_id,
            brand,
        };

        const [list] = await db.query(sqlList, sqlparam);

        var dataCount = 0;
        if (page == 1) {
            let sqlTotal = " SELECT COUNT(p.id) as total " + sqlJoin + sqlWhere;
            var [dataCountResult] = await db.query(sqlTotal, sqlparam);
            dataCount = dataCountResult[0].total;
        }

        // Get product details for all products in the list
        res.json({
            list: list,
            total: dataCount,
        });
    } catch (error) {
        logErr("product.getList", error, res);
    }
};
exports.create = async (req, res) => {
    try{
        var sql =
        " INSERT INTO products (category_id, name,brand,description,price,discount,status,image,create_by ) " +
        " VALUES (:category_id, :name, :brand, :description,  :price, :discount, :status, :image, :create_by ) ";

        var [data] = await db.query(sql, {
            ...req.body,
            image: req.files?.upload_image[0]?.filename,
            create_by: req.auth?.name,
        });
        // if (req.files && req.files?.upload_image_optional) {
        //     var paramImagePorduct = [];
        //     req.files?.upload_image_optional.map((item, index) => {
        //         paramImagePorduct.push([data?.insertId, item.filename]);
        //     });
        //     var sqlImageProduct =
        //         "INSERT INTO product_image (product_id,image) VALUES :data";
        //     var [dataImage] = await db.query(sqlImageProduct, {
        //         data: paramImagePorduct,
        //     });
        // }
        res.json({
            data: data,
            message: "success",
            error: false
        })
    }
    catch (error) {
        logErr("category.create", error, res);
    }
};
exports.update = async (req, res) => { 
    try { 
        var sql =
            " UPDATE products set " +
            " category_id = :category_id, " +
            // " barcode = :barcode, " +
            " name = :name, " +
            " brand = :brand, " +
            " description = :description, " +
            // " qty = :qty, " +
            " price = :price, " +
            " discount = :discount, " +
            " status = :status, " +
            " image = :image " +
            " WHERE id = :id";

        var filename = req.body.image;
        /// image new
        if (req.files?.upload_image) {
            filename = req.files?.upload_image[0]?.filename;
        }
        // image change
        if (
            req.body.image != "" &&
            req.body.image != null &&
            req.body.image != "null" &&
            req.files?.upload_image
        ) {
            removeFile(req.body.image); // remove old image
            filename = req.files?.upload_image[0]?.filename;
        }
        // image remove
        if (req.body.image_remove == "1") {
            removeFile(req.body.image); // remove image
            filename = null;
        }

        var [data] = await db.query(sql, {
            ...req.body,
            image: filename,
            create_by: req.auth?.name
        });
        // image opitonal
        // if (req.files && req.files?.upload_image_optional) {
        //     var paramImagePorduct = [];
        //     req.files?.upload_image_optional.map((item, index) => {
        //         paramImagePorduct.push([req.body.id, item.filename]);
        //     });
        //     var sqlImageProduct =
        //         "INSERT INTO product_image (product_id,image) VALUES :data";
        //     var [dataImage] = await db.query(sqlImageProduct, {
        //         data: paramImagePorduct,
        //     });
        // }
        //multiple image  ( case remove)
        // if (req.body.image_optional && req.body.image_optional.length > 0) {
        //     // console.log(req.body.image_optional);
        //     if (typeof req.body.image_optional == "string") {
        //         req.body.image_optional = [req.body.image_optional];
        //     }
        //     req.body.image_optional?.map(async (item, index) => {
        //         // remove database
        //         let [data] = await db.query(
        //             "DELETE FROM product_image WHERE image = :image",
        //             { image: item }
        //         );
        //         // unlink from hard
        //         removeFile(item); // remove image
        //     });
        // }

        res.json({
            data: data,
            message: "success",
            error: false
        })
    }
    catch (error) { 
        logErr("product.update", error, res);
    }  
};

exports.remove = async (req, res) => {
    try {
        var [data] = await db.query("DELETE FROM products WHERE id = :id", {
            id: req.body.id //null data
        });
        if (data.affectedRows && req.body.image != "" && req.body.image != null) {
            removeFile(req.body.image);
        }
        res.json({
            data: data,
            message: "deleted successfully",
            error: false
        })
    }
    catch (error) {
        logErr("remove.create", error, res);
    }
};
// exports.newBarcode = async (req, res) => {
//     try {
//         var sql =
//             "SELECT " +
//             "CONCAT('P',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM products), 3, '0')) " +
//             "as barcode";
//         var [data] = await db.query(sql);
//         res.json({
//             barcode: data[0].barcode,
//             message: "success",
//             error: false
//         })
//     }
//     catch (error) {
//         logErr("remove.create", error, res);
//     }
// };
// exports.productImage = async (req, res) => {
//     try {
//         var sql = "SELECT *  FROM product_image WHERE product_id=:product_id";
//         var [list] = await db.query(sql, {
//             product_id: req.params.product_id,
//         });
//         res.json({
//             list,
//             message: "success", 
//         });
//     }
//     catch (err) {
//         logErr("remove.create", err, res);
//     }
// };
// isExistBarcode = async (barcode) => {
//     try {
//         var sql = "SELECT COUNT(id) as Total FROM products WHERE barcode=:barcode";
//         var [data] = await db.query(sql, {
//             barcode: barcode,
//         });
//         if (data.length > 0 && data[0].Total > 0) {
//             return true; // ស្ទួន
//         }
//         return false; // អត់ស្ទួនទេ
//     } catch (error) {
//         logError("remove.create", error, res);
//     }
// };