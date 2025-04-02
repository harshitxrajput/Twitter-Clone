import notificationModel from "../models/notification.model.js";

export const getAllNotificationController = async (req, res) => {
    try{
        const userId = req.user._id;

        const notifications = await notificationModel.find({ to: userId }).sort({ createdAt: -1 })
        .populate({
            path: "from",
            select: "username profileImg"
        });
        
        if(notifications.length === 0){
            return res.status(200).json({ message: "You have no notifications" });
        }

        console.log("notifications retrieved");
        await notificationModel.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteAllNotificationController = async (req, res) => {
    try{
        const userId = req.user._id;

        const notifications = await notificationModel.find({ to: userId });

        if(notifications.length === 0){
            return res.status(200).json({ message: "No notifications to delete" });
        }

        await notificationModel.deleteMany({ to: userId });
        res.status(200).json({ message: "All notification deleted successfully" });
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}