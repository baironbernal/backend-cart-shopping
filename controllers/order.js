const { response } = require('express');

const Order = require('../models/order');

const getOrders = async (req, res) => {
    const since = Number(req.query.since) || 0;
    const [orders, total] = await Promise.all([
        Order.find()
            .skip(since)
            .limit(3)
            .populate('customer', 'name'),

        Order.count()
    ]);

    res.json({
        ok: true,
        orders,
        total
    });
};

const updateOrder = async (req, res = response) => {
    const orderId = req.params.id;
    try {
        const orderExist = await Order.findById(orderId);

        if (!orderExist) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una orden con ese id'
            });
        }

        const fields = req.body;

        const orderUpdated = await Order.findByIdAndUpdate(orderId, fields);

        res.json({
            ok: true,
            order: orderUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const getOrdersByCustomerId = async (req, res = response) => {
    const customerId = req.params.id;
    const since = Number(req.query.since) || 0;

    try {
        const [orders, total] = await Promise.all([
            Order.find({ customer: customerId })
                .sort('-timestamp')
                .skip(since)
                .limit(3),

            Order.count()
        ]);

        if (!orders) {
            return res.status(404).json({
                ok: false,
                msg: 'No existen órdenes para este cliente'
            });
        }

        res.json({
            ok: true,
            orders,
            total
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const createOrder = async (req, res = response) => {
    const order = new Order({
        customer: req.uid,
        ...req.body
    });

    try {
        const orderSaved = await order.save();

        res.json({
            ok: true,
            order: orderSaved
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en las órdenes, revisar logs',
            uid: req.uid
        });
    }
};

const deleteOrder = async (req, res = response) => {
    const orderId = req.params.id;
    try {
        const orderExist = await Order.findById(orderId);

        if (!orderExist) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una orden con ese id'
            });
        }

        await Order.findByIdAndDelete(orderId);

        res.json({
            ok: true,
            msg: 'Orden eliminada'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'La orden no pudo ser borrada'
        });
    }
};

module.exports = {
    getOrders,
    createOrder,
    deleteOrder,
    getOrdersByCustomerId,
    updateOrder
};
