import { Router } from "express";
import { addLectureToCourseById, createCourse, getAllCourses, getLecturesByCourseId, removeCourse, removeLectureFromCourse, updateCourse } from "../controllers/course.controller.js";
import upload from "../middleware/multer.middleware.js";
import { authorizeSubscriber, authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();
// router.get('/',getAllCourses);

router.route('/')
   .get(getAllCourses)
   .post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('thumbnail'),createCourse)


router.route('/:courseId/lectures/:lectureId')
   .delete(isLoggedIn, authorizedRoles("ADMIN"), removeLectureFromCourse);

   
// router.get('/:id',getLecturesByCourseId);

router.route('/:id')
   .get(isLoggedIn,authorizeSubscriber,getLecturesByCourseId)
   .put(isLoggedIn,authorizedRoles("ADMIN"),updateCourse)
   .delete(isLoggedIn,authorizedRoles("ADMIN"),removeCourse)
   .post(isLoggedIn,authorizedRoles("ADMIN"),upload.single('lecture'),addLectureToCourseById)
   

export default router

