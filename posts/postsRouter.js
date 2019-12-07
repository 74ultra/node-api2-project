const express = require('express');
const db = require('../data/db.js');

// create router

const router = express.Router();

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "The post info could not be retrieved."});
        })
    
});


router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents){
       res.status(400).json({ error: "Please provide title and contents for the post." });
    } else {
        db.insert({ title, contents})
            .then(({ id }) => {
                db.findById(id)
                .then(([post]) => {
                    res.status(201).json(post)
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "There was an error retrieving new post" })
                })
                
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }

    
    
})

router.put('/:id', (req, res) => {
        const id = req.params.id;
        const { title, contents } = req.body;

        if (!title || !contents) {
            return res.status(400).json({ error: "Please provide title and contents to update the post." });
        }

        db.update(id, {title, contents})
            .then(update => {
                if(update){
                    db.findById(id)
                        .then(post => res.status(200).json(post))
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({error: "Update was good but there was some error"})
                        })
                } else {
                    res.status(404).json({error: `Post with the id ${id} does not exist`})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "The post could not be modified."});
            })

})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(posts => {
            const post = posts[0];
            console.log(post);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ error: "Post with id does not exist" });
            }
        });
        
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then((deleted) => {
            if(deleted){
                console.log(`Post was deleted`)
                res.status(204).end();
            } else {
                res.status(404).json({error: "The post with the specified ID does not exist."});
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "There was an error deleting the post"})
        })
})




module.exports = router;