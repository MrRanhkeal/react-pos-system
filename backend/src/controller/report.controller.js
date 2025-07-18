
const { db, logErr, isArray, isEmpty } = require("../util/helper");


exports.report_sale_summary = async (req, res) => {
    try {
        let { from_date, to_date, category_id, brand_id } = req.query;
        let sql =
            " select " +
            "  DATE_FORMAT(o.create_at,'%d/%m/%Y') title, " +
            "  sum(od.total_qty) total_qty, " +
            "    sum(od.total_amount)  total_amount " +
            " from orders o " +
            " inner join  " +
            " ( " +
            "   select  " +
            "      od1.order_id, " +
            "      sum(od1.qty) total_qty, " +
            "      sum(od1.total) total_amount " +
            "    from order_detail od1 " +
            "    inner join products p on od1.product_id = p.id " +
            "    where (:category_id IS NULL OR p.category_id = :category_id )  " +
            "    and (:brand_id IS NULL OR p.brand = :brand_id) " +
            "    group by od1.order_id " +
            " ) od on o.id = od.order_id " +
            " where  " +
            " DATE_FORMAT(o.create_at,'%Y-%m-%d') BETWEEN :from_date  and :to_date  " +
            " group by DATE_FORMAT(o.create_at,'%d/%m/%Y') ";
        const [list] = await db.query(sql, {
            from_date,
            to_date,
            category_id,
            brand_id,
        });
        res.json({
            data: list,
            message: "success",
            error: false
        })
    }
    catch (error) {
        logErr(error, "report.report_sale_summary", error, res);
        // res.status(500).json({
        //     error: true,
        //     message: "Internal server error"
        // });
    }
}
// exports.report_expense_summary = async (req, res) => {
//     try {
//         let { from_date, to_date, expense_type_id } = req.query;
//         let sql =
//             "select " +
//             "  DATE_FORMAT(e.expense_date,'%d/%m/%Y') title, " +
//             "    sum(e.amount) total_amount " +
//             "  from expenses e  " +
//             "  where DATE_FORMAT(e.expense_date,'%Y-%m-%d') between :from_date and :to_date " +
//             "  and (:expense_type_id is null or e.expense_type_id = :expense_type_id)  " +
//             "  group by e.expense_date ";
//         const [list] = await db.query(sql, {
//             from_date,
//             to_date,
//             expense_type_id,
//         });
//         res.json({
//             list,
//         });
//     } catch (error) {
//         logError("report.report_sale_summary", error, res);
//     }
// };
// exports.report_top_sale = async (req, res) => {
//     try {
//         let { from_date, to_date } = req.query;
//         let sql =
//             "SELECT p.name, SUM(od.qty) as total_qty, SUM(od.total) as total_amount " +
//             "FROM order_detail od " +
//             "INNER JOIN products p ON od.product_id = p.id " +
//             "INNER JOIN orders o ON od.order_id = o.id " +
//             "WHERE DATE_FORMAT(o.create_at,'%Y-%m-%d') BETWEEN :from_date AND :to_date " +
//             "GROUP BY p.id, p.name " +
//             "ORDER BY total_qty DESC " +
//             "LIMIT 10";

//         const [list] = await db.query(sql, {
//             from_date,
//             to_date
//         });

//         res.json({
//             data: list,
//             message: "success",
//             error: false
//         });
//     } catch (error) {
//         logErr(error, "report.controller.js", "report_top_sale");
//         res.status(500).json({
//             error: true,
//             message: "Internal server error"
//         });
//     }
// }