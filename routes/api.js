const express = require("express");
// const authRouter = require("./auth");
// const bookRouter = require("./book");
const userRouter=require('./userRouter/userRoute');
const adminRouter=require('./adminRouter/adminRoute');
const proRouter=require('./professionalRouter/professionalRoute')
// const deliveryRoutes=require('./deliveryRoutes/deliveryRoutes');
// const cashCollectorRoutes=require('./deliveryRoutes/cashCollectorRoutes');
// const deliverySupervisorRoutes=require('./deliveryRoutes/deliverySupervisorRoutes');


// const hubRoutes = require('./hubRoute/hubRoute');
// const cronRoutes = require('./cronRouter/cronRoutes');

const app = express();

// app.use("/auth/", authRouter);
// app.use("/book/", bookRouter);


/* @sumit */
app.use("/user/v1/", userRouter);
app.use("/admin/v1/", adminRouter);
app.use("/pro/v1/", proRouter);
// app.use("/delivery/v1/", deliveryRoutes);
// app.use("/cashCollector/v1/", cashCollectorRoutes);
// app.use("/deliverySupervisor/v1/", deliverySupervisorRoutes);



// app.use("/hub/v1/", hubRoutes);
// app.use("/cron/v1/", cronRoutes);






module.exports = app;