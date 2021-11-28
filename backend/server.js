const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
require('date-utils');

app.use(express.static('public'));

const fs = require('fs');
const uuid = require('uuid').v4;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/temporary')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        const fileName = encodeURI(`${uuid()}-${originalname}`);
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage }).single('file');
const uploadAsync = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req,res,function(err){
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                reject(err);
              } else if (err) {
                // An unknown error occurred when uploading.
                reject(err);
              }
            else {resolve()}
        });
    })
}

// ここからtoken取得のためのコード
const _ = require('lodash');
const httpRequest = require('request');
const { resolve } = require('path/posix');

const tenantId = '819897bd08504d38bcce5fc9b4d08a6f';
const username = 'gncu77400403';
const password = '6846Eleven11';

const api_url = 'https://identity.tyo2.conoha.io/v2.0';

const params = {
    "url": api_url+'/tokens',
    "headers": {
        "Accept": 'application/json'
    },
    "form": JSON.stringify({
        "auth": {
            "passwordCredentials": {
                "username": username,
                "password": password
            },
            "tenantId": tenantId
        }
    })

};

// req.bodyを使うためのおまじない
app.use(express.urlencoded({encoded: false}));
app.use(express.json());
// cokkie
app.use(cookieParser());
// databaseの綴り気をつける
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9711Naoya',
    database: 'board'
});

const port = process.env.PORT || 3001

server.listen(port, () => {
        console.log(`listening on *:${port}`);
    });

// JWTに関する記述
// 鍵
const SECRET_KEY = '9711Naoya';
// 時間制限
const option = {
    expiresIn: '3days'
}

// ユーザー認証に関するAPI
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (results.length > 0){
                const plain = req.body.password;
                const hash = results[0].password;
                bcrypt.compare(plain, hash, (error, isEqual) => {
                    if (isEqual){
                        const token = jwt.sign({user: results}, SECRET_KEY, option);
                        res
                        .cookie('access_token', token)
                        .json({
                            success: true,
                            message: "ログインしました 😊 👌",
                            token: token
                        });
                    } else {
                        res.json({
                            success: false,
                            message: "パスワードが違います"
                          });                   
                    }
                })
            } else {    
                res.json({
                    success: false,
                    message: "ログインエラーです"
                  });
            }
        }
    )
});

app.post('/api/signup', 
    (req, res, next) => {
        const userName = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        const errors = [];

        if(userName === ''){
            errors.push('ユーザー名が空です')
        };

        if(email === ''){
            errors.push('メールアドレスが空です')
        };

        if(password === ''){
            errors.push('パスワードが空です')
        };

        if(errors.length > 0){
            res.json({
                success: false,
                message: "文字が空白です"
            })
        } else {
            next();
        };        
    },
    (req, res, next) => {
        const email = req.body.email;
        connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (error, results) => {
                results.length > 0 ? 
                    res.json({
                        success: false,
                        message: "入力されたEメールはすでに使用されています"
                    }) :
                    next()
            }
        )
    },
    (req, res) => {
        const userName = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        bcrypt.hash(password, 10, (error, hash) => {
            connection.query(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [userName, hash, email],
                (error, results) => {
                    const insertId = results.insertId;
                    connection.query(
                        'SELECT * FROM users WHERE id = ?',
                        [insertId],
                        (error, results) => {
                            const token = jwt.sign({user: results}, SECRET_KEY, option);
                            res
                                .cookie('access_token', token)
                                .json({
                                    success: true,
                                    message: "登録しました 😊 👌",
                                    token: token
                                });  
                        }
                    )
            }
        )  
        })
    },
);

app.get('/api/logout', (req, res) => {
    return res
        .clearCookie('access_token')
        .clearCookie('community_token')
        .json({ message:  "ログアウトしました 😏 🍀"});
});

