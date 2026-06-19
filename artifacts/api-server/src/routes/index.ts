import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fightersRouter from "./fighters";
import opportunitiesRouter from "./opportunities";
import eventsRouter from "./events";
import applicationsRouter from "./applications";
import dashboardRouter from "./dashboard";
import membershipRouter from "./membership";
import adminRouter from "./admin";
import applyRouter from "./apply";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/fighters", fightersRouter);
router.use("/opportunities", opportunitiesRouter);
router.use("/events", eventsRouter);
router.use("/applications", applicationsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/membership", membershipRouter);
router.use("/admin", adminRouter);
router.use("/apply", applyRouter);
router.use("/contact", contactRouter);

export default router;
