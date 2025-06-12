const GrowComponent = require('../models/YieldPredictModel');

// POST method to add a new record
exports.addGrowComponent = async (req, res) => {
    const { Noofpots, TempInside, HumidInside, CO2Inside, TempOutside, HumidOutside, CO2Outside, Yield } = req.body;

    try {
        const newGrowComponent = new GrowComponent({ Noofpots, TempInside, HumidInside, CO2Inside, TempOutside, HumidOutside, CO2Outside, Yield });
        const savedGrowComponent = await newGrowComponent.save();
        
        res.status(201).json(savedGrowComponent);
    } catch (error) {
        res.status(500).json({ error: "Cannot create grow component" });
    }
};

// GET method to retrieve all records
exports.getAllGrowComponents = async (req, res) => {
    try {
        const growComponents = await GrowComponent.find();
        res.json(growComponents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE method to remove a record by ID
exports.deleteGrowComponent = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedComponent = await GrowComponent.findByIdAndDelete(id);
        if (!deletedComponent) {
            return res.status(404).json({ message: "Component not found" });
        }
        res.json({ message: "Component successfully removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