app.use((req, res, next) => {
    const token = req.cookies.access_token;
    // cookieがない場合
    if(!token){
        return res.status(403).send({
            success: false,
            message: "再度ログインしてください"
        });
    }
    // tokenの検証
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
            // 認証NGの場合
            return res.status(403).json({
                success: false,
                message: "Invalid token"
              });
        } else {
            // 認証OKの場合
            req.decoded = decoded;
            req.userId = decoded.user[0].id;
            next();
        }
    })
});

app.post('/api/update/user', upload, 
    (req, res, next) => {
        const userName = req.body.name;
        const email = req.body.email;
        const errors = [];
        if(userName === ''){
            errors.push('ユーザー名が空です')
        };

        if(email === ''){
            errors.push('メールアドレスが空です')
        };
        if(errors.length > 0){
            res.json({
                success: false,
                message: "空白です"
            })
        } else {
            next();
        };        
    },
    (req, res) => {
        const userName = req.body.name;
        const email = req.body.email;

        connection.query(
            'UPDATE users SET username = ?, email = ? WHERE users.id = ?',
            [userName, email, req.userId],
            (error, results) => {
                connection.query(
                    'SELECT * FROM users WHERE id = ?',
                    [req.userId],
                    (error, results) => {
                        const token = jwt.sign({user: results}, SECRET_KEY, option);
                        return res
                        .cookie('access_token', token)
                        .json({
                            success: true,
                        })
                    }
                )        
            }
        )
    }
)

app.post('/api/update/userimage',
    (req, res, next) => {
        uploadAsync(req, res).then(() => {
            const file = req.file;
            // console.log(file);
            const imageName = file.filename;   

            // オブジェクトストレージへアップロード
            // tokenの取得
            httpRequest.post(params, function(err, result, body){
                if (_.isString(body)) {
                    const res = JSON.parse(body);
                    const token = res.access.token.id;
                    const token_expire = res.access.token.expires;
                    // console.log('token: ' + token);
                    // console.log('expire: ' + token_expire);

                    const headers = {
                        'X-Auth-Token': token,
                        "Transfer-Encoding":"chunked"
                    };

                    // アップロード
                    const options = {
                        url: `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${imageName}`,
                        headers: headers,
                    }

                    fs.createReadStream(`public/temporary/${imageName}`)
                    .pipe(httpRequest.put( options , function(err , response , body){
                    // console.log( response.headers );
                    // console.log( 'ステータスコード:',response.statusCode);
                    // console.log( body );
                    if(err)console.log(err);
                    else {
                        // console.log( 'アップロードしました' );

                        // 前の画像の消去
                        connection.query(
                            'SELECT imagename FROM users WHERE users.id = ?',
                            [req.userId],
                            (error, results) => {
                                const preImageName = results[0].imagename;
                                if (preImageName) {
                                    const deleteOptions = {
                                        url: `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${preImageName}`,
                                        method: 'DELETE',
                                        headers: headers
                                    }
                                    httpRequest(deleteOptions, function (error, response, body) {
                                        // console.log(`削除${body}`);
                                    })
                                }
                                fs.unlink(`public/temporary/${imageName}`, (err) => {
                                    if (err) throw err;
                                })
                                // 画像変更の処理
                                connection.query(
                                    'UPDATE users SET imagename = ? WHERE users.id = ?',
                                    [imageName, req.userId],
                                    (error, results) => {
                                        next()
                                    }
                                )
                            }
                        )
                    }
                    }));        

                } else {
                    const res = body;
                    console.log(res);
                }
            })

        }).catch((err) => {
            console,log(err);
        });
    },
    (req, res) => {
        connection.query(
            'SELECT * FROM users WHERE id = ?',
            [req.userId],
            (error, results) => {
                const token = jwt.sign({user: results}, SECRET_KEY, option);
                return res
                .cookie('access_token', token)
                .json({
                    success: true,
                })
            }
        )
    }
)

// コミュニティに関する記述

