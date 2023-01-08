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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const imageUrl: string = req.query.image_url as string;
    if (!imageUrl) {
      res.status(400).send("image url not specify. Please specify image url");
    }
    try {
      const filteredImage: string = await filterImageFromURL(imageUrl);
      res.status(200).sendFile(filteredImage);
      console.log("imagepath:", filteredImage);
      // deleting the image after response is sent
      res.on("finish", function () {
        deleteLocalFiles([filteredImage]);
      });
    } catch (error) {
      res.status(422).send(error);
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
