import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { deleteLocalFiles, filterImageFromURL } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /**
   * GET /filteredimage?image_url={{URL}}
   * returns filtered image file
   */
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res.status(400).json({
        message: "image_url query is required",
      });
    }
    try {
      const filteredImage = await filterImageFromURL(image_url);
      return res.status(200).sendFile(filteredImage, async () => {
        await deleteLocalFiles([filteredImage]);
      });
    } catch (error: Error) {
      return res.status(400).json({
        message: error!.message,
      });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
