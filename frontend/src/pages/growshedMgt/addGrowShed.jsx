import { useState } from "react";
import TextField from '@mui/material/TextField';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography, Button } from "@mui/material";
import axios from "axios"; // Import Axios library

const AddGrowShed = () => {
    
    const [GSCode, setGSCode] = useState('');
    const [Condition, setCondition] = useState('');
    const [Status, setStatus] = useState('');
    const [numRacks, setNumRacks] = useState('');

    const handleConditionChange = (event) => {
        setCondition(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleNumRacksChange = (event) => {
        setNumRacks(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send a POST request to your backend API
            const response = await axios.post('http://localhost:8080/api/v1/growshed/', {
                GSCode: GSCode,
                Condition: Condition,
                Status: Status,
                numRacks: numRacks
            });

            console.log(response.data); // Log the response from the server
            // Add any additional logic here, like showing a success message to the user
        } catch (error) {
            console.error('Error:', error); // Log any errors
            // Handle error, such as displaying an error message to the user
        }
    };

    return(
        <Grid>
            <Typography variant="h3">
                Add Growsheds
            </Typography>
            <br/>
            <hr/>
            <form noValidate autoComplete="off">
                <TextField 
                    onChange={(e) => setGSCode(e.target.value)}
                    label="Growshed GSCode" 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    required
                    style={{margin: '8px 0px 0px'}}
                />
                <FormControl variant="standard" required style={{width:'400px',margin:'10px'}}>
                    <InputLabel id="Condition-label">Condition</InputLabel>
                    <Select
                        labelId="Condition-label"
                        id="Condition"
                        value={Condition}
                        onChange={handleConditionChange}
                        label="Condition"
                    >
                        <MenuItem value="cold">Cold</MenuItem>
                        <MenuItem value="natural">Natural</MenuItem>
                    </Select>
                </FormControl><br/>
                <FormControl variant="standard" required style={{width:'400px',margin:'10px'}}>
                    <InputLabel id="Status-label">Status</InputLabel>
                    <Select
                        labelId="Status-label"
                        id="Status"
                        value={Status}
                        onChange={handleStatusChange}
                        label="Status"
                    >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="full">Full</MenuItem>
                        <MenuItem value="partial">Partial</MenuItem>
                    </Select>
                </FormControl>
                <TextField 
                    onChange={handleNumRacksChange}
                    label="Number of racks" 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    required
                    style={{margin: '8px 0px 0px'}}
                />
                <br/><br/>
                <Button 
                    type="submit"
                    variant="contained" 
                    style={{
                        margin: '30px 0px 0px',
                        width: '400px'                        
                    }}
                    onClick={handleSubmit}>
                    Submit
                </Button>
            </form>        
        </Grid>
    );
}

export default AddGrowShed;