app.post('/api/entry/search', 
    (req, res, next) => {
        const communityId = req.body.id;
        if(communityId === '') {
            res.json({
                success: false,
                message: "空白です"
            })
        } else {
            next();
        }
    },
    (req, res) => {
        const communityId = req.body.id;
        connection.query(
            'SELECT * FROM communities WHERE id = ?',
            [communityId],
            (error, results) => {
                if(results.length > 0){
                    return res
                        .json({
                            success: true,
                            message: "検索結果です 😊 👌",
                            community: results
                        });        
                } else {
                    return res.json({
                        success: false,
                        message: "コミュニティは存在しないです"
                      });
                        }
            } 
        )
    }
)

app.post('/api/entry/join',
    (req, res, next) => {
        const communityId = req.body.id;
        if(communityId === '') {
            res.json({
                success: false,
                message: "空白です"
            })
        } else {
            next();
        };
    },
    (req, res, next) => {
        const communityId = req.body.id;
        const isAlready = req.body.isAlready;
        if (isAlready) {
            connection.query(
                'SELECT * FROM communities WHERE id = ?',
                [communityId],
                (error, results) => {
                    if (results.length > 0) {
                        const token = jwt.sign({community: results}, SECRET_KEY, option);
                        res.cookie('community_token', token);
                        next();
                    } else {
                        return res.json({
                            success: false,
                            message: "参加しようとしたコミュニティは存在しませんでした"
                          });                        
                    }
                }
            )
        } else {
            connection.query(
                'SELECT * FROM communities WHERE id = ?',
                [communityId],
                (error, results) => {
                    if(results.length > 0){
                        if (results[0].password === null){
                            const token = jwt.sign({community: results}, SECRET_KEY, option);
                            res.cookie('community_token', token);
                            next();
                        } else {
                            const plain = req.body.password;
                            const hash = results[0].password;
                            bcrypt.compare(plain, hash, (error, isEqual) => {
                                if (isEqual) {
                                    const token = jwt.sign({community: results}, SECRET_KEY, option);
                                    res.cookie('community_token', token);
                                    next();
                                } else {
                                    res.json({
                                        success: false,
                                        message: "パスワードが違います"
                                    })
                                }
                            })
                        }
                    } else {
                        return res.json({
                            success: false,
                            message: "参加しようとしたコミュニティは存在しませんでした"
                          });
                            }
                } 
            )
    
        };
    }, 
    (req, res) => {
        const userId = req.userId;
        const communityId = req.body.id;
        const dt = new Date();
        const formatted = dt.toFormat('YYYY-MM-DD');

        connection.query(
            'SELECT * FROM members WHERE userid = ? AND communityid = ?',
            [userId, communityId],
            (error, results) => {
                if (results.length > 0) {
                    res.json({
                        success: true,
                        message: "コミュニティに参加しました😊 👌",
                    });                    
                } else {
                    connection.query(
                        'INSERT INTO members (userid, communityid, entrydate, host) VALUES (?, ?, ?, ?)',
                        [userId, communityId, formatted, false],
                        (error, results) => {
                            res.json({
                                success: true,
                                message: "新しいコミュニティに参加しました😊 👌",
                            });                    
                        }
                    );
                    // 未読既読データの作成
                    connection.query(
                        'SELECT * FROM news WHERE communityid = ?',
                        [communityId],
                        (error, results) => {
                            const news = results;
                            if (news.length > 0) {
                                news.forEach((news) => {
                                    connection.query(
                                        'INSERT INTO complete (userid, communityid, newsid, complete) VALUE (?, ?, ?, ?)',
                                        [userId, communityId, news.id, false]
                                    )                                               
                                })
                            }
                        }
                    );
                }
            }
        )
    }
)

