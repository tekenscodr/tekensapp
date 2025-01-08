const Event = require('../models/event-model')
const Ticket = require('../models/qrcode-model')
const Purchase = require('../models/purchase')

module.export = {
     verifyPayment : async (referenceId) => {
        try {
            const response = await fetch(`https://api.paystack.co/transaction/verify/${referenceId}`, {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_AUTH_LKEY}` }
            });
            if (response.ok) {
                return { verified: true, data: await response.json() };
              } else {
                return { verified: false, error: response.statusText };
              }        } catch (err) {
            throw err;
        }
      },
      
      getEvent: async (eventId) => {
        try {
          const event = await Event.findById(eventId);
          if (!event) {
            throw new Error(`Event not found with ID ${eventId}`);
          }
          return event;
        } catch (err) {
          throw new Error(`Error fetching event with ID ${eventId}: ${err.message}`);
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