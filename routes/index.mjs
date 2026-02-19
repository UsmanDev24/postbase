import * as express from 'express';
import { postsStore as posts } from '../models/posts-store.mjs';
import { WsServer } from '../app.mjs';

export const router = express.Router();

export function wsHomeListners() {
  
  posts.on('postcreated', (post) => {
    WsServer.clients.forEach((socket) => {
      if (socket.readyState === socket.OPEN)
        socket.send(JSON.stringify({ type: "postcreated", post: post }))
    })
  })
  posts.on('postdestroyed', (key) => {
  
    WsServer.clients.forEach((socket) => {
      if (socket.readyState === socket.OPEN)
        socket.send(JSON.stringify({ type: 'postdestroyed', key: key }));
    })
  })
 

}
/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    
    const keylist = await posts.keylist();
    const keyPromises = keylist.map(key => {
      return posts.read(key);
    });

    let postlist = await Promise.all(keyPromises);
    if (postlist.length === 0) {
      postlist = false;
    }
    res.render('index', {
      title: 'PostBase', postlist: postlist,
      homepage: true,
      user: req.user ? req.user : undefined,
      level: req.query.level,
      massage: req.query.massage
    });
  } catch (err) {
    next(err);
  }
});

router.get("/privacy_policy", (req, res, next) => {
  res.render('privacy', {
    title: 'Privacy Policy', 
    user: req.user ? req.user : undefined,
  })
})

router.get("/terms-of-services", (req, res, next) => {
  res.render('terms', {
    title: 'Terms of Services',
    user: req.user ? req.user : undefined,
  })
})

router.get("/about-postbase", (req, res, next) => {
  res.render('about-postbase', {
    title: 'About Postbase',
    user: req.user ? req.user : undefined,
  })
})