app.post('/api/establish', 
    (req, res, next) => {
        // 名前が空白のとき
        const communityName = req.body.name;
        if(communityName === ''){
            res.json({
                success: false,
                message: "空白です"
            })
        } else {
            next();
        }
    },
    (req, res) => {
        const communityName = req.body.name;
        const password = req.body.password === '' ? null : req.body.password;
        const dt = new Date();
        const formatted = dt.toFormat('YYYY-MM-DD');

        // パスワードがnullのとき
        if (password === null){
            connection.query(
                'INSERT INTO communities (communityname, createddate) VALUES (?, ?)',
                [communityName, formatted],
                (error, results) => {
                    const userId = req.userId;
                    const communityId = results.insertId;
                    // 新しいコミュニティあるか検索
                    connection.query(
                        'SELECT * FROM communities WHERE id = ?',
                        [communityId],
                        (error, results) => {
                            if (results.length > 0) {
                                // ある場合、cookieの発行
                                const token = jwt.sign({community: results}, SECRET_KEY, option);
                                res.cookie('community_token', token);
                                connection.query(
                                    'INSERT INTO members (userid, communityid, entrydate, host) VALUES (?, ?, ?, ?)',
                                    [userId, communityId, formatted, true],
                                    (error, results) => {
                                        res.json({
                                            success: true,
                                            message: "新しいコミュニティを設立しました😊 👌",
                                        });                    
                                    }            
                                )                                       
                            } else {
                                // ない場合
                                return res.json({
                                    success: false,
                                    message: "コミュニティを設立できませんでした"
                                  });            
                            }
                        } 
                    )
                }
            );
        } else {
            // パスワードがあるとき
            bcrypt.hash(password, 8, (error, hash) => {
                connection.query(
                    'INSERT INTO communities (communityname, password, createddate) VALUES (?, ?, ?)',
                    [communityName, hash, formatted],
                    (error, results) => {
                        const userId = req.userId;
                        const communityId = results.insertId;
                        connection.query(
                            'SELECT * FROM communities WHERE id = ?',
                            [communityId],
                            (error, results) => {
                                if (results.length > 0) {
                                    // ある場合、cookieの発行
                                    const token = jwt.sign({community: results}, SECRET_KEY, option);
                                    res.cookie('community_token', token);
                                    connection.query(
                                        'INSERT INTO members (userid, communityid, entrydate, host) VALUES (?, ?, ?, ?)',
                                        [userId, communityId, formatted, true],
                                        (error, results) => {
                                            res.json({
                                                success: true,
                                                message: "新しいコミュニティを設立しました😊 👌",
                                            });                    
                                        }            
                                    )                                       
                                } else {
                                    // ない場合
                                    return res.json({
                                        success: false,
                                        message: "コミュニティを設立できませんでした"
                                      });            
                                }
                            }     
                        )
                    }
                );
            })    
        };
    }
);

app.get('/api/communityLists', (req, res)　=> {
    connection.query(
        'SELECT userid, communityid, entrydate, withdrawaldate, communities.id, communityname, imagename FROM members INNER JOIN communities ON communityid = communities.id WHERE userid = ?',
        [req.userId],
        (error, results) => {
            if (results.length > 0) {
                res.json({
                    success: true,
                    communities: results,
                })        
            } else {
                res.json({
                    success: false,
                    message: '誰一人もいません(汗)'
                })
            }
        }
    )
})

app.use((req, res, next) => {
    const communityToken = req.cookies.community_token;
    // Tokenがない場合
    if(!communityToken) {
        return res.json({
            success: false,
            message: 'コミュニティ内にいません🌀'
        })
    }
    // Tokenの検証
    jwt.verify(communityToken, SECRET_KEY, (error, decoded) => {
        if(error) {
            // 認証NGの場合
            return res.status(403).json({
                success: false,
                message: 'ログインし直してください'
            })
        } else {
            // 認証OKのば
            req.communityId = decoded.community[0].id;
            next();
        }
    })
})

app.post('/api/update/community', upload, 
    (req, res, next) => {
        const communityName = req.body.name;
        if(communityName === ''){
            res.json({
                success: false,
                message: "空白です"
            })            
        } else {
            next();
        }
    },
    (req, res) => {
        const communityName = req.body.name;
        connection.query(
            'UPDATE communities SET communityname = ? WHERE communities.id = ?',
            [communityName, req.communityId],
            (error, results) => {
                connection.query(
                    'SELECT * FROM communities WHERE id = ?',
                    [req.communityId],
                    (error, results) => {
                        const token = jwt.sign({community: results}, SECRET_KEY, option);
                        return res
                        .cookie('community_token', token)
                        .json({
                            success: true,
                        })
                    }
                )        
            }
        )
    }
)

