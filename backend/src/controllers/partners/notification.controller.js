import Notification from '../../models/Notification.js';

// Get all notifications for partner
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read', error: err.message });
  }
};

// Send new order notification
export const sendNewOrderNotification = async (partnerId, orderId) => {
  const notification = new Notification({
    user: partnerId,
    type: 'order',
    title: 'New Order Assigned',
    message: `A new order (${orderId}) has been assigned to you. Please review and accept.`,
  });
  await notification.save();

  if (global.io) {
    global.io.to(`partner-${partnerId}`).emit('newNotification', notification);
  }
};

// Send payment update notification
export const sendPaymentNotification = async (partnerId, amount) => {
  const notification = new Notification({
    user: partnerId,
    type: 'payment',
    title: 'Payment Received',
    message: `You've received ₹${amount} in your wallet.`,
  });
  await notification.save();

  if (global.io) {
    global.io.to(`partner-${partnerId}`).emit('newNotification', notification);
  }
};
