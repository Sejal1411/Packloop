import Notification from '../../models/Notification.js';

// Send Notification
export const sendNotification = async (userId, message, type = 'general') => {
    await Notification.create({ recipient: userId, message, type });
};

// Get user Notification
export const getNotification = async(req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications '});
    }
};