app.post('/api/update/communityimage',
    (req, res, next) => {
        uploadAsync(req, res).then(() => {
            const file = req.file;
            const imageName = file.filename;    

            // オブジェクトストレージへアップロード
            // tokenの取得
            httpRequest.post(params, function(err, result, body){
                if(_.isString(body)){
                    const res = JSON.parse(body);
                    const token = res.access.token.id;
                    // const token_expire = res.access.token.expires;

                    const headers = {
                        'X-Auth-Token': token,
                        "Transfer-Encoding":"chunked"
                    };

                    // アップロード
                    const options = {
                        url: `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${imageName}`,
                        headers: headers,
                    }

                    fs.createReadStream(`public/temporary/${imageName}`)
                    .pipe(httpRequest.put( options , function(err , response , body){
                    if(err)console.log(err);
                    else {
                        // 前の画像の消去
                        connection.query(
                            'SELECT imagename FROM communities WHERE communities.id = ?',
                            [req.communityId],
                            (error, results) => {
                                const preImageName = results[0].imagename;
                                if (preImageName) {
                                    const deleteOptions = {
                                        url: `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${preImageName}`,
                                        method: 'DELETE',
                                        headers: headers
                                    }
                                    httpRequest(deleteOptions, function (error, response, body) {
                                        // console.log(`削除${body}`);
                                    })
                                }
                                fs.unlink(`public/temporary/${imageName}`, (err) => {
                                    if (err) throw err;
                                })
                                // 画像変更の処理
                                connection.query(
                                    'UPDATE communities SET imagename = ? WHERE communities.id = ?',
                                    [imageName, req.communityId],
                                    (error, results) => {
                                        next()
                                    }
                                )
                            }
                        )

                    }
                    }));        
                } else{
                    const res = body;
                    console.log(res);
                }
            });    

        }).catch((err) => {
            console.log(err);
        })        
    },
    (req, res) => {
        connection.query(
            'SELECT * FROM communities WHERE id = ?',
            [req.communityId],
            (error, results) => {
                const token = jwt.sign({community: results}, SECRET_KEY, option);
                return res
                .cookie('community_token', token)
                .json({
                    success: true,
                })
            }
        )
    }
)

app.get('/api/member', (req, res) => {
    connection.query(
        'SELECT users.id, username, imagename, communityid, entrydate, withdrawaldate, host FROM users INNER JOIN members ON users.id = userid WHERE communityid = ?',
        [req.communityId],
        (error, results) => {
            if (results.length > 0) {
                res.json({
                    success: true,
                    members: results,
                })        
            } else {
                res.json({
                    success: false,
                    message: '誰一人もいません(汗)'
                })
            }
        }
    )
});

// SQL呼び出しに、idが２つあるとバグが発生するので注意
app.get('/api/news/view', 
    (req, res) => {
        connection.query(
            'SELECT news.id, news.title, news.communityid, news.userid, news.postdate, news.important, news.content, users.username, users.imagename, complete FROM news, users, complete WHERE news.userid = users.id AND news.id = complete.newsid AND news.communityid = ? AND complete.userid = ? order by news.id desc',
            [req.communityId, req.userId],
            (error, results) => {
                if (results.length > 0) {
                    res.json({
                        success: true,
                        news: results,
                    })        
                } else {
                    res.json({
                        success: false,
                        message: 'ニュースはまだ投稿されていません'
                    })
                }
            }
        )
    }
)

// 追加
app.post('/api/news/file/view',
    (req, res) => {
        const newsId = req.body.id;
        connection.query(
            'SELECT filename FROM newsfile where newsid = ?',
            [newsId],
            (error, results) => {
                res.json({
                    message: true,
                    newsFileNames: results
                })
            }
        )
    }
)

