module.exports = (app, connection) => {
    app.get("/", (req, res) => {
        res.json({
            message: "Welcome to hhh test application."
        });
    });
}