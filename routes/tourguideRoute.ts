import express, { Request, Response } from 'express';
import Guide,{ IGuide,IReview } from '../models/Tourguide';  // تأكد من المسار الصحيح للنموذج الخاص بك
const router = express.Router();
//filter guides by price, rating, guideType, language
router.get('/guides/search', async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice, rating, guideType, language } = req.query;

    const query: Record<string, unknown> = {};

    if (minPrice || maxPrice) {
      query['price'] = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        (query['price'] as Record<string, unknown>)['$gte'] = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        (query['price'] as Record<string, unknown>)['$lte'] = Number(maxPrice);
      }
    }

      // filter rating
    if (rating && !isNaN(Number(rating))) {
      query['rating'] = { $gte: Number(rating) };
    }

    //filter guideType
    if (guideType) {
      query['guideType'] = guideType;
    }

    // filter language
    if (language) {
      query['languages'] = { $in: [language] };
    }

      //search for guides
    const guides = await Guide.find(query);

    // return result
    if (guides.length > 0) {
      res.status(200).json({
        success: true,
        count: guides.length,
        data: guides,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No guides found with the given criteria',
      });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    res.status(500).json({
      success: false,
      message: 'An error occurred while searching for guides',
      error: errorMessage,
    });
  }
});
// get All guides
router.get('/guides', async (req: Request, res: Response) => {
    try {
      //get All tour guides
      const guides: IGuide[] = await Guide.find({});
  
      if (guides.length > 0) {
        res.status(200).json({
          success: true,
          count: guides.length,
          data: guides,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No guides found',
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
  
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching guides',
        error: errorMessage,
      });
    }
  });
// get a single guide by id
router.get('/guides/:id', async (req: Request, res: Response) => {
    try {
      const guideId = req.params.id; 
      const guide = await Guide.findById(guideId);
  
      if (guide) {
        res.status(200).json({
          success: true,
          data: guide,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Guide not found',
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the guide',
        error: errorMessage,
      });
    }
  });
  //add new review To TourGuide 
router.post('/guides/:id/addReview',async(req:Request,res:Response)=>{
    try {
        const guideId = req.params.id; 
        const { name, image, comment, rating }: IReview = req.body;
        const guide = await Guide.findByIdAndUpdate(
            guideId,
            { $push: { reviews: { name, image, comment, date: new Date(), rating } } },
            { new: true }
          );
             if (guide) {
                res.status(201).json({
                  success: true,
                  message: 'Review added successfully',
                  data: guide,
                });
             } else {
                res.status(404).json({
                  success: false,
                  message: 'Guide not found',
                });
            }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({
          success: false,
          message: 'An error occurred while adding the review',
          error: errorMessage,
        });
      }
})
  
// delete review by guide id and review id
router.delete('/guides/:guideId/review/:reviewId', async (req: Request, res: Response) => {
    try {
      const { guideId, reviewId } = req.params;
      const guide = await Guide.findById(guideId);
  
      if (!guide) {
        res.status(404).json({
          success: false,
          message: 'Guide not found',
        });
        return;
      }
  
      const reviewIndex = guide.reviews.findIndex((review) => review._id.toString() === reviewId);
  
      if (reviewIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Review not found',
        });
        return;
      }
      const updatedGuide = await Guide.findByIdAndUpdate(
        guideId,
        { $pull: { reviews: { _id: reviewId } } },
        { new: true }
      );
  
      if (updatedGuide) {
        res.status(200).json({
          success: true,
          message: 'Review deleted successfully',
          data: updatedGuide,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Guide or review not found',
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the review',
        error: errorMessage,
      });
    }
  });


export default router;