// 更新
app.post('/api/news/post', upload, 
    (req, res, next) => {
        const title = req.body.title;
        const content = req.body.content;
        const errors = [];
        if(title === '') {
            errors.push('titleが空です');
        }
        if(content === '') {
            errors.push('contentが空です');
        }
        if(errors.length > 0){
            res.json({
                success: false,
                message: "空白です"
            })
        } else {
            next();
        };        
    },
    (req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const importantString = req.body.important;
        const important = importantString === 'true';
        const dt = new Date();
        const formatted = dt.toFormat('YYYY-MM-DD');
        connection.query(
            'INSERT INTO news (title, communityid, userid, postdate, important, content) VALUES (?, ?, ?, ?, ?, ?)',
            [title, req.communityId, req.userId, formatted, important, content],
            (error, results) => {
                const newsId = results.insertId;
                // 既読機能に関する
                connection.query(
                    "SELECT userid FROM members WHERE communityid = ?",
                    [req.communityId],
                    (error, results) => {
                        const communityMembers = results;
                        const communityOtherMembers = communityMembers.filter((member) => member.userid !== req.userId);
                        // DBにデータ挿入
                        if (communityOtherMembers.length > 0) {
                            communityOtherMembers.forEach((member) => {
                                connection.query(
                                    'INSERT INTO complete (userid, communityid, newsid, complete) VALUES (?, ?, ?, ?)',
                                    [member.userid, req.communityId, newsId, false]
                                )                
                            })
                        }
                        connection.query(
                            'INSERT INTO complete (userid, communityid, newsid, complete) VALUES (?, ?, ?, ?)',
                            [req.userId, req.communityId, newsId, true],
                            (error, results) => {
                                res.json({
                                    success: true,
                                    message: "ニュースを投稿しました😊 👌",
                                });                    
                            }
                        )
                    }
                );

                // ファイル投稿に関する
                uploadAsync(req, res).then (() => {
                    const file =req.file;
                    const imageName = file.filename;

                    // オブジェクトストレージへアップロード
                    // tokenの取得
                    httpRequest.post(params, function(err, result, body){
                        if(_.isString(body)){
                            const res = JSON.parse(body);
                            const token = res.access.token.id;
                            // const token_expire = res.access.token.expires;
        
                            const headers = {
                                'X-Auth-Token': token,
                                "Transfer-Encoding":"chunked"
                            };
        
                            // アップロード
                            const options = {
                                url: `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/newsfile/${imageName}`,
                                headers: headers,
                            }
        
                            fs.createReadStream(`public/temporary/${imageName}`)
                            .pipe(httpRequest.put( options , function(err , response , body){
                            if(err)console.log(err);
                            else {
                                connection.query(
                                    'INSERT INTO newsfile (filename, newsid) VALUES (?, ?)',
                                    [imageName, newsId],
                                )
                            }
                            }));        
                        } else{
                            const res = body;
                            console.log(res);
                        }
                    });    
                })

            }
        )
    }
);


app.post('/api/complete', 
    (req, res) => {
        // ニュースあるかチェック
        const newsId = req.body.id;
        connection.query(
            'SELECT * FROM news WHERE id = ?',
            [newsId],
            (error, results) => {
                // 既読に変更
                connection.query(
                    'UPDATE complete SET complete = true WHERE newsid = ? AND userid = ?',
                    [newsId, req.userId],
                    (error, results) => {
                        res.json({
                            success: true,
                        });                            
                    }
                )
            }
        )
    }
)

app.post('/api/complete/never',
    (req, res) => {
        const newsId = req.body.id;
        connection.query(
            'SELECT complete.userid, username, email, imagename FROM complete INNER JOIN users ON users.id = userid WHERE complete = false AND newsid = ?',
            [newsId],
            (error, results) => {
                res.json({
                    success: true,
                    members: results
                })
            }
        )
    }
);

// expressとreactについて
// https://reffect.co.jp/react/front-react-back-node#i

// jwtについて真似した
// https://qiita.com/sa9ra4ma/items/67edf18067eb64a0bf40
// https://qiita.com/c6tower/items/4909948b6619dca6e82c

// cookieについて真似した
// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

// ログイン認証について参考になるかも
// https://www.mushroom-blog.com/294/