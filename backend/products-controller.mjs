import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as products from './products-model.mjs';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());


// CREATE controller ******************************************
app.post ('/products', (req,res) => { 
    products.createProduct(
        req.body.type,
        req.body.name, 
        req.body.description, 
        req.body.link, 
        req.body.date,
        )
        .then(product => {
            res.status(201).json(product);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'Creation of a document failed due to invalid syntax.' });
        });
});

// GET products filtered by type,  name, description, or date
app.get('/totalNumberOfEndorsedProducts', (req, res) => {
    let filter = {};
    products.findNumberOfProducts(filter, '', 0)
        .then(products => {
            res.send(products.toString());
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request to retrieve documents failed' });
        });
});


// RETRIEVE controller ****************************************************
// GET products by ID
app.get('/products/:_id', (req, res) => {
    const productId = req.params._id;
    products.findProductById(productId)
        .then(product => { 
            if (product  !== null) {
                res.json(product );
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request to retrieve document failed' });
        });

});


// GET products filtered by type,  name, description, or date
app.get('/products', (req, res) => {
    let filter = {};
    //filter by type
    if(req.query.type !== undefined){
        filter = { type: req.query.type };
    }
    // filter by name
    if(req.query.name !== undefined){
        filter = { name: req.query.name };
    }
    // filter by description
    if(req.query.description !== undefined){
        filter = { description: req.query.description };
    }
    
    // filter by date
    if(req.query.date !== undefined){
        filter = { date: req.query.date };
    }
    products.findProducts(filter, '', 0)
        .then(products => {
            res.send(products);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request to retrieve documents failed' });
        });
});

// DELETE Controller ******************************
app.delete('/products/:_id', (req, res) => {
    console.log(req.params._id)
    products.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request to delete a document failed' });
        });
});

// UPDATE controller ************************************
app.put('/products/:_id', (req, res) => {
    products.replaceProduct(
        req.params._id, 
        req.body.type,
        req.body.name, 
        req.body.description, 
        req.body.link,
        req.body.date,
    )

    .then(numUpdated => {
        if (numUpdated === 1) {
            res.json({ 
                _id: req.params._id, 
                type: req.body.type,
                name: req.body.name, 
                description: req.body.description, 
                link: req.body.link,
                date: req.body.date,

            })
        } else {
            res.status(404).json({ Error: 'Document not found' });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: 'Request to update a document failed' });
    });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});