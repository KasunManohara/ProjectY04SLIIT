const GrowShed = require('../models/GrowShedModel');

//POST method
exports.addGS = async (req, res) => {
    const { GSCode, Condition, Status } = req.body;

    try {
        
        // Create new GreenHouse
        const newGS = new GrowShed({ GSCode, Condition, Status });
        const savedGS = await newGS.save();
        
        res.status(201).json(savedGS);
    } catch (error) {
        res.status(500).json({ error: "Cannot create growshed" });
    }
};

//Get all method
exports.getAllGS = async(req,res) => {
    try{
        const GetGrowShed = await GrowShed.find();
        res.json(GetGrowShed);
    }
    catch(error){
        res.status(500).json({error: error.message });
    }
}

//DELETE method
exports.deleteGS = async(req,res) => {
    const GSid = req.params.id;
    try{
        const deleteRM = await GrowShed.findByIdAndDelete(GSid);
        if (!deleteRM){
            return res.status(404).json({message: "Grow shed not found"})
        }
        res.json({massage: "Grow shed successfully removed"})
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}

//UPDATE method (By _id)
exports.updatedGS = async(req,res) => {
    const GSid = req.params.id;
    const {GSCode, Condition, Status} = req.body;
    try{
        const updatedGS = await GrowShed.findByIdAndUpdate(
            GSid,
            { GSCode, Condition, Status },
            { new: true, runValidators: true }
        );
        if (!updatedGS){
            return res.status(404).json({message: "Grow shed not found"});
        }
        res.json(updatedGS);
    } 
    catch(error){
        res.status(500).json({error: error.message});
    } 
}

