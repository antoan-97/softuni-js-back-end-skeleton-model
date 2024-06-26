const jwt = require('../lib/jwt');
const { SECRET } = require('../config/config');


exports.auth = async (req,res,next) => {
    const token = req.cookies['token'];
    
    if(token){
        try {
            const decodetToken = await jwt.verify(token,SECRET);
            req.user = decodetToken;
            res.locals.user = decodetToken;
            res.locals.itsAuthenticated = true;
            next();
        } catch (err) {
            res.clearCookie('token');
            res.redirect('users/login');
        }
    }else{
        next();
    }
};


exports.isAuth = (req,res,next) =>{
    if(!req.user){
        res.redirect('/users/login');
    }
    next();
};

exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        return res.render('404');
    }
    next();
};

exports.isOwner = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    const recipe = await recipeManager.getOne(recipeId);
    if (!recipe || recipe.owner.toString() !== req.user._id.toString()) {
        return res.render('404');
    }
    next();
};