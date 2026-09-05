const pathHandler = (req, res) => {
    const message = "URL not found!";
    const data = {
        method: req.method,
        url: req.originalUrl,
        error: message
    };
    res.status(404 || 401).json(data);
};

export default pathHandler;