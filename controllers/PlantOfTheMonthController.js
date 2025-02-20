const PlantOfTheMonth  = require("../model/plantofthemonth");
const PUBLISH_CODE = process.env.PUBLISH_CODE; 


const createPlantOfTheMonth = async (req, res) => {
    try {
      const { title, summary, procedure, month ,publishCode } = req.body;

      // Input validation
      if (!title || !summary || !procedure || !month ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (publishCode !== PUBLISH_CODE) {
        return res.status(403).json({ error: "Invalid publish code" });
      }

      const image_url = req.file ? `/uploads/${req.file.filename}` : null;

      if (!image_url ) {
        return res.status(400).json({ error: "Upload image" });
      }
      const newPlant = await PlantOfTheMonth.create({
        title,
        summary,
        procedure,
        image_url,
        month,
      });
      res.status(201).json(newPlant);
    } catch (error) {
      console.error("Error creating Plant of the Month:", error);
      res.status(500).json({ error: error.message });
    }
};

const getPlantOfTheMonth = async (req, res) => {
    try {
      const plant = await PlantOfTheMonth.findOne({
        order: [['createdAt', 'DESC']],
      });

      const plantWithImage = {
        ...plant.toJSON(),
        imageUrl: plant.image_url ? `${req.protocol}://${req.get("host")}${plant.image_url}` : null
      };
      res.json(plantWithImage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports={createPlantOfTheMonth,getPlantOfTheMonth}