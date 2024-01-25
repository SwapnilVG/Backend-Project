import Course from "../models/course.model.js";
import AppError from "../utils/appError.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'

const getAllCourses = async (req,res,next) => {
    try {
        const courses = await Course.find({}).select('-lectures')

        res.status(200).json({
            success:true,
            message: 'All courses',
            courses
        })
        
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const getLecturesByCourseId = async (req,res,next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id)

        if(!course){
            return next(new AppError('Invalid course id',400))
        }
        res.status(200).json({
            success:true,
            message:'Course lectures fetched successfully',
            lectures: course.lectures,
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const createCourse = async (req,res,next) =>{
    try {
        const {title,description,category,createdBy} = req.body;

        if(!title || !description || !category || !createdBy){
            return next(new AppError('All fields are required',400))
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail:{
                public_id:"Dummy",
                secure_url:"Dummy"
            }
        });

        if(!course){
            return next(new AppError('Course Could not created, please try again',500))
        }

        if(req.file){
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'Backend Project',
                });
    
                if(result){
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`)

            } catch (error) {
                return next(new AppError(error.message,500))
            }
        }

        await course.save()

        res.status(200).json({
            success:true,
            message:"Course created successfully",
            course
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const updateCourse = async (req,res,next) =>{
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body
            },
            {
                runValidators:true
            }
        );

        if(!course){
            return next(new AppError('Course with given id does not exits',500))
        }

        res.status(200).json({
            success:true,
            message: 'Course updated successfully',
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const removeCourse = async (req,res,next) =>{
    try {
        const { id } = req.params
        const course = await Course.findById(id);

        if(!course){
            return next(new AppError('Course with given id does not exits',500))
        }

        await course.deleteOne();

        res.status(200).json({
            success:true,
            message:'Course deleted successfully'
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}


const addLectureToCourseById = async (req,res,next) =>{
    try {
        const { title,description} = req.body;
        const { id } = req.params

        if(!title || !description){
            return next(new AppError('All fields are required',400))
        }

        const course = await Course.findById(id);

        if(!course){
            return next(new AppError('Course with given id does not exits',500))
        }

        const lectureData = {
            title,
            description,
            lecture:{}
        };

        
        if(req.file){
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'Backend Project',
                    chunk_size:50000000,
                    resource_type:'video'
                });
    
                if(result){
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`)

            } catch (error) {
                return next(new AppError(error.message,500))
            }
        }

        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success:true,
            message:'Lecture successfully added to the course',
            course
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const removeLectureFromCourse = async (req,res,next)=>{
    try {
        const { courseId , lectureId} = req.params;

        if (!courseId) {
            return next(new AppError('Course ID is required', 400));
        }
        
        if (!lectureId) {
            return next(new AppError('Lecture ID is required', 400));
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return next(new AppError('Invalid ID or Course does not exist.', 404));
        }

        // Find the index of the lecture using the lectureId
        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId.toString()
        );
          // If returned index is -1 then send error as mentioned below
        if (lectureIndex === -1) {
            return next(new AppError('Lecture does not exist.', 404));
        }

          // Delete the lecture from cloudinary
        try {
            await cloudinary.v2.uploader.destroy(
                course.lectures[lectureIndex].lecture.public_id,
                {
                    resource_type: 'video',
                }
            );
        } catch (error) {
            return next(new AppError(error.message,500))
        }

        // Remove the lecture from the array
        course.lectures.splice(lectureIndex, 1);

        // update the number of lectures based on lectres array length
        course.numberOfLectures = course.lectures.length;

        // Save the course object
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course lecture removed successfully',
          });
          
        
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}


export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLectureFromCourse
}