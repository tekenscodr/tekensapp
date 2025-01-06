const Event = require('../models/event-model')
const Ticket = require('../models/qrcode-model')
const Purchase = require('../models/purchase')

module.export = {
     verifyPayment : async (referenceId) => {
        try {
            const response = await fetch(`https://api.paystack.co/transaction/verify/${referenceId}`, {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_AUTH_LKEY}` }
            });
            return response.status === 200 || response.status === 201;
        } catch (err) {
            throw err;
        }
      },
      
      getEvent : async (eventId) => {
        try {
            return await Event.findById(eventId);
        } catch (err) {
            throw err;
        }
      },
      
       createTicket : async (ticketVariations, userId, eventId) => {
        try {
            const ticket = new Ticket({
                userId,
                eventId,
                ticketVariations,
                initialPurchase: ticketVariations.reduce((total, variation) => total + parseInt(variation.quantity, 10), 0)
            });
            return await ticket.save();
        } catch (err) {
            throw err;
        }
      },
      
      createPurchase : async (ticketId, buyerId, referenceId, ticketVariations) => {
        try {
            const purchase = new Purchase({
                ticketId,
                buyerId,
                referenceId,
                amount: ticketVariations.reduce((total, item) => total + item.price * item.quantity, 0)
            });
            return await purchase.save();
        } catch (err) {
            throw err;
        }
      },
}