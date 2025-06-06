import Pickup from '../models/Pickup.js'
import User from '../models/User.js'

export const createPickup = async(req, res) => {
    const { title, description, address, assignedTo, commission } = req.body;

    try {
        const partner = await User.findById(assignedTo);
        if (!partner || partner.role !== 'PickupPartner') {
            return res.status(404).json({
                message: 'Invalid Pickup partner'
            });
        }

        const pickup = new Pickup({
            title,
            description, 
            address,
            assignedTo,
            commission
        });

        await pickup.save();
        res.status(201).json({
            message: 'Pickup created', pickup
        });
    } catch(err) {
        res.status(500).json({
            message: 'Pickup creation failed', error: err.message
        });
    }

}

    // Partner: Update pickup status
export const updatePickupStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const pickup = await Pickup.findById(id);
        if(!pickup) return res.status(404).json({
            message: 'Pickup not found',
        })

        if(pickup.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Not authorised'
            });
        }

        pickup.status = status;
        await pickup.save();
        res.status(200).json({
            message: 'Status updated', pickup
        });
    } catch(err) {
        res.status(500).json({
            message: 'Error updating pickup', error: err.message
        })
    }
}

export const getMyPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find({ assignedTo: req.user.id }).sort({ date: -1});
        res.status(200).json(pickups);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pickups', error: err.message});
    }
};

export const filterPickups = async (req, res) => {
    const { status, partnerId, startDate, endDate } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (partnerId) filter.assignedTo = partnerId;
    if (startDate && endDate) {
        filter.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    try {
        const pickups = await Pickup.find(filter)
        .populate('assignedTo', 'name email')
        .sort({ date: -1});

        res.status(200).json(pickups);
    } catch (err) {
        res.status(500).json({ message: 'Error filering pickups', error: err.message});
    }
};

