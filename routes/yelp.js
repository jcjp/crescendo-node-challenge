const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.post('/', function (req, res) {

    const yelpUrl = req.query ? req.query.url : 'https://www.yelp.com/biz/spiral-pasay-2';
    let finalList = [];

    axios(yelpUrl)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            /* Get all reviews on the page url */
            textReviews = $('.review-content > p')
                .toArray()
                .map(review => review.children)
                .map(children => {
                    let review = ''
                    children.forEach(child => {
                        if (child.type === 'text')
                            review += child.data
                    })
                    finalList.push({ review, name: null })
                    return review
                })

            /* Get all the display name for every review  count is 20 */
            textUserNames = $('li.user-name > #dropdown_user-name')
                .toArray()
                .map((userName, index) => {
                    let name = ''
                    userName.children.forEach(child => {
                        if (child.type === 'text' && !child.data.includes('\n'))
                            name += child.data
                    })
                    if (name != '')
                        finalList[index] = {
                            review: finalList[index].review,
                            name
                        }
                    return name
                })

            res.send(finalList)

        })
        .catch(console.error);
});

module.exports = router;
