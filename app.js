const express = require(`express`);
const mongoose = require(`mongoose`);
const ejs = require(`ejs`);
const bodyParser = require(`body-parser`);
require(`dotenv`).config();

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.set(`view engine`, `ejs`);

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.get('/', (req, res) => {
    res.send(`hello world`);
});

/////////////////////// for /articles route  /////////////////////////////////////

// used chaining via app.route() to meke code more redundent
app.route('/articles')
    .get((req, res) => {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        // console.log(req.body.title, req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send(`successfully posted!`);
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send(`successfully deleted!`)
            } else {
                console.log(err);
                res.send(err);
            }
        });
    });

/* code below this line is refactored from line-29 to 64    

app.get('/articles', (req, res)=>{
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
});

app.post('/articles', (req, res)=>{
    // console.log(req.body.title, req.body.content);

    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send(`successfully posted!`);
        }else{
            res.send(err);
        }
    });
});

app.delete('/articles', (req, res)=>{
    Article.deleteMany(function(err){
        if(!err){
            res.send(`successfully deleted!`)
        }else {
            console.log(err);
            res.send(err);
        }
    });
});

*/

///////////////////// for specific route i.e,(/articles/xyz)  ////////////////////

app.route(`/articles/:article_Title`)
    .get((req, res) => {
        // console.log(req.params.article_Title);
        Article.findOne(
            { title: req.params.article_Title },
            (err, found_Articles) => {
                if (found_Articles) {
                    res.send(found_Articles);
                } else {
                    res.send(`no articles found :-(`);
                }
            });
    })
    .put((req, res) => {
        Article.updateOne(
            { title: req.params.article_Title }, // search Query
            { title: req.body.title, content: req.body.content }, // updates
            // {overwrite: true},
            (err) => {
                if (!err) {
                    res.send(`successfully updated`);
                    console.log(req.body.title, req.body.content);
                } else {
                    res.send(err);
                }
            });
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.article_Title },
            { $set: req.body },
            (err) => {
                if(!err){
                    console.log(req.body);
                    res.send(`successfully patched(updated)`);
                }else{
                    res.send(err);
                    console.log(err);
                }
            }
        );
    })
    .delete((req, res)=>{
        Article.deleteOne(
            { title: req.params.article_Title }, //  search Query
            (err)=>{
                if(!err){
                    res.send(`successfully deleted`);
                }
            }
        );
    });

app.listen(3000, () => {
    console.log(`server is started at port 3000`);
});