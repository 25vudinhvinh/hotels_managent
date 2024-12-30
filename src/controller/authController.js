const pool = require("../config/pg"); // Kết nối cơ sở dữ liệu
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Kiểm tra xem user có tồn tại hay không
        const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Lấy thông tin user từ database
        const user = result.rows[0];

        // 3. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 4. Tạo JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token có hiệu lực trong 1 giờ
        );

        // 5. Trả về token
        res.status(200).json({ token, message: "Login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
