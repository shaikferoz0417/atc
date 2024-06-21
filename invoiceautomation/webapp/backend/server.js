const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/updateVendorData', (req, res) => {
    const updatedData = req.body;

    fs.writeFile('model/Vendor.json', JSON.stringify(updatedData, null, 2), (err) => {
        if (err) {
            console.error("Error writing to vendor.json:", err);
            res.status(500).json({ success: false, message: 'Failed to update vendor data' });
        } else {
            res.json({ success: true, message: 'Vendor data updated successfully' });
        }
    });
});

app.listen(3030, () => {
    console.log('Server is running on port 3030');
});
