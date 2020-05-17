module.exports = (app, connection) => {
    app.get("/ojbo", (req, res) => {
        res.json({
            message: "Welcome to hhh test application."
        });
    });
    // app.post()
}