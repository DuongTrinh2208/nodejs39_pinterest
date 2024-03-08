export const responseApi = (res, code, data, message) => {
    // define response as json
    res.status(code).json({
        message: message,
        data: data,
        date: new Date(),
    })
}